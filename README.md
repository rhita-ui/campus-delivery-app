# Campus Delivery App

A comprehensive full-stack delivery application designed for campus environments. This platform connects students and staff with local stores and vending machines, facilitating seamless ordering, payment processing, and delivery management.

## 🚀 Features

- **User Authentication**: Secure login and registration system.
- **Store & Vending Machine Integration**: Browse products from various stores and connected vending machines.
- **Smart Cart & Checkout**: Robust cart management with real-time price calculation and secure checkout.
- **Order Management**: Track order history and status.
- **Admin Dashboard**:
  - Manage Stores and Products.
  - Monitor Vending Machines.
  - Create and Manage Events.
  - View Sales Stats and Analytics.
- **Payments**: Integrated Razorpay payment gateway for secure online transactions.
- **Notifications**: Email notifications for order confirmations and updates using Nodemailer.
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS and Radix UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Backend**: Next.js Server Actions
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT & Bcrypt based custom auth
- **Payments**: [Razorpay](https://razorpay.com/)
- **Validation**: [Zod](https://zod.dev/) & React Hook Form
- **Email**: Nodemailer (Gmail OAuth2)

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

## ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd campus-delivery-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

   # Authentication
   JWT_SECRET=your_jwt_secret_key

   # Email Configuration (Nodemailer with Gmail OAuth2)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password # Optional if using OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_refresh_token

   # Payment Gateway (Razorpay)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id # For client-side access
   ```

## 🏃‍♂️ Running the Application

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

- `app/`: Next.js App Router structure.
  - `admin/`: Admin dashboard routes.
  - `api/`: API endpoints.
  - `models/`: Mongoose schemas (User, Order, Store, etc.).
  - `restaurant/`: Store and ordering interface.
  - `(auth)/`: Authentication routes (login/register).
- `components/`: Reusable UI components.
- `lib/`: Utility libraries.
- `utils/`: Helper functions (JWT, Mail, Date formatting).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
