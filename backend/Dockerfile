# Use Eclipse Temurin (OpenJDK) for Java 24
FROM eclipse-temurin:24-alpine as builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies first (cache them in Docker layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:24-alpine

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/backend-*.jar app.jar

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables (can be overridden in docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]