# Use the correct OpenJDK 8 runtime as a parent image
FROM openjdk:8-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Give permission for mvnw
RUN chmod +x mvnw

# Download dependencies (faster build)
RUN ./mvnw dependency:go-offline

# Copy the rest of your project
COPY src ./src

# Package the application
RUN ./mvnw clean package -DskipTests

# Expose port (same as your Spring Boot app)
EXPOSE 8080

# ... other steps ...
# Run the jar file directly using ENTRYPOINT
ENTRYPOINT ["java", "-jar", "target/testeverse-0.0.1-SNAPSHOT.jar"]
