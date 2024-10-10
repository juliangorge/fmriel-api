import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { PostSection } from "./post-section.model";

@Injectable()
export class PostSectionRepository extends BaseRepository<PostSection> {
  constructor() {
    super("post_sections");
  }
}
