/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";
import { BaseService } from "@/contexts/base/api/base.service";

interface TestEntity {
  id: number;
  name: string;
}

describe("BaseService", () => {
  let baseService: BaseService<TestEntity>;
  let repositoryMock: BaseRepository<TestEntity>;
  let supabaseProviderMock: SupabaseProvider;

  beforeEach(() => {
    repositoryMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as BaseRepository<TestEntity>;

    supabaseProviderMock = {
      getClient: vi.fn(),
    } as unknown as SupabaseProvider;

    baseService = new BaseService(supabaseProviderMock, repositoryMock);
  });

  describe("getAll", () => {
    it("should return all records", async () => {
      const mockEntities = [
        { id: 1, name: "Record 1" },
        { id: 2, name: "Record 2" },
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getAll as unknown as Mock).mockResolvedValue(
        mockEntities,
      );

      const result = await baseService.getAll();
      expect(result).toEqual(mockEntities);

      expect(repositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return an record by ID", async () => {
      const mockEntity = { id: 1, name: "Entity 1" };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(mockEntity);

      const result = await baseService.getById(mockEntity.id);
      expect(result).toEqual(mockEntity);

      expect(repositoryMock.getById).toHaveBeenCalledWith(1);
    });
  });

  describe("create", () => {
    it("should create an record", async () => {
      const mockEntity = { id: 1, name: "Entity 1" };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.create as unknown as Mock).mockResolvedValue(mockEntity);

      const result = await baseService.create(mockEntity);
      expect(result).toEqual(mockEntity);

      expect(repositoryMock.create).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe("update", () => {
    const mockEntity = { id: 1, name: "Entity 1" };
    it("should update an record by ID", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(mockEntity);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.update as unknown as Mock).mockResolvedValue(mockEntity);

      const result = await baseService.update(mockEntity.id, mockEntity);
      expect(result).toEqual(mockEntity);

      expect(repositoryMock.getById).toHaveBeenCalledWith(mockEntity.id);

      expect(repositoryMock.update).toHaveBeenCalledWith(
        mockEntity.id,
        mockEntity,
      );
    });

    it("should throw NotFoundException if record is not found for update", async () => {
      // eslint-disable-next-line unicorn/no-null
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(null);

      try {
        await baseService.update(mockEntity.id, mockEntity);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(repositoryMock.getById).toHaveBeenCalledWith(1);
      expect(repositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    const mockRecord = { id: 1, name: "Record 1" };
    it("should delete an record by ID", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(mockRecord);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.delete as unknown as Mock).mockResolvedValue(mockRecord);

      const result = await baseService.delete(mockRecord.id);
      expect(result).toEqual(mockRecord);

      expect(repositoryMock.delete).toHaveBeenCalledWith(mockRecord.id);
    });

    it("should throw NotFoundException if record is not found for delete", async () => {
      // eslint-disable-next-line unicorn/no-null
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(null);

      try {
        await baseService.delete(mockRecord.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(repositoryMock.getById).toHaveBeenCalledWith(1);
      expect(repositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
