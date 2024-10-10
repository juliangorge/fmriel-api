/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { BaseRepository } from "@/contexts/base/api/base.repository";

interface TestEntity {
  id: number;
  name: string;
}

describe("BaseRepository", () => {
  let repository: BaseRepository<TestEntity>;
  let supabaseMock: SupabaseClient;
  const tableName = "test_table"; // Table name constant

  let selectMock: Mock;

  beforeEach(() => {
    selectMock = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    supabaseMock = {
      from: vi.fn(() => ({
        select: selectMock,
      })),
    } as unknown as SupabaseClient;

    // Mock createClient to return the Supabase mock
    vi.spyOn(require("@supabase/supabase-js"), "createClient").mockReturnValue(
      supabaseMock,
    );

    // Initialize the repository
    repository = new BaseRepository<TestEntity>(tableName);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all records in findAll", async () => {
    selectMock.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Entity 1" },
        { id: 2, name: "Entity 2" },
      ],
      error: null,
    });

    const result = await repository.findAll();

    expect(result).toEqual([
      { id: 1, name: "Entity 1" },
      { id: 2, name: "Entity 2" },
    ]);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should throw an error when findAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };
    selectMock.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    (supabaseMock.from(tableName).select as Mock).mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    try {
      await repository.findAll();
    } catch (error) {
      expect(error).toEqual(
        new Error("Error fetching data: Failed to fetch data"),
      );
    }
  });

  it("should fetch a record by ID in findById", async () => {
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

    const result = await repository.findById(1);

    expect(result).toEqual(mockRecord);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalledWith();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      1,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", 1).maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should throw an error when findById fails", async () => {
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

    await expect(repository.findById(1)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalledWith();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      1,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", 1).maybeSingle,
    ).toHaveBeenCalled();
  });
});
