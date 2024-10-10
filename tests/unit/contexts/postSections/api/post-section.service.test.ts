import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostSectionRepository } from "@/src/contexts/postSections/api/post-section.repository";
import { PostSectionService } from "@/src/contexts/postSections/api/post-section.service";

describe("PostSectionService", () => {
  let service: PostSectionService;
  let repository: PostSectionRepository;

  const mockPostSectionRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findFeatured: vi.fn(),
  };

  beforeEach(() => {
    repository = mockPostSectionRepository as unknown as PostSectionRepository;
    service = new PostSectionService(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PostMock];
    mockPostSectionRepository.findAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PostMock, id };
    mockPostSectionRepository.findById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });
});
