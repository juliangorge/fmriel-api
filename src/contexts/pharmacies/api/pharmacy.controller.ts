import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { CreatePharmacyDto, UpdatePharmacyDto } from "./pharmacy.dto";
import { PharmacyService } from "./pharmacy.service";
import { CreateDeathReportDto, UpdateDeathReportDto } from "../../deathReports/api/death-reports.dto";

@Controller("pharmacies")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PharmacyController {
  deathReportService: any;
  constructor(protected readonly service: PharmacyService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hora
  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get(":id")
  async getById(@Param("id") id: string) {
    const pharmacyId = Number.parseInt(id, 10);
    const pharmacy = await this.service.getById(pharmacyId);
    if (!pharmacy) {
      throw new NotFoundException();
    }
    return pharmacy;
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

    // Validar el DTO de UpdateDeathReport antes de pasarlo al servicio
    await validateDto(updateDeathReportDto);

    return this.deathReportService.update(reportId, updateDeathReportDto);
  }