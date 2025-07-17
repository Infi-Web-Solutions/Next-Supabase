🛒 QuickCart – Full-Stack ECommerce App with Next.js 15 & Supabase
QuickCart is a modern full-stack ECommerce platform built using Next.js 15 App Router, Supabase, Stripe, JavaScript, and Bootstrap. It features secure JWT-based authentication, role-based access control, Stripe payments & subscriptions, and a fully dynamic admin-user product system—all powered 100% by Supabase for authentication, database, and storage.

🔐 JWT-Based Authentication (Admin / Staff / User)

Auth is handled via Supabase Auth (email/password or OAuth with Google/GitHub).
On login/signup, Supabase generates a JWT access token with custom claims.
Custom claims include the user's role (admin, staff, or user) and permissions.
A PostgreSQL function (jwt_custom_claims) securely injects claims into tokens.

✅ Role-Based Permissions

Each system user (admin/staff) has a role_id from the system_users table.
Permissions (like products.update, orders.view) are stored in a permissions table.
A role_permissions table maps roles to their allowed actions.
Permissions are fetched after login and stored in localStorage to secure frontend/backend access.

⚙️ Middleware Route Protection

Implemented using middleware in Next.js 15 App Router.
Redirects unauthenticated users to /auth/login.
Blocks unauthorized users from accessing /admin and other protected routes.
Applies to routes like /admin, /orders, /profile, etc.
Prevents unauthorized frontend access and enforces security at the route level.

📦 Stripe Payment Integration (with Webhooks)

Integrated Stripe Checkout for one-time orders and subscription payments.
Webhooks listen to events like checkout.session.completed to update:
Orders
Subscriptions
Stripe metadata stores userId, productId, and email for tracking and logic.

📧 Email Verification on Signup

Supabase sends email verification links automatically on signup.
Users cannot log in until email is verified.
Protects from spam and fake accounts.

🛒 Product Order System

Users can browse and place orders for products.
Payments processed via Stripe Checkout.
Supabase Row Level Security (RLS):
Users can only view their own orders.
Admin/staff can view and manage all orders.
Only authenticated users can create new orders.

💳 Subscription System (Free, Pro, Premium)
3 plan tiers:

Free: Limited access
Pro: Paid with extra features
Premium: Paid with full access
Subscription Flow:
User logs in
Chooses plan
Completes Stripe payment
Webhook updates subscription in Supabase
Feature access is controlled dynamically based on active plan.

🌐 OAuth (Google / GitHub)

Seamless OAuth via Supabase using signInWithOAuth().
Google and GitHub login support.
On successful login:
Supabase creates the user
Applies email verification
Stores profile metadata

🛠️ Setup Instructions

1. 📦 Install Dependencies
Clone the repository and install all dependencies using:

bash
Copy
Edit
npm install
2. ⚙️ Configure Environment Variables
Create a .env.local file in the root directory of your project. You can start by copying the provided .env.example file:

bash
Copy
Edit
cp .env.example .env.local
Then, update the values as needed. Here's an example:

env
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=https://tqcpfyxtxzficnsjyftd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

PAY_SECRET="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_webhook_secret"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
⚠️ Never commit .env.local – keep your secrets safe!

3. 🚀 Start the Development Server
bash
Copy
Edit
npm run dev
This will start your Next.js 15 development server at http://localhost:3000.
