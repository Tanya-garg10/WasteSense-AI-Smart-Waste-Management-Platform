# WasteSense AI

AI-powered waste management and sustainability tracking application built with React, TypeScript, and Groq AI.

## Features

- 🤖 AI-powered waste analysis and recommendations
- 📊 Real-time waste tracking and analytics
- 🎯 Sustainability goal setting and monitoring
- 📱 Responsive web interface
- 🔄 Interactive data visualization

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **AI Integration:** Groq AI (groq-sdk)
- **Visualization:** Recharts
- **Build Tool:** Vite
- **Animations:** Motion

## Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Groq API Key (get it from https://console.groq.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wastesense-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Then add your Groq API key to `.env.local`:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run vercel-build` - Build for Vercel deployment
- `npm start` - Start production server
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## Project Structure

```
wastesense-ai/
├── src/          # React source code
├── assets/       # Static assets
├── server.ts     # Express server
├── index.html    # HTML entry point
├── vercel.json   # Vercel deployment configuration
├── .vercelignore # Vercel ignore file
└── package.json  # Project configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
