# Zomato Project

This is a backend REST API project for a Zomato-like application, built with Java and Spring Boot. 

## Tech Stack
- **Java 17**
- **Spring Boot 4.1.0**
- **Spring Data JPA**
- **Spring Web MVC**
- **MySQL Database**
- **Lombok**
- **Apache Commons Lang3**

## Prerequisites
- Java 17 or higher
- Maven
- MySQL Server

## Getting Started

1. Clone the repository.
2. Ensure MySQL is running and you have configured the database connection properties in `src/main/resources/application.properties` (or `application.yml`):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/zomato_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Navigate to the `Project` directory and build the application using Maven:
   ```bash
   cd Project
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Features
- RESTful APIs for Zomato functionalities.
- Database integration with MySQL using Spring Data JPA.
- Request validation using Spring Boot Validation.
- Boilerplate reduction using Lombok.

## Running Tests
Run the tests using Maven:
```bash
mvn test
```
