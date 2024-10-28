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

import { PharmacySchedule } from "./pharmacy-schedule.model";
import { PharmacyScheduleService } from "./pharmacy-schedule.service";

@Controller("pharmacy_schedules")
export class PharmacyScheduleController {
  constructor(protected readonly service: PharmacyScheduleService) {}

  @Get()
  async getAll(): Promise<PharmacySchedule[]> {
    return this.service.getAll();
  }

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
  async create(
    @Body() pharmacySchedule: PharmacySchedule,
  ): Promise<PharmacySchedule> {
    return this.service.create(pharmacySchedule);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() pharmacySchedule: Partial<PharmacySchedule>,
  ): Promise<PharmacySchedule> {
    return this.service.update(id, pharmacySchedule);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<PharmacySchedule> {
    return this.service.delete(id);
  }
}
