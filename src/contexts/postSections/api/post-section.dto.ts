import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostSectionDto {
  @ApiProperty({
    description: "Name of post section",
    example: "Sports & Health",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdatePostSectionDto {
  @ApiProperty({
    description: "Name of post section",
    example: "Business",
  })
  @IsString()
  name!: string;
}
