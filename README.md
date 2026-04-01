# eduFlow

**eduFlow** is a modern, comprehensive School Management SaaS application. Built with a focus on performance, scalability, and user experience, eduFlow provides specific tools and modules for different roles within educational institutions, including Principals, Heads of Departments (HoD), Admissions, Accounts, and Faculty.

## 🚀 Features

- **Role-Based Access Control:** Distinct portals and permissions for Principals, HoDs, Admission Officers, Accounts, and Faculty members.
- **Academic Management Module:** Intuitive interface for managing students, courses, grades, and academic tracking.
- **Modern User Interface:** A slick, theme-aware (Light/Dark mode) interface built with Radix UI primitives and Tailwind CSS.
- **Single Page Application Feel:** Powered by Inertia.js v3 providing seamless navigation without full page reloads.
- **Robust Backend:** Laravel 13 architecture connected to a MongoDB document database.

## 🛠️ Tech Stack

- **Backend:** Laravel 13 (PHP 8.4)
- **Frontend:** React 19 + TypeScript
- **Routing & State:** Inertia.js v3
- **CSS Framework:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix) + Lucide Icons
- **Database:** MongoDB (via `mongodb/laravel-mongodb`)
- **Build Tool:** Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- PHP >= 8.4
- Composer
- Node.js (v20+ recommended) & npm
- MongoDB running locally or accessible via URI

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd eduFlow
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install Node dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Copy the example environment file and configure your variables, especially your MongoDB connection settings.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup:**
   Run migrations and seed the database with initial data/roles.
   ```bash
   php artisan migrate --seed
   ```

## 💻 Local Development

To start the local development server, run the built-in composer dev script which will boot up everything concurrently:

```bash
composer run dev
```

This spins up the Laravel backend, Vite frontend tooling, and necessary queue workers. The application will be accessible at `http://localhost:8000`.

## 🧪 Testing and Linting

This project uses PHPUnit for backend tests.

To run tests:
```bash
composer run test
```
Or via specific command:
```bash
php artisan test
```

To run PHP formatters and JS linters:
```bash
composer run lint
npm run lint
```
