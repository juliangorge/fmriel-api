import { ApiProperty } from "@nestjs/swagger";

export class CreateDeathReportDto {
  @ApiProperty({
    description: "The name of the deceased",
  })
  name!: string;

  @ApiProperty({
    description: "The surname of the deceased",
  })
  surname!: string;

  @ApiProperty({
    description: "The age of the deceased",
  })
  age!: number;

  @ApiProperty({
    description: "The date of death",
  })
  date_of_death!: Date;

  @ApiProperty({
    description: "The place of death (optional)",
    required: false,
  })
  place_of_death?: string;

  @ApiProperty({
    description: "The funeral location (optional)",
    required: false,
  })
  funeral_location?: string;

  @ApiProperty({
    description: "The funeral date and time (optional)",
    required: false,
  })
  funeral_date?: Date;

  @ApiProperty({
    description: "The URL to the deceased's photo (optional)",
    required: false,
  })
  photo_url?: string;
}

export class UpdateDeathReportDto {
  @ApiProperty({
    description: "The name of the deceased",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "The surname of the deceased",
    required: false,
  })
  surname?: string;

  @ApiProperty({
    description: "The age of the deceased",
    required: false,
  })
  age?: number;

  @ApiProperty({
    description: "The date of death",
    required: false,
  })
  date_of_death?: Date;

  @ApiProperty({
    description: "The place of death (optional)",
    required: false,
  })
  place_of_death?: string;

  @ApiProperty({
    description: "The funeral location (optional)",
    required: false,
  })
  funeral_location?: string;

  @ApiProperty({
    description: "The funeral date and time (optional)",
    required: false,
  })
  funeral_date?: Date;

  @ApiProperty({
    description: "The URL to the deceased's photo (optional)",
    required: false,
  })
  photo_url?: string;
}
