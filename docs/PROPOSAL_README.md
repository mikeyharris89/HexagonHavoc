## Hexagon Havoc!

This is a free-for-all battle to be the last one standing. Up to 2-4 players are able to participate in this game. One of seven colors will be picked at random and the players will have a limited amount of time to make it to the platform with the corresponding color. If they don't make it in time, they are out of the game. The board resets, and this repeats until there is one player remaining.

## MVP
- [ ] A 7-Piece board, that can change to be a single piece board.
- [ ] A color displays, the game pauses for a determined amount of time, then changes.
- [ ] Board rests to original position
- [ ] Ability to have 4 players participate. (maybe use two keyboards?)
- [ ] Players get removed from the game unless on designated square
- [ ] Game continues until 1 player remains.


## Wireframes

### First Image
![home_screen]

### Second Image
![start_screen]

### Third Image
![flagged]

### Four Image
![end]

[home_screen]: ./wireframes/home_screen.png
[start_screen]: ./wireframes/start_screen.png
[flagged]: ./wireframes/flagged.png
[end]: ./wireframes/end.png

## Timeline

### Phase 1: Board/Platform
- [ ] Create index.html file to test code
- [ ] Make Canvas Background
- [ ] Create MovingPlatform class
- [ ] Create logic to make platform disappear
- [ ] All platforms disappear except one
- [ ] Create Flag class to display random color.
- [ ] Board changes based on random color flag
- [ ] Board resets to first position
- [ ] Game class to hold moving objects/game logic

### Phase 2: Players

- [ ] create Player class
- [ ] Player can move around board
- [ ] Player can move from platform to platform
- [ ] Player falls off edge
- [ ] Game stops once player has died
- [ ] Allow more then one player on the board
- [ ] Logic to allow collisions
- [ ] Some kind of punch to temporarily disable players?

### Phase 3: Styling

- [ ] Finish fleshing out the theme of the game. Election? Olympics?
- [ ] Flesh out background of Canvas
- [ ] Animate a way to show board is about to change
- [ ] Home screen displaying the rules
- [ ] Ability to chose the number of players
- [ ] Game over screen
