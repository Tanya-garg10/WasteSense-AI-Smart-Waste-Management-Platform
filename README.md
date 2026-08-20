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

## Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Deploy to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Groq API key from https://console.groq.com/

### Quick Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy: `Y`
   - Project name: `wastesense-ai` (or your preferred name)
   - Link to existing project: `N`
   - Override settings: `N`

5. Add environment variables in Vercel dashboard:
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add:
     - `GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: `production`

6. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `Tanya-garg10/WasteSense-AI-Smart-Waste-Management-Platform`
4. Configure:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `NODE_ENV`: `production`
6. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

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
