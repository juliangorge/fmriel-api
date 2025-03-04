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

  beforeEach(() => {
    // Mock supabase client
    supabaseMock = {
      from: vi.fn(), // We'll chain .select(), .eq(), .maybeSingle(), etc. on this
    } as unknown as SupabaseClient;

    // Mock provider to return our mocked supabase client
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Instantiate the actual repository with the mocked provider
    repository = new PostRepository(supabaseProviderMock);

    // Clear calls so each test starts fresh
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all records (success)", async () => {
      const mockData: Post[] = [PostMock, PostMock];

      // If you do ordering/pagination, you'll have something like:
      // .select() -> .order() -> .range().
      // Here’s the full chain if you rely on the BaseRepository’s logic:

      const rangeMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getAll(); // Default limit=10, offset=0, etc.

      // Assert
      expect(result).toEqual(mockData);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled(); // or .toHaveBeenCalledWith() if you pass arguments
      expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
      expect(rangeMock).toHaveBeenCalledWith(0, 9); // offset=0, limit=10 => 0..9
    });

    it("should throw an error when getAll fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const rangeMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getAll()).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    });
  });

  describe("getById", () => {
    it("should fetch a record by ID (success)", async () => {
      const mockPost: Post = PostMock;

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockPost, error: null });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getById(1);

      // Assert
      expect(result).toEqual(mockPost);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalledWith("*, post_categories(name)");
      expect(eqMock).toHaveBeenCalledWith("id", 1);
      expect(maybeSingleMock).toHaveBeenCalled();
    });

    it("should throw an error when getById fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getById(1)).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalledWith("*, post_categories(name)");
    });
  });

  describe("getHighlights", () => {
    it("should fetch all highlighted records (success)", async () => {
      const mockData: Post[] = [PostMock, PostMock];

      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getHighlights();

      // Assert
      expect(result).toEqual(mockData);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalledWith("*, post_categories(name)");
    });

    it("should throw an error when getHighlights fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getHighlights()).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );

      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalledWith("*, post_categories(name)");
    });
  });

  describe("getMainHighlights", () => {
    it("should fetch main highlighted posts (success)", async () => {
      // highlight_posts table returns array of objects with { posts: Post }
      const mockData = [{ posts: PostMock }, { posts: PostMock }];

      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getMainHighlights();

      // .map(item => item.posts)
      const expected = mockData.map(item => item.posts);
      expect(result).toEqual(expected);

      expect(supabaseMock.from).toHaveBeenCalledWith("highlight_posts");
      expect(selectMock).toHaveBeenCalledWith(
        "posts(*, post_categories(name))",
      );
    });

    it("should throw an error when getMainHighlights fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getMainHighlights()).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );

      expect(supabaseMock.from).toHaveBeenCalledWith("highlight_posts");
      expect(selectMock).toHaveBeenCalledWith(
        "posts(*, post_categories(name))",
      );
    });
  });
});
