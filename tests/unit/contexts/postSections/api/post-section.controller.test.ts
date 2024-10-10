import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";

import { PostSectionController } from "@/src/contexts/postSections/api/post-section.controller";
import { PostSectionRepository } from "@/src/contexts/postSections/api/post-section.repository";
import { PostSectionService } from "@/src/contexts/postSections/api/post-section.service";

describe("PostSectionController", () => {
  let controller: PostSectionController;
  let service: PostSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PostSectionController],
      providers: [PostSectionService, PostSectionRepository],
    }).compile();

    controller = module.get<PostSectionController>(PostSectionController);
    service = module.get<PostSectionService>(PostSectionService);
  });

  describe("getAll", () => {
    it("should return a list of all", async () => {
      const result = [{ id: 1, title: "Our city" }];
      vi.spyOn(service, "getAll").mockImplementation(() => result as never);

      const response = await controller.getAll();
      expect(response).toBe(result);
    });
  });

  describe("getById", () => {
    it("should return a single one by ID", async () => {
      const id = 1;
      const mock = { id, name: "Culture" };

      vi.spyOn(service, "getById").mockImplementation(() =>
        Promise.resolve(mock),
      );

      const response = await controller.getById(id.toString());
      expect(response).toEqual(mock);
    });
  });
});
