import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { BaseController } from "../../base/api/base.controller";
import { CreatePostSectionDto, UpdatePostSectionDto } from "./post-section.dto";
import { PostSection as PostSectionModel } from "./post-section.model";
import { PostSectionService } from "./post-section.service";

@ApiTags("Post Sections")
@Controller("postSections")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostSectionController extends BaseController<PostSectionModel> {
  constructor(protected readonly service: PostSectionService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreatePostSectionDto) {
    await validateDto(createDto);
    return this.baseService.create(createDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdatePostSectionDto,
  ) {
    await validateDto(updateDto);
    return this.baseService.update(id, updateDto);
  }
}
