import { Module } from "@nestjs/common";

import { PostSectionController } from "./api/post-section.controller";
import { PostSectionRepository } from "./api/post-section.repository";
import { PostSectionService } from "./api/post-section.service";

@Module({
  controllers: [PostSectionController],
  providers: [PostSectionService, PostSectionRepository],
})
export class PostSectionModule {}
