/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacySchedule } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.model";
import { PharmacyScheduleRepository } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("PharmacyScheduleRepository", () => {
  let repository: PharmacyScheduleRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "pharmacy_schedules";

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
    repository = new PharmacyScheduleRepository(supabaseProviderMock);

    // Clear calls so each test starts fresh
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all records (success)", async () => {
      const mockData: PharmacySchedule[] = [
        PharmacyScheduleMock,
        PharmacyScheduleMock,
      ];

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
      const mockPharmacySchedule: PharmacySchedule = PharmacyScheduleMock;

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockPharmacySchedule, error: null });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getById(1);

      // Assert
      expect(result).toEqual(mockPharmacySchedule);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
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
      expect(selectMock).toHaveBeenCalled();
    });
  });

  describe("getByDate", () => {
    it("should fetch a pharmacy schedule by date (success)", async () => {
      const mockPharmacySchedule: PharmacySchedule = PharmacyScheduleMock;
      const formattedDate = new Date();

      const lteMock = vi
        .fn()
        .mockReturnValue({ data: [mockPharmacySchedule], error: null });
      const gteMock = vi.fn().mockReturnValue({
        lte: lteMock,
      });
      const selectMock = vi.fn().mockReturnValue({ gte: gteMock });

      // Mock de la función from de supabase
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getByDate(formattedDate);

      // Assert
      expect(result).toEqual([mockPharmacySchedule]); // Asegúrate de que es un array
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
      expect(gteMock).toHaveBeenCalledWith(
        "start_date",
        formattedDate.toISOString(),
      );
      expect(lteMock).toHaveBeenCalledWith(
        "end_date",
        formattedDate.toISOString(),
      );
    });

    it("should throw an error when getByDate fails", async () => {
      const mockError = { message: "Failed to fetch data" };
      const formattedDate = "2022-01-01";

      // Simulando un error en la respuesta
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError }); // No hay datos, pero hay un error

      // Mocking los métodos gte, lte y select
      const lteMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const gteMock = vi.fn().mockReturnValue({ lte: lteMock });
      const selectMock = vi.fn().mockReturnValue({ gte: gteMock });

      // Mock de la función from de supabase
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act & Assert
      await expect(
        repository.getByDate(new Date(formattedDate)),
      ).rejects.toThrow("Error fetching data: Failed to fetch data"); // Esperamos que se lance el error
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
    });
  });
});
