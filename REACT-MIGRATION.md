# React UI Migration Guide

## Overview

The MGC UI has been completely rebuilt in React + TypeScript while maintaining 100% feature parity with the original vanilla JavaScript implementation.

## What Changed

### Technology Stack

**Before:**
- Vanilla JavaScript (ES6)
- jQuery for DOM manipulation
- Manual module loading
- Individual CSS files

**After:**
- React 18 with TypeScript
- Modern hooks-based architecture
- Vite for bundling and dev server
- CSS with theme variables
- Path aliases for clean imports

### File Structure

```
OLD: /ui/
├── index.html
├── js/
│   ├── app.js
│   └── games/*.js (20 files)
├── css/
│   ├── style.css
│   ├── games/*.css (20 files)
│   └── themes/default.css
└── assets/

NEW: /ui-react/
├── src/
│   ├── components/      # Reusable React components
│   ├── games/          # 20 game components (*.tsx)
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utilities (NUI, audio, etc.)
│   ├── types/          # TypeScript definitions
│   └── styles/         # CSS (organized)
├── public/assets/      # Static assets
└── Build Output: ../ui-dist/
```

## Features Maintained

✅ All 20 games work identically to original
✅ Same NUI communication protocol
✅ Same audio system
✅ Same visual design and themes
✅ Same game mechanics and difficulty
✅ Same export API for Lua

## New Features

### Development Mode

The React version includes a **built-in development panel** for testing:

```bash
cd ui-react
npm run dev
```

- Opens browser at http://localhost:3000
- Side panel with all 20 games
- Click to test any game instantly
- No FiveM needed for UI development
- Hot Module Replacement (HMR)

### TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE autocomplete
- **Refactoring**: Safer code changes
- **Documentation**: Self-documenting types

### Modern React Patterns

- **Hooks**: useTimer, useKeyPress for game logic
- **Component Reusability**: GameContainer, ResultScreen
- **Clean Separation**: UI, logic, and state management
- **Performance**: Optimized re-renders

## Using the React UI

### Option 1: Switch to React UI (Recommended)

1. Backup current fxmanifest.lua:
   ```bash
   cp fxmanifest.lua fxmanifest-old.lua
   ```

2. Use React manifest:
   ```bash
   cp fxmanifest-react.lua fxmanifest.lua
   ```

3. Restart resource:
   ```
   restart mgc
   ```

### Option 2: Keep Both UIs

The old UI still works! Both are included:
- `ui/` - Original vanilla JS (use `fxmanifest.lua`)
- `ui-dist/` - New React build (use `fxmanifest-react.lua`)

## Development Workflow

### Making Changes to UI

1. Navigate to React project:
   ```bash
   cd ui-react
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Edit files in `src/`
   - Changes auto-reload in browser
   - Test games using dev panel

4. Build for production:
   ```bash
   npm run build
   ```

5. Output goes to `../ui-dist/`

6. Restart FiveM resource to see changes

### Adding a New Game

1. Create `src/games/MyGame.tsx`
2. Add types to `src/types/index.ts`
3. Create `src/styles/games/MyGame.css`
4. Register in `src/App.tsx`
5. Update Lua exports if needed

## Migration Notes

### NUI Communication

The React UI uses the same NUI protocol:

```typescript
// Lua -> React
{
  action: "start_minigame",
  game: "skill_bar",
  data: { /* config */ }
}

// React -> Lua
{
  success: true/false,
  game: "skill_bar"
}
```

No changes needed to Lua code!

### Game Data Structure

All game configurations remain identical:

```lua
-- Still works the same
exports.mgc:start_game({
    game = "skill_bar",
    icon = "fa-solid fa-fish",
    area_size = 20,
    speed = 1.0
}, function(result)
    print(result.success)
end)
```

### Asset Paths

Assets moved from `ui/assets/` to `ui-react/public/assets/` during build, but paths in code remain `./assets/`

## Performance

**Build Size:**
- **Old UI**: ~200KB (unminified)
- **New UI**: ~183KB (minified + gzipped)

**Load Time:**
- Comparable or faster due to modern bundling
- Single JS bundle vs multiple files

## Troubleshooting

### Build Errors

```bash
cd ui-react
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Games Not Showing

1. Check browser console (F12)
2. Verify `ui-dist/` folder exists
3. Check `fxmanifest.lua` points to `ui-dist/`
4. Restart resource completely

### Development Mode Not Working

```bash
cd ui-react
npm install
npm run dev
```

Ensure port 3000 is available.

## Rollback to Old UI

If needed, revert to vanilla JS UI:

```bash
cp fxmanifest-old.lua fxmanifest.lua
restart mgc
```

The old `ui/` folder is untouched and still works.

## Support

- **React UI Issues**: Check `ui-react/README.md`
- **Game Issues**: Check `docs/game_settings.md`
- **General**: Check `README.md`

## Future Enhancements

The React architecture enables:
- [ ] Multiple themes (easy with CSS variables)
- [ ] Game difficulty presets
- [ ] Accessibility features
- [ ] Mobile/tablet support
- [ ] Custom game variants
- [ ] Animated transitions
- [ ] Sound volume controls
- [ ] Keyboard shortcuts panel

## Conclusion

The React migration provides a modern, maintainable codebase while keeping 100% compatibility with existing implementations. Both UIs work, giving you flexibility in deployment.

Happy gaming! 🎮
