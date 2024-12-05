import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePharmacyScheduleDto {
  @ApiProperty({
    description: "ID of the pharmacy",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  pharmacy_id!: number;

  @ApiProperty({
    description:
      "Start date and time of the schedule (selected via date picker)",
    example: "2024-10-24T16:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  start_date!: Date;

  @ApiProperty({
    description: "End date and time of the schedule (selected via date picker)",
    example: "2024-10-24T18:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  end_date!: Date;
}

export class UpdatePharmacyScheduleDto {
  @ApiProperty({
    description: "ID of the pharmacy",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  pharmacy_id?: number;

  @ApiProperty({
    description:
      "Start date and time of the schedule (selected via date picker)",
    example: "2024-10-24T16:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @ApiProperty({
    description: "End date and time of the schedule (selected via date picker)",
    example: "2024-10-24T18:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: Date;
}
