import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { BaseController } from "../../base/api/base.controller";
import {
  CreatePharmacyScheduleDto,
  UpdatePharmacyScheduleDto,
} from "./pharmacy-schedule.dto";
import { PharmacySchedule as PharmacyScheduleModel } from "./pharmacy-schedule.model";
import { PharmacyScheduleService } from "./pharmacy-schedule.service";

@ApiTags("Pharmacy Schedules")
@Controller("pharmacy_schedules")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PharmacyScheduleController extends BaseController<PharmacyScheduleModel> {
  constructor(protected readonly service: PharmacyScheduleService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreatePharmacyScheduleDto) {
    await validateDto(createDto);
    return this.baseService.create(createDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdatePharmacyScheduleDto,
  ) {
    await validateDto(updateDto);
    return this.baseService.update(id, updateDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("byDate/:date")
  async getByDate(@Param("date") date: string) {
    try {
      const parsedDate = new Date(date);
      const result = await this.service.getByDate(parsedDate);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        // Si el error es por no encontrar farmacias, responde con 404
        if (error.message === "No pharmacies found for the provided date") {
          return {
            statusCode: 404,
            message: error.message,
          };
        }

        // Si es un error general, responde con 500
        return {
          statusCode: 500,
          message: "Internal server error",
        };
      }
    }
  }
}
