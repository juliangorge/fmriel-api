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

  beforeEach(() => {
    // 1. Create a base mock for the Supabase client.
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    // 2. Mock the provider to return our supabaseMock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // 3. Instantiate the repository with the mock provider
    repository = new RainCityRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Reset mocks between each test
  });

  /*
   * getAll (SUCCESS)
   * If your repository calls:
   *    .from(tableName)
   *      .select()
   *      .order(...)
   *      .range(...)
   * you need to mock the chain.
   * Otherwise, if it's just .select(), keep it simple.
   */
  it("should fetch all records in getAll", async () => {
    const mockData = [RainCityMock] as RainCity[];

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

  /*
   * 3) getById (SUCCESS)
   * from(tableName).select(...).eq("id", id).maybeSingle()
   */
  it("should fetch a record by ID in getById", async () => {
    const mockRainCity = RainCityMock as RainCity;

    // Final step: maybeSingle returns { data, error }
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: mockRainCity, error: null });
    // eq returns an object containing { maybeSingle: ... }
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    // select returns an object containing { eq: ... }
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getById(mockRainCity.id);

    expect(result).toEqual(mockRainCity);
    // Verify chain calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockRainCity.id);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * 4) getById (ERROR)
   */
  it("should throw an error when getById fails", async () => {
    const mockId = 1;
    const mockError = { message: "Failed to fetch data" };

    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getById(mockId)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockId);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * 5) create (SUCCESS)
   * from(tableName).insert(data).select() => { data, error }
   */
  it("should create a record in create", async () => {
    const mockRainCity = RainCityMock as RainCity;

    // Final step: select() => { data, error }
    const selectInsertMock = vi
      .fn()
      .mockResolvedValue({ data: mockRainCity, error: null });
    // insert() => { select: selectInsertMock }
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    (supabaseMock.from as Mock).mockReturnValue({ insert: insertMock });

    const result = await repository.create(mockRainCity);

    expect(result).toEqual(mockRainCity);
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(insertMock).toHaveBeenCalledWith(mockRainCity);
    expect(selectInsertMock).toHaveBeenCalled();
  });

  /*
   * 6) create (ERROR)
   */
  it("should throw an error when create fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to create data" };

    const selectInsertMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    (supabaseMock.from as Mock).mockReturnValue({ insert: insertMock });

    await expect(repository.create(mockRainCity)).rejects.toThrow(
      "Error creating data: Failed to create data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(insertMock).toHaveBeenCalledWith(mockRainCity);
    expect(selectInsertMock).toHaveBeenCalled();
  });

  /*
   * 7) update (SUCCESS)
   * from(tableName).update(data).eq("id", id).select() => { data, error }
   */
  it("should update a record in update", async () => {
    const mockRainCity = RainCityMock as RainCity;

    // Final step: select() => { data, error }
    const selectUpdateMock = vi
      .fn()
      .mockResolvedValue({ data: mockRainCity, error: null });
    // eq() => { select: selectUpdateMock }
    const eqMock = vi.fn().mockReturnValue({ select: selectUpdateMock });
    // update() => { eq: eqMock }
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ update: updateMock });

    const result = await repository.update(mockRainCity.id, mockRainCity);

    expect(result).toEqual(mockRainCity);
    // Verify chain calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(updateMock).toHaveBeenCalledWith(mockRainCity);
    expect(eqMock).toHaveBeenCalledWith("id", mockRainCity.id);
    expect(selectUpdateMock).toHaveBeenCalled();
  });

  /*
   * 8) update (ERROR)
   */
  it("should throw an error when update fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to update data" };

    const selectUpdateMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ select: selectUpdateMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ update: updateMock });

    await expect(
      repository.update(mockRainCity.id, mockRainCity),
    ).rejects.toThrow("Error updating data: Failed to update data");

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(updateMock).toHaveBeenCalledWith(mockRainCity);
    expect(eqMock).toHaveBeenCalledWith("id", mockRainCity.id);
    expect(selectUpdateMock).toHaveBeenCalled();
  });

  /*
   * 9) delete (SUCCESS)
   * from(tableName).delete().eq("id", id).select() => { data, error }
   */
  it("should delete a record in delete", async () => {
    const mockRainCity = RainCityMock as RainCity;

    // Final step: select() => { data, error }
    const selectDeleteMock = vi
      .fn()
      .mockResolvedValue({ data: mockRainCity, error: null });
    // eq() => { select: selectDeleteMock }
    const eqMock = vi.fn().mockReturnValue({ select: selectDeleteMock });
    // delete() => { eq: eqMock }
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ delete: deleteMock });

    const result = await repository.delete(mockRainCity.id);

    expect(result).toEqual(mockRainCity);
    // Verify chain
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockRainCity.id);
    expect(selectDeleteMock).toHaveBeenCalled();
  });

  /*
   * 10) delete (ERROR)
   */
  it("should throw an error when delete fails", async () => {
    const mockRainCity = RainCityMock as RainCity;
    const mockError = { message: "Failed to delete data" };

    const selectDeleteMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ select: selectDeleteMock });
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ delete: deleteMock });

    await expect(repository.delete(mockRainCity.id)).rejects.toThrow(
      "Error deleting data: Failed to delete data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockRainCity.id);
    expect(selectDeleteMock).toHaveBeenCalled();
  });
});
