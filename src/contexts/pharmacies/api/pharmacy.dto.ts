import { ApiProperty } from "@nestjs/swagger";

export class CreatePharmacyDto {
  @ApiProperty({
    description: "Name of the pharmacy",
    example: "Farmacia A",
  })
  name!: string;

  @ApiProperty({
    description: "Address of the pharmacy",
    example: "Av. 25 de mayo 1234, Entre Rios",
  })
  address!: string;

  @ApiProperty({
    description: "Phone number of the pharmacy",
    example: "+543445123456",
  })
  phone_number!: string;
}

export class UpdatePharmacyDto {
  @ApiProperty({
    description: "Name of the pharmacy",
    example: "Farmacia A",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Address of the pharmacy",
    example: "Av. 25 de mayo 1234, Entre Rios",
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: "Phone number of the pharmacy",
    example: "+543445123456",
    required: false,
  })
  phone_number?: string;
}
