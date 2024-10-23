/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostController } from "@/src/contexts/posts/api/post.controller";
import { PostService } from "@/src/contexts/posts/api/post.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("PostController", () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
            getHighlights: vi.fn(),
            getMainHighlights: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  describe("getAll", () => {
    it("should return a list of all posts", async () => {
      const result = [PostMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getHighlights", () => {
    it("should return highlighted posts", async () => {
      const result = [PostMock];

      vi.spyOn(service, "getHighlights").mockResolvedValue(result as never);

      const response = await controller.getHighlights();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    it("should return a post by ID", async () => {
      const id = 1;
      const mockPost = { ...PostMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockPost as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockPost);
    });
  });

  describe("getMainHighlight", () => {
    it("should return main featured posts", async () => {
      const result = [PostMock];

      vi.spyOn(service, "getMainHighlights").mockResolvedValue(result as never);

      const response = await controller.getMainHighlights();
      expect(response).toBe(result);
    });
  });
});
