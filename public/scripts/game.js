const width = 30
const height = 30
const screen = document.getElementsByTagName('canvas')[0]
const ctx = screen.getContext('2d')

//paddle class includes both the player and the cpu objects
class Paddle {
  pWidth = 10
  pHeight = 30
  constructor(xPos, yPos, velocity) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.velocity = velocity
  }

  draw() {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.xPos, this.yPos, this.pWidth, this.pHeight)
  }

  move() {
    this.draw()
    this.yPos += this.velocity
  }
}

const player = new Paddle(5, 60, 0)
const playerVelocity = 1.5

//object indicates which key is pressed down to avoid movement bug
const keys = {
  w: {
    pressed: false
  },
  s: {
    pressed: false
  }
}

//set velocity on key press
window.addEventListener('keydown', (e) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
  }
})

//stops movement
window.addEventListener('keyup', (e) => {
  switch (event.key) {
    case 'w':
      player.velocity = 0
      keys.w.pressed = false
      break
    case 's':
      player.velocity = 0
      keys.s.pressed = false
      break
  }
})

function animate () {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, screen.width, screen.height)
  player.move()
  
  if (keys.w.pressed) {
    player.velocity = - playerVelocity
  } else if (keys.s.pressed) {
    player.velocity = playerVelocity
  }
}

animate()
