/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PharmacyMock } from "@/tests/utils/mocks/pharmacy";

import { PharmacyController } from "@/src/contexts/pharmacies/api/pharmacy.controller";
import { PharmacyService } from "@/src/contexts/pharmacies/api/pharmacy.service";

describe("PharmacyController", () => {
  let controller: PharmacyController;
  let service: PharmacyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyController],
      providers: [
        {
          provide: PharmacyService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
            getByDate: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyController>(PharmacyController);
    service = module.get<PharmacyService>(PharmacyService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a pharmacy", async () => {
      const result = PharmacyMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(PharmacyMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a pharmacy", async () => {
      const result = PharmacyMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, PharmacyMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });
});
