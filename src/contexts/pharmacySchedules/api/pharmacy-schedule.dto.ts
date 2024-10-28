import { ApiProperty } from "@nestjs/swagger";

export class CreatePharmacyScheduleDto {
  @ApiProperty({
    description: "ID of the pharmacy",
    example: 1,
  })
  pharmacy_id!: number;

  @ApiProperty({
    description:
      "Start date and time of the schedule (selected via date picker)",
    example: "2024-10-24T16:00:00Z",
  })
  start_date!: Date;

  @ApiProperty({
    description: "End date and time of the schedule (selected via date picker)",
    example: "2024-10-24T18:00:00Z",
  })
  end_date!: Date;
}

export class UpdatePharmacyScheduleDto {
  @ApiProperty({
    description: "ID of the pharmacy",
    example: 1,
    required: false,
  })
  pharmacy_id?: number;

  @ApiProperty({
    description:
      "Start date and time of the schedule (selected via date picker)",
    example: "2024-10-24T16:00:00Z",
    required: false,
  })
  start_date?: Date;

  @ApiProperty({
    description: "End date and time of the schedule (selected via date picker)",
    example: "2024-10-24T18:00:00Z",
    required: false,
  })
  end_date?: Date;
}
