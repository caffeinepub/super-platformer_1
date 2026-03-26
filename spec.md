# Super Platformer

## Current State
New project. No existing application code.

## Requested Changes (Diff)

### Add
- A fully playable Mario-style 2D side-scrolling platformer game in the browser
- Player character with run, jump, and collision physics
- Multiple platforms at varying heights
- Collectible coins that increment a score counter
- Moving enemy characters (Goomba-style) that kill the player on contact
- Lives system (3 lives, lose one on enemy hit or falling off screen)
- Score display, lives display, and coin count HUD
- Level progression - one looping level with increasing difficulty
- Game states: title screen, playing, game over
- Keyboard controls: Arrow keys / WASD to move, Space/Up to jump
- Landing page with game instructions, featured levels section, and leaderboard
- Retro pixel-art aesthetic with bright colors

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Minimal backend - just a leaderboard actor to store top scores
2. Frontend: Canvas-based game engine with requestAnimationFrame loop
3. Player entity: position, velocity, gravity, jump, collision detection
4. Platform entities: static rectangles the player lands on
5. Coin entities: collectibles that disappear on contact
6. Enemy entities: moving left/right, reverse on platform edge
7. Game loop: update physics, check collisions, render all entities
8. HUD overlay: score, lives, coins rendered on canvas or DOM overlay
9. Landing page with hero section, how to play, and leaderboard table
10. Game over / restart screen
