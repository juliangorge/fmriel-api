import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    description: "Title of the post",
    example: "Understanding TypeScript",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: "Section ID associated with the post",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  section_id!: number;

  @ApiProperty({
    description: "Subtitle of the post",
    example: "Advanced concepts explained simply",
    required: false,
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    description: "Summary of the post",
    example: "This post explains advanced TypeScript concepts.",
  })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiProperty({
    description: "Main body of the post",
    example: "TypeScript is a powerful tool for modern web development...",
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiProperty({
    description: "Tags associated with the post (comma-separated)",
    example: "typescript,web development,programming",
  })
  @IsString()
  @IsNotEmpty()
  tags!: string;

  @ApiProperty({
    description: "Image URL for the post",
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: "Epigraph for the post",
    example: "Learn TypeScript step by step.",
    required: false,
  })
  @IsOptional()
  @IsString()
  epigraph?: string;

  @ApiProperty({
    description: "User ID of the post creator",
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id!: number;
}

export class UpdatePostDto {
  @ApiProperty({
    description: "Title of the post",
    example: "Understanding TypeScript",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Section ID associated with the post",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  section_id?: number;

  @ApiProperty({
    description: "Subtitle of the post",
    example: "Advanced concepts explained simply",
    required: false,
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    description: "Summary of the post",
    example: "This post explains advanced TypeScript concepts.",
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: "Main body of the post",
    example: "TypeScript is a powerful tool for modern web development...",
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: "Tags associated with the post (comma-separated)",
    example: "typescript,web development,programming",
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({
    description: "Image URL for the post",
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: "Epigraph for the post",
    example: "Learn TypeScript step by step.",
    required: false,
  })
  @IsOptional()
  @IsString()
  epigraph?: string;

  @ApiProperty({
    description: "User ID of the post creator",
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
