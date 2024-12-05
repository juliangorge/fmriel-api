import type { PharmacySchedule } from "./pharmacy-schedule.model";

import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import {
  CreatePharmacyScheduleDto,
  UpdatePharmacyScheduleDto,
} from "./pharmacy-schedule.dto";
import { PharmacyScheduleService } from "./pharmacy-schedule.service";

@ApiTags("Pharmacy Schedules")
@Controller("pharmacy_schedules")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PharmacyScheduleController {
  constructor(protected readonly service: PharmacyScheduleService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hora
  @Get()
  async getAll(): Promise<PharmacySchedule[]> {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hora
  @Get("date")
  async getByDate(@Query("date") dateStr: string): Promise<PharmacySchedule[]> {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      throw new BadRequestException(
        "Invalid date format. Please use YYYY-MM-DD.",
      );
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("Invalid date provided.");
    }

    return this.service.getByDate(date);
  }

  @Post()
  async create(@Body() createPharmacyScheduleDto: CreatePharmacyScheduleDto) {
    await validateDto(CreatePharmacyScheduleDto);
    return this.service.create(createPharmacyScheduleDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePharmacyScheduleDto: UpdatePharmacyScheduleDto,
  ) {
    const scheduleId = Number.parseInt(id, 10);

    if (Number.isNaN(scheduleId)) {
      throw new BadRequestException("The provided ID must be a valid number.");
    }

    await validateDto(UpdatePharmacyScheduleDto);

    return this.service.update(scheduleId, updatePharmacyScheduleDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<PharmacySchedule> {
    return this.service.delete(id);
  }
}
