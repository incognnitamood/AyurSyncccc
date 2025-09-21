# AyurSync Backend API

A comprehensive backend API for the Ayurvedic Diet Management System, providing patient management, AI-powered diet plan generation, and recipe database functionality.

## Features

### Core Features
- **Patient Management**: Complete patient profiles with Ayurvedic dosha assessment
- **AI Diet Plan Generation**: Automated diet plan creation using OpenAI GPT-4
- **Recipe Database**: Comprehensive recipe management with nutritional analysis
- **Nutrition Analysis**: Scientific nutritional calculations and recommendations
- **Ayurvedic Integration**: Dosha-based meal planning and recommendations

### Key Capabilities
- Scientifically calculated nutrient data for diverse food categories
- Dynamic food database covering Indian, multicultural, and international cuisines
- Automated diet chart generation with nutritionally balanced, Ayurveda-compliant plans
- Comprehensive patient management with health parameters and dietary habits
- Recipe-based diet charts with automated nutrient analysis

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-4 API
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ayursync-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ayursync
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key-here
   
   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Patients
- `GET /api/patients` - Get all patients (with pagination and filtering)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/stats` - Get patient statistics
- `GET /api/patients/dosha/:dosha` - Get patients by dosha

### Diet Plans
- `GET /api/diet-plans` - Get all diet plans
- `GET /api/diet-plans/:id` - Get diet plan by ID
- `POST /api/diet-plans/generate/:patientId` - Generate AI diet plan
- `PUT /api/diet-plans/:id` - Update diet plan
- `DELETE /api/diet-plans/:id` - Delete diet plan
- `POST /api/diet-plans/:planId/complete/:dayIndex` - Mark day as completed
- `GET /api/diet-plans/stats` - Get diet plan statistics
- `GET /api/diet-plans/suggestions/:patientId` - Get recipe suggestions

### Recipes
- `GET /api/recipes` - Get all recipes (with filtering)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/stats` - Get recipe statistics
- `GET /api/recipes/dosha/:dosha` - Get recipes by dosha
- `POST /api/recipes/analyze` - Analyze nutrition of multiple recipes
- `GET /api/recipes/popular` - Get popular recipes

## Data Models

### Patient
- Personal information (name, age, gender, contact)
- Physical measurements (weight, height, BMI)
- Dosha assessment and scores
- Health information (concerns, symptoms, medications)
- Lifestyle preferences (diet type, cooking skills, meal frequency)
- Health metrics and progress tracking

### Recipe
- Basic information (name, type, cuisine)
- Ingredients and instructions
- Ayurvedic properties (rasa, virya, vipaka, dosha effects)
- Nutritional profile (calories, macronutrients, vitamins, minerals)
- Health benefits and difficulty level

### Diet Plan
- Patient association and plan details
- Daily meal plans with recipes
- Nutritional targets and tracking
- Ayurvedic considerations
- AI generation metadata
- Progress tracking and feedback

## AI Integration

The system uses OpenAI GPT-4 for intelligent diet plan generation:

1. **Patient Analysis**: Analyzes patient's dosha, health goals, and preferences
2. **Recipe Selection**: Filters suitable recipes from the database
3. **Plan Generation**: Creates personalized meal plans with proper nutrition
4. **Ayurvedic Compliance**: Ensures plans follow Ayurvedic principles
5. **Nutritional Balance**: Maintains proper macronutrient distribution

## Authentication & Authorization

- **JWT-based authentication** for secure API access
- **Role-based access control** (Admin, Practitioner, Patient)
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization

## Database Seeding

Seed the database with sample recipes:

```bash
node backend/scripts/seedRecipes.js
```

## Development

### Project Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic services
├── scripts/         # Database seeding scripts
└── server.js        # Main server file
```

### Key Services

- **AIService**: Handles OpenAI integration for diet plan generation
- **NutritionService**: Calculates nutritional requirements and analysis
- **PatientService**: Manages patient data and dosha calculations

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure JWT secrets
- Configure production MongoDB URI
- Set up OpenAI API key
- Configure CORS for production frontend URL

### Docker Deployment
```bash
# Build image
docker build -t ayursync-backend .

# Run container
docker run -p 5000:5000 ayursync-backend
```

## API Documentation

The API follows RESTful conventions with consistent response formats:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
