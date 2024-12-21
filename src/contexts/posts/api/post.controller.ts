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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";
import { validateDto } from "@/src/utils/validateDto";

import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { PostService } from "./post.service";

@Controller("posts")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostController {
  constructor(protected readonly service: PostService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get("highlights")
  async getHighlights() {
    return await this.service.getHighlights();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get(":id")
  async getById(@Param("id") id: string) {
    const postId = Number.parseInt(id, 10);
    const post = await this.service.getById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get("mainHighlights")
  getMainHighlights() {
    return this.service.getMainHighlights();
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    await validateDto(createPostDto);
    return this.service.create(createPostDto);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    const postId = Number.parseInt(id, 10);
    await validateDto(updatePostDto); // Validate DTO before proceeding
    const post = await this.service.update(postId, updatePostDto);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const postId = Number.parseInt(id, 10);
    const post = await this.service.delete(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return { message: `Post with ID ${id} successfully deleted` };
  }
}
