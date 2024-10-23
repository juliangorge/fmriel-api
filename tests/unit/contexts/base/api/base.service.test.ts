/* eslint-disable @typescript-eslint/no-unsafe-call */
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";
import { BaseService } from "@/contexts/base/api/base.service";

// Mocking Identifiable Interface
interface TestEntity {
  id: number;
  name: string;
}

describe("BaseService", () => {
  let baseService: BaseService<TestEntity>;
  let repositoryMock: BaseRepository<TestEntity>;
  let supabaseProviderMock: SupabaseProvider;

  beforeEach(() => {
    // Mocking the repository methods
    repositoryMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
    } as unknown as BaseRepository<TestEntity>;

    // Mocking the SupabaseProvider (if used, but not necessary for the service tests)
    supabaseProviderMock = {
      getClient: vi.fn(),
    } as unknown as SupabaseProvider;

    // Initializing the BaseService with the mocked dependencies
    baseService = new BaseService(supabaseProviderMock, repositoryMock);
  });

  describe("getAll", () => {
    it("should return all entities", async () => {
      const mockEntities = [
        { id: 1, name: "Entity 1" },
        { id: 2, name: "Entity 2" },
      ];

      // Mock the getAll method of the repository
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getAll as unknown as Mock).mockResolvedValue(
        mockEntities,
      );

      const result = await baseService.getAll();
      expect(result).toEqual(mockEntities);

      // Ensure the repository's getAll method was called
      expect(repositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return an entity by ID", async () => {
      const mockEntity = { id: 1, name: "Entity 1" };

      // Mock the getById method of the repository
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (repositoryMock.getById as unknown as Mock).mockResolvedValue(mockEntity);

      const result = await baseService.getById(1);
      expect(result).toEqual(mockEntity);

      // Ensure the repository's getById method was called with the correct ID
      expect(repositoryMock.getById).toHaveBeenCalledWith(1);
    });
  });
});
