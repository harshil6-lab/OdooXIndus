# CoreInventory - Enterprise-Grade Inventory Management Frontend

A premium, production-ready inventory management system (IMS) frontend built with modern React technologies. CoreInventory provides warehouse teams and inventory managers with real-time stock tracking, order management, and comprehensive analytics.

## 🎯 Features

### Dashboard

- **KPI Overview**: Total products, low stock alerts, pending receipts/deliveries
- **Inventory Trends**: Real-time charts showing inventory levels and movement patterns
- **Recent Operations**: Activity feed of latest stock movements
- **Low Stock Alerts**: Immediate visibility of items below reorder levels

### Product Management

- **Product Inventory Table**: Sortable, searchable product catalog
- **Add/Edit Products**: Create and maintain product listings
- **Category Filtering**: Filter products by category
- **SKU Search**: Quick product lookup by SKU code
- **Stock Status Indicators**: Visual stock level indicators

### Operations Management

#### Receipts

- Manage incoming goods from suppliers
- Receipt validation and verification
- Tracking of received quantities

#### Delivery Orders

- Create and manage outgoing shipments
- Multi-stage workflow: Pick → Pack → Ship → Deliver
- Order tracking and status updates

#### Internal Transfers

- Move stock between warehouse locations
- Track inter-warehouse movements
- Transfer validation

#### Inventory Adjustments

- Handle physical count discrepancies
- Record stock corrections
- Approval workflow

### Analytics & Reporting

- **Move History**: Complete audit trail of all stock movements
- **Warehouse Analytics**: Capacity utilization and metrics
- **Customizable Reports**: Chart data with Recharts integration

### Warehouse Management

- Multi-warehouse support
- Capacity tracking and utilization metrics
- Temperature/humidity monitoring (optional)
- Warehouse location management

### Additional Features

- **Settings**: Configuration for inventory rules, reorder levels, low stock alerts
- **Profile**: User account management and preferences
- **Command Palette**: Global command search (Ctrl/Cmd + K)
- **Dark/Light Mode**: Theme switching with persistence
- **Responsive Design**: Full mobile and tablet support
- **Real-time Search**: Global search across products, orders, and operations

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Custom ShadCN UI components
- **Styling**: TailwindCSS with custom design tokens
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge for className management

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Dialog, etc.)
│   ├── layout/          # Layout components (Sidebar, Navbar, Layout wrapper)
│   └── common/          # Common components (CommandPalette, etc.)
├── pages/               # Page components (Dashboard, Products, etc.)
├── stores/              # Zustand stores (appStore, inventoryStore)
├── contexts/            # React contexts (ThemeContext)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions (cn for className merging)
├── constants/           # Application constants
├── types/               # TypeScript type definitions
├── services/            # API services (placeholder)
├── assets/              # Static assets
├── App.tsx              # Main app component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern browser with ES2020 support

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (`hsl(217, 91.2%, 59.8%)`)
- **Secondary**: Dark Blue (`hsl(217, 32.6%, 17.5%)`)
- **Destructive**: Red (for alerts/deletions)
- **Success**: Green (for completed operations)
- **Warning**: Yellow (for low stock/alerts)
- **Info**: Blue (for informational alerts)

### Spacing & Typography

- Base spacing unit: 0.25rem (4px)
- Responsive typography scale
- Professional font weights (400, 500, 600, 700)

### Components Library

- **Button**: Primary, secondary, destructive, ghost, outline variants
- **Card**: Soft shadow design, rounded corners
- **Badge**: Status indicators with multiple color variants
- **Dialog**: Modal dialogs for forms and confirmations
- **Table**: Responsive data tables with hover effects
- **Input**: Accessible form inputs with validation
- **Select**: Dropdown menus
- **DropdownMenu**: Context menus and user actions
- **Tabs**: Tab navigation
- **Skeleton**: Loading state placeholders

## 📊 Key Pages

| Page               | Purpose               | Features                        |
| ------------------ | --------------------- | ------------------------------- |
| Dashboard          | Main overview         | KPIs, charts, alerts            |
| Products           | Inventory catalog     | Search, filter, add/edit/delete |
| Receipts           | Incoming goods        | Create, track, verify           |
| Delivery Orders    | Outgoing shipments    | Multi-stage workflow            |
| Internal Transfers | Inter-warehouse moves | Track movements                 |
| Adjustments        | Stock corrections     | Physical count management       |
| Move History       | Audit trail           | Complete operation history      |
| Warehouses         | Location management   | Capacity, monitoring            |
| Settings           | System configuration  | Rules, alerts, preferences      |
| Profile            | User management       | Account, preferences            |

## 🎮 Keyboard Shortcuts

| Shortcut       | Action                      |
| -------------- | --------------------------- |
| `Ctrl/Cmd + K` | Open Command Palette        |
| `Esc`          | Close modals/dialogs        |
| `↑/↓`          | Navigate in Command Palette |
| `Enter`        | Select in Command Palette   |

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+
- **Large Desktop**: 1280px+

## 🔐 Authentication & Authorization

The frontend is structured to integrate with authentication systems. Currently uses mock data. To add authentication:

1. Update `src/services/` with API integration
2. Add auth provider in `src/contexts/`
3. Implement protected routes with React Router
4. Add JWT token management

## 🔄 State Management

### App Store (Zustand)

Manages global UI state:

- Sidebar open/close
- Search visibility
- Command palette state
- Modal states
- User preferences

### Inventory Store (Zustand)

Manages business data:

- Products
- Receipts
- Delivery Orders
- Transfers
- Adjustments
- Movements
- Warehouses

## 🎯 Best Practices

### Performance

- Code splitting for large views
- Lazy loading of routes
- Optimized re-renders with React hooks
- Efficient state updates with Zustand

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios

### Code Quality

- TypeScript for type safety
- ESLint configuration
- Consistent naming conventions
- Component composition patterns

## 🚀 Deployment

### Vite Optimizations

- Automatic code splitting
- CSS minification
- Tree-shaking of unused code
- Chunk hashing for caching

### Production Checklist

- [ ] Build successfully: `npm run build`
- [ ] No console errors in production
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] API endpoints configured
- [ ] Error tracking setup
- [ ] Analytics integrated
- [ ] SEO metadata added

## 📈 Future Enhancements

- [ ] Real API integration
- [ ] User authentication & authorization
- [ ] Advanced reporting & exports
- [ ] Bulk operations
- [ ] Barcode/QR code scanning
- [ ] Mobile app variant
- [ ] Offline support
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering & sorting
- [ ] Custom dashboard widgets
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1 AA)

## 🐛 Common Issues

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
# Specify different port
npm run dev -- --port 3000
```

### TypeScript Errors

```bash
# Generate declarations
npm run build
```

## 📞 Support

For issues or feature requests, please create an issue in the repository.

## 📄 License

[Add your license here]

## 👥 Contributors

Built with React + TypeScript + Tailwind CSS + Framer Motion

---

**Last Updated**: 2026-03-14

Made with ❤️ for enterprise inventory management
