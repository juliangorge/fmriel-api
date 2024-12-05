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
  UseInterceptors,
} from "@nestjs/common";

import { validateDto } from "@/src/utils/validateDto";

import {
  CreateDeathReportDto,
  UpdateDeathReportDto,
} from "./death-reports.dto";
import { DeathReport } from "./death-reports.model";
import { DeathReportService } from "./death-reports.service";

@Controller("death-reports")
export class DeathReportController {
  constructor(private readonly deathReportService: DeathReportService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hora
  @Get()
  async getAll(): Promise<DeathReport[]> {
    return this.deathReportService.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800) // 30 minutos
  @Get("search")
  async findByQuery(@Query("query") query: string): Promise<DeathReport[]> {
    return this.deathReportService.findByQuery(query);
  }

  @Post()
  async create(@Body() createDeathReportDto: CreateDeathReportDto) {
    await validateDto(createDeathReportDto);
    return this.deathReportService.create(createDeathReportDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDeathReportDto: UpdateDeathReportDto,
  ) {
    const reportId = Number.parseInt(id, 10);

    if (Number.isNaN(reportId)) {
      throw new BadRequestException("The provided ID must be a valid number.");
    }

    await validateDto(updateDeathReportDto);

    return this.deathReportService.update(reportId, updateDeathReportDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<DeathReport> {
    return this.deathReportService.delete(id);
  }
}
