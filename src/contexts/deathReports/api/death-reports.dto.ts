import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateDeathReportDto {
  @ApiProperty({
    description: "The name of the deceased",
    example: "Maria",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "The surname of the deceased",
    example: "Perez",
  })
  @IsString()
  @IsNotEmpty()
  surname!: string;

  @ApiProperty({
    description: "The age of the deceased",
    example: 75,
  })
  @IsInt()
  age!: number;

  @ApiProperty({
    description: "The date of death",
    example: "2024-12-01",
  })
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => (value ? new Date(value) : value))
  date_of_death!: Date;

  @ApiProperty({
    description: "The place of death (optional)",
    required: false,
    example: "Concepcion del Uruguay",
  })
  @IsString()
  @IsOptional()
  place_of_death?: string;

  @ApiProperty({
    description: "The funeral location (optional)",
    required: false,
    example: "Estrada 123",
  })
  @IsString()
  @IsOptional()
  funeral_location?: string;

  @ApiProperty({
    description: "The funeral date (optional)",
    required: false,
    example: "2024-12-03",
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => (value ? new Date(value) : value))
  funeral_date?: Date;

  @ApiProperty({
    description: "The URL to the deceased's photo (optional)",
    required: false,
    example: "https://example.com/photo.jpg",
  })
  @IsUrl()
  @IsOptional()
  photo_url?: string;
}

export class UpdateDeathReportDto {
  @ApiProperty({
    description: "The name of the deceased",
    required: false,
    example: "Maria",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "The surname of the deceased",
    required: false,
    example: "Perez",
  })
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({
    description: "The age of the deceased",
    required: false,
    example: 75,
  })
  @IsInt()
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: "The date of death",
    required: false,
    example: "2024-12-01",
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => (value ? new Date(value) : value))
  date_of_death?: Date;

  @ApiProperty({
    description: "The place of death (optional)",
    required: false,
    example: "Concepcion del Uruguay",
  })
  @IsString()
  @IsOptional()
  place_of_death?: string;

  @ApiProperty({
    description: "The funeral location (optional)",
    required: false,
    example: "Estrada 123",
  })
  @IsString()
  @IsOptional()
  funeral_location?: string;

  @ApiProperty({
    description: "The funeral date (optional)",
    required: false,
    example: "2024-12-03", // Fecha sin hora, ajustada al formato que necesitas
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => (value ? new Date(value) : value)) // Convierte el string en un objeto Date
  funeral_date?: Date;

  @ApiProperty({
    description: "The URL to the deceased's photo (optional)",
    required: false,
    example: "https://example.com/photo.jpg",
  })
  @IsUrl()
  @IsOptional()
  photo_url?: string;
}
