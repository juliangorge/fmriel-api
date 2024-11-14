import { Module } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { DeathReportController } from "./api/death-reports.controller";
import { DeathReportRepository } from "./api/death-reports.repository";
import { DeathReportService } from "./api/death-reports.service";

@Module({
  imports: [],
  controllers: [DeathReportController],
  providers: [DeathReportService, DeathReportRepository, SupabaseProvider],
})
export class DeathReportModule {}
