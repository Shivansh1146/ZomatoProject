<div align="center">

# 🍽️ Zomato Clone — Backend REST API

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Maven-3.9-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" />
  <img src="https://img.shields.io/badge/Lombok-1.18-blueviolet?style=for-the-badge" />
</p>

<p align="center">
  A production-ready, scalable <strong>RESTful backend API</strong> and <strong>Admin Frontend</strong> for a food delivery platform — inspired by Zomato.<br/>
  🚀 <strong>Project Status: 100% Completed & Synchronized (Frontend + Backend)</strong><br/>
  Built with <strong>Spring Boot</strong>, <strong>JPA/Hibernate</strong>, and <strong>MySQL</strong> as part of an advanced Java learning project.
</p>

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🏗️ Project Architecture](#️-project-architecture)
- [🗂️ Entity Model](#️-entity-model)
- [🔗 API Endpoints](#-api-endpoints)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

- 🏪 **Restaurant Management** — Register and manage restaurants with address mapping
- 🍕 **Menu Item Management** — Add menu items with variants, ratings, and types (VEG/NON-VEG)
- 🧹 **Full CRUD & Soft Delete** — Fully functional `DELETE` endpoints for restaurants, menu items, and variants. Records are soft-deleted using Hibernate's `@SoftDelete`
- 🕒 **Audit Timestamps** — Automatic creation timestamps (`createdAt` / `userAccountCreatedTime`) on all entities via `@CreationTimestamp`, dynamically rendered in the UI.
- 📦 **Inventory Management** — Track stock limits (`inventoryManaged`, `currentAvailableInventoryCount`) seamlessly through the DTOs to the DB.
- ✅ **Request Validation & Error Handling** — Full input validation using `spring-boot-starter-validation`. The frontend smartly parses ugly JSON backend errors into clean, responsive UI toasts!
- 🏛️ **Layered Architecture** — Clean separation between Controller → Service → Repository → Entity layers
- 🎨 **Admin Panel Frontend** — Includes a stunning, fully-responsive light-theme frontend built with Zomato aesthetics to view dashboards, track inventory, execute CRUD operations, and manage complex menu items.

---

## 🏗️ Project Architecture

```
Client (Postman / Frontend)
         │
         ▼
  ┌─────────────┐
  │  Controller  │  ← REST endpoints, request validation
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │   Service    │  ← Business logic
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │ Repository   │  ← Spring Data JPA (CRUD)
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  MySQL DB    │  ← Persistent storage
  └─────────────┘
```

---

## 🗂️ Entity Model

```
Base (MappedSuperclass)
 ├── id (Auto-generated PK)
 └── createdAt (Auto timestamp)

Restaurant ──────────── extends Base
 ├── restaurantName
 ├── restaurantPhoneNumber (unique)
 ├── restaurantAddress   ──→ Address (OneToOne)
 └── menuItemList        ──→ List<MenuItem> (OneToMany)

MenuItem ────────────── extends Base
 ├── menuItemName
 ├── menuItemDescription
 ├── menuItemType        ──→ MenuItemType (VEG / NON_VEG)
 ├── menuItemRating
 ├── menuItemLabel
 ├── menuItemVariantList ──→ List<MenuItemVariant> (OneToMany)
 └── restaurant          ──→ Restaurant (ManyToOne)

Address ─────────────── standalone entity
User ───────────────── standalone entity
```

---

## 🔗 API Endpoints

### 🏪 Restaurant

| Method | Endpoint         | Description           | Body / Response          |
|--------|------------------|-----------------------|--------------------------|
| `POST` | `/restaurant`    | Register a restaurant | Req: `RestaurantRequestDTO`  |
| `GET`  | `/restaurant`    | Get all restaurants   | Res: `List<RestaurantResponseDTO>` |
| `GET`  | `/restaurant/{id}`| Get specific restaurant| Res: `RestaurantResponseDTO` |
| `DELETE`| `/restaurant/{id}`| Delete a restaurant   | Res: `String`              |

### 🍕 Menu Item

| Method   | Endpoint           | Description          | Body / Response            |
|----------|--------------------|----------------------|----------------------------|
| `POST`   | `/menuItem`        | Add a menu item      | Req: `MenuItemRequestDTO`  |
| `PUT`    | `/menuItem/{id}`   | Update a menu item   | Req: `MenuItemRequestDTO`  |
| `DELETE` | `/menuItem/{id}`   | Delete a menu item   | Res: `String`              |

### 🏷️ Menu Item Variant

| Method | Endpoint                | Description               | Body / Response                                  |
|--------|-------------------------|---------------------------|--------------------------------------------------|
| `PUT`  | `/menuItemVariant/{id}` | Update a menu item variant| Req: `CombineMenuItemAndMenuItemVariantRequestDTO` |
| `DELETE`| `/menuItemVariant/{id}`| Delete a menu item variant| Res: `String`                                    |

> 💡 `POST` and `PUT` endpoints return `HTTP 201 Created` on success. `GET` and `DELETE` return `HTTP 200 OK`.

---

## ⚙️ Tech Stack

| Technology                     | Version  | Purpose                              |
|--------------------------------|----------|--------------------------------------|
| Java                           | 17       | Core programming language            |
| Spring Boot                    | 4.1.0    | Application framework                |
| Spring Data JPA / Hibernate    | —        | ORM & database interaction           |
| Spring Web MVC                 | —        | REST API layer                       |
| Spring Boot Validation         | —        | Request body validation              |
| MySQL                          | 8.x      | Relational database                  |
| Lombok                         | 1.18.46  | Boilerplate reduction (getters, etc) |
| Apache Commons Lang3           | 3.20.0   | Utility library                      |
| Maven                          | 3.x      | Build and dependency management      |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- ☕ [Java 17+](https://adoptium.net/)
- 🗃️ [MySQL 8.x](https://dev.mysql.com/downloads/)
- 🔨 [Maven 3.x](https://maven.apache.org/download.cgi) (or use the bundled `mvnw`)

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

**5. Run the backend application**
```bash
./mvnw spring-boot:run
```
The server starts at: **`http://localhost:9090`**

**6. Run the Admin Panel Frontend**
Open a new terminal window in the `frontend` folder and start a local HTTP server:
```bash
cd ZomatoProject/frontend
python -m http.server 3000
```
Then open your browser to **`http://localhost:3000`** to access the Admin Panel.

---

## 🛠️ Configuration

| Property                        | Default                               | Description                   |
|---------------------------------|---------------------------------------|-------------------------------|
| `server.port`                   | `9090`                                | Application port              |
| `spring.datasource.url`         | `jdbc:mysql://localhost:3306/zomato_db` | Database URL                |
| `spring.jpa.hibernate.ddl-auto` | `update`                              | Schema strategy               |
| `spring.jpa.show-sql`           | `true`                                | Print SQL to console          |

---

## 📁 Project Structure

```
ZomatoProject/
└── Project/
    ├── src/
    │   └── main/
    │       ├── java/Zomato/Project/
    │       │   ├── controller/
    │       │   │   ├── RestaurantController.java
    │       │   │   └── MenuItemController.java
    │       │   ├── service/
    │       │   │   ├── RestaurantService.java
    │       │   │   └── MenuItemService.java
    │       │   ├── repository/
    │       │   ├── entity/
    │       │   │   ├── Base.java
    │       │   │   ├── Restaurant.java
    │       │   │   ├── MenuItem.java
    │       │   │   ├── MenuItemVariant.java
    │       │   │   ├── Address.java
    │       │   │   └── User.java
    │       │   ├── dto/
    │       │   │   ├── RestaurantRequestDTO.java
    │       │   │   └── MenuItemRequestDTO.java
    │       │   ├── enums/
    │       │   │   └── MenuItemType.java
    │       │   └── ProjectApplication.java
    │       └── resources/
    │           └── application.properties
    └── pom.xml
frontend/
└── index.html      # Admin Panel HTML
└── style.css       # Custom UI styling
└── app.js          # Logic & API integration
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ as part of an <strong>Advanced Java</strong> learning journey.</p>
  <p>
    <img src="https://img.shields.io/github/last-commit/Shivansh1146/ZomatoProject?style=flat-square" />
    <img src="https://img.shields.io/github/languages/top/Shivansh1146/ZomatoProject?style=flat-square" />
  </p>
</div>
