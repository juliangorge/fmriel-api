import { BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";

/**
 * Validates a DTO object and throws a BadRequestException if validation fails.
 * @param dto The DTO object to validate
 */
export async function validateDto(dto: object): Promise<void> {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .flatMap(err => (err.constraints ? Object.values(err.constraints) : []))
      .join(", ");
    throw new BadRequestException(messages);
  }
}
