import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { PharmacySchedule } from "./pharmacy-schedule.model";

@Injectable()
export class PharmacyScheduleRepository extends BaseRepository<PharmacySchedule> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "pharmacy_schedules");
  }

  async getByDate(date: Date): Promise<PharmacySchedule[]> {
    const formattedDate = date.toISOString().split("T")[0]; // "2024-10-24"

    const startOfDay = `${formattedDate}T00:00:00Z`;
    const endOfDay = `${formattedDate}T23:59:59Z`;

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id, pharmacy_id, start_date, end_date")
      .gte("start_date", startOfDay)
      .lte("end_date", endOfDay);

    if (error) {
      throw new Error("Error fetching pharmacy data from the database");
    }

    if (!data || data.length === 0) {
      throw new Error("No pharmacies found for the provided date");
    }

    return data as PharmacySchedule[];
  }
}
