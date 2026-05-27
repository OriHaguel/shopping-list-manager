# Shopping List Manager

A modern, responsive web application for managing shopping lists with smart categorization, voice input, expense tracking, and list sharing capabilities. Works seamlessly on desktop, laptop, tablets, and mobile devices.

## 🎯 Features

### List Management
- **Create Lists** - Create multiple shopping lists for different purposes
- **Share Lists** - Share your lists with others via email
- **Rename Lists** - Update list names anytime
- **Delete Lists** - Remove lists you no longer need

### Smart Item Management
- **Auto-Categorization** - Items are automatically placed in their correct category (e.g., Milk → Dairy)
- **Edit Items** - Modify item properties including:
  - Item name
  - Quantity/Amount
  - Price per unit
  - Category
  - Custom category assignment
- **Custom Categories** - Create your own custom categories for items

### Voice Input
- **Speech-to-Text** - Add items using your voice
- **Batch Input** - Say multiple items (e.g., "banana and apples") to create multiple list items at once

### Expense Tracking
- **Purchase Tracking** - Track how much money you spent on items you've already bought
- **Budget Estimation** - See the estimated total cost of items you plan to buy
- **Expense Overview** - Monitor your spending and budget planning

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org) - React framework with App Router
- [React Query](https://tanstack.com/query/latest) - Server state management
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [SCSS Modules](https://sass-lang.com) - Scoped styling

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 💻 Desktop computers
- 💻 Laptops
- 📱 Tablets
- 📱 Mobile phones

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── services/         # API service layer
├── lib/              # Utilities and helpers
├── styles/           # Global styles and SCSS setup
├── types/            # TypeScript type definitions
├── lan/              # Internationalization (i18n)
└── utils/            # Utility functions
```

## 🌐 Internationalization

The application supports multiple languages including English and Hebrew with full RTL support.
