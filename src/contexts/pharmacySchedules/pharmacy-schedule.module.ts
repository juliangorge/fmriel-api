import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { SupabaseModule } from "@/shared/supabase/supabase.module";

import { PharmacyScheduleController } from "./api/pharmacy-schedule.controller";
import { PharmacyScheduleRepository } from "./api/pharmacy-schedule.repository";
import { PharmacyScheduleService } from "./api/pharmacy-schedule.service";

@Module({
  imports: [SupabaseModule, CacheModule.register({ isGlobal: true })],
  controllers: [PharmacyScheduleController],
  providers: [PharmacyScheduleService, PharmacyScheduleRepository],
  exports: [PharmacyScheduleService],
})
export class PharmacyScheduleModule {}
