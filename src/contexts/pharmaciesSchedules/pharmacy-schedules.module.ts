import { Module } from "@nestjs/common";

import { PharmacyScheduleController } from "./api/pharmacy-schedules.controller";
import { PharmacyScheduleRepository } from "./api/pharmacy-schedules.repository";
import { PharmacyScheduleService } from "./api/pharmacy-schedules.service";

@Module({
  controllers: [PharmacyScheduleController],
  providers: [PharmacyScheduleService, PharmacyScheduleRepository],
  exports: [PharmacyScheduleService],
})
export class PharmacyScheduleModule {}
