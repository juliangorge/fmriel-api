import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostRepository } from "@/src/contexts/posts/api/post.repository";
import { PostService } from "@/src/contexts/posts/api/post.service";

describe("PostService", () => {
  let service: PostService;
  let repository: PostRepository;

  const mockPostRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findFeatured: vi.fn(),
  };

  beforeEach(() => {
    repository = mockPostRepository as unknown as PostRepository;
    service = new PostService(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PostMock];
    mockPostRepository.findAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PostMock, id };
    mockPostRepository.findById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });

  it("should return featured", async () => {
    const mock = [PostMock];
    mockPostRepository.findFeatured.mockReturnValue(mock);

    const response = await service.getFeatured();
    expect(response).toBe(mock);
  });
});
