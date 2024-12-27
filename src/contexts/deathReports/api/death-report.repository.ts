import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { DeathReport } from "./death-report.model";

@Injectable()
export class DeathReportRepository extends BaseRepository<DeathReport> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "death_reports");
  }
}
