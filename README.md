# SmartRetailX — Distributed Microservices Platform

## Services

| Service | Port | Swagger Docs |
|---|---|---|
| User Management | 3001 | http://localhost:3001/api-docs |
| Product Catalogue | 3002 | http://localhost:3002/api-docs |
| Order Processing | 3003 | http://localhost:3003/api-docs |
| Inventory Management | 3004 | http://localhost:3004/api-docs |

## Run Everything

```bash
docker-compose up --build
```

## Stop Everything

```bash
docker-compose down
```

## Test Flow

### 1. Register a user
POST http://localhost:3001/api/v1/auth/register
```json
{ "name": "Admin User", "email": "admin@smartretailx.com", "password": "admin123", "role": "admin" }
```

### 2. Login and get token
POST http://localhost:3001/api/v1/auth/login
```json
{ "email": "admin@smartretailx.com", "password": "admin123" }
```
Copy the token from the response.

### 3. Add a product (use token)
POST http://localhost:3002/api/v1/products
Authorization: Bearer <token>
```json
{ "name": "iPhone 15", "price": 999.99, "sku": "IPH15-BLK", "category": "Electronics" }
```

### 4. Add inventory for the product
POST http://localhost:3004/api/v1/inventory
Authorization: Bearer <token>
```json
{ "product_id": 1, "product_name": "iPhone 15", "quantity": 100 }
```

### 5. Place an order
POST http://localhost:3003/api/v1/orders
Authorization: Bearer <token>
```json
{
  "shipping_address": "123 Main St, Colombo",
  "items": [{ "product_id": 1, "product_name": "iPhone 15", "quantity": 2, "unit_price": 999.99 }]
}
```
