import './App.css';
import Minter from './Minter'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {NavDropdown, MenuItem, Navbar, NavItem, Nav} from 'react-bootstrap';
import Slideshow from './Slideshow';
import logo from './img/00_Blue.png'
import smallLogo from './img/CrossSwordSmallSvg.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'


export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <div className='navBar'>
            {/* <Link className='text-link' to="/mint">Mint</Link> */}
            {/* <a className='text-link'>OpenSea</a> */}
            {/* <NavDropdown className="navDrop text-link" title="Socials">
              <NavDropdown.Item href="https://twitter.com/FinalTcg">Twitter</NavDropdown.Item>
              <NavDropdown.Item href="https://discord.gg/87kdNqrASP">Discord</NavDropdown.Item>
            </NavDropdown> */}
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                  <Navbar.Brand href="#home">
                  <Link to="/"><img className='small-logo' src={smallLogo}/></Link>
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                      <Nav.Link href="#aboutUs">About Us</Nav.Link>
                      <Nav.Link href="#overview">Overview</Nav.Link>
                      <Nav.Link href="#faq">FAQ</Nav.Link>
                      <Nav.Link href="#roadmap">Roadmap</Nav.Link>
                      <NavDropdown title="Socials" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="https://discord.gg/87kdNqrASP">Discord</NavDropdown.Item>
                        <NavDropdown.Item href="https://twitter.com/metakeyblades">
                          Twitter
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item disabled href="#action/3.4">
                          OpenSea
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
          </div>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/mint">
            <Minter />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
    return (
    <div className="App">
      <div className='aboutUs' id='aboutUs'>
        <div><img className='logo' src={logo} /></div>
        <div className='aboutUsText'>
          <h1>MetaKey Blades is a generative collection of weapons</h1>
          <p>
             There are a total of 2,500 weapons that also act as keys throughout the metaverse.
             Each key will allow you to mint 1 free NFT + gas on each future project. Each weapon has a celestial manastone fragment that is charged by the power of the gods.
             When your weapon is bonded to you through the blockchain, you are allowed to pass through the celestial gates and onto adventure.
          </p>
          <button><a className="joinDisc" href="https://discord.gg/87kdNqrASP">Join Our Discord</a></button>
        </div>
      </div>
      <div className='overview' id='overview'>
          <div className='overviewText'>
            <h1>A Sharp Collection ⚔️</h1>
            <p className="listItem">The majority of the collection will be randomly generated, while some will be handcrafted and picked by the team.</p>
            <p className="listItem">Priority minting for our next project will be given to those who hold a MetaKey Blade in their wallet.</p>
            <p className="listItem">Each blade will have a unique card style with a QR code.</p>
          </div>
        <Slideshow></Slideshow>
      </div>
      <div className='faq' id='faq'>
          <div className='faqText'>
            <h1>FAQ 🤔</h1>
            <p className="listItem"><h2>What are the details of the sale?</h2></p>
            <p className="listItem">There will be a total supply of 2500 unique tokens. The price will be 0.06 ETH.</p>
            <p className="listItem"><h2>Is there a Presale or Whitelist?</h2></p>
            <p className="listItem">Presale information will be announced later.</p>
            <p className="listItem"><h2>How many can you mint during the sale?</h2></p>
            <p className="listItem">You can mint up to 10 per transaction.</p>
            <p className="listItem"><h2>Do I have commercial rights to my MetaKey Blade?</h2></p>
            <p className="listItem">You have full non-exclusive rights. You can use the NFT you own as you wish. However, MetaKey Blades will also have the rights to use your NFT for future projects and marketing.</p>
            <p className="listItem"><h2>Who is the MetaKey Blade Artist?</h2></p>
            <p className="listItem">Artist and Creator: <b>Celt#5043 (Discord)</b></p>
            <p className="listItem">NFT lover and supporter, looking to bring my works into this MKB world. Checkout my collection - <a href='https://rarible.com/finalsanctuary'>Rarible Collection </a></p>
            <p className="listItem">Previous project - <a href='https://twitter.com/FinalTcg'>EthRangers </a></p>
          </div>
      </div>
      <div className='faq' id='roadmap'>
          <div className='faqText'>
            <h1>Launch Roadmap 🚀</h1>
            <div className='road-box'>
              <div className='road-left'><h2>25%</h2></div>
              <div className='road-right'>
              <h2>The Beginning</h2>
              <p className="listItem">We will donate a portion of earnings to a charity orginization!</p>
              </div>
            </div>
            <div className='road-box'>
              <div className='road-left'><h2>50%</h2></div>
              <div className='road-right'>
              <h2>Taking Off</h2>
              <p className="listItem">We will Airdrop to 5 MetaKey Blade holders a free NFT.</p>
              </div>
            </div>
            <div className='road-box'>
              <div className='road-left'><h2>75%</h2></div>
              <div className='road-right'>
              <h2>Celestial Awakening</h2>
              <p className="listItem">Celestial Weaponsmith active for community reward claims.</p>
              </div>
            </div>
            <div className='road-box'>
              <div className='road-left'><h2>100%</h2></div>
              <div className='road-right'>
              <h2>The Unsheathing</h2>
              <p className="listItem">Reveal process begins and all owners are bonded with their blades.</p>
              </div>
            </div>
          </div>
      </div>
      <div className='footer'>
          <div className='footerText'>
            <h1>Join the Community</h1>
            <p className="listItem">Come talk to us in Discord if you have any questions or concerns.</p>
            <button class='footer-button'><a className="footerDisc" href="https://discord.gg/87kdNqrASP">Join Our Discord</a></button>
          </div>
          <div className='socialContainer'>
            <p><b>@metakeyblades</b> are designed with care, and ready for adventure ⚔️ 😊</p>
            <a className='social' href="https://discord.gg/87kdNqrASP"><FontAwesomeIcon icon={faDiscord} size="2x"/></a>
            <a className='social' href="https://twitter.com/metakeyblades"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
          </div>
      </div>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

// function App() {
//   return (
//     <div className="App">
//       <div className='aboutUs'>
//         <div><img className='logo' src={logo} /></div>
//         <div className='aboutUsText'>
//           <h1>MetaKey Blades is a generated NFT sword project</h1>
//           <p>A unique collection filled with different styles</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
