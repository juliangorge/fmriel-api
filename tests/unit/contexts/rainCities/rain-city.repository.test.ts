/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { RainCityMock } from "@/tests/utils/mocks/rain-city";

import { RainCity } from "@/src/contexts/rainCities/api/rain-city.model";
import { RainCityRepository } from "@/src/contexts/rainCities/api/rain-city.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("RainCityRepository", () => {
  let repository: RainCityRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "rain_cities";

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
    repository = new RainCityRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all records in getAll", async () => {
    const mockData = [RainCityMock] as RainCity[];

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
    const mockRainCity = RainCityMock as RainCity;

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: mockRainCity,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.getById(mockRainCity.id);

    expect(result).toEqual(mockRainCity);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      mockRainCity.id,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", mockRainCity.id)
        .maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should throw an error when getById fails", async () => {
    const mockId = 1;
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

    await expect(repository.getById(mockId)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      mockId,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", mockId).maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should create a record in create", async () => {
    const mockRainCity = RainCityMock as RainCity;

    (supabaseMock.from as Mock).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: mockRainCity,
          error: null,
        }),
      }),
    });

    const result = await repository.create(mockRainCity);

    expect(result).toEqual(mockRainCity);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).insert).toHaveBeenCalledWith(
      mockRainCity,
    );
    expect(
      supabaseMock.from(tableName).insert(mockRainCity).select,
    ).toHaveBeenCalled();
  });

  it("should throw an error when create fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to create data" };

    (supabaseMock.from as Mock).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      }),
    });

    await expect(repository.create(mockRainCity)).rejects.toThrow(
      "Error creating data: Failed to create data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).insert).toHaveBeenCalledWith(
      mockRainCity,
    );
    expect(
      supabaseMock.from(tableName).insert(mockRainCity).select,
    ).toHaveBeenCalled();
  });

  it("should update a record in update", async () => {
    const mockRainCity = RainCityMock as RainCity;

    (supabaseMock.from as Mock).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: mockRainCity,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.update(mockRainCity.id, mockRainCity);

    expect(result).toEqual(mockRainCity);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).update).toHaveBeenCalledWith(
      mockRainCity,
    );
    expect(
      supabaseMock.from(tableName).update(mockRainCity).eq,
    ).toHaveBeenCalledWith("id", mockRainCity.id);

    expect(
      supabaseMock
        .from(tableName)
        .update(mockRainCity)
        .eq("id", mockRainCity.id).select,
    ).toHaveBeenCalled();
  });

  it("should throw an error when update fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to update data" };

    (supabaseMock.from as Mock).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      }),
    });

    await expect(
      repository.update(mockRainCity.id, mockRainCity),
    ).rejects.toThrow("Error updating data: Failed to update data");

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).update).toHaveBeenCalledWith(
      mockRainCity,
    );
  });

  it("should delete a record in delete", async () => {
    const mockRainCity = RainCityMock as RainCity;

    (supabaseMock.from as Mock).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: mockRainCity,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.delete(mockRainCity.id);

    expect(result).toEqual(mockRainCity);

    expect(supabaseMock.from(tableName).delete).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).delete().eq).toHaveBeenCalledWith(
      "id",
      mockRainCity.id,
    );
  });

  it("should throw an error when delete fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to delete data" };

    (supabaseMock.from as Mock).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      }),
    });

    await expect(repository.delete(mockRainCity.id)).rejects.toThrow(
      "Error deleting data: Failed to delete data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).delete).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).delete().eq).toHaveBeenCalledWith(
      "id",
      mockRainCity.id,
    );
  });
});
