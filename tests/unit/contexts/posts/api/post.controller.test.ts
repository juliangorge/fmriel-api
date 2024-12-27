/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostController } from "@/src/contexts/posts/api/post.controller";
import { PostService } from "@/src/contexts/posts/api/post.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("PostController (Custom Endpoints)", () => {
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
            // Only mock the custom methods or calls you need
            create: vi.fn(),
            update: vi.fn(),
            getHighlights: vi.fn(),
            getMainHighlights: vi.fn(),
            // If your PostController doesn’t define other methods,
            // you can remove them from the mock or keep them if needed.
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a post", async () => {
      const result = PostMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(PostMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const result = PostMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, PostMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe("getHighlights", () => {
    it("should return highlighted posts", async () => {
      const result = [PostMock];
      vi.spyOn(service, "getHighlights").mockResolvedValue(result as never);

      const response = await controller.getHighlights();
      expect(response).toBe(result);
      expect(service.getHighlights).toHaveBeenCalled();
    });
  });

  describe("getMainHighlights", () => {
    it("should return main featured posts", async () => {
      const result = [PostMock];
      vi.spyOn(service, "getMainHighlights").mockResolvedValue(result as never);

      const response = await controller.getMainHighlights();
      expect(response).toBe(result);
      expect(service.getMainHighlights).toHaveBeenCalled();
    });
  });

  // If you keep/override any other custom endpoints in PostController, test them here
});
