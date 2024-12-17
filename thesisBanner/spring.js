class Spring extends VerletSpring2D {
  constructor(a, b, strength) {
    let length = dist(a.x, a.y, b.x, b.y);
    super(a, b, length, strength);
    physics.addSpring(this);
  }

  show() {
    stroke(0);
    strokeWeight(0.3);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}