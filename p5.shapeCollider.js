/*
Repo: https://github.com/TheDiamondfinderNG/p5.shapeCollide
p5.collide2D created by http://benmoren.com
Created by https://thediamondfinder.newgrounds.com
Version V0.1.2 (ALPHA) | November 8, 2024
CC BY-NC-SA 4.0
*/

class CollisionObject {
  constructor(x = 0, y = 0, t="d") {
    this.x = x;
    this.y = y;
    this.velocity = createVector(0,0)
    this._shape = "none";
    // Don't render it if there's something solid overlapping it 
    this.visualCull = true
  }
  draw() {}
  update() {
    
  }
  collide(objects) {
    
  }
  onCollide() {
    
  }
  overlapping(object){
    if(this.w && this.h){
    }
  }
  overlapped(object){
    
  }
  noCollision(){
    
  }
  get type() {
    return this.shape;
  }
  set type(val) {}
  get v(){
    return this.velocity
  }
  set v(val){
    if(typeof val == "object")
    this.velocity = val
    else console.warn("VELOCITY MUST BE VECTOR")
  }
}

class CircleObject extends CollisionObject {
  constructor(x=0,y=0,r=10, t="d"){
    super(x,y)
    this.r = r
    this._shape="circle"
  }
  get d(){
    return this.r*2
  }
  set d(val){
    this.r=val/2
  }
  get diameter(){
    return this.d
  }
  set diameter(val){
    this.d = val
  }
}
