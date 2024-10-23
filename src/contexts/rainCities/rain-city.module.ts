import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { SupabaseModule } from "@/shared/supabase/supabase.module";

import { RainCityController } from "./api/rain-city.controller";
import { RainCityRepository } from "./api/rain-city.repository";
import { RainCityService } from "./api/rain-city.service";

@Module({
  imports: [SupabaseModule, CacheModule.register({ isGlobal: true })],
  controllers: [RainCityController],
  providers: [RainCityService, RainCityRepository],
})
export class RainCityModule {}
