import React, { useRef, useEffect } from 'react'

import {Position, Velocity, AttackBox, HealthBar} from '../types/spriteArgumentTypes'

const Canvas = (props:any) => {
  const canvasRef = useRef<any|null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if(canvas){
    const c = canvas.getContext('2d')
    //Our first draw
    c.fillStyle = '#000000'
    canvas.width = 1024
    canvas.height = 576
    c.fillRect(0, 0, c.canvas.width, c.canvas.height)

    const gravity = 0.05

    let sides: Boolean = true
    
    class Sprite {
        position: Position
        width: number
        height: number
        velocity: Velocity
        health: number
        healthBar: HealthBar
        attackBox: AttackBox
        color: string
        isAttacking: boolean
        lastKey: string
        constructor(position: Position, velocity: Velocity, color = 'red', offset: number, healthBar: HealthBar,){
            this.position = position
            this.velocity = velocity
            this.width = 50
            this.height = 150
            this.health = 100
            this.healthBar = healthBar
            this.lastKey = "a"
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset: {x:offset},
                width: 100,
                height: 50
            }
            this.color = color
            this.isAttacking = false
        }
    
        draw() {
            c.fillStyle = this.color
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
            c.fillStyle = "red"
            c.fillRect(this.healthBar.x, this.healthBar.y, 400, 50)
            c.fillStyle = "green"
            c.fillRect(this.healthBar.x, this.healthBar.y, this.health*4, 50)
            
            if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x,
                 this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
                )}
        }
    
        update(timeDelta: number){
            this.draw()
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.attackBox.position.y = this.position.y
            this.position.y = this.position.y + this.velocity.y * timeDelta
            this.position.x = this.position.x + this.velocity.x * timeDelta
            
    
            if (this.position.y + this.height + this.velocity.y * timeDelta >= canvas.height ||
                (isOnTop() && this.velocity.y >= 0 )
                ){
                this.velocity.y = 0
            } else this.velocity.y = this.velocity.y + gravity  
            
            
        }
    
        attack(){
            
            this.isAttacking = true
            setTimeout(() => {
                this.isAttacking = false
            }, 100)
            
        }
    }
    
    
    let Kengu = {
        name: "Kengu",
        position: {
            x: 100,
            y: 0
        },
        velocity:{
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
        },
        healthBar: {
            x: 20,
            y: 20
        }
    }
    let Human = {
        name:"Human",
            position: {
                x: canvas.width - 150,
                y: 100
            },
            velocity:{
                x: 0,
                y: 0
            },
            offset: {
                x:-50,
                y:0
            },
            healthBar:{
                x:canvas.width - 420,
                y:20
            },
            color: 'blue'
    }
    const player = new Sprite(Kengu.position, Kengu.velocity, undefined, Kengu.offset.x, Kengu.healthBar,  );
    const enemy = new Sprite(Human.position, Human.velocity, Human.color, Human.offset.x, Human.healthBar, );
    
    
    
    const keys ={
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        },
        ArrowLeft:{
            pressed: false
        },
        ArrowUp:{
            pressed: false
        },
        space:{
            pressed: false
        },
        Enter:{
            pressed: false
        }
    }
    
    const isColliding = () => {
        return player.position.x <= enemy.position.x + enemy.width &&
        player.position.x + player.width >= enemy.position.x &&
        player.position.y <= enemy.position.y + enemy.height &&
            player.height + player.position.y >= enemy.position.y
                
    }
    
    const isOnTop = () => {
        
        return (isColliding() &&  
            (player.position.y + player.height -3    <= enemy.position.y ||
            enemy.position.y + enemy.height  -3 <= player.position.y))              
    }
    const isAbove = () => {
        
        return (  
            (player.position.y + player.height -5   <= enemy.position.y ||
            enemy.position.y + enemy.height  -5 <= player.position.y))              
    }
    
    var previousTimestamp = 0
    

    const animate = (timestamp: number) => {
        
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
        
        const timeDelta = timestamp - previousTimestamp
        previousTimestamp = timestamp
        if(player.health<= 0){
            c.font = "30px Arial";
            c.fillStyle = "white  "
            c.fillText("Blue won!!!", canvas.width/2-50, canvas.height/2);
            setTimeout(() => window.location.reload(), 2000)
            return 0
        }
        if(enemy.health<= 0){
            c.font = "30px Arial";
            c.fillStyle = "white  "
            c.fillText("Red won!!!", canvas.width/2-50, canvas.height/2);
            setTimeout(() => window.location.reload(), 2000)
            return 0
        }
        player.update(timeDelta)
        enemy.update(timeDelta)
        
        player.velocity.x = 0
        enemy.velocity.x = 0
       
    
        if (player.position.x > enemy.position.x){
            sides = false
        } else {
            sides = true
        }
    
        // player movement
        if (keys.a.pressed && player.lastKey === 'a' &&
         player.position.x >= 0 &&
         (sides ||
            !isColliding() ||
         isAbove())){
            player.velocity.x = -0.2
        } 
        if (keys.d.pressed && player.lastKey ==='d' &&
        player.position.x <= canvas.width-player.width &&
        (!sides ||
            !isColliding() ||
        isAbove())){
            player.velocity.x =0.2
        }
    
        // enemy movement
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' &&
        enemy.position.x >= 0 &&
        (!sides ||
        !isColliding() ||
        isAbove())){
            enemy.velocity.x = -0.2
        } 
        if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight' &&
        enemy.position.x <= canvas.width-enemy.width &&
        (sides ||
        !isColliding() ||
        isAbove())){
            enemy.velocity.x =0.2
        }
    
        // detect hit
        if (player.attackBox.position.x + player.attackBox.width >=enemy.position.x
            && player.attackBox.position.x <= enemy.position.x + enemy.width
            && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
            && player.attackBox.position.y <= enemy.position.y + enemy.height
            && player.isAttacking){
            if(enemy.health > 0){
            enemy.health -= 1
            console.log('hit')
            console.log(enemy.health)
            }
        }
        if (enemy.attackBox.position.x + enemy.attackBox.width >=player.position.x
            && enemy.attackBox.position.x <= player.position.x + player.width
            && enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y
            && enemy.attackBox.position.y <= player.position.y + player.height
            && enemy.isAttacking){
            if(player.health > 0){
            player.health -= 1
            console.log('hit')
            console.log(player.health)
            }
        }
    window.requestAnimationFrame(animate)
    }
    

    animate(0)
    
    
    window.addEventListener('keydown', (event) =>{
        switch (event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                player.attackBox.offset.x = 0
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                player.attackBox.offset.x = -50
                break
            case 'w':
                console.log(player.position.y)
                if (player.position.y + player.height >= 556 || isOnTop()){
                player.velocity.y = -1.0
                }
                break
            case ' ':
                if(!keys.space.pressed){
                keys.space.pressed = true
                    if (!player.isAttacking){
                        player.attack()
                }
                }
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                enemy.attackBox.offset.x = 0
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                enemy.attackBox.offset.x = -50
                break
            case 'ArrowUp':
                if (enemy.position.y + enemy.height >= 556 || isOnTop()){
                enemy.velocity.y = -1.0
                }
                break
            case 'Enter':
                if(!keys.Enter.pressed){
                    keys.Enter.pressed = true
                        if (!enemy.isAttacking){
                            enemy.attack()
                    }
                }
                break
        }
    console.log(event.key)
    })
    
    window.addEventListener('keyup', (event) =>{
        switch (event.key){
            case 'd':
            keys.d.pressed = false
            break
            case 'a':
            keys.a.pressed = false
            break
            case 'w':
            keys.w.pressed = false
            break
            case ' ':
                keys.space.pressed = false
                break   
        }
        switch (event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
            case 'ArrowUp':
                keys.ArrowUp.pressed = false
                break
            case 'Enter':
                keys.Enter.pressed = false
                break      
        }
    console.log(event.key)
    })
}
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas