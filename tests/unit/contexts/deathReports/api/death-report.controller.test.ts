/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReportController } from "@/src/contexts/deathReports/api/death-report.controller";
import { DeathReportService } from "@/src/contexts/deathReports/api/death-report.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("DeathReportController", () => {
  let controller: DeathReportController;
  let service: DeathReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [DeathReportController],
      providers: [
        {
          provide: DeathReportService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findByQuery: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeathReportController>(DeathReportController);
    service = module.get<DeathReportService>(DeathReportService);
  });

  describe("getAll", () => {
    it("should return a list of all death reports", async () => {
      const result = [DeathReportMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    const id = 1;
    it("should return a death report by ID", async () => {
      const mockDeathReport = { ...DeathReportMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockDeathReport as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockDeathReport);
    });

    it("should throw NotFoundException if no record is found by ID", async () => {
      vi.spyOn(service, "getById").mockResolvedValue(null);

      await expect(controller.getById(id.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("create", () => {
    it("should create a new death report successfully", async () => {
      // Mock service.create returning the created post
      vi.spyOn(service, "create").mockResolvedValue(DeathReportMock as never);

      const response = await controller.create(DeathReportMock);
      expect(response).toEqual(DeathReportMock);
      // Ensure the service was called with the correct DTO
      expect(service.create).toHaveBeenCalledWith(DeathReportMock);
    });

    // OPTIONAL: If you want to test validation or error scenarios, you can add more tests here.
  });

  describe("update", () => {
    const deathReportId = 123;
    const updateData = { name: "Jane" };

    it("should update a death report if found", async () => {
      // Mock the updated record
      const updatedDeathReport = {
        ...DeathReportMock,
        id: deathReportId,
        ...updateData,
      };

      vi.spyOn(service, "update").mockResolvedValue(
        updatedDeathReport as never,
      );

      const response = await controller.update(
        deathReportId.toString(),
        updateData,
      );
      expect(response).toEqual(updatedDeathReport);
      expect(service.update).toHaveBeenCalledWith(deathReportId, updateData);
    });

    it("should throw NotFoundException if update returns null", async () => {
      // vi.spyOn(service, "update").mockResolvedValue(null);

      await expect(
        controller.update(deathReportId.toString(), updateData),
      ).rejects.toThrowError(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(deathReportId, updateData);
    });
  });

  describe("delete", () => {
    const deathReportId = 456;
    it("should delete a death report if found", async () => {
      // Suppose the service.delete returns the deleted post or a truthy value
      vi.spyOn(service, "delete").mockResolvedValue(deathReportId as never);

      const response = await controller.delete(deathReportId.toString());
      expect(response).toEqual({
        message: `Death Report with ID ${deathReportId} successfully deleted`,
      });
      expect(service.delete).toHaveBeenCalledWith(deathReportId);
    });

    it("should throw NotFoundException if delete returns null", async () => {
      // vi.spyOn(service, "delete").mockResolvedValue(null);

      await expect(
        controller.delete(deathReportId.toString()),
      ).rejects.toThrowError(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(deathReportId);
    });
  });

  describe("findByQuery", () => {
    const query = "search query";
    it("should return a list of death reports by query", async () => {
      const result = [DeathReportMock];

      vi.spyOn(service, "findByQuery").mockResolvedValue(result as never);

      const response = await controller.findByQuery(query);
      expect(response).toBe(result);
      expect(service.findByQuery).toHaveBeenCalledWith(query);
    });
  });
});
