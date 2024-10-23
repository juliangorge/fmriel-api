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

  async getAll(): Promise<PharmacySchedule[]> {
    return this.repository.getAll();
  }

  async getByDate(date: Date): Promise<PharmacySchedule[]> {
    return this.repository.getByDate(date);
  }

  async create(pharmacySchedule: PharmacySchedule): Promise<PharmacySchedule> {
    return this.repository.create(pharmacySchedule);
  }

  async update(
    id: number,
    pharmacySchedule: Partial<PharmacySchedule>,
  ): Promise<PharmacySchedule> {
    return this.repository.update(id, pharmacySchedule);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
