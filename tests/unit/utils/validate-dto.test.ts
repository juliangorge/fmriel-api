import { BadRequestException } from "@nestjs/common";
import { Type } from "class-transformer";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { describe, expect, it } from "vitest";

import { validateDto } from "@/src/utils/validateDto";

/* ----------------------------------
 * 1) Basic DTOs to test validation
 * --------------------------------- */
class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}

/* ----------------------------------
 * 2) Nested DTO scenario
 * --------------------------------- */
class AddressDto {
  @IsNotEmpty()
  street!: string;
}

class UserWithAddressDto {
  @IsNotEmpty()
  name!: string;

  // This tells class-validator to validate the 'address' field as a nested object
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}

describe("validateDto utility (basic)", () => {
  it("should not throw if DTO is valid", async () => {
    const validDto = new CreateUserDto();
    validDto.name = "John Doe";
    validDto.email = "john@example.com";

    // `validateDto` should resolve without throwing any exception
    await expect(validateDto(validDto)).resolves.not.toThrow();
  });

  it("should throw BadRequestException if DTO validation fails", async () => {
    // Missing name, invalid email
    const invalidDto = new CreateUserDto();
    invalidDto.name = "";
    invalidDto.email = "not-an-email";

    // Expect the function to reject with BadRequestException
    await expect(validateDto(invalidDto)).rejects.toThrow(BadRequestException);
  });

  it("should combine multiple errors into one message (flatMap test)", async () => {
    // Missing name, invalid email => two errors
    const invalidDto = new CreateUserDto();
    invalidDto.name = "";
    invalidDto.email = "invalid";

    try {
      await validateDto(invalidDto);
      // If we reach here, then no error was thrown (unexpected)
      expect.fail("Expected validateDto to throw BadRequestException");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      if (error instanceof BadRequestException) {
        // We expect both errors in the message
        expect(error.message).toContain("should not be empty"); // from @IsNotEmpty
        expect(error.message).toContain("must be an email"); // from @IsEmail
      }
    }
  });
});

describe("validateDto utility (nested DTO for full .flatMap coverage)", () => {
  it("should handle nested validation errors (where the parent has no constraints)", async () => {
    const userWithNoAddress = new UserWithAddressDto();
    userWithNoAddress.name = "Alice";
    // userWithNoAddress.address = undefined; // property is missing

    await expect(validateDto(userWithNoAddress)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should fail when the child DTO (address) is missing required fields", async () => {
    // The parent's name is fine, but the child's street is empty
    const userWithEmptyStreet = new UserWithAddressDto();
    userWithEmptyStreet.name = "Bob";
    userWithEmptyStreet.address = new AddressDto();
    userWithEmptyStreet.address.street = "";

    await expect(validateDto(userWithEmptyStreet)).rejects.toThrow(
      BadRequestException,
    );
  });
});
