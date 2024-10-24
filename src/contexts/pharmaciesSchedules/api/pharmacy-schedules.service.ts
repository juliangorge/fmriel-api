import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { PharmacySchedule } from "./pharmacy-schedules.model";
import { PharmacyScheduleRepository } from "./pharmacy-schedules.repository";

@Injectable()
export class PharmacyScheduleService extends BaseService<PharmacySchedule> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly repository: PharmacyScheduleRepository,
  ) {
    super(supabaseProvider, repository);
  }

  async getByDate(date: Date): Promise<PharmacySchedule[]> {
    return this.repository.getByDate(date);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
