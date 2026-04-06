# Viewing Vortex

Viewing Vortex is a modern web application for discovering random movies, TV shows, and books. It serves as a full rewrite of the original "MediaCurator" app, featuring a sleek, dynamic UI tailored to help you find your next great watch or read.

**[Looking for the classic experience? → Legacy App](/legacy/index.html)**

## 🚀 Tech Stack

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v3 + CSS Variables
- **State**: Zustand (with localStorage persistence)
- **Data Fetching**: TanStack Query v5
- **Routing**: React Router v6 (Hash-based sharing)
- **Animation**: Framer Motion
- **Additional Tools**: Lucide React (Icons), Recharts (Stats Dashboard), html2canvas (Image Sharing), Vite PWA.

## ✨ Features

1. **Random Discovery**: Discover media across three distinct categories: Movies, TV Shows, and Books.
2. **Advanced Filtering**: Use debounced smart filters like Year Sliders, Genre Pills, and Ratings to refine your picks.
3. **Vortex Mode (Mood Picker)**: Don't know what you want? Pick a mood (e.g. Action, Mind-Bending, Romance) and let the app randomly fetch a highly-rated title matching that vibe!
4. **Streaming Availability**: View where to Stream, Rent, or Buy for your specified region.
5. **My Collection (Favorites & Watched)**: Save your favorites or mark them as watched. Include personal star ratings and notes!
6. **Detailed Media Cards**: Browse cast strips, similar title rails, YouTube trailers, collection badges, and beautifully blurred gradient backdrops.
7. **Stats Dashboard**: Analyze your viewing patterns with visual breakdowns of your saves using `Recharts`.
8. **Export / Import**: Easily download your Watchlist as JSON and move it across devices.
9. **Global Keyboard Shortcuts**: E.g. Press `Space` to roll again, `S` to Save, `W` to mark Watched, `T` to toggle themes, `/` to search.
10. **Rich Sharing**: Effortlessly generate a PNG card of your media or instantly copy a smart deep-link to share with friends.
11. **PWA Support**: Installable offline-capable app with caching via Workbox plugin.

## 🛠 Setup Instructions

1. **Prerequisites**: Node.js v18+ and npm.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
4. **Run Unit Tests**:
   ```bash
   npm test
   ```

*Enjoy exploring the Vortex!*
