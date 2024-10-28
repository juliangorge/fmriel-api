/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacyScheduleController } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.controller";
import { PharmacyScheduleService } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("PharmacyScheduleController", () => {
  let controller: PharmacyScheduleController;
  let service: PharmacyScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [PharmacyScheduleController],
      providers: [
        {
          provide: PharmacyScheduleService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
            getByDate: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyScheduleController>(
      PharmacyScheduleController,
    );
    service = module.get<PharmacyScheduleService>(PharmacyScheduleService);
  });

  describe("getAll", () => {
    it("should return a list of all rain cities", async () => {
      const result = [PharmacyScheduleMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getByDate", () => {
    it("should return pharmacy schedules for a valid date", async () => {
      const validDate = "2023-10-20";
      const mockSchedules = [PharmacyScheduleMock];

      vi.spyOn(service, "getByDate").mockResolvedValue(mockSchedules as never);

      const response = await controller.getByDate(validDate);
      expect(response).toEqual(mockSchedules);
      expect(service.getByDate).toHaveBeenCalledWith(new Date(validDate));
    });

    it("should throw BadRequestException for an invalid date format", async () => {
      const invalidDate = "20-10-2023";

      try {
        await controller.getByDate(invalidDate);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it("should throw BadRequestException for an unparsable date", async () => {
      const unparsableDate = "2023-02-30";

      try {
        await controller.getByDate(unparsableDate);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it("should throw BadRequestException if date format is invalid", async () => {
      const invalidDateFormat = "invalid-date";

      await expect(controller.getByDate(invalidDateFormat)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.getByDate(invalidDateFormat)).rejects.toThrow(
        "Invalid date format. Please use YYYY-MM-DD.",
      );
    });
  });

  describe("create", () => {
    it("should create a new record", async () => {
      const mockPharmacies = PharmacyScheduleMock;

      vi.spyOn(service, "create").mockResolvedValue(mockPharmacies as never);

      const response = await controller.create(mockPharmacies);
      expect(response).toEqual(mockPharmacies);
    });
  });

  describe("update", () => {
    const id = 1;
    it("should update a record by ID", async () => {
      const mockPharmacies = { ...PharmacyScheduleMock, id };

      vi.spyOn(service, "update").mockResolvedValue(mockPharmacies as never);

      const response = await controller.update(id.toString(), mockPharmacies);
      expect(response).toEqual(mockPharmacies);
    });
  });

  describe("delete", () => {
    it("should delete a record by ID", async () => {
      const id = 1;

      vi.spyOn(service, "delete").mockResolvedValue({ id } as never);

      const response = await controller.delete(id);
      expect(response).toEqual({ id });
    });
  });
});
