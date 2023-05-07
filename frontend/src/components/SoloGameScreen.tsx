import * as React from 'react'
import Canvas from './SoloCanvas'
import {Link} from 'react-router-dom'

function SoloGame() {
 return(
  <div><h2>Game</h2>
            <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
          <Canvas/>
          </div>
 )
 
}
  

export default SoloGame;