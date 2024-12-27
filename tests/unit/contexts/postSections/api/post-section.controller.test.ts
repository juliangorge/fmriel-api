/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { vi } from "vitest";

import { PostSectionMock } from "@/tests/utils/mocks/post-section";

import { PostSectionController } from "@/src/contexts/postSections/api/post-section.controller";
import { PostSectionService } from "@/src/contexts/postSections/api/post-section.service";

describe("PostSectionController", () => {
  let controller: PostSectionController;
  let service: PostSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostSectionController],
      providers: [
        {
          provide: PostSectionService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostSectionController>(PostSectionController);
    service = module.get<PostSectionService>(PostSectionService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a post section", async () => {
      const result = PostSectionMock;
      vi.spyOn(service, "create").mockResolvedValue(result as never);

      const response = await controller.create(PostSectionMock);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a post section", async () => {
      const result = PostSectionMock;
      vi.spyOn(service, "update").mockResolvedValue(result as never);

      const response = await controller.update(1, PostSectionMock);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalled();
    });
  });
});
