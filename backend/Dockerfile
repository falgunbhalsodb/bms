# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (for better layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create custom JRE
FROM eclipse-temurin:21-jdk AS jre-build

# Extract the JAR to analyze dependencies
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create a custom JRE with only required modules using jdeps and jlink
RUN jar xf app.jar && \
    jdeps \
    --ignore-missing-deps \
    --print-module-deps \
    --multi-release 21 \
    --recursive \
    --class-path 'BOOT-INF/lib/*' \
    app.jar > /tmp/modules.txt && \
    jlink \
    --add-modules $(cat /tmp/modules.txt),jdk.crypto.ec \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /custom-jre

# Stage 3: Final runtime image
FROM debian:bookworm-slim
WORKDIR /app

# Install minimal runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy custom JRE from jre-build stage
COPY --from=jre-build /custom-jre /opt/java

# Copy the application JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables
ENV JAVA_HOME=/opt/java
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring && \
    chown -R spring:spring /app
USER spring

# Expose the default Spring Boot port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD ${JAVA_HOME}/bin/java -cp app.jar org.springframework.boot.loader.JarLauncher --health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]
