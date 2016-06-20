#Hexagon Havoc!

[Hexagon Havoc! Live][gitHubPages]

[gitHubPages]: http://mikeyharris89.github.io/HexagonHavoc

Hexagon Havoc is a 2-4 player JavaScript game inspired by some MarioParty shenanigans.
Made with Canvas animation, Hexagon Havoc is a free-for-all type game, fun for anyone
with a competitive and ruthless gameplay style.

![Action Shot](/assets/images/action.png)

## Instructions

On the homepage users are prompted to choose between 2-4 Players. Then using the
keyboard (I recommend attaching another keyboard if playing with more than 2 players)
players will find their characters on a board consisting of 7 different-colored hexagons.
At the top of the page a flag will display a random color, corresponding to one
of the hexagon platform colors. The players then have a limited time to make it
to that "safe" platform, before the other platforms race of the screen. If you don't
make it in time, you are out. Play continues until there is only 1 (or 0) player/players
remaining.

![Homepage](/assets/images/homepage.png)
### Controls

* Player1:
    LEFT: `left arrow`
    UP: `up arrow`
    RIGHT: `right arrow`
    DOWN: `down arrow`

* Player2:
    LEFT: `a`
    UP: `w`
    RIGHT: `d`
    DOWN: `s`  

* Player3:
    LEFT: `j`
    UP: `i`
    RIGHT: `l`
    DOWN: `k`  

* Player4:
    LEFT: `x`
    UP: `f`
    RIGHT: `v`
    DOWN: `c`       

## Languages/APIs

* JavaScript
* Canvas

## Features and Implementation

Hexagon Havoc is a flexible game that allows the user to choose how many players
get to participate in the mayhem. Depending on which button is clicked, the game
gets initialized with a different number, and adds the corresponding players.


One of the trickiest components of the game was checking to see whether or not a
player is "safe". When the platforms are in motion there is only one possible space
a player can exist on and still survive. Instead of checking to see if a
player was "off" the board, I decided to ensure a player was within either one "flagged"
platform, or within all of the platforms. I accomplished this using a bit of tricky
mathematics, evaluating whether a point(corresponding to a player's position) fell
within a polygon (in this case a hexagonal platform). I found this to be an extremely auspicious solution, as it is so logically sound.
Theoretically one can draw horizontal rays in one direction from the point, and then
count the number of times it intersects with the polygon. In this case we are dealing
with a convex polygon so if the number of times the ray intersects is 1, the point must
be inside the polygon. If it intersects 0 or 2 times it must be outside, as the ray will
either completely miss the polygon or will hit more than one side. In my code this
is slightly modified, and I just check the point is within the range of y point for two vertices
and check if it intersects. I then toggle the inside value and check every contiguous pair of vertices to test the point against all sides of the polygon.

`````JavaScript

Game.prototype.pointInHexagon = function(point, vertices) {
  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    var xi = vertices[i][0], yi = vertices[i][1];
    var xj = vertices[j][0], yj = vertices[j][1];

    var intersect = ((yi > y) != (yj > y)) &&
    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

`````

## Todo

In addition to the features you currently see, I plan on tweaking the game a bit more
to make it more visually appealing and user friendly.

- [ ] Instruction screen after homepage
- [ ] Revisit controls to emulate more realistic usability/acceleration
- [ ] Theme styling
- [ ] Player collisions
- [ ] Make players be able to stun other players
- [ ] Music
