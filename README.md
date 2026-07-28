# Shipment Manager

A web application for managing shipments, clients, shipment labels, grouped shipments, Excel imports, and shipment tracking.

The system is built with **Laravel**, **Inertia.js**, **React**, and **Tailwind CSS**.

---

## About the Project

Shipment Manager is designed to help clients create and manage shipments through a simple web interface.

Clients can manually enter shipment data, import multiple shipments through Excel files, generate shipment labels, print labels, and track shipment statuses. The system also supports **grouped shipments**, where multiple shipments can be delivered to the same recipient and processed with a discount.

---

## Main Features

### Authentication

- User registration
- User login
- Protected dashboard routes
- Client-specific shipment access

---

### Shipment Management

Clients can create shipments by filling out a web form with details such as:

- Recipient name
- Recipient phone number
- Address
- City
- Package information
- Delivery notes
- Shipment status

Each shipment can be viewed, edited, and managed from the client dashboard.

---

### Excel Shipment Import

Clients can upload an Excel file with a predefined structure.

The system supports:

- Bulk shipment import
- Preview before saving
- Validation of required fields
- Error handling for incorrectly filled files

This makes it easier for clients who need to create many shipments at once.

---

### Shipment Labels

Each shipment has a printable label page.

The label includes the important shipment information needed for delivery, such as:

- Sender information
- Recipient information
- Address
- Phone number
- Barcode / shipment identifier
- Shipment details

The print button prints only the label container, not the entire page.

---

### Grouped Shipments

The system supports **grouped shipments**.

Grouped shipments are used when:

- One sender sends from one location
- The recipient is the same person
- The recipient is identified by phone number
- Multiple shipments are delivered at the same time

Grouped shipments can include:

- Number of shipments
- Discount percentage
- Grouped shipment label
- Total price calculation with discount

This allows clients to process multiple shipments for the same recipient more efficiently.

---

### Shipment Tracking

Each shipment has a status that can be updated and tracked.

Example statuses:

- Pending
- Accepted
- In Transit
- Delivered
- Cancelled

Clients can follow the progress of their shipments from their dashboard.

---

## Tech Stack

- **Laravel** - Backend framework
- **Inertia.js** - Connects Laravel backend with React frontend
- **React** - Frontend UI
- **Tailwind CSS** - Styling
- **MySQL** - Database
- **Laravel Excel** - Excel import support
- **Vite** - Frontend build tool

---

## Local Docker Setup

This project can be run locally using Docker.

The local setup includes:

- Laravel app container
- MySQL database container
- Vite development server
- Automatic startup with Docker Compose
- Database migrations and seeders for test users

---

## Requirements

Make sure you have installed:

- Docker
- Docker Compose

---

## First-time setup

Run:

```bash
./scripts/local-setup.sh
```

The script will:

- Build and start the containers
- Install Composer dependencies
- Install NPM dependencies
- Create `.env` from `.env.example` if needed
- Generate the Laravel app key
- Run database migrations
- Seed the database with test users

After it finishes, open:

```text
http://localhost:8000
```

---

## Start the project later

After the first setup, start the project with:

```bash
docker compose -f compose.local.yaml up -d
```

Then open:

```text
http://localhost:8000
```

Laravel and Vite will start automatically.

---

## Stop the project

```bash
docker compose -f compose.local.yaml down
```

---

## Rebuild containers

Use this if Docker files were changed:

```bash
docker compose -f compose.local.yaml up -d --build
```

---

## Useful commands

View running containers:

```bash
docker ps
```

View app logs:

```bash
docker logs -f shipment_manager_local_app
```

Enter the app container:

```bash
docker exec -it shipment_manager_local_app bash
```

Run migrations manually:

```bash
docker exec shipment_manager_local_app php artisan migrate
```

Run seeders manually:

```bash
docker exec shipment_manager_local_app php artisan db:seed
```

---

## Local services

Application:

```text
http://localhost:8000
```

Vite:

```text
http://localhost:5173
```

MySQL:

```text
localhost:3307
```
