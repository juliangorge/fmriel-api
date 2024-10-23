import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { SupabaseModule } from "@/shared/supabase/supabase.module";

import { PharmacyScheduleController } from "./api/pharmacy-schedules.controller";
import { PharmacyScheduleRepository } from "./api/pharmacy-schedules.repository";
import { PharmacyScheduleService } from "./api/pharmacy-schedules.service";
@Module({
  imports: [SupabaseModule, CacheModule.register({ isGlobal: true })],
  controllers: [PharmacyScheduleController],
  providers: [PharmacyScheduleService, PharmacyScheduleRepository],
  exports: [PharmacyScheduleService],
})
export class PharmacyScheduleModule {}
