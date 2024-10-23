import { Injectable } from "@nestjs/common";

import { PharmacySchedule } from "./pharmacy-schedules.model";
import { PharmacyScheduleRepository } from "./pharmacy-schedules.repository";

@Injectable()
export class PharmacyScheduleService {
  constructor(private readonly repository: PharmacyScheduleRepository) {}

  async getAll(): Promise<PharmacySchedule[]> {
    return this.repository.findAll();
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
