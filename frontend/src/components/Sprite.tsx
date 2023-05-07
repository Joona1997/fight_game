import {Position, Velocity, AttackBox, HealthBar, newLoc} from '../types/spriteArgumentTypes'



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
    lastKey = "a"

    constructor(position: Position, velocity: Velocity, color = 'red', offset: number, healthBar: HealthBar){
        this.position = {...position}
        this.width = 50
        this.height = 150
        this.velocity = velocity
        this.health = 400
        this.healthBar = healthBar
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

    isColliding = (other: any) => {
        return this.position.x <= other.position.x + other.width &&
        this.position.x + this.width >= other.position.x &&
        this.position.y <= other.position.y + other.height &&
        this.height + this.position.y >= other.position.y
    }

    isOnTop = (other: any) => {
        
        return (this.isColliding(other) &&  
            (this.position.y + this.height -3    <= other.position.y ||
            this.position.y + other.height -3  <= this.position.y))              
    }
    isAbove = (other: any) => {
        
        return (  
            (this.position.y + this.height -5  <= other.position.y ||
            other.position.y + other.height  -5 <= this.position.y))              
    }

    attack = () => {   
        if(!this.keys.space.pressed){
            this.keys.space.pressed = true
            if (!this.isAttacking){
                this.isAttacking = true
                setTimeout(() => {
                    this.isAttacking = false
                }, 100)     
            }
        }
    }

    getStatus = () => {
        return {
            position: this.position,
            health: this.health,
            isAttacking: this.isAttacking,
            attackBoxPosition: this.attackBox.position
        }
    } 

    updateStatus = (status: {position: Position, health: number, isAttacking: boolean, attackBoxPosition:Position}) => {
        this.position = status.position;
        this.health = status.health;
        this.isAttacking = status.isAttacking;
        this.attackBox.position = status.attackBoxPosition;
    }

    moveLeft = () => {
        this.keys.a.pressed = true
        this.lastKey = 'a'
        this.attackBox.offset.x = -50
        this.velocity.x = -0.2
    }

    moveRight = () => {
        this.keys.d.pressed = true
        this.velocity.x = 0.2
        this.lastKey = 'd'
        this.attackBox.offset.x = 0
    }

    jump = () => {
        if (this.position.y + this.height >= 556 ){
            this.velocity.y = -1.0
        }
    }

    keyUp = (key: any) => {
        switch(key){
            case 'd':
                this.keys.d.pressed = false
                if(!this.keys.a.pressed){this.velocity.x = 0}
                
                break
                case 'a':
                this.keys.a.pressed = false
                
                if(!this.keys.d.pressed){this.velocity.x = 0}
                break
                case 'w':
                this.keys.w.pressed = false
                break
                case ' ':
                this.keys.space.pressed = false
                break   
        }
        
    }

     keys ={
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        },
        space:{
            pressed: false
        },
    }
}
export { Sprite };