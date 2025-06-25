# Use Eclipse Temurin (OpenJDK) for Java 24
FROM eclipse-temurin:24-alpine AS builder

WORKDIR /app

# Set JVM options to suppress native warnings and disable Jansi
ENV MAVEN_OPTS="--enable-native-access=ALL-UNNAMED -Djansi.force=false"

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Ensure the wrapper is executable
#RUN chmod +x mvnw

# Download dependencies first (cache them in Docker layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application without running tests
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:24-alpine
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables (can be overridden in docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod

# Disable Jansi and allow native access at runtime
ENTRYPOINT ["java", "--enable-native-access=ALL-UNNAMED", "-Djansi.force=false", "-jar", "app.jar"]