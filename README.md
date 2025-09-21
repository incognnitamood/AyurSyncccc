# 🧘‍♀️ AyurSync - Ayurvedic Diet Management System

A comprehensive web application for managing Ayurvedic diet plans, patient profiles, and recipe databases with AI-powered meal plan generation.

## ✨ Features

### 🎯 Core Features
- **Patient Management**: Complete patient profiles with Ayurvedic dosha assessment
- **AI Diet Plan Generation**: Automated diet plan creation using OpenAI GPT-4
- **Recipe Database**: Comprehensive recipe management with nutritional analysis
- **Nutrition Analysis**: Scientific nutritional calculations and recommendations
- **Ayurvedic Integration**: Dosha-based meal planning and recommendations

### 🔬 Key Capabilities
- **Scientifically Calculated Nutrition**: BMR/TDEE calculations, macronutrient distribution, micronutrient requirements
- **Dynamic Recipe Database**: 8,000+ item capacity with Indian, multicultural, and international cuisines
- **Automated Diet Chart Generation**: AI-powered, nutritionally balanced, Ayurveda-compliant plans
- **Comprehensive Patient Management**: Age, gender, dietary habits, meal frequency, health parameters
- **Recipe-Based Analysis**: Automated nutrient analysis with detailed guidance

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ayursync
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   ```

3. **Set up environment variables**
   
   Create `backend/.env` file:
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

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm start
   
   # Or start individually
   npm run dev          # Frontend only
   npm run backend      # Backend only
   ```

5. **Seed the database (optional)**
   ```bash
   npm run backend:seed
   ```

## 🔑 Demo Access

**Login Credentials:**
- Email: `doctor@ayursync.com`
- Password: `password`

## 📱 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Ayurvedic theme
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and context
- **Authentication**: JWT-based with context provider

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-4 API
- **Authentication**: JWT tokens
- **Validation**: Express-validator
- **Security**: Helmet, CORS, rate limiting

## 📊 Database Schema

### Patient Model
```javascript
{
  fullName: String,
  dateOfBirth: Date,
  age: Number,
  gender: String,
  email: String,
  phone: String,
  weight: Number,
  height: Number,
  bmi: Number,
  doshaAnswers: [Object],
  primaryDosha: String,
  doshaScores: Object,
  primaryConcerns: String,
  currentSymptoms: [String],
  mealFrequency: String,
  waterIntake: String,
  dietType: String,
  cookingSkills: String,
  // ... more fields
}
```

### Recipe Model
```javascript
{
  name: String,
  type: String,
  cuisine: String,
  ingredients: [Object],
  instructions: [String],
  ayurvedic_properties: Object,
  health_benefits: [String],
  nutrition_profile: Object,
  difficulty: String,
  // ... more fields
}
```

### Diet Plan Model
```javascript
{
  name: String,
  patientId: ObjectId,
  startDate: Date,
  endDate: Date,
  duration: Number,
  dailyPlans: [Object],
  targetCalories: Number,
  primaryDosha: String,
  aiGenerated: Boolean,
  status: String,
  // ... more fields
}
```

## 🤖 AI Integration

The system uses OpenAI GPT-4 for intelligent diet plan generation:

1. **Patient Analysis**: Analyzes patient's dosha, health goals, and preferences
2. **Recipe Selection**: Filters suitable recipes from the database
3. **Plan Generation**: Creates personalized meal plans with proper nutrition
4. **Ayurvedic Compliance**: Ensures plans follow Ayurvedic principles
5. **Nutritional Balance**: Maintains proper macronutrient distribution

### AI Prompt Engineering
The system uses carefully crafted prompts that include:
- Patient's complete health profile
- Dosha assessment results
- Available recipes with nutritional data
- Ayurvedic principles and guidelines
- Specific dietary restrictions and preferences

## 🔧 API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Diet Plans
- `GET /api/diet-plans` - Get all diet plans
- `POST /api/diet-plans/generate/:patientId` - Generate AI diet plan
- `GET /api/diet-plans/:id` - Get diet plan by ID
- `PUT /api/diet-plans/:id` - Update diet plan

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/dosha/:dosha` - Get recipes by dosha
- `POST /api/recipes/analyze` - Analyze nutrition

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Earthy tones inspired by Ayurvedic principles
- **Typography**: Georgia serif for traditional feel
- **Components**: Custom-styled with rustic, organic aesthetics
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 📈 Performance Optimizations

- Lazy loading of components
- Image optimization
- API response caching
- Database indexing
- Efficient state management

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
npm test
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure OpenAI API key
5. Set production CORS origins

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify environment variables
- Ensure all dependencies are installed

**AI features not working:**
- Verify OpenAI API key is set
- Check API key has sufficient credits
- Ensure network connectivity

**Frontend build errors:**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

### Getting Help
- Check the documentation
- Review the API endpoints
- Test with the demo credentials
- Check browser console for errors

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with fitness trackers
- [ ] Multi-language support
- [ ] Advanced AI recommendations
- [ ] Social features for practitioners
- [ ] Telemedicine integration

### Performance Improvements
- [ ] GraphQL API
- [ ] Real-time updates
- [ ] Advanced caching
- [ ] CDN integration
- [ ] Progressive Web App features

---

**Built with ❤️ for the Ayurvedic community**

*AyurSync - Sync your diet, Balance your life*