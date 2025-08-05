# Black Market

This monorepo contains a demo application showcasing Futureverse SDKs and tools for asset management and trading. The main application is a React Vite-based "Black Market" that demonstrates asset registration, viewing, and trading capabilities.

## Project Structure

- **`apps/black-market/`** - Main React Vite application
- **`libs/ui-shared/`** - Shared UI components library
- **`tools/`** - Development and utility scripts

## Features

The Black Market application demonstrates:

- **Asset Management**: View and manage digital assets using Futureverse Asset Register
- **Authentication**: Integration with Futureverse Auth for user authentication
- **Asset Trading**: Interactive asset viewing and trading interface
- **Game Integration**: Connect with game servers for asset synchronization
- **Transaction Management**: Real-time transaction details and gas estimation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the `apps/black-market/` directory with the following variables:

```env
VITE_COLLECTION_CHARACTER_ID=your_character_collection_id
VITE_COLLECTION_EQUIPMENT_ID=your_equipment_collection_id
VITE_COLLECTION_STONE_ID=your_stone_collection_id
VITE_PUBLIC_KEY=your_public_key
VITE_GAME_SERVER_URL=your_game_server_url
```

### Development

**Start the development server:**

```bash
npm run vite
```

**Build for production:**

```bash
npm run build
```

## Available Scripts

- `npm run vite` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code quality checks

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Framework**: Custom components with shared library
- **Blockchain**: Futureverse SDK integration
- **Authentication**: Futureverse Auth
- **Asset Management**: Futureverse Asset Register

## Architecture

The application uses a monorepo structure with Nx for efficient development:

- **Apps**: Contains the main black-market application
- **Libs**: Shared UI components and utilities
- **Tools**: Development utilities and scripts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
