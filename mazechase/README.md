# 🎮 Wordwall Maze Chase

A fun interactive maze game where players navigate through a dynamically generated maze to collect letters and spell target words.

## Features

- **Dynamic Maze Generation** - Each game generates a unique maze layout
- **Customizable Words** - Set any target word (up to 10 characters) to spell
- **Score Tracking** - Earn points for each letter collected
- **Smooth Controls** - Use arrow keys (↑↓←→) or WASD to navigate
- **Responsive Design** - Works on desktop and tablet sizes
- **Real-time Display** - Track target word, collected letters, and score

## How to Play

1. **Enter a Target Word** - Type any word in the input field (default: "HELLO")
2. **Click "Set Word"** - The maze regenerates with letters scattered throughout
3. **Navigate the Maze** - Use arrow keys or WASD to move your purple character
4. **Collect Letters** - Touch each letter to collect it in order
5. **Win the Game** - Collect all letters in sequence to win!

## Project Structure

```
mazechase/
├── index.html       # Main HTML file
├── styles.css       # Game styling
├── game.js          # Game logic and canvas rendering
└── mazechase.html   # Original single-file version (legacy)
```

## Running the Game

### Option 1: Open Directly
Simply open `index.html` in any modern web browser:
```bash
Double-click index.html
```

### Option 2: Local Server (Recommended)
For better performance and to avoid potential CORS issues:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js (npx):**
```bash
npx http-server
```

Then navigate to `http://localhost:8000`

### Option 3: Using Live Server
If you have the VS Code Live Server extension:
- Right-click `index.html`
- Select "Open with Live Server"

## Technology Stack

- **HTML5** - Structure and canvas API
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Game logic and interactivity

## Game Mechanics

- **Canvas Size**: Dynamically adjusts to fit window (40px tiles)
- **Maze Dimensions**: 12 columns × 10 rows (adjustable)
- **Collision Detection**: Check against walls and letter positions
- **Win Condition**: Collect all letters in the correct order

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Runs at 60 FPS using requestAnimationFrame
- Optimized canvas rendering
- Minimal memory footprint

## Customization

### Change Default Word
Edit `game.js` line 13:
```javascript
targetWord: 'HELLO',  // Change to your word
```

### Adjust Tile Size
Edit `game.js` line 6:
```javascript
const TILE_SIZE = 40;  // Larger = bigger maze
```

### Modify Colors
Edit `styles.css` to change theme colors:
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (dark purple)

## Future Enhancements

- [ ] Multiple difficulty levels
- [ ] Leaderboard/high scores
- [ ] Timed challenges
- [ ] Mobile touch controls
- [ ] Sound effects
- [ ] Multiplayer mode
- [ ] Power-ups

## License

Free to use and modify.

## Author

Created as an interactive learning game inspired by Wordwall.

---

Enjoy the game! 🎉
