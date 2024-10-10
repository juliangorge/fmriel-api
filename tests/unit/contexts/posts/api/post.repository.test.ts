/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { Post } from "@/src/contexts/posts/api/post.model";
import { PostRepository } from "@/src/contexts/posts/api/post.repository";

describe("PostRepository", () => {
  let repository: PostRepository;
  let supabaseMock: SupabaseClient;

  beforeEach(async () => {
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostRepository,
        { provide: SupabaseClient, useValue: supabaseMock }, // Provide the mock SupabaseClient
      ],
    }).compile();

    repository = module.get<PostRepository>(PostRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // eslint-disable-next-line vitest/no-commented-out-tests
  /*
  Not implemented yet
  it("should fetch featured posts successfully", async () => {
    // Mock the Supabase query chain
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: mockPosts,
        error: null,
      }),
    });

    (supabaseMock.from as Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repository.findFeatured();

    expect(supabaseMock.from).toHaveBeenCalledWith("posts");
    expect(supabaseMock.from("posts").select).toHaveBeenCalled();
    expect(supabaseMock.from("posts").select().eq).toHaveBeenCalledWith(
      "featured",
      true,
    );
    expect(result).toEqual(mockPosts);
  });

  it("should throw an error when fetching featured posts fails", async () => {
    const mockError = { message: "Failed to fetch featured posts" };

    // Mock the Supabase query chain to return an error
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      }),
    });

    (supabaseMock.from as Mock).mockReturnValue({
      select: mockSelect,
    });

    // Test that the method throws the correct error
    await expect(repository.findFeatured()).rejects.toThrow(
      "Error fetching featured posts: Failed to fetch featured posts",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith("posts");
    expect(supabaseMock.from("posts").select).toHaveBeenCalled();
    expect(supabaseMock.from("posts").select().eq).toHaveBeenCalledWith(
      "featured",
      true,
    );
  });
  */
});
