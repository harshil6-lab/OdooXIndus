# CoreInventory

CoreInventory is a real-time inventory management platform that helps businesses track products, warehouses, stock movements, and receipts through a modern dashboard interface. Built as a hackathon project, it demonstrates a production-ready full-stack approach to inventory operations using a lean, performant tech stack.

---

## ✨ Features

- **OTP Authentication** — Passwordless login via Supabase Auth
- **Inventory Dashboard** — KPI cards, low-stock alerts, and activity feed
- **Product Management** — Add, edit, and search products with category filtering
- **Warehouse Management** — Create and manage multiple warehouse locations
- **Receipt Generation** — Log incoming stock with receipt records
- **Delivery Orders** — Track and manage outgoing shipments
- **Stock Transfers** — Move stock between warehouses with full audit trail
- **Inventory Adjustments** — Manually correct stock levels with reason tracking
- **Move History** — Complete stock ledger with chronological movement log
- **Account & Profile Settings** — User profile management backed by Supabase
- **Real-time Database** — All data persisted and synced via Supabase PostgreSQL

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                    |
| --------------- | -------------------------- |
| React 18        | UI component library       |
| Vite            | Build tool and dev server  |
| TypeScript      | Type-safe JavaScript       |
| TailwindCSS     | Utility-first styling      |
| Framer Motion   | Animations and transitions |
| React Router v6 | Client-side routing        |

### Backend

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Supabase           | Backend-as-a-Service platform |
| PostgreSQL         | Relational database           |
| Supabase Auth      | OTP / email authentication    |
| Row Level Security | Per-user data isolation       |

### Deployment

| Platform | Purpose          |
| -------- | ---------------- |
| Vercel   | Frontend hosting |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI primitives (Button, Card, Input, Dialog, etc.)
│   ├── layout/      # App shell (Sidebar, Navbar, Layout wrapper)
│   └── common/      # Shared components (CommandPalette)
├── pages/           # Route-level page components
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Receipts.tsx
│   ├── DeliveryOrders.tsx
│   ├── InternalTransfers.tsx
│   ├── InventoryAdjustments.tsx
│   ├── MoveHistory.tsx
│   ├── Warehouses.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
├── hooks/           # Custom React hooks (useAuthUser, useInventory, etc.)
├── services/        # Supabase API service modules
├── stores/          # Zustand global state stores
├── types/           # TypeScript interfaces and types
├── contexts/        # React context providers (ThemeContext)
├── utils/           # Utility functions (cn for className merging)
└── assets/          # Fonts, icons, images
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the Repository

```bash
git clone <repo-url>
cd coreinventory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Database Migrations

Execute the migration files in your Supabase SQL editor in order:

```
supabase/migrations/001_ensure_schema.sql
supabase/migrations/002_fix_rls_and_required_ids.sql
supabase/migrations/003_add_query_indexes.sql
```

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 6. Build for Production

```bash
npm run build
```

---

## 🗄️ Database

The database is fully managed through Supabase (PostgreSQL). Row Level Security (RLS) ensures every user can only access their own data.

### Main Tables

| Table            | Description                                |
| ---------------- | ------------------------------------------ |
| `profiles`       | User profile data linked to auth.users     |
| `products`       | Product catalog with SKU, category, stock  |
| `warehouses`     | Warehouse locations and metadata           |
| `receipts`       | Incoming goods and purchase records        |
| `deliveries`     | Outgoing shipment orders                   |
| `transfers`      | Internal stock movement between warehouses |
| `adjustments`    | Manual inventory correction records        |
| `stock_ledger`   | Append-only log of all stock movements     |
| `product_stocks` | Per-warehouse stock levels per product     |

---

## 🔐 Authentication

CoreInventory uses **Supabase OTP authentication** — no passwords required.

1. Enter your email address on the login page.
2. Receive a one-time passcode to your inbox.
3. Enter the OTP to authenticate and access the dashboard.

Sessions are managed automatically via `supabase.auth.onAuthStateChange`.

---

## 🎮 Demo Workflow

1. **Login** — Enter email, receive OTP, authenticate.
2. **Add Products** — Navigate to Products → Add a product with SKU and category.
3. **Create Warehouses** — Navigate to Warehouses → Add warehouse locations.
4. **Generate Receipts** — Navigate to Receipts → Log incoming stock from a supplier.
5. **Transfer Stock** — Navigate to Internal Transfers → Move stock between warehouses.
6. **Adjust Inventory** — Navigate to Adjustments → Correct stock counts as needed.
7. **Review History** — Navigate to Move History → View the complete audit trail.

---

## 🏆 Hackathon Context

CoreInventory was built for a hackathon with a focus on solving real inventory management challenges faced by small-to-medium businesses. The emphasis was on:

- **Real-time data operations** using Supabase PostgreSQL
- **Clean, accessible UI** without sacrificing functionality
- **Secure multi-user isolation** via Row Level Security
- **Performance** — bounded queries, client-side caching, and database indexes

---

## 🔮 Future Improvements

- [ ] AI-powered inventory insights and demand forecasting
- [ ] Advanced analytics dashboard with export to CSV/PDF
- [ ] Supplier management module
- [ ] Barcode / QR code scanning support
- [ ] Mobile app (React Native)
- [ ] Low-stock automated email alerts
- [ ] Multi-language / internationalization support
- [ ] Role-based access control (admin, staff, read-only)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with React · Vite · TypeScript · TailwindCSS · Supabase
