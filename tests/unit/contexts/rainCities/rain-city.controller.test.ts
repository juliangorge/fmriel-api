/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { RainCityMock } from "@/tests/utils/mocks/rain-city";

import { RainCityController } from "@/src/contexts/rainCities/api/rain-city.controller";
import { RainCityService } from "@/src/contexts/rainCities/api/rain-city.service";

describe("RainCityController", () => {
  let controller: RainCityController;
  let service: RainCityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RainCityController],
      providers: [
        {
          provide: RainCityService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RainCityController>(RainCityController);
    service = module.get<RainCityService>(RainCityService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a rain city", async () => {
      const result = RainCityMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(RainCityMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a rain city", async () => {
      const result = RainCityMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, RainCityMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });
});
