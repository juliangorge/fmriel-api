/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReport } from "@/src/contexts/deathReports/api/death-report.model";
import { DeathReportRepository } from "@/src/contexts/deathReports/api/death-report.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("DeathReportRepository", () => {
  let repository: DeathReportRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "death_reports";

  beforeEach(() => {
    // 1. Create a basic mock for supabase, only `from()` is mocked here.
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    // 2. Have the provider return this mock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // 3. Instantiate the repository with the mock provider
    repository = new DeathReportRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /*
   * 1) getAll (SUCCESS)
   *    BaseRepository’s getAll() calls:
   *      from(tableName).select().order(sortBy, { ascending }).range(offset, offset+limit-1)
   *
   *    If you *don't* actually use .order()/.range() in DeathReportRepository's getAll,
   *    you can keep it simple as from(tableName).select() -> { data, error }.
   *    Adjust these mocks to match exactly what your BaseRepository does.
   */
  it("should fetch all records in getAll", async () => {
    const mockData: DeathReport[] = [DeathReportMock, DeathReportMock];

    // If DeathReportRepository relies on the *parent’s* getAll (which includes .order and .range),
    // you need the chain: select -> order -> range -> resolves { data, error }.
    // Otherwise, if it’s just .select() in your code, you can keep it simpler.

    // Example of the *full* chain (if you do ordering/pagination):
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: mockData, error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    // If your code only does `select()` without `.order` or `.range`, you can do:
    // const selectMock = vi.fn().mockResolvedValue({ data: mockData, error: null });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getAll();

    expect(result).toEqual(mockData);
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled(); // or toHaveBeenCalledWith() if you pass arguments to select
    // If you have the order/range chain:
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
  });

  /*
   * 2) getAll (ERROR)
   */
  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    // Full chain if using .order -> .range
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
    expect(selectMock).toHaveBeenCalled();
    // If using ordering/pagination:
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
  });

  /*
   * 3) getById (SUCCESS)
   *    from(tableName)
   *      .select()
   *      .eq("id", id)
   *      .maybeSingle()
   */
  it("should fetch a post by ID in getById", async () => {
    const mockDeathReport: DeathReport = DeathReportMock;

    // Build the chain:
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: mockDeathReport, error: null });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    // The .select() might accept a string argument, e.g. select()
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getById(1);

    expect(result).toEqual(mockDeathReport);

    // Validate chain
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
   * 5) findByQuery (SUCCESS)
   *    from(tableName)
   *      .select()
   *      .textSearch("column", query)
   */
  describe("findByQuery", () => {
    it("should fetch records by query (SUCCESS)", async () => {
      const mockData: DeathReport[] = [DeathReportMock, DeathReportMock];
      const query = "TestName";

      // Final method: or(...) => returns a promise
      const orMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
      // select() => { or: orMock }
      const selectMock = vi.fn().mockReturnValue({ or: orMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      const result = await repository.findByQuery(query);
      expect(result).toEqual(mockData);

      // Verify chain
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled(); // or .toHaveBeenCalledWith() if you pass fields to select
      expect(orMock).toHaveBeenCalledWith(
        `name.ilike.%${query}%,surname.ilike.%${query}%`,
      );
    });

    it("should throw an error when findByQuery fails", async () => {
      const query = "TestName";
      const mockError = { message: "Failed to fetch data" };

      const orMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      const selectMock = vi.fn().mockReturnValue({ or: orMock });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.findByQuery(query)).rejects.toThrow(
        "Error fetching death records by query in name or surname: Failed to fetch data",
      );

      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
      expect(orMock).toHaveBeenCalledWith(
        `name.ilike.%${query}%,surname.ilike.%${query}%`,
      );
    });
  });
});
