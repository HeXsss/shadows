class Mouse {
  constructor(size = 30) {
    this.size = size
    this.pos = null
    window.addEventListener("mousemove", this.#handleMouseMove.bind(this))
    window.addEventListener("touchmove", this.#handleMouseMove.bind(this))
    window.addEventListener("mouseout", this.#handleMouseLeave.bind(this))
    window.addEventListener("touchend", this.#handleMouseLeave.bind(this))
  }
  #handleMouseMove(e) {
    this.pos = {
      x: e.pageX,
      y: e.pageY
    }
  }
  #handleMouseLeave(e) {
    this.pos = null
  }
  draw(ctx) {
    if (this.pos) {
      ctx.fillStyle = "#b1dcda"
      ctx.shadowColor = "#b1dcda"
      ctx.shadowBlur = 25
      ctx.fillRect(
        this.pos.x - this.size / 2,
        this.pos.y - this.size / 2,
        this.size,
        this.size
      )
    }
  }
}

class Particle {
  constructor(scene, x, y, size, color) {
    this.scene = scene
    this.x = Math.floor(x)
    this.y = Math.floor(y)
    this.originX = Math.floor(x)
    this.originY = Math.floor(y)
    this.vx = Math.random() * 2 - 1
    this.vy = Math.random() * 2 - 1
    this.size = size
    this.color = color
  }
  draw(ctx) {
    if (this.scene.mouse.pos) {
      const { x: Sx, y: Sy } = this.scene.mouse.pos
      // Normalizing mouse position to closest
      // const dxU = x - this.x
      // const dyU = y - this.y
      // const d = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
      // const r = (this.scene.mouse.size * d) / (2 * dxU)
      // const newX = (dyU / dxU) * (this.scene.mouse.size / 2)
      // const Sx = x + newX
      // const Sy = y + this.scene.mouse.size / 2

      // Shadow calculations
      const dx = Sx - this.x
      const dy = Sy - this.y
      const mx = dx > 0 ? 1 : -1
      const my = dy > 0 ? 1 : -1
      const p0 = {
        x: this.x + (mx * this.size) / 2,
        y: this.y - (my * this.size) / 2
      }
      const p1 = {
        x: this.x - (mx * this.size) / 2,
        y: this.y + (my * this.size) / 2
      }

      if (Math.abs(dx) <= this.size) {
        p0.y = this.y + (my * this.size) / 2
      }
      if (Math.abs(dy) <= this.size) {
        p1.x = this.x + (mx * this.size) / 2
      }

      ctx.fillStyle = "rgba(26,169,89,1.0)"
      // Debug line
      // ctx.fillRect(p0.x - 5, p0.y - 5, 10, 10)
      // ctx.fillRect(p1.x - 5, p1.y - 5, 10, 10)
      // ctx.beginPath()
      // ctx.moveTo(Sx, Sy)
      // ctx.lineTo(p0.x, p0.y)
      // ctx.lineTo(p1.x, p1.y)
      // ctx.closePath()
      // ctx.fill()
      // Calculate end of OX and OY
      const a0 = (p0.y - Sy) / (p0.x - Sx)
      const b0 = p0.y - a0 * p0.x
      const a1 = (p1.y - Sy) / (p1.x - Sx)
      const b1 = p1.y - a1 * p1.x

      const { width, height } = this.scene.canvas
      ctx.fillStyle = "rgba(0,0,0,0.1)"
      if (Math.abs(dx) <= this.size) {
        if (dy < 0) {
          const endX0 = (height - b0) / a0
          const endX1 = (height - b1) / a1
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(endX0, height)
          ctx.lineTo(endX1, height)
          ctx.lineTo(p1.x, p1.y)
          ctx.closePath()
          ctx.fill()
        } else {
          const endX0 = -b0 / a0
          const endX1 = -b1 / a1
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(endX0, 0)
          ctx.lineTo(endX1, 0)
          ctx.lineTo(p1.x, p1.y)
          ctx.closePath()
          ctx.fill()
        }
      } else if (Math.abs(dy) <= this.size) {
        if (dx < 0) {
          const endY0 = a0 * width + b0
          const endY1 = a1 * width + b1
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(width, endY0)
          ctx.lineTo(width, endY1)
          ctx.lineTo(p1.x, p1.y)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(0, b0)
          ctx.lineTo(0, b1)
          ctx.lineTo(p1.x, p1.y)
          ctx.closePath()
          ctx.fill()
        }
      } else if (dx > 0) {
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(0, b0)
        ctx.lineTo(0, b1)
        ctx.lineTo(p1.x, p1.y)
        ctx.closePath()
        ctx.fill()
      } else if (dx < 0 && dy < 0) {
        const endX0 = (height - b0) / a0
        const endX1 = (height - b1) / a1
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(endX0, height)
        ctx.lineTo(endX1, height)
        ctx.lineTo(p1.x, p1.y)
        ctx.closePath()
        ctx.fill()
      } else {
        const endX0 = -b0 / a0
        const endX1 = -b1 / a1
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(endX0, 0)
        ctx.lineTo(endX1, 0)
        ctx.lineTo(p1.x, p1.y)
        ctx.closePath()
        ctx.fill()
      }
    }
    ctx.fillStyle = this.color
    ctx.shadowBlur = 0
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    )
  }
  update() {
    this.x += this.vx
    this.y += this.vy
  }
}

class Scene {
  constructor() {
    // DOM
    this.canvas = document.getElementById("Scene")
    this.ctx = this.canvas.getContext("2d")
    this.pixelAdjuster = document.getElementById("pixelAmount")
    this.pixelAdjusterLabel = document.getElementById("labelPixelAmount")
    // User Cursor
    this.mouse = new Mouse(30)
    // Particles
    this.#createPixels()
    // Adjust pixel amount
    this.pixelAdjuster.addEventListener("input", (e) => {
      this.particlesAmount = e.target.value
      this.pixelAdjusterLabel.innerHTML = `Pixel amount: ${this.particlesAmount}`
      this.#createPixels()
    })
    // Animations
    this.#frame()
  }
  #createPixels() {
    this.particles = []
    this.particlesAmount = this.pixelAdjuster.value
    for (let i = 0; i < this.particlesAmount; i++) {
      this.particles.push(
        new Particle(
          this,
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          20, // from 5 to 15
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 255)`
        )
      )
    }
  }
  #draw() {
    this.particles.forEach((particle) => particle.draw(this.ctx))
    this.mouse.draw(this.ctx)
  }
  #update() {
    this.particles.forEach((particle, id) => {
      particle.update()
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1
      }
    })
  }
  #frame() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.#draw()
    this.#update()
    requestAnimationFrame(this.#frame.bind(this))
  }
}

const scene = new Scene()
