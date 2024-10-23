/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { Post } from "@/src/contexts/posts/api/post.model";
import { PostRepository } from "@/src/contexts/posts/api/post.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("PostRepository", () => {
  let repository: PostRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "posts";

  let selectMock: Mock;

  beforeEach(() => {
    // Mock SupabaseClient methods
    selectMock = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });

    supabaseMock = {
      from: vi.fn(() => ({
        select: selectMock,
      })),
    } as unknown as SupabaseClient;

    // Mock SupabaseProvider to return the mock SupabaseClient
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Initialize the repository with the mock provider
    repository = new PostRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all posts in getAll", async () => {
    const mockData: Post[] = [PostMock, PostMock];

    selectMock.mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await repository.getAll();

    expect(result).toEqual(mockData);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };
    selectMock.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(repository.getAll()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should fetch a post by ID in getById", async () => {
    const mockPost: Post = PostMock;

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: mockPost,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.getById(1);

    expect(result).toEqual(mockPost);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      1,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", 1).maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should throw an error when getById fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: null,
            error: mockError,
          }),
        }),
      }),
    });

    await expect(repository.getById(1)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      1,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", 1).maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should fetch all highlighted posts in getHighlights", async () => {
    const mockData: Post[] = [PostMock, PostMock];

    selectMock.mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await repository.getHighlights();

    expect(result).toEqual(mockData);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should throw an error when getHighlights fails", async () => {
    const mockError = { message: "Failed to fetch data" };
    selectMock.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(repository.getHighlights()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should fetch all main highlighted posts in getMainHighlights", async () => {
    const mockData: Post[] = [PostMock, PostMock];

    selectMock.mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await repository.getMainHighlights();

    expect(result).toEqual(mockData);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should throw an error when getMainHighlights fails", async () => {
    const mockError = { message: "Failed to fetch data" };
    selectMock.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(repository.getMainHighlights()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });
});
