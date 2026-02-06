import * as dotenv from "dotenv";
import * as path from "path";
import * as Joi from "joi";

class Config {
  private readonly envVars: any;

  constructor() {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });

    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid("production", "development", "test").required(),

      HOST: Joi.string().default("0.0.0.0"),
      PORT: Joi.number().default(5004),

      // MongoDB
      MONGODB_URI: Joi.string().required(),

      // JWT
      JWT_SECRET: Joi.string().required(),
      JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
      JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
      JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
      JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),

      // Base URL
      BASE_URL: Joi.string().required(),

      // REDIS
      REDIS_URL: Joi.string().optional(),

      // Cloudinary
      CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
      CLOUDINARY_API_KEY: Joi.string().optional(),
      CLOUDINARY_API_SECRET: Joi.string().optional(),

      // SMTP / Email
      SMTP_SERVICE: Joi.string().optional(),
      SMTP_USER: Joi.string().optional(),
      SMTP_PASS: Joi.string().optional(),


      // SSL (Optional)
      SSL_KEY_PATH: Joi.string().optional(),
      SSL_CERT_PATH: Joi.string().optional(),
    }).unknown(true);

    const { value, error } = envVarsSchema.validate(process.env, {
      abortEarly: false,
      errors: { label: "key" },
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    this.envVars = value;
  }

  get nodeEnv(): string {
    return this.envVars.NODE_ENV;
  }

  get server() {
    return {
      host: this.envVars.HOST,
      port: this.envVars.PORT,
      baseUrl: this.envVars.BASE_URL,
    };
  }

  get database() {
    return {
      mongodbURI: this.envVars.MONGODB_URI,
    };
  }

  get jwt() {
    return {
      secret: this.envVars.JWT_SECRET,
      accessExpirationMinutes: this.envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: this.envVars.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes:
        this.envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes:
        this.envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    };
  }

  get redis() {
    return {
      url: this.envVars.REDIS_URL
    };
  }

  get cloudinary() {
    return {
      cloudName: this.envVars.CLOUDINARY_CLOUD_NAME,
      apiKey: this.envVars.CLOUDINARY_API_KEY,
      apiSecret: this.envVars.CLOUDINARY_API_SECRET,
    };
  }

  get smtp() {
    return {
      service: this.envVars.SMTP_SERVICE,
      user: this.envVars.SMTP_USER,
      pass: this.envVars.SMTP_PASS,
    };
  }

  get mailgun() {
    return {
      apiKey: this.envVars.MAILGUN_API_KEY,
      domain: this.envVars.MAILGUN_DOMAIN,
      fromEmail: this.envVars.MAILGUN_FROM_EMAIL || `noreply@${this.envVars.MAILGUN_DOMAIN}`,
    };
  }

  get ssl() {
    return {
      keyPath: this.envVars.SSL_KEY_PATH,
      certPath: this.envVars.SSL_CERT_PATH,
    };
  }
}

export default new Config();
