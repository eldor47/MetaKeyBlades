import './App.css';
import Mint from './mint/Mint'
import Sword from './sword/Sword';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import {NavDropdown, Navbar, Nav} from 'react-bootstrap';
import Slideshow from './Slideshow';
import logo from './img/LogoTransparent.png'
import smallLogo from './img/CrossSwordSmallSvg.svg'
import slatt from './img/team/slatt.jpg'
import celt from './img/team/celt.png'
import eldor from './img/team/eldor.png'
import bandit from './img/team/bandit.png'

import "animate.css/animate.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

import ScrollAnimation from 'react-animate-on-scroll';

import Timer from './timer/Timer'


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
                      <Nav.Link href="/#overview">Overview</Nav.Link>
                      <Nav.Link href="/#faq">FAQ</Nav.Link>
                      <Nav.Link href="/#roadmap">Roadmap</Nav.Link>
                      <Nav.Link href="/#team">Team</Nav.Link>
                      <NavDropdown title="Socials" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="https://discord.gg/metakeyblades">Discord</NavDropdown.Item>
                        <NavDropdown.Item href="https://twitter.com/metakeyblades">
                          Twitter
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="https://opensea.io/collection/metakey-blades">
                          OpenSea
                        </NavDropdown.Item>
                      </NavDropdown>
                      <Nav.Link href="https://opensea.io/collection/metakey-blades">Opensea</Nav.Link>
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
            <Mint />
          </Route>
          <Route path='/sword/:id' component={Sword}>
          </Route>
          <Route path='/sword' component={Sword}>
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
  var history = useHistory()
    return (
    <div className="App">
      <div className='aboutUs' id='aboutUs'>
        <ScrollAnimation initiallyVisible animateIn='pulse'>
        <div><img className='logo' src={logo} /></div>
        </ScrollAnimation>
        <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
        <div className='aboutUsText'>
          <h1>A generative collection of weapons</h1>
          <p>
          There are a total of 1,500 weapons that act as keys throughout the metaverse. Each key allows you to mint 1 free NFT, plus gas on each future project. 
          All weapons contain a celestial manastone fragment that is charged by the power of the gods. 
          When your weapon is bonded to you through the blockchain, you are able to pass through the celestial gates and onto adventure.
          </p>
          <button><a className="joinDisc" href="https://discord.gg/metakeyblades">Join Our Discord</a></button>
          <button className="joinDisc" onClick={() => history.push('/sword')}>View our Blades</button>
        </div>
        </ScrollAnimation>
        <ScrollAnimation animateIn='bounceIn' animateOut='bounceOut'>
        <Timer></Timer>
        </ScrollAnimation>
      </div>
      <div className='overview' id='overview'>
          <div className='overviewText'>
            <h1>A Sharp Collection ⚔️</h1>
            <p className="listItem">The majority of the collection is randomly generated, while some are handcrafted and picked by the team.</p>
            <p className="listItem">Priority minting for our next project will be given to those who hold a MetaKey Blade in their wallet.</p>
            <p className="listItem">Each blade will have a unique card style as well as a QR code.</p>
          </div>
        <Slideshow></Slideshow>
      </div>
      <div className='faq' id='faq'>
          <div className='faqText'>
            <ScrollAnimation initiallyVisible animateIn='pulse'>
            <h1>FAQ 🤔</h1>
            </ScrollAnimation>
            <p className="listItem"><h2>What are the details of the sale?</h2></p>
            <p className="listItem">There will be a total supply of 1500 unique tokens. The price will be 0.06 ETH.</p>
            <p className="listItem"><h2>When will I be able to mint?</h2></p>
            <p className="listItem">The public sale is Nov. 12, 2021</p>
            <p className="listItem"><h2>Is there a Presale or Whitelist?</h2></p>
            <p className="listItem">There is a whitelist and presale prior to public sale. More details in Discord</p>
            <p className="listItem"><h2>How many can you mint during the sale?</h2></p>
            <p className="listItem">You can mint up to 10 per transaction.</p>
            <p className="listItem"><h2>Do I have commercial rights to my MetaKey Blade?</h2></p>
            <p className="listItem">You have full non-exclusive rights. You can use the NFT you own as you wish. However, MetaKey Blades will also have the rights to use your NFT for future projects and marketing.</p>
            <p className="listItem"><h2>When will blades be revealed?</h2></p>
            <p className="listItem">Blades will be revealed one day after mint on Nov. 13th. Time will be announced in Discord</p>
          </div>
      </div>
      
      <div className='faq' id='roadmap'>
          <div className='faqText'>
            <ScrollAnimation initiallyVisible animateIn='pulse'>
            <h1>Launch Roadmap 🚀</h1>
            </ScrollAnimation>
            <ScrollAnimation duration={1.5} animateIn='fadeInRight' animateOut='fadeOutLeft'>
              <div className='road-box'>
                <div className='road-left'><h2>25%</h2></div>
                <div className='road-right'>
                <h2>The Beginning</h2>
                <p className="listItem">We will donate a portion of earnings to National Pediatric Cancer Foundation.</p>
              </div>
            </div>
            </ScrollAnimation>
            <ScrollAnimation duration={1.5} animateIn='fadeInRight' animateOut='fadeOutLeft'>
            <div className='road-box'>
              <div className='road-left'><h2>50%</h2></div>
              <div className='road-right'>
              <h2>Taking Off</h2>
              <p className="listItem">Celestial Weaponsmith becomes active for community reward claims. This will involve the QR codes on the blades.</p>
              </div>
            </div>
            </ScrollAnimation>
            <ScrollAnimation duration={1.5} animateIn='fadeInRight' animateOut='fadeOutLeft'>
            <div className='road-box'>
              <div className='road-left'><h2>75%</h2></div>
              <div className='road-right'>
              <h2>Celestial Awakening</h2>
              <p className="listItem">Blade IDs wil be randomly chosen for a total of 1 ETH in giveaways.</p>
              </div>
            </div>
            </ScrollAnimation>
            <ScrollAnimation duration={1.5} animateIn='fadeInRight' animateOut='fadeOutLeft'>
            <div className='road-box'>
              <div className='road-left'><h2>100%</h2></div>
              <div className='road-right'>
              <h2>The Unsheathing</h2>
              <p className="listItem">Rarity tool will begin showing Blade Rankings. Reveal will start taking place 1 day after mint. Rankings will reveal after all blades are minted.</p>
              </div>
            </div>
            </ScrollAnimation>
          </div>
      </div>
      <div className='overview' id='team'>
          <h1 className='team-header'>MKB Team 🗡️</h1>
          <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
          <div className='overviewText team'>
            <img className='team-img' src={celt}/>
            <h1>Celt</h1>
            <p className="listItem"><b>Artist & Creator 🔥</b></p>
            <p className="listItem">Creator of EthRangers and more. Joined the NFT scene back in February. NFT lover and supporter, looking to bring my works into this MKB world. 
            Checkout my collection <a className='team-link' href='https://rarible.com/finalsanctuary'>Rarible Collection</a>📚</p>
            <p className="listItem">Previous project - <a className='team-link' href='https://twitter.com/FinalTcg'>EthRangers </a></p>
            <a className='social' href="https://twitter.com/FinalTcg"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
          </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
          <div className='overviewText team'>
            <img className='team-img' src={slatt}/>
            <h1>Slatt</h1>
            <p className='listItem'><b>Marketing Lead & Admin ✨</b></p>
            <p className='listItem'> Previously worked in crypto PR as head of digital for crypto and blockchain clients like Ledger, Uniswap, MEW (My Ether Wallet), and Bitstamp. 
            I am a long term member of these communities and have worked to help startup several other NFT projects.</p>
            <a className='social' href="https://twitter.com/0666eth"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
            <a className='social file' href="https://y.at/☢️⚠️☢️"><FontAwesomeIcon icon={faGlobe} size="2x" /></a>
          </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
          <div className='overviewText team'>
            <img className='team-img' src={bandit}/>
            <h1>Bandit</h1>
            <p className='listItem'><b>Project Marketer & Moderator ✨</b></p>
            <p className='listItem'>Community Manager for Ethaliens. NFT collector who joined the scene back in March when Slatt sent me one.
              NFT lover and supporter who wants to bring MKB to the next level. </p>
              <a className='social' href="https://twitter.com/degenbandit"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
          </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn='fadeIn' animateOut='fadeOut'>
          <div className='overviewText team'>
            <img className='team-img' src={eldor}/>
            <h1>Eldor</h1>
            <p className='listItem'><b>Solidity & Web Developer ✍️</b></p>
            <p className='listItem'>Builder of websites, apps and APIs for 7 years. MKB is my introduction project into the NFT space.
            I spend my time contributing to the ETH network and Web3. Inspired by the Sevens, Animetas and Uwucrew 🌎</p>
            <a className='social' href="https://twitter.com/eldor4747"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
          </div>
          </ScrollAnimation>
      </div>
      <div className='footer'>
          <div className='footerText'>
            <h1>Join the Community</h1>
            <p className="listItem">Come talk to us in Discord if you have any questions or concerns.</p>
            <button className='footer-button'><a className="footerDisc" href="https://discord.gg/metakeyblades">Join Our Discord</a></button>
          </div>
          <div className='socialContainer'>
            <p><b>@metakeyblades</b> are designed with care, and ready for adventure ⚔️ 😊</p>
            <a className='social' href="https://discord.gg/metakeyblades"><FontAwesomeIcon icon={faDiscord} size="2x"/></a>
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
