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
- **MySQL / MariaDB** - Database
- **Laravel Excel** - Excel import support
- **Vite** - Frontend build tool

---
