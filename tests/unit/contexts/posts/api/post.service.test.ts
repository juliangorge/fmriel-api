/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostRepository } from "@/src/contexts/posts/api/post.repository";
import { PostService } from "@/src/contexts/posts/api/post.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PostService", () => {
  let service: PostService;
  let repositoryMock: PostRepository;
  let supabaseProviderMock: SupabaseProvider;

  // You only need to mock the methods that PostService (or BaseService) actually calls
  const mockPostRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getHighlights: vi.fn(),
    getMainHighlights: vi.fn(),
  };

  const mockSupabaseProvider = {
    getClient: vi.fn().mockReturnValue({
      from: vi.fn(),
      auth: {
        getSession: vi.fn().mockResolvedValue({
          session: { user: { id: "test-user-id" } },
        }),
      },
    }),
  };

  beforeEach(() => {
    repositoryMock = mockPostRepository as unknown as PostRepository;
    supabaseProviderMock = mockSupabaseProvider as unknown as SupabaseProvider;

    // Instantiate the PostService with the mocked repository and provider
    service = new PostService(supabaseProviderMock, repositoryMock);

    // Clear calls so each test is isolated
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  //
  // If you want integration-style checks for inherited methods, keep these:
  // (Otherwise, remove them to avoid duplicating the coverage from base.service.test.ts)
  //
  describe("Inherited BaseService methods", () => {
    it("should call repository.getAll and return all posts", async () => {
      const mockData = [PostMock];
      mockPostRepository.getAll.mockResolvedValueOnce(mockData);

      const result = await service.getAll();
      expect(result).toBe(mockData);
      expect(repositoryMock.getAll).toHaveBeenCalledOnce();
    });

    it("should call repository.getById and return a post", async () => {
      const id = 1;
      const mockData = { ...PostMock, id };
      mockPostRepository.getById.mockResolvedValueOnce(mockData);

      const result = await service.getById(id);
      expect(result).toBe(mockData);
      expect(repositoryMock.getById).toHaveBeenCalledWith(id);
    });

    // Similarly, you could add tests for create, update, and delete
    // if you'd like an extra layer of integration checks.
    // ...
  });

  //
  // PostService-specific methods
  //
  describe("Custom PostService methods", () => {
    it("should return highlighted posts", async () => {
      const mockHighlights = [PostMock];
      mockPostRepository.getHighlights.mockResolvedValueOnce(mockHighlights);

      const result = await service.getHighlights();
      expect(result).toBe(mockHighlights);
      expect(repositoryMock.getHighlights).toHaveBeenCalledOnce();
    });

    it("should return main highlighted posts", async () => {
      const mockMainHighlights = [PostMock];
      mockPostRepository.getMainHighlights.mockResolvedValueOnce(
        mockMainHighlights,
      );

      const result = await service.getMainHighlights();
      expect(result).toBe(mockMainHighlights);
      expect(repositoryMock.getMainHighlights).toHaveBeenCalledOnce();
    });
  });
});
