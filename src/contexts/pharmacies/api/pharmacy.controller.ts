import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

import * as pharmacyModel from "./pharmacy.model";
import { PharmacyService } from "./pharmacy.service";

@Controller("pharmacies")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PharmacyController {
  constructor(protected readonly service: PharmacyService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get(":id")
  async getById(@Param("id") id: string) {
    const pharmacyId = Number.parseInt(id, 10);
    const pharmacy = await this.service.getById(pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }
    return pharmacy;
  }

  @Post()
  async create(@Body() pharmacy: pharmacyModel.Pharmacy) {
    return this.service.create(pharmacy);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() pharmacy: pharmacyModel.Pharmacy,
  ) {
    const pharmacyId = Number.parseInt(id, 10);
    return this.service.update(pharmacyId, pharmacy);
  }
}
