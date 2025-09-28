# Vue 3 Guest List Management Application

A modern, responsive guest list management application built with Vue 3, Composition API, and TailwindCSS. This application allows event organizers to manage guest lists with a 20-person capacity limit, featuring real-time validation, loading states, and toast notifications.

## Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Extract the project** to your desired location
2. **Navigate to the project directory**:
   ```bash
   cd recruit-project-vue3
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint for code quality |

## Features

### Core Functionality
- **Guest Management**: Add, edit, and delete guests
- **Capacity Control**: Enforces 20-ticket limit with real-time validation
- **Data Persistence**: Uses localStorage via GuestRepository
- **Responsive Design**: Works seamlessly on mobile and desktop

### User Experience
- **Loading States**: Visual feedback during all operations
- **Toast Notifications**: Success/error messages for user actions
- **Real-time Validation**: Prevents duplicate emails and capacity violations
- **Modal Interface**: Clean add/edit functionality with form validation
- **Smooth Animations**: Transition effects for better UX

### Technical Features
- **Vue 3 Composition API**: Modern reactive programming
- **TypeScript**: Full type safety throughout the application
- **TailwindCSS**: Utility-first styling with responsive design
- **Unit Tests**: Comprehensive test coverage with Vitest
- **Component Architecture**: Modular, reusable components

## Project Structure

```
src/
├── components/           # Vue components
│   ├── GuestList.vue    # Main orchestrator component
│   ├── GuestModal.vue   # Add/Edit guest modal
│   ├── GuestTable.vue   # Guest list table
│   ├── GuestRow.vue     # Individual guest row
│   ├── GuestStats.vue   # Guest count display
│   ├── ActionButtons.vue # Action buttons
│   └── GuestList.spec.ts # Unit tests
├── services/
│   └── guest-repository.ts # Data persistence layer
├── app/
│   ├── app.vue         # Main app component
│   ├── app.ts          # App entry point
│   ├── app.css         # Global styles
│   └── tw.css          # TailwindCSS imports
└── vite-env.d.ts       # TypeScript declarations
```

## Key Components

### GuestList.vue
- Main orchestrator component managing global state
- Handles CRUD operations and validation logic
- Coordinates child components and manages loading states

### GuestModal.vue
- Reusable modal for adding/editing guests
- Real-time form validation (email duplicates, capacity limits)
- Dynamic ticket limits based on current capacity

### GuestRepository
- Data persistence layer using localStorage
- Simulates async operations with realistic delays
- Provides load, save, and reset functionality

## Testing

The application includes comprehensive unit tests:

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run
```

Tests cover:
- Component rendering
- Computed properties
- Capacity validation logic
- CRUD operations
- User interactions

## Styling

Built with TailwindCSS


