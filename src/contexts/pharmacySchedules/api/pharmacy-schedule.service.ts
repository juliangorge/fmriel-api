import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { PharmacySchedule } from "./pharmacy-schedule.model";
import { PharmacyScheduleRepository } from "./pharmacy-schedule.repository";

@Injectable()
export class PharmacyScheduleService extends BaseService<PharmacySchedule> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly repository: PharmacyScheduleRepository,
  ) {
    super(supabaseProvider, repository);
  }

  async getByDate(date: Date): Promise<PharmacySchedule[]> {
    const result = await this.repository.getByDate(date);
    return result;
  }
}
