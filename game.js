class Score extends Object {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
    this.w = this.h = 0
    this.color = "white"
    this.number = 0
    this.refreshScore()
  }

  addScorePoint() {
    this.number++
  }

  refreshScore() {
    this.text = `Score: ${this.number}`
  }
}

class Food extends Object {
  constructor(snake, score) {
    super()
    this.snake = snake
    this.score = score
    this.color = "white"
    this.w = this.h = sqmSize
  }

  onAppend() {
    this.setRandomPosition()
  }

  setRandomPosition() {
    this.x = Math.floor(Math.random() * (this.parent.canvas.width / sqmSize)) * sqmSize
    this.y = Math.floor(Math.random() * (this.parent.canvas.height / sqmSize)) * sqmSize
  }

  onThink() {
    this.onCollision((self, collider) => {
      this.score.addScorePoint()
      this.score.refreshScore()
      this.snake.createNode()

      this.setRandomPosition()
    })
  }
}

class SnakeNode extends Object {
  constructor() {
    super()
    this.color = "white"
  }
}

class Snake extends Object {
  constructor() {
    super()
    this.w = this.h = sqmSize
    this.x = this.y = 100
    this.color = "white"
    this.direction = [1]
    this.nodes = []
  }

  onAppend() {
    for(let i = 0; i < 3; i++) {
      this.createNode()
    }
  }

  onThink() {
    if(!this.isDoingAction()) {
      return;
    }

    var lastPosX = this.x
    var lastPosY = this.y

    if(this.direction[0] == 0) {
      this.y -= sqmSize
    } else if(this.direction[0] == 1) {
      this.x += sqmSize
    } else if(this.direction[0] == 2) {
      this.y += sqmSize
    } else if(this.direction[0] == 3) {
      this.x -= sqmSize
    }

    if(this.x < 0 || this.x >= this.parent.canvas.width ||
       this.y < 0 || this.y >= this.parent.canvas.height) {
      this.parent.reset()
      return
    }

    for(let node of this.nodes) {
      let tmpPosX = node.x
      let tmpPosY = node.y

      node.x = lastPosX
      node.y = lastPosY

      lastPosX = tmpPosX
      lastPosY = tmpPosY
    }

    this.onCollision((self, collider) => {
      if(collider instanceof SnakeNode) {
        this.parent.reset()
      }
    })

    if(this.direction.length > 1)
      this.direction.splice(0, 1)

    this.setDoingAction(50)
  }

  get lastNode() {
    return this.nodes[this.nodes.length - 1] || this
  }

  createNode() {
    let obj = new SnakeNode()
        obj.w = obj.h = sqmSize
        obj.direction = this.lastNode.direction

    if(obj.direction[0] == 0) {
      obj.x = this.lastNode.x
      obj.y = this.lastNode.y + this.lastNode.h
    } else if(obj.direction[0] == 1) {
      obj.x = this.lastNode.x - this.lastNode.w
      obj.y = this.lastNode.y
    } else if(obj.direction[0] == 2) {
      obj.x = this.lastNode.x
      obj.y = this.lastNode.y - this.lastNode.w
    } else if(obj.direction[0] == 3) {
      obj.x = this.lastNode.x + this.lastNode.w
      obj.y = this.lastNode.y
    }

    this.nodes.push(obj)
    this.parent.appendObject(obj)
  }

  setDirection(dir) {
    if(this.pressed)
      return

    let oppositeList = {0: 2, 1: 3, 2: 0, 3: 1}
    let newdir = (this.direction[0] != oppositeList[dir]) ? dir : oppositeList[dir]

    if(this.direction.length >= 1 && this.direction.length <= 3) {
      if(dir != oppositeList[this.direction[this.direction.length - 1]]) 
        this.direction.push(dir)
    }
  }
}