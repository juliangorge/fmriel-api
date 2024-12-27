import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

import { BaseController } from "../../base/api/base.controller";
import { CreatePharmacyDto, UpdatePharmacyDto } from "./pharmacy.dto";
import { Pharmacy as PharmacyModel } from "./pharmacy.model";
import { PharmacyService } from "./pharmacy.service";

@ApiTags("Pharmacies")
@Controller("pharmacies")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PharmacyController extends BaseController<PharmacyModel> {
  constructor(protected readonly service: PharmacyService) {
    super(service);
  }

  @Post()
  async create(@Body() createPostDto: CreatePharmacyDto) {
    return this.baseService.create(createPostDto);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateDto: UpdatePharmacyDto) {
    return this.baseService.update(id, updateDto);
  }
}
