import React from 'react'
import {Link} from 'react-router-dom';

function Home() {
    return <div><h2>Fighting game</h2>
            <p>Welcome to the game!</p>
            <p>Have fun!</p>
            <nav>
            <ul>
              <li>
                <Link to="/Solo">Solo</Link>
              </li>
              <li>
                <Link to="/Multiplayer">Multiplayer</Link>
              </li>
            </ul>
          </nav>
          </div>;
  }

export default Home;