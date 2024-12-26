/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PostSection } from "@/src/contexts/postSections/api/post-section.model";
import { PostSectionRepository } from "@/src/contexts/postSections/api/post-section.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("PostSectionRepository", () => {
  let repository: PostSectionRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "post_sections";

  beforeEach(() => {
    // Base supabase mock
    supabaseMock = {
      from: vi.fn(), // We'll chain off this in each test
    } as unknown as SupabaseClient;

    // Mock provider to return the supabaseMock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Instantiate repository
    repository = new PostSectionRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all records in getAll (SUCCESS)", async () => {
    const mockData: PostSection[] = [
      { id: 1, name: "Culture" },
      { id: 2, name: "Sports" },
    ];

    // 1. Final link in chain: range(...) -> returns a Promise
    const rangeMock = vi.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    // 2. Next link: order(...) returns an object with range
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    // 3. Next link: select(...) returns an object with order
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    // 4. .from(tableName) returns an object with select
    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getAll();
    // If your getAll calls .order(...).range(...), this chain will be used

    expect(result).toEqual(mockData);

    // Check the chain
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    // default sort? depends on your repository
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    // default offset=0, limit=10 => range(0, 9)
  });

  /*
   * getAll (ERROR)
   */
  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    // Build the chain but return an error at the final step
    const rangeMock = vi.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getAll()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
  });

  // ... other tests (getById, etc.) follow the same pattern
});
