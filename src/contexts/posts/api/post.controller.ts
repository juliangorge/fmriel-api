import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { BaseController } from "@/contexts/base/api/base.controller";

import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { Post as PostModel } from "./post.model";
import { PostService } from "./post.service";

@ApiTags("Posts")
@Controller("posts")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostController extends BaseController<PostModel> {
  constructor(protected readonly service: PostService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreatePostDto) {
    await validateDto(createDto);
    return this.baseService.create(createDto);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateDto: UpdatePostDto) {
    await validateDto(updateDto);
    return this.baseService.update(id, updateDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("highlights")
  async getHighlights() {
    return this.service.getHighlights();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("mainHighlights")
  getMainHighlights() {
    return this.service.getMainHighlights();
  }
}
