import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
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
  async create(
    @Body() deathReport: Omit<DeathReport, "id">,
  ): Promise<DeathReport> {
    return this.deathReportService.create(deathReport);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() deathReport: Partial<Omit<DeathReport, "id">>,
  ): Promise<DeathReport> {
    return this.deathReportService.update(id, deathReport);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<DeathReport> {
    return this.deathReportService.delete(id);
  }
}
