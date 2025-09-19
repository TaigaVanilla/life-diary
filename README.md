# LifeDiary

A full-stack web application built with Spring Boot and MongoDB for personal diary management with calendar-based entry system.

## Technical Overview

**Backend Architecture**: Spring Boot 3.5.6 with Java 21  
**Database**: MongoDB with Spring Data MongoDB  
**Security**: Spring Security with BCrypt password encoding  
**Frontend**: Vanilla JavaScript with Thymeleaf templating  
**Containerization**: Docker with multi-stage builds  
**Testing**: JUnit 5 with Mockito for unit testing  

## Key Features

### 1. User Authentication & Authorization
- User registration with duplicate username prevention
- Secure password hashing using BCrypt
- Session-based authentication with Spring Security
- Custom user details service implementation

### 2. Diary Entry Management
- **Upsert Operations**: Smart save/update logic using MongoDB upsert
- **Date-based Queries**: Efficient month-based entry retrieval
- **Content Validation**: Empty content handling with automatic deletion
- **User Isolation**: All operations scoped to authenticated user

### 3. Data Extraction & Export
- Date range-based entry extraction
- Full diary export functionality
- Optimized queries for large datasets


## Getting Started

### Local Development
1. **Clone the repository**
2. **Set environment variables**:
   ```bash
   cp .env.example .env
   ```
3. **Run with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```
4. **Access the application**: http://localhost:8080

### Production Build
```bash
# Build production image
docker build -f Dockerfile.prod -t life-diary:latest .

# Run with environment variables
docker run -p 8080:8080 \
  -e MONGO_URI=mongodb://your-mongo-uri \
  -e MONGO_DB=lifediary \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=secure_password \
  life-diary:latest
```

## Project Structure

```
src/main/java/me/taigavanilla/lifediary/
├── config/          # Security and application configuration
├── controller/      # REST API controllers
├── dto/             # Data Transfer Objects
├── exception/       # Global exception handling
├── mapper/          # Entity-DTO mapping
├── model/           # JPA/MongoDB entities
├── repository/      # Data access layer
└── service/         # Business logic layer
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (form-based)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Authentication status

### Diary Management
- `POST /api/diary` - Create/update diary entry
- `GET /api/diary/{date}` - Get entry for specific date
- `GET /api/diary/month/{year}/{month}` - Get entries for month
- `GET /api/diary/extract` - Extract entries with date range
