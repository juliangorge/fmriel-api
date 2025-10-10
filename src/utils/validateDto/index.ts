import { BadRequestException } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

/**
 * Validates a DTO object and throws a BadRequestException if validation fails.
 * @param dtoClass The DTO class constructor
 * @param dto The DTO object to validate (can be a plain object or class instance)
 */
export async function validateDto<T extends object>(
  dtoClass: ClassConstructor<T>,
  dto: T | object,
): Promise<void> {
  // Transform plain object to class instance
  const instance = plainToInstance(dtoClass, dto);

  const errors = await validate(instance);
  if (errors.length > 0) {
    const messages = errors
      .flatMap(err => (err.constraints ? Object.values(err.constraints) : []))
      .join(", ");
    throw new BadRequestException(messages);
  }
}
