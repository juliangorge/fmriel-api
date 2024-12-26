import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { PharmacySchedule } from "./pharmacy-schedule.model";

@Injectable()
export class PharmacyScheduleRepository extends BaseRepository<PharmacySchedule> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "pharmacy_schedules");
  }

  async getByDate(date: Date): Promise<PharmacySchedule> {
    const formattedDate = date.toISOString().split("T")[0];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id, pharmacy_id")
      .gte("start_date", formattedDate)
      .lte("end_date", formattedDate)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    return data as PharmacySchedule;
  }
}
