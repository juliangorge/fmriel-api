/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { RainCityMock } from "@/tests/utils/mocks/rain-city";

import { RainCityController } from "@/src/contexts/rainCities/api/rain-city.controller";
import { RainCityService } from "@/src/contexts/rainCities/api/rain-city.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("RainCityController", () => {
  let controller: RainCityController;
  let service: RainCityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [RainCityController],
      providers: [
        {
          provide: RainCityService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RainCityController>(RainCityController);
    service = module.get<RainCityService>(RainCityService);
  });

  describe("getAll", () => {
    it("should return a list of all rain cities", async () => {
      const result = [RainCityMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    it("should return a rain city by ID", async () => {
      const id = 1;
      const mockPharmacies = { ...RainCityMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockPharmacies as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockPharmacies);
    });
  });

  describe("create", () => {
    it("should create a new record", async () => {
      const mockPharmacies = RainCityMock;

      vi.spyOn(service, "create").mockResolvedValue(mockPharmacies as never);

      const response = await controller.create(mockPharmacies);
      expect(response).toEqual(mockPharmacies);
    });
  });

  describe("update", () => {
    it("should update a record by ID", async () => {
      const id = 1;
      const mockPharmacies = { ...RainCityMock, id };

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
