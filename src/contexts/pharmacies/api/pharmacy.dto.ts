import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePharmacyDto {
  @ApiProperty({
    description: "Name of the pharmacy",
    example: "Farmacia A",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Address of the pharmacy",
    example: "Av. 25 de mayo 1234, Entre Rios",
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: "Phone number of the pharmacy",
    example: "+543445123456",
  })
  @IsString()
  @IsNotEmpty()
  phone_number!: string;
}

export class UpdatePharmacyDto {
  @ApiProperty({
    description: "Name of the pharmacy",
    example: "Farmacia A",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Address of the pharmacy",
    example: "Av. 25 de mayo 1234, Entre Rios",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: "Phone number of the pharmacy",
    example: "+543445123456",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
