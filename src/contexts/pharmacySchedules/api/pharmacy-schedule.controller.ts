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
  async create(@Body() createPostDto: CreatePharmacyScheduleDto) {
    return this.baseService.create(createPostDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdatePharmacyScheduleDto,
  ) {
    return this.baseService.update(id, updateDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("byDate/:date")
  async getByDate(@Param("date") date: string) {
    const parsedDate = new Date(date);
    return this.service.getByDate(parsedDate);
  }
}
