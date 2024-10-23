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
} from "@nestjs/common";

import * as pharmacyScheduleModel from "./pharmacy-schedules.model";
import { PharmacyScheduleService } from "./pharmacy-schedules.service";

@Controller("pharmacy_schedules")
export class PharmacyScheduleController {
  constructor(protected readonly service: PharmacyScheduleService) {}

  @Get()
  async getAll(): Promise<pharmacyScheduleModel.PharmacySchedule[]> {
    return this.service.getAll();
  }

  @Get("date")
  async getByDate(
    @Query("date") dateStr: string,
  ): Promise<pharmacyScheduleModel.PharmacySchedule[]> {
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
  async create(
    @Body() pharmacySchedule: pharmacyScheduleModel.PharmacySchedule,
  ): Promise<pharmacyScheduleModel.PharmacySchedule> {
    return this.service.create(pharmacySchedule);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() pharmacySchedule: Partial<pharmacyScheduleModel.PharmacySchedule>,
  ): Promise<pharmacyScheduleModel.PharmacySchedule> {
    return this.service.update(id, pharmacySchedule);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<void> {
    return this.service.delete(id);
  }
}
