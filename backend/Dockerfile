# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

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

# Expose port
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "target/*.jar"]
