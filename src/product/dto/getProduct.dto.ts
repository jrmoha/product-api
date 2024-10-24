import { IsMongoId, IsString } from 'class-validator';

export class GetProductDto {
  @IsString()
  @IsMongoId()
  id: string;
}
