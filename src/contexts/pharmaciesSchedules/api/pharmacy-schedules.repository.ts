import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { PharmacySchedule } from "./pharmacy-schedules.model";

@Injectable()
export class PharmacyScheduleRepository extends BaseRepository<PharmacySchedule> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "pharmacy_schedules");
  }

  async create(pharmacySchedule: PharmacySchedule): Promise<PharmacySchedule> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(pharmacySchedule)
      .single();

    if (error) {
      throw new Error(`Error creating record: ${error.message}`);
    }
    return data as PharmacySchedule;
  }

  async getByDate(date: Date): Promise<PharmacySchedule[]> {
    const formattedDate = date.toISOString().split("T")[0];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id, pharmacy_id") // Solo selecciona los IDs y el pharmacy_id
      .gte("start_date", formattedDate)
      .lte("end_date", formattedDate);

    if (error) {
      throw new Error(`Error fetching data by date: ${error.message}`);
    }

    return data as PharmacySchedule[];
  }

  async update(
    id: number,
    pharmacySchedule: Partial<PharmacySchedule>,
  ): Promise<PharmacySchedule> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(pharmacySchedule)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }

    return data as PharmacySchedule;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }
}
