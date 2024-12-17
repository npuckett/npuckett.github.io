class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(x, y);
    this.r = PARTICLE_SIZE;
    physics.addParticle(this);
  }

  show() {
    fill(0);
    stroke(0);
    circle(this.x, this.y, this.r * 2);
  }
}