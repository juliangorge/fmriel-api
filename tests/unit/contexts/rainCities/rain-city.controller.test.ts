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
      const mockRainCity = { ...RainCityMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockRainCity as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockRainCity);
    });
  });

  describe("create", () => {
    it("should create a new record", async () => {
      const mockRainCity = RainCityMock;

      vi.spyOn(service, "create").mockResolvedValue(mockRainCity as never);

      const response = await controller.create(mockRainCity);
      expect(response).toEqual(mockRainCity);
      // Ensure the service was called with the correct DTO
      expect(service.create).toHaveBeenCalledWith(mockRainCity);
    });
  });

  describe("update", () => {
    it("should update a record by ID", async () => {
      const id = 1;
      const mockRainCity = { ...RainCityMock, id };

      vi.spyOn(service, "update").mockResolvedValue(mockRainCity as never);

      const response = await controller.update(id.toString(), mockRainCity);
      expect(response).toEqual(mockRainCity);
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
