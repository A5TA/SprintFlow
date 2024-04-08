FROM maven:3-openjdk-17 AS build
WORKDIR /backend
COPY ./backend /backend

RUN mvn -f /backend/pom.xml clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim 
COPY --from=build /backend/target/project-0.0.1-SNAPSHOT.jar project.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "project.jar"]
