import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateRainCityDto, UpdateRainCityDto } from "./rain-city.dto";
import { RainCityService } from "./rain-city.service";

@Controller("rainCities")
@ApiTags("Rain Cities")
@ApiBearerAuth("access-token")
export class RainCityController {
  constructor(protected readonly rainCityService: RainCityService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get()
  @ApiOperation({ summary: "Get all rain cities" })
  getAll() {
    return this.rainCityService.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get(":id")
  @ApiOperation({ summary: "Get rain city by ID" })
  getById(@Param("id") id: string) {
    const rainCityId = Number.parseInt(id, 10);
    return this.rainCityService.getById(rainCityId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new rain city" })
  create(@Body() createRainCityDto: CreateRainCityDto) {
    return this.rainCityService.create(createRainCityDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing rain city by ID" })
  update(
    @Param("id") id: string,
    @Body() updateRainCityDto: UpdateRainCityDto,
  ) {
    const rainCityId = Number.parseInt(id, 10);
    return this.rainCityService.update(rainCityId, updateRainCityDto);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.rainCityService.delete(id);
  }
}
