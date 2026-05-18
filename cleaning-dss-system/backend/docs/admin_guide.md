# Clean Match DSS – Admin Guide

## 1. Introduction

The Clean Match Decision Support System (DSS) helps cleaning companies in Uganda select appropriate cleaning machines and detergents. As an **administrator**, you have privileged access to manage users, monitor system usage, upload data, and configure TCO (Total Cost of Ownership) multipliers.

This guide covers all administrative functions available via the API (or via the admin dashboard if implemented).

---

## 2. Prerequisites

- You have been assigned an **admin** role in the system.
- You have a valid **JWT token** obtained by logging in via `POST /api/v1/auth/login`.
- You include the token in all admin requests as:  
  `Authorization: Bearer <your_token>`

---

## 3. User Management

### 3.1 List All Users

**Endpoint:** `GET /api/v1/admin/users`

**Query parameters (optional):**
- `role` – filter by `user` or `admin`
- `is_active` – `true` or `false`
- `page` – page number (default 1)
- `limit` – records per page (default 20)

**Example response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}