import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { PostController } from "./api/post.controller";
import { PostRepository } from "./api/post.repository";
import { PostService } from "./api/post.service";

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}