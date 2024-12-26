/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PharmacyMock } from "@/tests/utils/mocks/pharmacy";

import { Pharmacy } from "@/src/contexts/pharmacies/api/pharmacy.model";
import { PharmacyRepository } from "@/src/contexts/pharmacies/api/pharmacy.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("PharmacyRepository", () => {
  let repository: PharmacyRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "pharmacies";

  beforeEach(() => {
    // Create a base mock for Supabase, where only 'from' is defined.
    supabaseMock = {
      from: vi.fn(), // We'll chain off this in each test
    } as unknown as SupabaseClient;

    // Mock SupabaseProvider to return the supabaseMock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Initialize the repository with the mock provider
    repository = new PharmacyRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    const mockData = [PharmacyMock] as Pharmacy[];

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
   * getById (SUCCESS)
   * from(tableName)
   *   .select(...)
   *   .eq("id", someId)
   *   .maybeSingle()
   */
  it("should fetch a pharmacy by ID in getById", async () => {
    const mockPharmacy = PharmacyMock as Pharmacy;

    // Final step in the chain: .maybeSingle() => resolves { data, error }
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: mockPharmacy, error: null });
    // Middle step: .eq() => returns object with maybeSingle
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    // First step: .select() => returns object with eq
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getById(mockPharmacy.id);

    expect(result).toEqual(mockPharmacy);

    // Ensure the chain was called with correct args
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockPharmacy.id);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * getById (ERROR)
   */
  it("should throw an error when getById fails", async () => {
    const mockId = 1;
    const mockError = { message: "Failed to fetch data" };

    // Chain returns an error at maybeSingle()
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
});
