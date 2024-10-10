import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { PostSection } from "./post-section.model";
import { PostSectionRepository } from "./post-section.repository";

@Injectable()
export class PostSectionService extends BaseService<PostSection> {
  constructor(private readonly postSectionRepository: PostSectionRepository) {
    super(postSectionRepository);
  }
}
