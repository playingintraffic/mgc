# MGC React UI - Development Guide

This is the React-based UI for the MGC (Minigame Collection) FiveM resource.

## Features

- **20 Complete Minigames** ported from vanilla JavaScript to React + TypeScript
- **Development Mode** for testing games in browser without FiveM
- **Modern Stack**: React 18, TypeScript, Vite
- **FiveM Compatible**: Builds production bundle for FiveM NUI
- **Hot Reload**: Fast development with Vite's HMR

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- A modern web browser for testing

### Installation

```bash
cd ui-react
npm install
```

### Development Mode

To test and develop games in your browser:

```bash
npm run dev
```

This will start a development server at `http://localhost:3000` with:
- **Dev Panel**: A side panel on the right showing all 20 games
- **Hot Reload**: Changes reflect instantly
- **Browser Testing**: No need for FiveM to test UI and game logic

Click any game in the dev panel to test it!

### Building for Production

To build the optimized bundle for FiveM:

```bash
npm run build
```

This creates the production files in `../ui-dist/` directory.

## Project Structure

```
ui-react/
├── src/
│   ├── components/      # Shared React components
│   │   ├── GameContainer.tsx
│   │   ├── ResultScreen.tsx
│   │   └── DevPanel.tsx
│   ├── games/          # All 20 game components
│   │   ├── SkillBar.tsx
│   │   ├── SafeCrack.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useTimer.ts
│   │   └── useKeyPress.ts
│   ├── utils/          # Utility functions
│   │   ├── nui.ts      # FiveM NUI communication
│   │   ├── audio.ts    # Audio management
│   │   └── wordlists.ts
│   ├── types/          # TypeScript definitions
│   ├── styles/         # CSS files
│   │   ├── games/      # Game-specific styles
│   │   └── themes/     # Theme variables
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/
│   └── assets/         # Static assets (audio, fonts, images)
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── package.json
```

## Games Included

### Logic Games
1. **Anagram** - Unscramble words
2. **Tile Shift** - Sliding puzzle
3. **Bit Flip** - Binary sequence matching
4. **Circuit Trace** - Trace circuit paths

### Reflex Games
5. **Whack Flash** - React to flashing targets
6. **Button Mash** - Rapid key tapping
7. **Key Drop** - Catch falling letters
8. **Code Drop** - Catch falling codes

### Timing Games
9. **Skill Bar** - Stop icon in target zone
10. **Skill Circle** - Rotating circle timing
11. **Pulse Sync** - Sync to pulse rhythm
12. **Signal Wave** - Match wave patterns

### Puzzle Games
13. **Chip Hack** - Find hidden chips
14. **Pattern Lock** - Draw dot patterns
15. **Safe Crack** - Align safe tumblers
16. **Pincode** - Enter PIN code

### Special Games
17. **Wire Cut** - Cut the correct wire
18. **Packet Snatch** - Catch valid packets
19. **Frequency Jam** - Tune frequencies
20. **Hangman** - Classic word game

## Development Tips

### Adding a New Game

1. Create game component in `src/games/YourGame.tsx`
2. Add game type to `src/types/index.ts`
3. Create CSS file in `src/styles/games/YourGame.css`
4. Register in `src/App.tsx` gameComponents map

### NUI Communication

The app automatically handles FiveM NUI messages:

```typescript
// FiveM sends this message to start a game
{
  action: "start_minigame",
  game: "skill_bar",
  data: { /* game config */ }
}

// App sends this back when game ends
{
  success: true/false,
  game: "skill_bar"
}
```

### Environment Detection

The app automatically detects if running in:
- **Browser**: Shows dev panel, mocks NUI calls
- **FiveM**: Hides dev panel, uses real NUI communication

## Building and Deploying

After building with `npm run build`:

1. The `../ui-dist/` folder contains the compiled UI
2. Update `fxmanifest.lua` to point to the new UI location
3. Restart the FiveM resource

## Troubleshooting

### Assets not loading?
- Check that `public/assets/` contains audio, fonts, and images
- Verify paths use `./assets/` prefix

### Games not responding to keys?
- Make sure the game container has focus
- Check browser console for errors

### Build errors?
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

## Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and dev server
- **ESLint** - Code linting
- **CSS Variables** - Theming support

## License

MIT License - Same as parent MGC project

## Support

For issues or questions, refer to the main MGC documentation in `/docs/`
