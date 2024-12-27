/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReportController } from "@/src/contexts/deathReports/api/death-report.controller";
import { DeathReportService } from "@/src/contexts/deathReports/api/death-report.service";

describe("DeathReportController", () => {
  let controller: DeathReportController;
  let service: DeathReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeathReportController],
      providers: [
        {
          provide: DeathReportService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeathReportController>(DeathReportController);
    service = module.get<DeathReportService>(DeathReportService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a death report", async () => {
      const result = DeathReportMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(DeathReportMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a death report", async () => {
      const result = DeathReportMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, DeathReportMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });
});
