# Tidodevs Portfolio Website

A modern, interactive portfolio website built with Next.js, Three.js, and React Three Fiber. Features a stunning 3D particle background and smooth animations.

## Features

- 🎨 **Modern Design**: Corporate, minimalist aesthetic inspired by BCDApps.io
- 🎭 **3D Particle Background**: Interactive Three.js particle system with animated shapes
- 📱 **Fully Responsive**: Optimized for all device sizes
- ⚡ **Performance**: Built with Next.js 14 for optimal performance
- 🎬 **Smooth Animations**: Framer Motion animations throughout
- 🎯 **Single Page Architecture**: Smooth scrolling navigation

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── ParticleBackground.tsx  # 3D particle system
│   ├── Navigation.tsx           # Sticky navigation
│   ├── Hero.tsx                # Hero section
│   ├── Partners.tsx            # Partners section
│   ├── Projects.tsx            # Projects showcase
│   ├── Services.tsx            # Services grid
│   └── Footer.tsx              # Footer & contact
└── requirement.md              # Project specification
```

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:
- `navy`: #0F172A (Deep navy blue)
- `offWhite`: #F9F9F9 (Off-white background)
- `electricBlue`: #3B82F6 (Electric blue accent)
- `teal`: #14B8A6 (Teal accent)

### Particle Settings

Edit `components/ParticleBackground.tsx`:
- `count`: Number of particles (default: 2000)
- Particle colors and shapes
- Animation speed and patterns

## Deployment

The site can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any Node.js hosting platform

## License

© 2024 Tidodevs. All rights reserved.
