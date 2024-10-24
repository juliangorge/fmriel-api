import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { Pharmacy } from "./pharmacy.model";

@Injectable()
export class PharmacyRepository extends BaseRepository<Pharmacy> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "pharmacies");
  }
}
