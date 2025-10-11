
## 🚀 Features

### ✅ Implemented (Backend)
- Authentication & Authorization (JWT-based)
- Ticket creation, editing, and listing
- Order creation & expiration logic
- Event-driven architecture using NATS Streaming
- Payment integration with Stripe (mock/test mode)
- Global error handling and validation
- MongoDB-based persistence per service
- Dockerized services with Kubernetes deployments

### ✅ Implemented  (Frontend)
- Client UI built in Next.js + React
- End-to-end user experience: browsing, buying, and managing tickets

---

## 🛠️ Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Frontend     | Next.js, React, Tailwind CSS (WIP) |
| Backend      | Node.js, Express, TypeScript       |
| Database     | MongoDB                            |
| Messaging    | NATS Streaming Server              |
| Auth         | JWT + Cookies                      |
| DevOps       | Docker, Kubernetes, Skaffold       |
| Payments     | Stripe (Test Mode)                 |

---

## 📁 Microservices Overview

| Service         | Description                             |
|------------------|-----------------------------------------|
| **Auth**         | Handles signup, signin, signout, current user |
| **Tickets**      | CRUD operations for event tickets       |
| **Orders**       | Manages ticket reservations/orders      |
| **Expiration**   | Cancels expired orders automatically    |
| **Payments**     | Handles Stripe payments                 |
| **Client**       | Frontend UI (WIP)                       |

---

## 📸 Screenshots / Video Demo

*(To be added soon)*

---

## 🧪 Running Locally (Backend Only)

### Prerequisites:
- Docker
- Kubernetes (e.g., Docker Desktop, Minikube)
- Skaffold
- NATS Streaming Server (embedded via deployment)
- Stripe test keys

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ticketing-app.git
cd ticketing-app

// Add in k8 secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-key --from-literal=STRIPE_KEY=your_stripe_test_key


skaffold dev
```