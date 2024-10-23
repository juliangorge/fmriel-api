import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { RainCity } from "./rain-city.model";

@Injectable()
export class RainCityRepository extends BaseRepository<RainCity> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "rain_cities");
  }
}
