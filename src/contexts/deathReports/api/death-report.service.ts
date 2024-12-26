import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseService } from "@/contexts/base/api/base.service";

import { DeathReport } from "./death-report.model";
import { DeathReportRepository } from "./death-report.repository";

@Injectable()
export class DeathReportService extends BaseService<DeathReport> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly repository: DeathReportRepository,
  ) {
    super(supabaseProvider, repository);
  }

  async findByQuery(query: string): Promise<DeathReport[]> {
    return this.repository.findByQuery(query);
  }
}
