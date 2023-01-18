const screen = document.getElementsByTagName('canvas')[0]
const score = document.getElementById('num_score')
screen.width = 800
screen.height = 700
const ctx = screen.getContext('2d')

function postScore(score_num) {
  fetch('/score/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'score': score_num})
  })
}

//paddle class includes both the player and the cpu objects
class GameObject {
  constructor (width, height, xPos, yPos, yVelocity=0) {
    this.width = width
    this.height = height
    this.xPos = xPos
    this.yPos = yPos
    this.yVelocity = yVelocity
  }

  draw() {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height)
  }

  move() {
    this.draw()
    this.onCollision()
    if ((this.yPos + this.height < 700 && this.yVelocity > 0) || (this.yPos > 0 && this.yVelocity < 0)) {
      this.yPos += this.yVelocity
    }
  }

  onCollision() {
    if ((this.xPos > ball.xPos || ball.xPos < this.width + this.xPos) && (this.yPos < ball.yPos && ball.yPos < this.yPos + this.height)) {
      ball.yVelocity *= Math.random() * 6 - 3
      if (ball.xVelocity < 8) {
        ball.xVelocity *= -1.05
      }
      score.textContent = Number(score.textContent) + 10
    }
  }
}

class Ball extends GameObject{
  constructor(width, height, xPos, yPos, yVelocity, xVelocity) {
    super(width, height, xPos, yPos, yVelocity)
    this.xVelocity = xVelocity
  }

  move() {
    this.draw()
    this.onScore()
    if (this.yPos <= 0 || this.yPos + this.height>= screen.height) {
      this.yVelocity *= -1
    } 
      this.yPos += this.yVelocity
      this.xPos += this.xVelocity
  }

  onScore() {
    if (ball.xPos <= 0) {
      postScore(Number(score.textContent))
      score.textContent = 0
      ball.xPos = 400
      ball.yPos = 350
      ball.xVelocity = 5
      ball.yVelocity = Math.random() * 6 - 3
    }
  }
}

class Computer extends GameObject{
  constructor(width, height, xPos, yPos, yVelocity) {
    super(width, height, xPos, yPos, yVelocity)
  }

  //sets the enemy paddle to follow the ball and stops any out of bounds
  //that might happen
  followBall(yBallPos, ballHeight) {
    this.draw()
    this.onCollision()
    if ((this.yPos + this.height - 75 < 700 && yBallPos < screen.height - this.height + 75) && 
        (this.yPos > 0 && yBallPos > this.height - 75)) {
      this.yPos = yBallPos - 75
    }
  }

  onCollision() {
    if ((this.xPos < ball.xPos + ball.width || ball.xPos + ball.width > this.width + this.xPos) && (this.yPos < ball.yPos && ball.yPos < this.yPos + this.height)) {
      ball.yVelocity *= Math.random() * 8 - 4
      if (ball.xVelocity < 8) {
        ball.xVelocity *= -1.05
      }
    }
  }
}

const player = new GameObject(25, 150, 20, 275)
const ball = new Ball(15, 15, 400, 350, Math.random() * 10 - 5, 5)
const cpu = new Computer(25, 150, 755, 275)
const playerVelocity = 15

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
      player.yVelocity = 0
      keys.w.pressed = false
      break
    case 's':
      player.yVelocity = 0
      keys.s.pressed = false
      break
  }
})


function animate () {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, screen.width, screen.height)
  ball.move()
  player.move()
  cpu.followBall(ball.yPos, ball.height)
  
  if (keys.w.pressed) {
    player.yVelocity = - playerVelocity
  } else if (keys.s.pressed) {
    player.yVelocity = playerVelocity
  }
}

animate()
