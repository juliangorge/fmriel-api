import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { Pharmacy } from "./pharmacy.model";

@Injectable()
export class PharmacyRepository extends BaseRepository<Pharmacy> {
  constructor() {
    super("pharmacies");
  }

  async create(pharmacy: Pharmacy): Promise<Pharmacy> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([pharmacy])
      .single();
    if (error) throw new Error(`Error inserting data: ${error.message}`);
    return data as Pharmacy;
  }

  async update(id: number, pharmacy: Pharmacy): Promise<Pharmacy> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(pharmacy)
      .eq("id", id)
      .single();
    if (error) throw new Error(`Error updating data: ${error.message}`);
    return data as Pharmacy;
  }
}
