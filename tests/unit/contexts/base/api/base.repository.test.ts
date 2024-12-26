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

  const tableName = "test_table";

  beforeEach(() => {
    // Create a single Supabase mock where .from() is also mocked
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    // Mock the provider to return our supabaseMock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Instantiate the repository with the mock provider
    repository = new BaseRepository<TestEntity>(
      supabaseProviderMock,
      tableName,
    );
  });

  afterEach(() => {
    vi.clearAllMocks(); // Reset all mock calls between tests
  });

  /*
   * 1) getAll (SUCCESS)
   *    Mocks the chain: from(tableName) -> select() -> order() -> range() -> { data, error }
   */
  it("should fetch all records in getAll", async () => {
    const mockData = [
      { id: 1, name: "Entity 1" },
      { id: 2, name: "Entity 2" },
    ];

    // Mock the chain for getAll
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: mockData, error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    // supabaseMock.from() => { select: selectMock }
    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getAll();

    expect(result).toEqual(mockData);

    // Verify the chain of calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9); // offset=0, limit=10 => range(0, 9)
  });

  /*
   * 2) getAll (ERROR)
   *    If the final call in the chain returns { data: null, error: ... },
   *    we expect an exception.
   */
  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    // Mock the chain but return an error on the last step
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getAll()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    // Verify chain calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
  });

  /*
   * 3) getById (SUCCESS)
   *    Chain: from(tableName) -> select() -> eq("id", id) -> maybeSingle() -> { data, error }
   */
  it("should fetch a record by ID in getById", async () => {
    const mockRecord = { id: 1, name: "Entity 1" };

    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: mockRecord, error: null });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getById(1);

    expect(result).toEqual(mockRecord);

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * 4) getById (ERROR)
   */
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
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * 5) create (SUCCESS)
   *    Chain: from(tableName) -> insert(data) -> select() -> { data, error }
   */
  it("should create a new record in create", async () => {
    const newEntity = { name: "New Entity" };
    const mockCreatedData = { id: 1, name: "New Entity" };

    const selectInsertMock = vi
      .fn()
      .mockResolvedValue({ data: mockCreatedData, error: null });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    (supabaseMock.from as Mock).mockReturnValue({ insert: insertMock });

    const result = await repository.create(newEntity);

    expect(result).toEqual(mockCreatedData);

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(insertMock).toHaveBeenCalledWith(newEntity);
    expect(selectInsertMock).toHaveBeenCalled();
  });

  /*
   * 6) create (ERROR)
   */
  it("should throw an error when create fails", async () => {
    const newEntity = { name: "New Entity" };
    const mockError = { message: "Error creating data" };

    const selectInsertMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    (supabaseMock.from as Mock).mockReturnValue({ insert: insertMock });

    await expect(repository.create(newEntity)).rejects.toThrow(
      "Error creating data: Error creating data",
    );

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(insertMock).toHaveBeenCalledWith(newEntity);
    expect(selectInsertMock).toHaveBeenCalled();
  });

  /*
   * 7) update (SUCCESS)
   *    Chain: from(tableName) -> update(data) -> eq("id", id) -> select() -> { data, error }
   */
  it("should update a record", async () => {
    const mockUpdatedData = { id: 1, name: "Updated Entity" };

    const selectUpdateMock = vi
      .fn()
      .mockResolvedValue({ data: mockUpdatedData, error: null });
    const eqMock = vi.fn().mockReturnValue({ select: selectUpdateMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ update: updateMock });

    const result = await repository.update(mockUpdatedData.id, {
      name: "Updated Entity",
    });

    expect(result).toEqual(mockUpdatedData);

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(updateMock).toHaveBeenCalledWith({ name: "Updated Entity" });
    expect(eqMock).toHaveBeenCalledWith("id", mockUpdatedData.id);
    expect(selectUpdateMock).toHaveBeenCalled();
  });

  /*
   * 8) update (ERROR)
   */
  it("should throw an error when update fails", async () => {
    const mockError = { message: "Error updating data" };
    const mockUpdatedData = { name: "Updated Entity" };

    const selectUpdateMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ select: selectUpdateMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ update: updateMock });

    await expect(repository.update(1, mockUpdatedData)).rejects.toThrow(
      "Error updating data: Error updating data",
    );

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(updateMock).toHaveBeenCalledWith({ name: "Updated Entity" });
    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(selectUpdateMock).toHaveBeenCalled();
  });

  /*
   * 9) delete (SUCCESS)
   *    Chain: from(tableName) -> delete() -> eq("id", id) -> select() -> { data, error }
   */
  it("should delete a record", async () => {
    const mockDeletedData = { id: 1, name: "Deleted Entity" };

    const selectDeleteMock = vi
      .fn()
      .mockResolvedValue({ data: mockDeletedData, error: null });
    const eqMock = vi.fn().mockReturnValue({ select: selectDeleteMock });
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ delete: deleteMock });

    const result = await repository.delete(mockDeletedData.id);

    expect(result).toEqual(mockDeletedData);

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockDeletedData.id);
    expect(selectDeleteMock).toHaveBeenCalled();
  });

  /*
   * 10) delete (ERROR)
   */
  it("should throw an error when delete fails", async () => {
    const mockError = { message: "Error deleting data" };
    const mockDeletedData = { id: 1 };

    const selectDeleteMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ select: selectDeleteMock });
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ delete: deleteMock });

    await expect(repository.delete(mockDeletedData.id)).rejects.toThrow(
      "Error deleting data: Error deleting data",
    );

    // Verify calls
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockDeletedData.id);
    expect(selectDeleteMock).toHaveBeenCalled();
  });
});
