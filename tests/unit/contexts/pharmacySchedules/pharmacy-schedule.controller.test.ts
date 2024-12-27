/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacyScheduleController } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.controller";
import { PharmacyScheduleService } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.service";

describe("PharmacyScheduleController", () => {
  let controller: PharmacyScheduleController;
  let service: PharmacyScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PharmacyScheduleController],
      providers: [
        {
          provide: PharmacyScheduleService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
            getByDate: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyScheduleController>(
      PharmacyScheduleController,
    );
    service = module.get<PharmacyScheduleService>(PharmacyScheduleService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a pharmacy schedule", async () => {
      const result = PharmacyScheduleMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(PharmacyScheduleMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a pharmacy schedule", async () => {
      const result = PharmacyScheduleMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, PharmacyScheduleMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe("getByDate", () => {
    it("should get pharmacy schedules by date", async () => {
      const result = [PharmacyScheduleMock];
      vi.spyOn(service, "getByDate").mockResolvedValue(result as never);

      const response = await controller.getByDate("2022-01-01");
      expect(response).toBe(result);
      expect(service.getByDate).toHaveBeenCalled();
    });
  });
});
