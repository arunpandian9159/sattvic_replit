# Sattvic Foods Delivery App

A full-stack food delivery application built with React, TypeScript, Express.js, and Supabase.

## Features

- Meal Plan Management
- Customer Management  
- Order Tracking
- Responsive Design
- Type Safety with TypeScript

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Query, Supabase
**Backend:** Express.js 5, TypeScript, Zod validation, CORS

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file in `client/` directory:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start development: `npm run dev`

### Build
```bash
npm run build
```

## Project Structure

```
sattvic_replit/
├── client/          # Frontend React app
├── server/          # Backend Express app  
├── shared/          # Shared types/schemas
├── attached_assets/ # Static assets
└── dist/           # Build output
```

## API Endpoints

- `GET /api/meal-plans` - Get all meal plans
- `GET /api/customers` - Get all customers
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

## Development

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run build:client` - Build frontend only
- `npm run build:server` - Build backend only

## 🚀 Features

- **Meal Plan Management**: Browse and order vegetarian meal plans
- **Customer Management**: User registration and profile management
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Modern UI with mobile-first approach
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for state management
- **Supabase** for authentication and database

### Backend
- **Express.js 5** with TypeScript
- **In-memory storage** (can be extended to database)
- **Zod** for data validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
sattvic_replit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── main.tsx       # Application entry point
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Backend Express.js application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
├── attached_assets/       # Static assets (images)
└── dist/                  # Build output
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sattvic_replit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (Vite) and backend (Express) servers.

### Build for Production

```bash
npm run build
```

This builds both the client and server applications.

## 📚 API Endpoints

### Meal Plans
- `GET /api/meal-plans` - Get all meal plans
- `GET /api/meal-plans/:id` - Get meal plan by ID
- `POST /api/meal-plans` - Create new meal plan

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders?customerId=:id` - Get orders by customer
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run build:client` - Build only frontend
- `npm run build:server` - Build only backend

### TypeScript Configuration

- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.server.json` - Server-specific configuration

## 🎨 UI Components

The application uses a component-based architecture with:

- **Header**: Navigation and user authentication
- **TopNavigation**: Main navigation menu
- **FoodImage**: Image display component
- **ErrorBoundary**: Error handling wrapper
- **Loading**: Loading state component

## 🔐 Authentication

Authentication is handled through Supabase Auth with:

- Email/password registration and login
- Protected routes
- User context management

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS, ensuring a great experience across all devices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Real-time order tracking
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Multi-language support 