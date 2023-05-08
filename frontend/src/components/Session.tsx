import { Sprite } from './Sprite';
import { Peer } from "peerjs";
import {Position, Velocity, AttackBox, HealthBar, newLoc} from '../types/spriteArgumentTypes'
export { Session };

class Session {
    connection: any
    enemy?: Sprite
    player?: Sprite
    canvas: any
    peer?: Peer

    constructor(canvas: any) {
        
        this.connection = null
        this.enemy = undefined
        this.player = undefined
        this.canvas = canvas
        
        // Connect to server
        let person = prompt("Please enter your name");
        if(person){
            
            this.peer = new Peer(person, {
            host: window.location.hostname,
            
            debug: 1,
            //port: 8000,
            path: '/myapp'
        });
        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });
        }
        
        

        const initiateGame = (playerColor: string) => {
            const red = new Sprite({x:100, y:0} , {x: 0, y: 0 }, "red", 0, {x:20,y:20} )
            const blue = new Sprite({x: canvas.width - 150, y:100} , {x: 0, y: 0 }, "blue", -50, {x:canvas.width - 420,y:20} )
            red.assingEnemy(blue)
            blue.assingEnemy(red)
           
            if (playerColor === 'red') {
                this.player = red
                this.enemy = blue
            } else {
                this.player = blue
                this.enemy = red
            }
        }

        const handleConnection = (connection: any) => {
            console.log(this.connection)
            connection.on('data', (status: any) => { 
                this.enemy?.updateStatus(status);
             });
        }

        // You join somebody
        const joinBtn = document.querySelector('.join-btn');
        joinBtn?.addEventListener('click', () => {
            const peerUser = window.prompt('Please enter the user to join');
            if(peerUser){
                this.connection = this.peer?.connect(peerUser);
                handleConnection(this.connection)
                initiateGame('red')
                console.log('Conneted to ' + this.connection.peer)
            }
            
        })
        
        // Somebody joins you
        this.peer?.on('connection', (dataConnection) => { 
            this.connection = dataConnection;
            handleConnection(this.connection);
            initiateGame('blue')
            console.log('Connected from ' + this.connection.peer);
        });
    
    }

     restartGame = () => {
        console.log("toimii")
        if(this.player && this.enemy){
            this.player.health = 200    
            
            if(this.player.color === 'red'){
                this.player.position = {x:100, y:0}
                
                
                
            }else{
                
                this.player.position = {x:1024-150, y:0}
            }
        }
        
       
       
    }
    sendPlayerUpdate = () => {
        if (this.connection) {
            this.connection.send(this.player?.getStatus());
        }
    }

    isRunning = () => {
        return this.player && this.enemy
    }

    update = (timeDelta: number) => {
        let side: boolean
        const gravity = 0.05
        
        
        if(this.player && this.enemy){
           
            
            this.player.attackBox.position.x = this.player.position.x + this.player.attackBox.offset.x
            this.player.attackBox.position.y = this.player.position.y
            this.player.position.y = this.player.position.y + this.player.velocity.y * timeDelta
            this.player.position.x = this.player.position.x + this.player.velocity.x * timeDelta
            this.player.velocity.x = 0
            
        
        if (this.player.position.x > this.enemy.position.x){
            side = false
        } else {
            side = true
        }

        if (this.player.position.y + this.player.height + this.player.velocity.y * timeDelta >= this.canvas.height ||
            (this.player.isOnTop() && this.player.velocity.y >= 0 )
            ){
            this.player.velocity.y = 0
        } else this.player.velocity.y = this.player.velocity.y + gravity 
        
       
        
        if (this.player.keys.a.pressed && this.player.lastKey === 'a' &&
        this.player.position.x >= 0 &&
         (side ||
            !this.player.isColliding() ||
            this.player.isAbove())){
                this.player.velocity.x = -0.2
        } 
        if (this.player.keys.d.pressed && this.player.lastKey ==='d' &&
        this.player.position.x <= this.canvas.width-this.player.width &&
        (!side ||
            !this.player.isColliding() ||
            this.player.isAbove())){
            this.player.velocity.x =0.2
        }
        if (this.enemy.attackBox.position.x + this.enemy.attackBox.width >=this.player.position.x
            && this.enemy.attackBox.position.x <= this.player.position.x + this.player.width
            && this.enemy.attackBox.position.y + this.enemy.attackBox.height >= this.player.position.y
            && this.enemy.attackBox.position.y <= this.player.position.y +this.player.height
            && this.enemy.isAttacking){
            if(this.player.health > 0){
                this.player.health -= 1
            console.log('hit')
            console.log(this.player.health)
            }
        }
        
        
        }
        
        
        this.sendPlayerUpdate()
    }
 }