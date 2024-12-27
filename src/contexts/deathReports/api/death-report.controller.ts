import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { BaseController } from "../../base/api/base.controller";
import { CreateDeathReportDto, UpdateDeathReportDto } from "./death-report.dto";
import { DeathReport as DeathReportModel } from "./death-report.model";
import { DeathReportService } from "./death-report.service";

@ApiTags("Death Reports")
@Controller("death_reports")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class DeathReportController extends BaseController<DeathReportModel> {
  constructor(protected readonly service: DeathReportService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreateDeathReportDto) {
    await validateDto(createDto);
    return this.baseService.create(createDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdateDeathReportDto,
  ) {
    await validateDto(updateDto);
    return this.baseService.update(id, updateDto);
  }
}
