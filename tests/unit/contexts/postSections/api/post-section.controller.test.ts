/* eslint-disable unicorn/no-null */
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PostSectionMock } from "@/tests/utils/mocks/post-section";

import { PostSectionController } from "@/src/contexts/postSections/api/post-section.controller";
import { PostSectionService } from "@/src/contexts/postSections/api/post-section.service";
import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

describe("PostSectionController", () => {
  let controller: PostSectionController;
  let service: PostSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, CacheModule.register()],
      controllers: [PostSectionController],
      providers: [
        {
          provide: PostSectionService,
          useValue: {
            getAll: vi.fn(),
            getById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostSectionController>(PostSectionController);
    service = module.get<PostSectionService>(PostSectionService);
  });

  describe("getAll", () => {
    it("should return a list of all posts", async () => {
      const result = [PostSectionMock];

      vi.spyOn(service, "getAll").mockResolvedValue(result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    it("should return a post by ID", async () => {
      const id = 1;
      const mockPostSection = { ...PostSectionMock, id };

      vi.spyOn(service, "getById").mockResolvedValue(mockPostSection as never);

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mockPostSection);
    });
  });
});
