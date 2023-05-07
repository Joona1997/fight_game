import * as React from 'react'
import Multiplayer from './Multiplayer'
import {Link} from 'react-router-dom'

function Game() {
 return(
  <div><h2>Game</h2>
            <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
          <Multiplayer/>
          <button className="join-btn">
          Join
        </button>
          </div>
 )
 
}
  

export default Game;