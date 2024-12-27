import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

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
  async create(@Body() createPostDto: CreateDeathReportDto) {
    return this.baseService.create(createPostDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdateDeathReportDto,
  ) {
    return this.baseService.update(id, updateDto);
  }
}
