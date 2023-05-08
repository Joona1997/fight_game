import React, { useRef, useEffect } from 'react'
import {Session} from './Session'
import {Sprite} from './Sprite'

const Multiplayer = (props: any) => {
    const canvasRef = useRef<any|null>(null)
  
  useEffect(() => {
    
        
       

    
    const canvas = canvasRef.current
    const c = canvas.getContext('2d')
    //Our first draw
    c.fillStyle = '#000000'
    canvas.width = 1024
    canvas.height = 576
    c.fillRect(0, 0, c.canvas.width, c.canvas.height)
    
    
    const session = new Session(canvas)

function draw(sprite: Sprite) {
    c.fillStyle = sprite.color
    c.fillRect(sprite.position.x, sprite.position.y, sprite.width, sprite.height)
    c.fillRect(sprite.healthBar.x, sprite.healthBar.y, sprite.health, 50)
    
    if(sprite.isAttacking){
    c.fillStyle = 'green'
    c.fillRect(sprite.attackBox.position.x,
        sprite.attackBox.position.y,
        sprite.attackBox.width,
        sprite.attackBox.height
        )}
}

var previousTimestamp = Date.now()

function animate(timestamp: number) {
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    const timeDelta = timestamp - previousTimestamp
    previousTimestamp = timestamp

    //console.log(timeDelta)

    if (session.isRunning()) {
        session.update(timeDelta)
        if(session.player && session.enemy){
            draw(session.player)
            draw(session.enemy)
            
        }
        
        
    }

    window.requestAnimationFrame(animate)
}

    animate(Date.now())
   

       

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'd':
            
            session.player?.moveRight()
            break
        case 'a':
            session.player?.moveLeft()
            break
        case 'w':
            session.player?.jump()
            break
        case ' ':
            if (!session.player?.isAttacking){
                session.player?.attack()
            }
            break
    }
    console.log(event.key)
})
window.addEventListener('keyup', (event) =>{
    switch (event.key){
        case 'd':
            session.player?.keyUp('d')
        break
        case 'a':
            session.player?.keyUp('a')
        break
        case 'w':
            session.player?.keyUp('w')
        break
        case ' ':
            session.player?.keyUp(' ')
        break   
    }
    
console.log(event.key)
})

   
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Multiplayer