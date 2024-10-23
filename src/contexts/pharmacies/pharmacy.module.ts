import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { PharmacyController } from "./api/pharmacy.controller";
import { PharmacyRepository } from "./api/pharmacy.repository";
import { PharmacyService } from "./api/pharmacy.service";

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  controllers: [PharmacyController],
  providers: [PharmacyService, PharmacyRepository],
})
export class PharmacyModule {}
