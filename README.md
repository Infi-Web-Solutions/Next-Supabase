# 🛒 QuickCart – Full-Stack ECommerce App 
## 🧠 SaaS Multi-Tenant System with Supabase + Stripe + Next.js 15
This project is a full-featured SaaS application boilerplate supporting multi-organization management, JWT-based authentication, role-based access control, and Stripe integration per organization and 
and a fully dynamic admin-user product system—all powered 100% by Supabase for authentication, database, and storage.

### 🔐 JWT-Based Authentication (Admin / Staff / User)

Auth is handled via Supabase Auth (email/password or OAuth with Google/GitHub).
On login/signup, Supabase generates a JWT access token with custom claims.
Custom claims include the user's role (admin, staff, or user) and permissions.
A PostgreSQL function (jwt_custom_claims) securely injects claims into tokens.

### 🏢 Multi-Tenant SaaS Support (Organization-Based)

The platform supports **multiple organizations**, each with:

- Its own admin, staff, and user roles  
- A dedicated set of permissions  
- A separate Stripe account (via **Stripe Connect** or custom API keys)

Each organization can independently:

- Manage its own users and roles  
- Configure its own products and subscription plans  
- Use its own Stripe credentials for billing and subscriptions

Additional features:

- Stripe API keys are stored **per organization** in the database  
- Keys are **dynamically selected** at runtime during checkout and webhooks  
- Ensures complete **data isolation** and **billing independence** across organizations

### ✅ Role-Based Permissions

- Each system user (admin or staff) is assigned a specific role.
- Roles define what actions the user can perform (e.g., update products, view orders).
- Permissions are mapped to each role to control access throughout the application.
- On login:
  - The system fetches the user's permissions based on their role.
  - These permissions are stored in the browser to control access both in the UI and API requests.

### ⚙️ Middleware Route Protection

- Implemented using **Next.js 15 App Router middleware**.
- Automatically:
  - Redirects unauthenticated users to `/auth/login`.
  - Blocks unauthorized access to protected routes like `/admin`, `/orders`, `/dashboard`.
  - Checks `role` and `permissions` via **JWT claims** at the edge layer.
- Provides high-performance and secure route access enforcement.

### 📦 Stripe Integration (One-Time + Subscription + Multi-Org)

- Fully integrated **Stripe Checkout** for:
  - One-time product purchases
  - Tiered SaaS subscription plans
- Webhooks listen to key events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `invoice.payment_succeeded`
- Metadata passed to Stripe includes:
  - `userId`
  - `organizationId`
  - `productId`
- 🧩 **Each organization has its own Stripe account**:
  - Stripe keys are stored per organization.
  - Keys are selected dynamically at runtime for secure and isolated billing.

### 📧 Email Verification on Signup

- Supabase automatically sends email verification links on signup.
- Users **cannot access the app** until their email is verified.
- Prevents spam, fake accounts, and unauthorized access.

### 🛒 Product Order System

- Authenticated users can:
  - Browse available products
  - Place orders via Stripe Checkout
- Each order is linked to:
  - The current user's `user_id`
  - The organization’s `org_id`
- Supabase Row Level Security (RLS) ensures:
  - Users can only view **their own orders**
  - Admin/staff can view and manage **all orders** under their organization

### 💳 Subscription System (Free, Pro, Premium per Organization)

- Each organization has its **own subscription system** powered by **its own Stripe account**.
- Organizations can offer three plan tiers:
  - **Free**: Basic feature access
  - **Pro**: Paid plan with additional features
  - **Premium**: Paid plan with full access
- Subscription flow (per organization):
  - A user logs in under their organization
  - Selects a plan offered by **that organization**
  - Completes payment through that organization's Stripe Checkout
  - Stripe webhook updates the subscription status for the user within the organization
  - Application features are **dynamically gated** based on the user’s active plan within their organization
- Each organization’s Stripe credentials are used dynamically to ensure secure and isolated subscription handling.

### 🌐 OAuth (Google / GitHub)

- OAuth via Supabase using `signInWithOAuth()`.
- Supports:
  - Google login
  - GitHub login
- On successful login:
  - Supabase creates the user
  - Verifies email

### 🛠️ Setup Instructions

#### 1. 📦 Install Dependencies

Clone the repository and install all required dependencies using the following command:

```bash
npm install

 ⚙️ Configure Environment Variables
Create a .env.local file in the root directory of your project. You can start by copying the provided .env.example file:

cp .env.example .env.local
Then, update the values as needed. Here's an example:

NEXT_PUBLIC_SUPABASE_URL=https://tqcpfyxtxzficnsjyftd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

PAY_SECRET="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_webhook_secret"
NEXT_PUBLIC_BASE_URL=http://localhost:3000

 🚀 Start the Development Server

npm run dev
This will start your Next.js 15 development server at http://localhost:3000.
