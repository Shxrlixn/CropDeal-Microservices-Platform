# CropDeal – Microservices-Based Agricultural Marketplace

A scalable agricultural marketplace built using Spring Boot Microservices and Angular that enables farmers and dealers to trade crops through a secure, distributed architecture.

## Project Overview

CropDeal streamlines agricultural trading by connecting farmers and dealers on a unified platform. The application leverages a microservices architecture to ensure scalability, maintainability, and independent deployment of business services.

---

## Key Features

* JWT-Based Authentication & Authorization
* Farmer and Dealer Management
* Crop Listing and Inventory Management
* Crop Purchase & Order Processing
* Role-Based Access Control (Admin, Farmer, Dealer)
* API Gateway for Centralized Routing
* Service Discovery using Eureka Server
* Inter-Service Communication using OpenFeign
* RESTful APIs with Swagger Documentation
* Independent Databases for Each Service

---

## Microservices Architecture

### Core Services

* Authentication Service
* User Service
* Farmer Service
* Dealer Service
* Crop Service
* Order Service
* Admin User Management Service

### Infrastructure Services

* API Gateway
* Eureka Service Registry

---

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* OpenFeign
* Eureka Server
* Spring Cloud Gateway
* MySQL
* Maven

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3

### Development & Testing Tools

* Postman
* Swagger / OpenAPI
* Git
* GitHub
* Spring Tool Suite (STS)

---

## System Design Highlights

* Implemented a distributed microservices architecture with service isolation.
* Configured Eureka Server for dynamic service discovery.
* Developed secure authentication using JWT tokens.
* Implemented centralized API routing through API Gateway.
* Enabled inter-service communication using OpenFeign clients.
* Designed independent databases for improved scalability and fault isolation.
* Built REST APIs following industry-standard practices.

---

## Database Design

Each microservice maintains its own database schema:

* authdb
* userdb
* farmerdb
* dealerdb
* cropdb
* orderdb
* adminuserdb

This approach follows the Database-per-Service pattern commonly used in microservice architectures.

---

## Project Screenshots

### Application Login Page

![Login Page](docs/login-page.jpeg)

### Running Microservices

![Backend Microservices](docs/backend-microservices.jpeg)

### Eureka Service Discovery

![Eureka Server](docs/eureka-server.jpeg)

### JWT Authentication

![Protected API](docs/protected-api.jpeg)

### Secured API Access

![Protected API 2](docs/protected-api2.jpeg)

### Database Schemas

![MySQL Databases](docs/mysql-databases.jpeg)

---

## Learning Outcomes

* Designing and developing enterprise-grade microservices.
* Implementing secure authentication and authorization.
* Managing distributed systems using service discovery.
* Building scalable backend architectures.
* Integrating Angular frontend with Spring Boot backend services.
* Working with real-world API testing and documentation tools.

---

## Author

**Sherlien Molly D**

B.Tech Computer Engineering (Specialisation in AI and ML)

Interests:

* Artificial Intelligence & Machine Learning
* Backend Engineering
* Software Engineering
* Distributed Systems & Cloud Technologies
* Java Spring Ecosystem
