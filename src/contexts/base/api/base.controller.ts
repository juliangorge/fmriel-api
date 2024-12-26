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
} from "@nestjs/common";

import { Identifiable } from "./base.repository";
import { BaseService } from "./base.service";

@Controller()
export abstract class BaseController<T extends Identifiable> {
  protected constructor(protected readonly baseService: BaseService<T>) {}

  @Get()
  async getAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("sortBy") sortBy = "id",
    @Query("desc") desc = false,
  ): Promise<T[]> {
    const offset = (page - 1) * limit;
    // `desc = false` => ascending = true,
    // so we invert it: ascending = !desc
    return this.baseService.getAll(limit, offset, sortBy, !desc);
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<T> {
    const entity = await this.baseService.getById(Number(id));
    if (!entity) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return entity;
  }

  @Post()
  async create(@Body() data: Omit<T, "id">): Promise<T> {
    return this.baseService.create(data);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() data: Partial<Omit<T, "id">>,
  ): Promise<T> {
    return this.baseService.update(Number(id), data);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<T> {
    return this.baseService.delete(Number(id));
  }
}
