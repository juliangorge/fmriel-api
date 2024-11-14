import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { DeathReport } from "./death-reports.model";

@Injectable()
export class DeathRecordRepository extends BaseRepository<DeathReport> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "death_reports");
  }

  async findByQuery(query: string): Promise<DeathReport[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .or(`name.ilike.%${query}%,surname.ilike.%${query}%`);

    if (error) {
      throw new Error(
        `Error fetching death records by query in name or surname: ${error.message}`,
      );
    }

    return data as DeathReport[];
  }
}
