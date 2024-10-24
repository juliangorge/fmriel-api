import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { Pharmacy } from "./pharmacy.model";
import { PharmacyRepository } from "./pharmacy.repository";

@Injectable()
export class PharmacyService extends BaseService<Pharmacy> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly pharmacyRepository: PharmacyRepository,
  ) {
    super(supabaseProvider, pharmacyRepository);
  }
}
