/*
Repo: https://github.com/TheDiamondfinderNG/p5.shapeCollide
p5.collide2D created by http://benmoren.com
Created by https://thediamondfinder.newgrounds.com
Version V0.1.3 (ALPHA) | November 13, 2024
CC BY-NC-SA 4.0
*/

let autoReshape = true, /* For optimization, this will automatically convert
                           generated polygons into basic shapes if possible
                           For example: High-detail regular polygons like 
                           pentadecagons (50-sides) are converted to a circle 
                           
                           Low-detail shapes (3 & 4-sided) are converted to
                           their respective shapes (triangle and square)
                           TODO: Implement
                        */
  regularSideLimit = 50,  /* Number of sides a generated regular polygon can have
                           before becoming a circle (doesn't account for scale) 
                        */
  vectorMode = false, /* Whether or not new shapes should have vectors
                       May affect performance, but allows for vector functions
                    */
  //TODO: Finish Implementations
  _oldRect = "corner" // Store the rendering mode from last frame (Default is CORNER)
allShapes = [] // List of all shape objects
// NOTE: There's a better way to do this, but I don't want to deal with that right now (i forgor)
allShapes.clear = () => allShapes.length = 0 // Clear list function 

// Base collision object
class CollisionObject {
  constructor(x = 0, y = 0, t = "d") {
    this.x = x; // Coordinates
    this.y = y;
    this.velocity = createVector(0, 0); // TODO: Implement
    // Don't render it if there's something solid overlapping it
    this.visualCull = true; // TODO: Implement
    // Visibility
    this.visible = true
    allShapes.push(this)
  }
  draw() { }
  // TODO: Implement all functions
  update() { }
  collide(objects) { }
  onCollide() { }
  overlapping(object) {
    // Check if it's a rectangle
    if (this.w && this.h) {
    }
  }
  overlapped(object) { }
  noCollision() { }
  get type() {
    return this._shape;
  }
  set type(val) { }
  get v() {
    return this.velocity;
  }
  set v(val) {
    if (typeof val == "object") this.velocity = val;
    else console.warn("VELOCITY MUST BE VECTOR");
  }
  get shape() {
    return this._shape
  }
  set shape(val) {
    this._shape = val
    // TODO: change the whole ass shape
  }
}

class CircleObject extends CollisionObject {
  constructor(x = 0, y = 0, r = 20, type = "d") {
    super(x, y); // Get and use base object
    this.r = r; // Radius
    this._shape = "circle";
  }
  draw() {
    circle(this.x, this.y, this.d)
  }
  // Diameter getting and setting
  get d() {
    return this.r * 2;
  }
  set d(val) {
    this.r = val / 2;
  }
  get diameter() {
    return this.d;
  }
  set diameter(val) {
    this.d = val;
  }
}
class RectObject extends CollisionObject {
  constructor(x = 0, y = 0, w = 40, h = w, type = "d") {
    super(x, y); // Get and use base object
    this.w = w; // Width
    this.h = h; // Height
    this._shape = "rect";
  }
  draw() {
    rect(this.x, this.y, this.w, this.h)
  }
}
class PolyObject extends CollisionObject {
  constructor(x = 0, y = 0, closed = true, ...points) {
    super(x, y); // Get and use base object

    this._scale = { x: 1, y: 1 }

    // If there's no points defined or it's a regular polygon, make a regular polygon
    this.points = (typeof points[0] == "undefined" || points[0] == "regular") ?
      generatePoly(
        0, // Due to points and truePoints being different, these are set to zero
        0, // for shape modification consistency 
        points[1] ? points[1] : 20, // Scale - Multiply the size of the polygon. Default: 20
        points[2] ? points[2] : 6 // Sides - Amount of sides in polygon. Default: 6
      )
      : this.points = points
    this._truePoints = structuredClone(this.points) // Allows for modification of relative points
    this._truePoints.every(p => { p.x += this.x; p.y += this.y; return p })

    this.closed = closed // Solely for rendering, close the shape
    this._shape = "poly";
  }
  draw() {
    beginShape();
    this._truePoints.forEach((p) => vertex(p.x, p.y));
    if (this.closed)
      endShape(CLOSE)
    else
      endShape()
  }
  get scale() {
    return this._scale
  }
  set scale(val) {
    if (typeof val == "number") {
      this._scale.x = val
      this._scale.y = val
    } else {
      this._scale = val
    }
    this._truePoints = structuredClone(this.points) // Allows for modification of relative points
    this._truePoints.every(p => { p.x += this.x; p.y += this.y; return p })

    return val
  }
}

// Generate points of a regular polygon
function generatePoly(x, y, scale, sides) {
  push(); // You'll see why ...
  // Separate x and y scale for stretching
  if (typeof scale == "number") scale = {
    x: scale,
    y: scale
  }
  let points = [];
  angleMode(DEGREES); // ... This is why
  let angle = 360 / sides; // Inner angle to increment by
  for (let i = 0; i <= sides; i++) // One extra to close the shape
    points.push(
      vectorMode ?
        createVector(scale.x * sin(angle * i) + x, -scale.y * cos(angle * i) + y) :
        {
          x: scale.x * sin(angle * i) + x,
          y: -scale.y * cos(angle * i) + y // Negative because of upside-down pentagons :(
        }
    );
  pop();
  return points;
}

function drawShapes() {
  if (frameCount == 1) _oldRect = _renderer._rectMode
  if (!allShapes.length) return // If there aren't any shapes, don't even bother
  if (_renderer._rectMode != _oldRect) { // Check whether or not rectMode changed
    // Warns of their fate, yet the doom of their making is inevitable
    console.warn("WARNING: CHANGING RECT MODE WHILE RUNNING WILL CHANGE ALL RECTANGLES COORDINATES,",
      "POSSIBLY CAUSING A LAG SPIKE AND MESSING UP ANY CODE RELYING ON POSITIONS")
    // Because I don't separate the lists (and this is a very niche case), 
    // it will go through all the shapes and check for which ones are rectangles
    for (let i in allShapes) {
      if (allShapes[i].shape == "rect") {
        allShapes[i].x -= (_oldRect == CORNER ? -1 : 1) * allShapes[i].w / 2
        allShapes[i].y -= (_oldRect == CORNER ? -1 : 1) * allShapes[i].h / 2
      }
    }
    // Update _oldRect to current renderer
    _oldRect = _renderer._rectMode
  }
  // draw aldat -v-
  for (let i = 0; i < allShapes.length; i++) {
    allShapes[i].draw()
  }
}