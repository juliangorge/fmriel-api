import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRainCityDto {
  @ApiProperty({
    description: "Name of the rain city",
    example: "San Francisco",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Whether the city is active",
    example: true,
  })
  @IsBoolean()
  is_active!: boolean;
}

export class UpdateRainCityDto {
  @ApiProperty({
    description: "Name of the rain city",
    example: "San Francisco",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Whether the city is active",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
