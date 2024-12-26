import { Module } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { DeathReportController } from "./api/death-report.controller";
import { DeathReportRepository } from "./api/death-report.repository";
import { DeathReportService } from "./api/death-report.service";

@Module({
  imports: [],
  controllers: [DeathReportController],
  providers: [DeathReportService, DeathReportRepository, SupabaseProvider],
})
export class DeathReportModule {}
