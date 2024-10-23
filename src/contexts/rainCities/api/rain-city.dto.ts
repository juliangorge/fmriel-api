import { ApiProperty } from "@nestjs/swagger";

export class CreateRainCityDto {
  @ApiProperty({
    description: "Name of the rain city",
    example: "San Francisco",
  })
  name!: string;

  @ApiProperty({
    description: "Whether the city is active",
    example: true,
  })
  is_active: boolean = true;
}

export class UpdateRainCityDto {
  @ApiProperty({
    description: "Name of the rain city",
    example: "San Francisco",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Whether the city is active",
    example: true,
    required: false,
  })
  is_active?: boolean;
}
