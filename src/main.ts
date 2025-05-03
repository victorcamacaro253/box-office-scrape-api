import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Add this import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Enable CORS with production configuration
   app.enableCors({
    origin: [
      'https://cineverseonline.netlify.app', // Your production frontend
      'http://localhost:5173' // For local development
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });


   // Swagger configuration
   const config = new DocumentBuilder()
   .setTitle('Movie API')
   .setDescription('The Movie API description')
   .setVersion('1.0')
   .addTag('movies') // Add tags for different resource groups
   .build();
 
   const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api-docs', app, document); // This will expose Swagger UI at /api-docs
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
