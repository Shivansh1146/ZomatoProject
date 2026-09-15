<div align="center">

# ðŸ½ï¸ Zomato Clone â€” Full-Stack Food Delivery App

<p align="center">
  A production-ready, full-stack <strong>food delivery platform</strong> inspired by Zomato.<br/>
  Features a <strong>Spring Boot REST API</strong>, an <strong>Admin Partner Panel</strong>, and a <strong>Consumer Storefront</strong> with GPS-based nearby restaurant discovery.<br/>
  🚀 <strong>Status: 100% Completed &amp; Fully Synchronized — Frontend ↔ Backend</strong><br/>
  Built with <strong>Spring Boot</strong>, <strong>JPA/Hibernate</strong>, <strong>MySQL</strong>, and <strong>Vanilla JS</strong> as part of an advanced Java learning project.
</p>

</div>

---

## ðŸ“Œ Table of Contents

- [âœ¨ Features](#-features)
- [ðŸ—ï¸ Project Architecture](#ï¸-project-architecture)
- [ðŸ—‚ï¸ Entity Model](#ï¸-entity-model)
- [ðŸ”— API Endpoints](#-api-endpoints)
- [âš™ï¸ Tech Stack](#ï¸-tech-stack)
- [ðŸš€ Getting Started](#-getting-started)
- [ðŸ› ï¸ Configuration](#ï¸-configuration)
- [ðŸ“ Project Structure](#-project-structure)
- [ðŸ¤ Contributing](#-contributing)

---

## âœ¨ Features

### ðŸ”™ Backend
- ðŸª **Restaurant Management** â€” Register and manage restaurants with address mapping
- ðŸ• **Menu Item Management** â€” Add menu items with variants, ratings, and types (VEG/NON-VEG)
- ðŸ§¹ **Full CRUD & Soft Delete** â€” Fully functional `DELETE` endpoints for restaurants, menu items, and variants. Records are soft-deleted using Hibernate's `@SoftDelete`
- ðŸ“ **GPS Nearby Search** â€” Find restaurants within a configurable radius using a native SQL Haversine formula query
- ðŸ•’ **Audit Timestamps** â€” Automatic creation timestamps (`createdAt` / `userAccountCreatedTime`) on all entities via `@CreationTimestamp`
- ðŸ“¦ **Inventory Management** â€” Track stock limits (`inventoryManaged`, `currentAvailableInventoryCount`) through DTOs to the DB
- âœ… **Request Validation & Error Handling** â€” Full input validation using `spring-boot-starter-validation` with a `GlobalExceptionHandler` returning structured `ErrorDTO`
- ðŸ›ï¸ **Layered Architecture** â€” Clean separation: Controller â†’ Service â†’ Repository â†’ Entity

### ðŸ–¥ï¸ Frontend
- ðŸŽ¨ **Admin / Partner Panel** (`index.html` + `app_v2.js`) â€” Fully-responsive light-theme dashboard for Restaurant, Menu Item, Variant, and User CRUD; includes 1-click autofill buttons and live inventory tracking
- ðŸ” **Consumer Storefront** (`consumer.html` + `consumer.js`) â€” A stunning customer UI with hero search, live All/Veg/Non-Veg filters, GPS nearby discovery, promotional offer tags, and slide-up restaurant menus with intelligent food image mapping
- ðŸ§ª **API Test Suite** (`test_apis.js`) â€” Node.js automated test runner covering all 28 endpoints

---

## ðŸ—ï¸ Project Architecture

```
Client (Postman / Frontend)
         â”‚
         â–¼
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚  Controller  â”‚  â† REST endpoints, request validation
  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
         â”‚
  â”Œâ”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”
  â”‚   Service    â”‚  â† Business logic
  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
         â”‚
  â”Œâ”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”
  â”‚ Repository   â”‚  â† Spring Data JPA (CRUD)
  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
         â”‚
  â”Œâ”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”
  â”‚  MySQL DB    â”‚  â† Persistent storage
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ðŸ—‚ï¸ Entity Model

```
Base (MappedSuperclass)
 â”œâ”€â”€ id (Auto-generated PK)
 â””â”€â”€ createdAt (Auto timestamp)

Restaurant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ extends Base
 â”œâ”€â”€ restaurantName
 â”œâ”€â”€ restaurantPhoneNumber (unique)
 â”œâ”€â”€ restaurantAddress   â”€â”€â†’ Address (OneToOne)
 â””â”€â”€ menuItemList        â”€â”€â†’ List<MenuItem> (OneToMany)

MenuItem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ extends Base
 â”œâ”€â”€ menuItemName
 â”œâ”€â”€ menuItemDescription
 â”œâ”€â”€ menuItemType        â”€â”€â†’ MenuItemType (VEG / NON_VEG)
 â”œâ”€â”€ menuItemRating
 â”œâ”€â”€ menuItemLabel
 â”œâ”€â”€ menuItemVariantList â”€â”€â†’ List<MenuItemVariant> (OneToMany)
 â””â”€â”€ restaurant          â”€â”€â†’ Restaurant (ManyToOne)

Address â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ standalone entity
User â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ standalone entity
```

---

## ðŸ”— API Endpoints

### ðŸª Restaurant

| Method | Endpoint         | Description           | Body / Response          |
|--------|------------------|-----------------------|--------------------------|
| `POST` | `/restaurant`    | Register a restaurant | Req: `RestaurantRequestDTO`  |
| `GET`  | `/restaurant`    | Get all restaurants   | Res: `List<RestaurantResponseDTO>` |
| `GET`  | `/restaurant/{id}`| Get specific restaurant| Res: `RestaurantResponseDTO` |
| `PUT`  | `/restaurant/{id}`| Update restaurant     | Req: `RestaurantRequestDTO` |
| `DELETE`| `/restaurant/{id}`| Delete a restaurant   | Res: `String`              |
| `GET`  | `/restaurant/getRestaurantToUser` | Get nearby restaurants by GPS | Query: `userLon`, `userLat` |

### ðŸ• Menu Item

| Method   | Endpoint           | Description          | Body / Response            |
|----------|--------------------|----------------------|----------------------------|
| `POST`   | `/menuItem`        | Add a menu item      | Req: `MenuItemRequestDTO`  |
| `PUT`    | `/menuItem/{id}`   | Update a menu item   | Req: `MenuItemRequestDTO`  |
| `DELETE` | `/menuItem/{id}`   | Delete a menu item   | Res: `String`              |

### ðŸ·ï¸ Menu Item Variant

| Method | Endpoint                | Description               | Body / Response                                  |
|--------|-------------------------|---------------------------|--------------------------------------------------|
| `PUT`  | `/menuItemVariant/{id}` | Update a menu item variant| Req: `CombineMenuItemAndMenuItemVariantRequestDTO` |
| `DELETE`| `/menuItemVariant/{id}`| Delete a menu item variant| Res: `String` (Guards last remaining variant)    |

### ðŸ‘¤ User & Address Management

| Method | Endpoint         | Description           | Body / Response          |
|--------|------------------|-----------------------|--------------------------|
| `POST` | `/user`          | Add a new user        | Req: `UserRequestDTO`    |
| `GET`  | `/user`          | Get all users         | Res: `List<UserResponseDTO>` |
| `GET`  | `/user/{id}`     | Get user by ID        | Res: `UserResponseDTO`   |
| `PUT`  | `/user/{id}`     | Update user details   | Req: `UserRequestDTO`    |
| `DELETE`| `/user/{id}`     | Delete a user         | Res: `String`            |
| `POST` | `/address/{userId}` | Add delivery address to user | Req: `AddressRequestDTO` |

> ðŸ’¡ `POST` and `PUT` endpoints return `HTTP 201 Created` on success. `GET` and `DELETE` return `HTTP 200 OK`. Full input validation is backed by Hibernate Validator and managed through custom Exception Handlers.

---

## âš™ï¸ Tech Stack

| Technology                     | Version  | Purpose                              |
|--------------------------------|----------|--------------------------------------|
| Java                           | 17       | Core programming language            |
| Spring Boot                    | 4.1.0    | Application framework                |
| Spring Data JPA / Hibernate    | â€”        | ORM & database interaction           |
| Spring Web MVC                 | â€”        | REST API layer                       |
| Spring Boot Validation         | â€”        | Request body validation              |
| SpringDoc OpenAPI / Swagger    | 3.1.0    | API Documentation (Swagger UI)       |
| MySQL                          | 8.x      | Relational database                  |
| Lombok                         | 1.18.46  | Boilerplate reduction (getters, etc) |
| Apache Commons Lang3           | 3.20.0   | Utility library                      |
| Maven                          | 3.x      | Build and dependency management      |

---

## ðŸš€ Getting Started

### Prerequisites

Make sure you have the following installed:

- â˜• [Java 17+](https://adoptium.net/)
- ðŸ—ƒï¸ [MySQL 8.x](https://dev.mysql.com/downloads/)
- ðŸ”¨ [Maven 3.x](https://maven.apache.org/download.cgi) (or use the bundled `mvnw`)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Shivansh1146/ZomatoProject.git
cd ZomatoProject/Project
```

**2. Create the MySQL database**
```sql
CREATE DATABASE zomato_db;
```

**3. Configure application properties**

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/zomato_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**4. Build the project**
```bash
./mvnw clean install
```

**5. Run the Backend Application**
You can run the backend directly from your IDE (like IntelliJ or Eclipse), or use the terminal:
```bash
# Ensure you are in the Project directory
cd ZomatoProject/Project

# Run the Spring Boot application
./mvnw spring-boot:run
```
*(The backend will start and listen on **`http://localhost:9090`**)*

**6. Access Swagger UI**
Once the backend is running, you can interact with the APIs directly via Swagger UI at:
ðŸ‘‰ **`http://localhost:9090/swagger-ui/index.html`**

**7. Run the Frontend Applications (Admin & Consumer)**
To view the frontends, you must serve the HTML/JS files using a simple HTTP server (this avoids CORS and file:// protocol issues).

Open a **new, separate terminal window**:
```bash
# Navigate to the frontend directory
cd ZomatoProject/frontend

# Start a local Python HTTP server
python -m http.server 3000
```

**8. Open the Apps in your Browser**
With both the backend and frontend servers running, open your browser and navigate to:
- ðŸ” **Customer App (Ordering):** [http://localhost:3000/consumer.html](http://localhost:3000/consumer.html)
- ðŸ› ï¸ **Admin Panel (Management):** [http://localhost:3000/index.html](http://localhost:3000/index.html)

---

## ðŸ› ï¸ Configuration

| Property                        | Default                               | Description                   |
|---------------------------------|---------------------------------------|-------------------------------|
| `server.port`                   | `9090`                                | Application port              |
| `spring.datasource.url`         | `jdbc:mysql://localhost:3306/zomato_db` | Database URL                |
| `spring.jpa.hibernate.ddl-auto` | `update`                              | Schema strategy               |
| `spring.jpa.show-sql`           | `true`                                | Print SQL to console          |

---

## ðŸ“ Project Structure

```
ZomatoProject/
â”œâ”€â”€ Project/                      # Spring Boot Backend
â”‚   â”œâ”€â”€ src/main/java/Zomato/Project/
â”‚   â”‚   â”œâ”€â”€ controller/
â”‚   â”‚   â”‚   â”œâ”€â”€ RestaurantController.java    (POST, GET, PUT, DELETE + GPS nearby)
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemController.java      (POST, PUT, DELETE)
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariantController.java (PUT, DELETE)
â”‚   â”‚   â”‚   â”œâ”€â”€ UserController.java          (POST, GET, PUT, DELETE)
â”‚   â”‚   â”‚   â””â”€â”€ AddressController.java       (POST)
â”‚   â”‚   â”œâ”€â”€ service/
â”‚   â”‚   â”‚   â”œâ”€â”€ RestaurantService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariantService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ UserService.java
â”‚   â”‚   â”‚   â””â”€â”€ AddressService.java
â”‚   â”‚   â”œâ”€â”€ repository/
â”‚   â”‚   â”‚   â”œâ”€â”€ RestaurantRepository.java    (incl. native GPS query)
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemRepository.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariantRepository.java
â”‚   â”‚   â”‚   â”œâ”€â”€ UserRepository.java
â”‚   â”‚   â”‚   â””â”€â”€ AddressRepository.java
â”‚   â”‚   â”œâ”€â”€ entity/
â”‚   â”‚   â”‚   â”œâ”€â”€ Base.java           (MappedSuperclass: id, createdAt)
â”‚   â”‚   â”‚   â”œâ”€â”€ Restaurant.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItem.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariant.java
â”‚   â”‚   â”‚   â”œâ”€â”€ Address.java
â”‚   â”‚   â”‚   â””â”€â”€ User.java
â”‚   â”‚   â”œâ”€â”€ dto/
â”‚   â”‚   â”‚   â”œâ”€â”€ RestaurantRequestDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ RestaurantResponseDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemRequestDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemResponseDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariantRequestDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ MenuItemVariantResponseDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ CombineMenuItemAndMenuItemVariantRequestDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ UserRequestDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ UserResponseDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ AddressRequestDTO.java
â”‚   â”‚   â”‚   â””â”€â”€ ErrorDTO.java
â”‚   â”‚   â”œâ”€â”€ enums/
â”‚   â”‚   â”‚   â””â”€â”€ MenuItemType.java   (VEG, NONVEG)
â”‚   â”‚   â”œâ”€â”€ exception/
â”‚   â”‚   â”‚   â”œâ”€â”€ GlobalExceptionHandler.java
â”‚   â”‚   â”‚   â”œâ”€â”€ AlreadyExistException.java
â”‚   â”‚   â”‚   â”œâ”€â”€ ResourceNotFoundException.java
â”‚   â”‚   â”‚   â””â”€â”€ InvalidRequestException.java
â”‚   â”‚   â””â”€â”€ ProjectApplication.java
â”‚   â””â”€â”€ src/main/resources/
â”‚       â””â”€â”€ application.properties
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ index.html        # ðŸ› ï¸ Admin / Partner Panel
â”‚   â”œâ”€â”€ app_v2.js         # Admin Panel â€“ all API calls, validations, modals
â”‚   â”œâ”€â”€ consumer.html     # ðŸ” Customer Ordering Storefront
â”‚   â”œâ”€â”€ consumer.js       # Customer Logic â€“ search, filters, GPS, menu overlay
â”‚   â”œâ”€â”€ style.css         # Admin Panel Styles
â”‚   â”œâ”€â”€ logo.png          # Zomato logo asset
â”‚   â”œâ”€â”€ food-banner.png   # Hero banner image
â”‚   â””â”€â”€ test_apis.js      # Node.js full API test suite (27/28 tests pass)
â”œâ”€â”€ README.md
â””â”€â”€ .gitignore
```

---

## ðŸ¤ Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">
  <p>Made with â¤ï¸ as part of an <strong>Advanced Java</strong> learning journey.</p>
  <p>
    <img src="https://img.shields.io/github/last-commit/Shivansh1146/ZomatoProject?style=flat-square" />
    <img src="https://img.shields.io/github/languages/top/Shivansh1146/ZomatoProject?style=flat-square" />
  </p>
</div>


