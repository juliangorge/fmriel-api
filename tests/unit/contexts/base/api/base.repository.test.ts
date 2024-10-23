/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

interface TestEntity {
  id: number;
  name: string;
}

describe("BaseRepository", () => {
  let repository: BaseRepository<TestEntity>;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "test_table"; // Table name constant

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
    repository = new BaseRepository<TestEntity>(
      supabaseProviderMock,
      tableName,
    );
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all records in getAll", async () => {
    const mockData = [
      { id: 1, name: "Entity 1" },
      { id: 2, name: "Entity 2" },
    ];

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

  it("should fetch a record by ID in getById", async () => {
    const mockRecord = { id: 1, name: "Entity 1" };

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: mockRecord,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.getById(1);

    expect(result).toEqual(mockRecord);

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
});
