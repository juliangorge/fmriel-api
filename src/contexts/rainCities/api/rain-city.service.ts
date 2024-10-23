import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { RainCity } from "./rain-city.model";
import { RainCityRepository } from "./rain-city.repository";

@Injectable()
export class RainCityService extends BaseService<RainCity> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly rainCityRepository: RainCityRepository,
  ) {
    super(supabaseProvider, rainCityRepository);
  }
}
