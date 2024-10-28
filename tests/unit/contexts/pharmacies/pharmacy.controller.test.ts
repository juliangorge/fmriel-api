/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PharmacyMock } from "@/tests/utils/mocks/pharmacy";

import { PharmacyController } from "@/src/contexts/pharmacies/api/pharmacy.controller";
import { PharmacyService } from "@/src/contexts/pharmacies/api/pharmacy.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("PharmacyController", () => {
  let controller: PharmacyController;
  let service: PharmacyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [PharmacyController],
      providers: [
        {
          provide: PharmacyService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyController>(PharmacyController);
    service = module.get<PharmacyService>(PharmacyService);
  });

  describe("getAll", () => {
    it("should return a list of all records", async () => {
      const result = [PharmacyMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    const id = 1;
    it("should return a record by ID", async () => {
      const mockPharmacies = { ...PharmacyMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockPharmacies as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockPharmacies);
    });

    it("should throw NotFoundException if no record is found by ID", async () => {
      vi.spyOn(service, "getById").mockResolvedValue(null);

      await expect(controller.getById(id.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("create", () => {
    it("should create a record", async () => {
      const mockPharmacies = PharmacyMock;

      vi.spyOn(service, "create").mockResolvedValue(mockPharmacies as never);

      const response = await controller.create(mockPharmacies);
      expect(response).toEqual(mockPharmacies);
    });
  });

  describe("update", () => {
    it("should update a record", async () => {
      const id = 1;
      const mockPharmacies = { ...PharmacyMock, id };

      vi.spyOn(service, "update").mockResolvedValue(mockPharmacies as never);

      const response = await controller.update(id.toString(), mockPharmacies);
      expect(response).toEqual(mockPharmacies);
    });
  });
});
