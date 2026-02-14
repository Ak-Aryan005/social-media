import { readFileSync } from "fs";
import { join } from "path";
import swaggerJsdoc from "swagger-jsdoc";

let swaggerSpec: any;

try {
  // Try to load YAML file using js-yaml
  // Install with: npm install js-yaml @types/js-yaml
  const yaml = require("js-yaml");
  const swaggerYamlPath = join(__dirname, "swagger.yml");
  const swaggerDocument = yaml.load(readFileSync(swaggerYamlPath, "utf8"));

  const swaggerOptions: swaggerJsdoc.Options = {
    definition: swaggerDocument,
    apis: [], // We're using YAML file, so no need for JSDoc comments
  };

  swaggerSpec = swaggerJsdoc(swaggerOptions);
} catch (error: any) {
  // Fallback: Use inline definition if YAML loading fails
  console.warn("Warning: Could not load swagger.yml. Using fallback definition.");
  console.warn("To use YAML file, install js-yaml: npm install js-yaml @types/js-yaml");
  
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "Instagram Clone Backend API - Install js-yaml to load full YAML specification",
    },
    servers: [
      {
        url: "http://localhost:5004/api/v1",
        description: "Development server",
      },
    ],
    paths: {},
  };
}

export default swaggerSpec;

