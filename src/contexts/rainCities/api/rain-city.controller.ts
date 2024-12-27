import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { BaseController } from "../../base/api/base.controller";
import { CreateRainCityDto, UpdateRainCityDto } from "./rain-city.dto";
import { RainCity as RainCityModel } from "./rain-city.model";
import { RainCityService } from "./rain-city.service";

@ApiTags("Rain Cities")
@Controller("rainCities")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class RainCityController extends BaseController<RainCityModel> {
  constructor(protected readonly service: RainCityService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreateRainCityDto) {
    await validateDto(createDto);
    return this.baseService.create(createDto);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateDto: UpdateRainCityDto) {
    await validateDto(updateDto);
    return this.baseService.update(id, updateDto);
  }
}
