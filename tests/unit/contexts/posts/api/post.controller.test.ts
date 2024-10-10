import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostController } from "@/src/contexts/posts/api/post.controller";
import { PostRepository } from "@/src/contexts/posts/api/post.repository";
import { PostService } from "@/src/contexts/posts/api/post.service";

describe("PostController", () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PostController],
      providers: [PostService, PostRepository],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  describe("getAll", () => {
    it("should return a list of all", async () => {
      const result = [PostMock];
      vi.spyOn(service, "getAll").mockImplementation(() => result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    it("should return a single one by ID", async () => {
      const id = 1;
      const mockPost = { ...PostMock, id };

      vi.spyOn(service, "getById").mockImplementation(() =>
        Promise.resolve(mockPost),
      );

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockPost);
    });
  });

  describe("getFeatured", () => {
    it("should return a list of featured posts", async () => {
      const mockFeaturedPosts = [PostMock];

      vi.spyOn(service, "getFeatured").mockImplementation(() =>
        Promise.resolve(mockFeaturedPosts),
      );

      const response = await controller.getFeatured();
      expect(response).toEqual(mockFeaturedPosts);
    });
  });
});
