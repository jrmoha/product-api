import { plainToInstance } from 'class-transformer';
import { Min, IsString, Max, validateSync, IsInt } from 'class-validator';

class EnvironmentVariables {
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DATABASE_URI: string;

  @IsInt()
  @Min(0)
  @Max(10)
  SALT_ROUNDS: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;
}

export function validateEnvFile(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
