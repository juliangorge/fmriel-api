import { beforeEach, describe, expect, it, vi } from "vitest";

import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

import { BaseController } from "@/contexts/base/api/base.controller";
import {
  BaseRepository,
  Identifiable,
} from "@/contexts/base/api/base.repository";
import { BaseService } from "@/contexts/base/api/base.service";

//
// 1. Create a mock entity and mock service
//
interface MockEntity extends Identifiable {
  id: number;
  title: string;
}

class MockService extends BaseService<MockEntity> {
  constructor() {
    super(
      {} as SupabaseProvider, // cast an empty object
      {} as BaseRepository<MockEntity>, // cast an empty object
    );
  }
  // We can mock out or stub the methods we need
  override getAll = vi.fn();
  override getById = vi.fn();
  override create = vi.fn();
  override update = vi.fn();
  override delete = vi.fn();
}

//
// 2. Create a concrete (non-abstract) controller extending the abstract BaseController
//
class MockController extends BaseController<MockEntity> {
  constructor(mockService: BaseService<MockEntity>) {
    super(mockService);
  }
}

describe("BaseController", () => {
  let controller: MockController;
  let mockService: MockService;

  //
  // 3. Instantiate our mock service and controller before each test
  //
  beforeEach(() => {
    mockService = new MockService(); // passing `null` just to fulfill constructor
    controller = new MockController(mockService);
  });

  //
  // 4. Test `getAll` method
  //
  it("should call baseService.getAll with correct parameters", async () => {
    // Arrange
    const page = 2;
    const limit = 5;
    const sortBy = "title";
    const desc = true; // which means descending = true => ascending = false

    // Act
    await controller.getAll(page, limit, sortBy, desc);

    // Assert
    expect(mockService.getAll).toHaveBeenCalledOnce();
    // The offset should be (page - 1) * limit = (2 - 1) * 5 = 5
    expect(mockService.getAll).toHaveBeenCalledWith(
      limit,
      5, // offset
      sortBy,
      false, // ascending = !desc
    );
  });

  it("should use default query params if none are provided", async () => {
    // Arrange
    // (No arguments provided, so we rely on defaults.)

    // Act
    await controller.getAll();
    // Alternatively, await controller.getAll(undefined, undefined, undefined, undefined);

    // Assert
    expect(mockService.getAll).toHaveBeenCalledOnce();
    // By default:
    //   page = 1 => offset = 0
    //   limit = 10
    //   sortBy = "id"
    //   desc = false => ascending = true
    expect(mockService.getAll).toHaveBeenCalledWith(
      10, // default limit
      0, // (page - 1) * limit = (1 - 1) * 10 = 0
      "id",
      true, // ascending = !desc = !false = true
    );
  });

  //
  // 5. Test `getById` method
  //
  it("should call baseService.getById and return the entity", async () => {
    // Arrange
    const mockEntity: MockEntity = { id: 1, title: "Test title" };
    mockService.getById.mockResolvedValueOnce(mockEntity);

    // Act
    const result = await controller.getById(1);

    // Assert
    expect(mockService.getById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEntity);
  });

  it("should throw NotFoundException if entity not found", async () => {
    // Arrange
    // eslint-disable-next-line unicorn/no-null
    mockService.getById.mockResolvedValueOnce(null);

    // Act + Assert
    await expect(() => controller.getById(999)).rejects.toThrow(
      "Resource with ID 999 not found",
    );
  });

  //
  // 6. Test `create` method
  //
  it("should call baseService.create with the data provided", async () => {
    // Arrange
    const dto = { title: "New Title" };
    const expectedEntity: MockEntity = { id: 2, title: "New Title" };
    mockService.create.mockResolvedValueOnce(expectedEntity);

    // Act
    const result = await controller.create(dto);

    // Assert
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedEntity);
  });

  //
  // 7. Test `update` method
  //
  it("should call baseService.update with correct parameters", async () => {
    // Arrange
    const updateDto = { title: "Updated Title" };
    const updatedEntity: MockEntity = { id: 1, title: "Updated Title" };
    mockService.update.mockResolvedValueOnce(updatedEntity);

    // Act
    const result = await controller.update(1, updateDto);

    // Assert
    expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toEqual(updatedEntity);
  });

  //
  // 8. Test `delete` method
  //
  it("should call baseService.delete and return deleted entity", async () => {
    // Arrange
    const mockEntity: MockEntity = { id: 1, title: "Deleted Title" };
    mockService.delete.mockResolvedValueOnce(mockEntity);

    // Act
    const result = await controller.delete(1);

    // Assert
    expect(mockService.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEntity);
  });
});
