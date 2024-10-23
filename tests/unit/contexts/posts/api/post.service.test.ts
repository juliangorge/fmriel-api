/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostRepository } from "@/src/contexts/posts/api/post.repository";
import { PostService } from "@/src/contexts/posts/api/post.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PostService", () => {
  let service: PostService;
  let repository: PostRepository;
  let supabaseProvider: SupabaseProvider;

  const mockPostRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getHighlights: vi.fn(),
    getMainHighlights: vi.fn(),
  };

  const mockSupabaseProvider = {
    getClient: vi.fn().mockReturnValue({
      from: vi.fn(),
      auth: {
        getSession: vi
          .fn()
          .mockResolvedValue({ session: { user: { id: "test-user-id" } } }),
      },
    }),
  };

  beforeEach(() => {
    repository = mockPostRepository as unknown as PostRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new PostService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PostMock];
    mockPostRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PostMock, id };
    mockPostRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });

  it("should return highlighted posts", async () => {
    const mock = [PostMock];
    mockPostRepository.getHighlights.mockReturnValue(mock);

    const response = await service.getHighlights();
    expect(response).toBe(mock);
  });

  it("should return main highlighted posts", async () => {
    const mock = [PostMock];
    mockPostRepository.getMainHighlights.mockReturnValue(mock);

    const response = await service.getMainHighlights();
    expect(response).toBe(mock);
  });
});
