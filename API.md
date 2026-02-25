# Backend API Endpoints List

Berikut adalah daftar lengkap endpoint API yang tersedia di backend KinerjaHub along with their specific details.

## Authentication
**Prefix:** `/api/auth`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user with organization details |
| `POST` | `/login` | Authenticate user and receive a JWT token |

---

## Users
**Prefix:** `/api/users`

| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Authenticated | Get list of all users |
| `POST` | `/` | Admin Only | Create a new user manually |
| `GET` | `/:id` | All Authenticated | Get detailed information of a user |
| `PUT` | `/:id` | Admin Only | Update user information |
| `DELETE` | `/:id` | Admin Only | Remove a user from the system |

---

## Departments
**Prefix:** `/api/departments`

| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Authenticated | List all departments |
| `POST` | `/` | Admin Only | Create a new department |
| `GET` | `/:id` | All Authenticated | Get specific department details |
| `PUT` | `/:id` | Admin Only | Update department name/data |
| `DELETE` | `/:id` | Admin Only | Delete a department |

---

## Divisions
**Prefix:** `/api/divisions`

| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Authenticated | List all divisions |
| `POST` | `/` | Admin Only | Create a new division |
| `GET` | `/:id` | All Authenticated | Get specific division details |
| `PUT` | `/:id` | Admin Only | Update division information |
| `DELETE` | `/:id` | Admin Only | Delete a division |

---

## Roles
**Prefix:** `/api/roles`

| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Authenticated | List all roles within the organization |
| `POST` | `/` | All Authenticated | Create a new role |
| `GET` | `/:id` | All Authenticated | Get role details by ID |
| `PATCH` | `/:id` | All Authenticated | Update role name |
| `DELETE` | `/:id` | All Authenticated | Remove a role |

---

## Tasks
**Prefix:** `/api/tasks`

| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Authenticated | Get tasks (with role-based filtering) |
| `POST` | `/` | Admin/Koordinator | Create a new task |
| `GET` | `/:id` | All Authenticated | Get task details |
| `PATCH` | `/:id` | All Authenticated | Update task (status, etc.) |
| `DELETE` | `/:id` | Admin Only | Delete a task |
| `PATCH` | `/:id/assign` | Admin/Koordinator | Assign task to a user |

---

## Miscellaneous & System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api-docs` | Swagger / OpenAPI Documentation UI |
| `GET` | `/health` | API Health Check (Status, Uptime, Env) |
| `GET` | `/` | API Root (Check if running) |

> [!TIP]
> Semua endpoint (kecuali `/api/auth/*` dan `/health`, `/`) memerlukan header **Authorization: Bearer <token>** yang didapat dari proses login.
