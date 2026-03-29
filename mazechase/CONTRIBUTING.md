# Contributing

## Development Setup

### Prerequisites
- A modern web browser
- Optional: Node.js 14+ for local server

### Quick Start

1. **Clone or download the repository**
2. **Open the project folder in your editor**
3. **Start a local server** (recommended):
   ```bash
   npm start
   ```
   Or manually:
   ```bash
   python -m http.server 8000
   ```
4. **Navigate to localhost:8000** in your browser

## Project Structure

- `index.html` - Main entry point (links to CSS/JS)
- `styles.css` - All styling and layout
- `game.js` - Game logic, canvas rendering, and controls
- `mazechase.html` - Legacy single-file version (for reference)

## Making Changes

### Adding Features

1. **Game Logic** - Edit `game.js`
   - Add new functions for game mechanics
   - Update `gameState` for new variables
   - Modify `gameLoop()` if needed

2. **Styling** - Edit `styles.css`
   - Update colors, sizes, or layouts
   - Keep responsive design in mind

3. **HTML Structure** - Edit `index.html`
   - Add new UI elements carefully
   - Ensure IDs match JavaScript references

### Testing

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test at different window sizes (responsive)
- Verify game controls work smoothly
- Check for console errors (F12)

## Code Style

- Use descriptive variable names
- Add comments for complex logic
- Keep functions focused and modular
- Maintain consistent indentation (4 spaces)

## Common Customizations

### Change Game Colors
Find and update these in `styles.css`:
- `#667eea` - Primary purple
- `#764ba2` - Dark purple
- `#27ae60` - Green (collected letters)

### Adjust Difficulty
In `game.js`:
- Change `TILE_SIZE` for larger/smaller tiles
- Modify `MAZE_HEIGHT` and `MAZE_WIDTH` for maze size
- Adjust point values in `checkLetterCollision()`

### Add Sound Effects
You can integrate Web Audio API in `game.js`:
```javascript
const audio = new Audio('sound.mp3');
audio.play();
```

## Performance Tips

- Keep requestAnimationFrame clean
- Avoid heavy DOM manipulation in game loop
- Use canvas for rendering (not DOM elements)
- Minimize re-draws when possible

## Troubleshooting

**Game won't load:**
- Check browser console (F12) for errors
- Ensure all files are in same directory
- Try opening with a local server

**Mouse cursor hidden:**
- This is intentional (`cursor: none;` in CSS)
- Remove from `styles.css` if not desired

**Lag/Performance issues:**
- Reduce `TILE_SIZE` value
- Check browser extensions consuming CPU
- Try in a different browser

## Deployment

1. **GitHub Pages** (free)
   - Push to `gh-pages` branch
   - Enable Pages in repository settings

2. **Netlify** (free)
   - Connect GitHub repository
   - Deploy with one click

3. **Vercel** (free)
   - Similar to Netlify
   - Exceptional performance

4. **Static Host** (paid)
   - Upload all files to any web host
   - No server required

## Questions or Ideas?

Feel free to open an issue or create a pull request with improvements!
