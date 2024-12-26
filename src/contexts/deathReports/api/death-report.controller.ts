import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";

import { validateDto } from "@/src/utils/validateDto";

import { CreateDeathReportDto, UpdateDeathReportDto } from "./death-report.dto";
import { DeathReport } from "./death-report.model";
import { DeathReportService } from "./death-report.service";

@Controller("death-reports")
export class DeathReportController {
  constructor(private readonly service: DeathReportService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hora
  @Get()
  async getAll(): Promise<DeathReport[]> {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get(":id")
  async getById(@Param("id") id: string) {
    const deathReportId = Number.parseInt(id, 10);
    const deathReport = await this.service.getById(deathReportId);
    if (!deathReport) {
      throw new NotFoundException();
    }
    return deathReport;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800) // 30 minutos
  @Get("search")
  async findByQuery(@Query("query") query: string): Promise<DeathReport[]> {
    return this.service.findByQuery(query);
  }

  @Post()
  async create(@Body() createDeathReportDto: CreateDeathReportDto) {
    await validateDto(createDeathReportDto);
    return this.service.create(createDeathReportDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDeathReportDto: UpdateDeathReportDto,
  ) {
    const deathReportId = Number.parseInt(id, 10);
    await validateDto(updateDeathReportDto); // Validate DTO before proceeding
    const deathReport = await this.service.update(
      deathReportId,
      updateDeathReportDto,
    );
    if (!deathReport) {
      throw new NotFoundException();
    }
    return deathReport;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const deathReportId = Number.parseInt(id, 10);
    const deathReport = await this.service.delete(deathReportId);
    if (!deathReport) {
      throw new NotFoundException();
    }
    return { message: `Death Report with ID ${id} successfully deleted` };
  }
}
