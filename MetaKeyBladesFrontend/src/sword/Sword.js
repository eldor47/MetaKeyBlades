import React from "react";

import axios from 'axios';

import { Button, InputGroup, FormControl, OverlayTrigger, Tooltip, Pagination, Card, Modal, ButtonGroup, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faDiceFive } from '@fortawesome/free-solid-svg-icons'


import Select from 'react-select';

import './Sword.css'



class Sword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      swords: [],
      pageSize: 50,
      pageNumber: 1,
      loading: true,
      bladeId: null,
      checked: false,
      show: false,
      selectedSword: 0,
      bladeType: null,
      blateMaterial: null,
      hilt: null,
      manastone: null,
      manastoneShape: null,
      border: null,
      sortMethod: 'ID',
      filterDirection: true,
      id: null,
      typeOptions: [
        { value: 'Soldier', label: 'Soldier' },
        { value: 'Mercenary', label: 'Mercenary' },
        { value: 'Hunter', label: 'Hunter' },
        { value: 'DragonKnight', label: 'DragonKnight' },
        { value: 'Zero', label: 'Zero' },
        { value: 'DeathKnight', label: 'DeathKnight' },
        { value: 'WorldEnder', label: 'WorldEnder' },
        { value: 'WyrmSlayer', label: 'WyrmSlayer' },
        { value: 'Mage', label: 'Mage' },
        { value: 'Training', label: 'Training' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Hellfire', label: 'Hellfire' },
        { value: 'Ranger', label: 'Ranger' },
        { value: 'Beholder', label: 'Beholder' },
        { value: 'Serpent', label: 'Serpent' },
        { value: 'Berserker', label: 'Berserker' },
        { value: 'Sun', label: 'Sun' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Warrior', label: 'Warrior' },
        { value: 'WindCutter', label: 'WindCutter' },
        { value: 'Scarab', label: 'Scarab' },
        { value: 'Melodic', label: 'Melodic' },
        { value: 'Monster', label: 'Monster' },
        { value: 'DemonHunter', label: 'DemonHunter' },
        { value: 'Orc', label: 'Orc' },
        { value: 'Goblin', label: 'Goblin' }
      ],
      materialOptions: [
        { value: 'Mithril', label: 'Mithril' },
        { value: 'DwarfSteel', label: 'DwarfSteel' },
        { value: 'ElfSteel', label: 'ElfSteel' },
        { value: 'Gold', label: 'Gold' },
        { value: 'WyrmFrost', label: 'WyrmFrost' },
        { value: 'ScarletMetal', label: 'ScarletMetal' },
        { value: 'Ethereal', label: 'Ethereal' },
        { value: 'ColdIron', label: 'ColdIron' },
        { value: 'SkyMetal', label: 'SkyMetal' },
        { value: 'BloodMetal', label: 'BloodMetal' },
        { value: 'Galaxy', label: 'Galaxy' },
        { value: 'StarMetal', label: 'StarMetal' },
        { value: 'DragonMetal', label: 'DragonMetal' },
        { value: 'Obsidian', label: 'Obsidian' },
        { value: 'GhostFire', label: 'GhostFire' },
        { value: 'Orichalcum', label: 'Orichalcum' },
        { value: 'Adamantite', label: 'Adamantite' },
        { value: 'SunSteel', label: 'SunSteel' },
        { value: 'Palladium', label: 'Palladium' },
        { value: 'ChronoSteel', label: 'ChronoSteel' },
        { value: 'MelodicSteel', label: 'MelodicSteel' },
        { value: 'Prismatic', label: 'Prismatic' },
        { value: 'CelestialStar', label: 'CelestialStar' }
      ],
      hiltOptions: [
        { value: 'Soldier', label: 'Soldier' },
        { value: 'Mercenary', label: 'Mercenary' },
        { value: 'Hunter', label: 'Hunter' },
        { value: 'DragonKnight', label: 'DragonKnight' },
        { value: 'Zero', label: 'Zero' },
        { value: 'DeathKnight', label: 'DeathKnight' },
        { value: 'WorldEnder', label: 'WorldEnder' },
        { value: 'WyrmSlayer', label: 'WyrmSlayer' },
        { value: 'Mage', label: 'Mage' },
        { value: 'Training', label: 'Training' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Hellfire', label: 'Hellfire' },
        { value: 'Ranger', label: 'Ranger' },
        { value: 'Beholder', label: 'Beholder' },
        { value: 'Serpent', label: 'Serpent' },
        { value: 'Berserker', label: 'Berserker' },
        { value: 'Sun', label: 'Sun' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Warrior', label: 'Warrior' },
        { value: 'WindCutter', label: 'WindCutter' },
        { value: 'Scarab', label: 'Scarab' },
        { value: 'Melodic', label: 'Melodic' },
        { value: 'Monster', label: 'Monster' },
        { value: 'DemonHunter', label: 'DemonHunter' },
        { value: 'Orc', label: 'Orc' },
        { value: 'Goblin', label: 'Goblin' }
      ],
      manastoneOptions: [
        { value: 'Green', label: 'Green' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Red', label: 'Red' },
        { value: 'Orange', label: 'Orange' },
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Pink', label: 'Pink' },
        { value: 'Purple', label: 'Purple' },
        { value: 'Prismatic', label: 'Prismatic' }
      ],
      manastoneShapeOptions: [
        { value: 'Round', label: 'Round' },
        { value: 'Diamond', label: 'Diamond' }
      ],
      borderOptions: [
        { value: 'BlueYellow', label: 'BlueYellow' },
        { value: 'GunMetal', label: 'GunMetal' },
        { value: 'OrangeYellow', label: 'OrangeYellow' },
        { value: 'BluePurple', label: 'BluePurple' },
        { value: 'Pink', label: 'Pink' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Purple', label: 'Purple' },
        { value: 'Prismatic', label: 'Prismatic' },
        { value: 'RedWhite', label: 'RedWhite' },
        { value: 'Violet', label: 'Violet' },
        { value: 'Green', label: 'Green' },
        { value: 'Blue', label: 'Blue' },
        { value: 'MixedBerry', label: 'MixedBerry' }
      ]
    };

    this.timer = null;

  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      var id = parseInt(this.props.match.params.id)
      this.setState({ bladeId: id });
    } else {
      await this.setState({ loading: true })
      var initialSwords = await this.getSwordData({})
      initialSwords.sort((a, b) => {
        return a.name - b.name;
      });
      await this.setState({ swords: initialSwords })
      await this.setState({ loading: false })
    }
  }

  getRows() {
    var pageSize = this.state.pageSize
    var swords = this.state.swords
    var pageNumber = this.state.pageNumber

    var rows = []
    for (var i = (pageNumber - 1) * pageSize; i < pageSize * pageNumber && swords.length > 0 && i < swords.length; i++) {
      var sword = swords[i]
      var name = !sword["Legendary Name"] ? ("#" + sword.name) : (sword["Legendary Name"] + " - #" + sword.name)
      name = !sword["Godly Name"] ? name : (sword["Godly Name"] + " - #" + sword.name)
      rows.push(
        // <div className='sword-item' key={sword.name}>
        //   <img className="sword-img" src={sword.image} />
        //   <p>{!sword["Legendary Name"] ? ("#" + sword.name) : (sword["Legendary Name"] + "#" + sword.name)}</p>
        // </div>
        <Card onClick={(e) => this.handleCardClick(e)} key={sword.name} datakey={i} className='sword-item' style={{ width: '18rem' }}>
          <Card.Img datakey={i} variant="top" src={sword.image} />
          <Card.Body datakey={i}>
            <Card.Title datakey={i}>{name}</Card.Title>
            <Card.Text style={{color: 'rgba(158, 250, 230)'}} datakey={i}>
              {!sword["Legendary Name"] ? (!sword["Godly Name"] ? ("Randomly Generated Blade") : "Godly Blade") : 'Legendary Blade'}
              <br datakey={i}></br>
              <b datakey={i}>{sword.rank == 0 ? 'Rank to be Revealed' : ('Rank - ' + sword.rank)}</b>
            </Card.Text>
            {/* <Button variant="primary">Attack Stats</Button> */}
          </Card.Body>
        </Card>
      )
    }
    return rows;
  }

  handleCardClick(e) {
    console.log(e)
    const selectedIndex = e.target.getAttribute('datakey');
    console.log(selectedIndex)
    this.setState({
      show: true,
      selectedSword: selectedIndex
    })
  }

  handleClick(e) {
    const selectedIndex = e.target.getAttribute('datakey');
    console.log(selectedIndex)
    this.setState({ pageNumber: parseInt(selectedIndex) })
  }

  getPageNumbers() {
    var rows = [];
    var swords = this.state.swords;
    var pageSize = this.state.pageSize;
    var currentPage = this.state.pageNumber;
    for (var i = 1; i < (swords.length / pageSize) + 1; i += 2) {
      rows.push(
        <Pagination.Item key={i} datakey={i} onClick={(e) => this.handleClick(e)} active={i === currentPage}>{i}</Pagination.Item>
      )
    }
    return rows;
  }

  nextPage() {
    if (this.state.pageNumber === Math.ceil(this.state.swords.length / this.state.pageSize)) {

    } else {
      this.setState({
        pageNumber: this.state.pageNumber + 1
      })
    }
  }

  getPages() {
    return (
      <Pagination>
        <Pagination.First onClick={() => this.setState({ pageNumber: 1 })} >First</Pagination.First>
        <Pagination.Prev onClick={() => this.setState({ pageNumber: Math.max(this.state.pageNumber - 1, 1) })} />
        {/* {this.getPageNumbers()} */}
        <Pagination.Next onClick={() => this.nextPage()} />
        <Pagination.Last onClick={() => this.setState({ pageNumber: Math.ceil(this.state.swords.length / this.state.pageSize) })}>
          Last
        </Pagination.Last>
      </Pagination>);
  }

  async getSwordData(options) {
    var headers = { headers: { 'x-api-key': process.env.REACT_APP_API_KEY } }
    var res;
    try {
      res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/getblades', options, headers);
    } catch (e) {
      console.log(e)
      return [];
    }
    if (res.data.errorMessage) {
      return [];
    }

    return res.data.body.blades;
  }

  async handleSelect(options, names) {
    await this.setState({ loading: true })
    if (names === "Blade Type") {
      await this.setState({ bladeType: options ? options.value : null })
    }
    if (names === "Blade Material") {
      await this.setState({ bladeMaterial: options ? options.value : null })
    }
    if (names === "Hilt") {
      await this.setState({ hilt: options ? options.value : null })
    }
    if (names === "Manastone") {
      await this.setState({ manastone: options ? options.value : null })
    }
    if (names === "Manastone Shape") {
      await this.setState({ manastoneShape: options ? options.value : null })
    }
    if (names === "Border") {
      await this.setState({ border: options ? options.value : null })
    }

    await this.setState({pageNumber: 1})
    this.handleCheck()
  }

  makeDropdown(options, name) {
    return (
      <div className="filter multi">
        <p className='filter-text'>{name}</p>
        <Select
          name="filter"
          onChange={(e) => this.handleSelect(e, name)}
          options={options}
          isClearable
          className="box"
          classNamePrefix="select"
        />
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bladeId !== this.state.bladeId) {
      this.handleCheck();
    }
  }

  handleCheck = () => {
    // Clears running timer and starts a new one each time the user types
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getData();
    }, 300);
  }

  getData = async () => {
    var filterObj = {};
    if (this.state.bladeId) {
      filterObj.bladeId = this.state.bladeId;
    }
    if (this.state.bladeType) {
      filterObj.bladeType = this.state.bladeType;
    }
    if (this.state.bladeMaterial) {
      filterObj.bladeMaterial = this.state.bladeMaterial;
    }
    if (this.state.hilt) {
      filterObj.hilt = this.state.hilt;
    }
    if (this.state.manastone) {
      filterObj.manastone = this.state.manastone;
    }
    if (this.state.manastoneShape) {
      filterObj.manastoneShape = this.state.manastoneShape;
    }
    if (this.state.border) {
      filterObj.Background = this.state.border;
    }
    console.log(filterObj)
    var swords = await this.getSwordData(filterObj)
    swords.sort((a, b) => {
      return a.name - b.name;
    });
    await this.setState({
      swords
    })
    await this.setState({ loading: false })

    this.sortBy(this.state.sortMethod);
  }

  async filterEvent(e, filterEvent) {
    await this.setState({ loading: true })
    await this.setState({ pageNumber: 1 })
    if (filterEvent === "bladeId") {
      if (!e.target.value) {
        await this.setState({ bladeId: null })
      } else {
        await this.setState({ bladeId: parseInt(e.target.value) })
      }
    }
  }

  handleClose(e) {
    this.setState({ show: false })
  }

  getSwordTitle() {
    var swords = this.state.swords
    if (swords[this.state.selectedSword]) {
      var sword = swords[this.state.selectedSword]
      var title = !sword["Legendary Name"] ? ("MetaKey Blades #" + sword.name) : (sword["Legendary Name"] + " - #" + sword.name)
      if(sword["Godly Name"]) {
        title = (sword["Godly Name"] + " - #" + sword.name)
      }
      return title
    }
    return ''
  }

  getRank() {
    var swords = this.state.swords
    if (swords[this.state.selectedSword]) {
      var sword = swords[this.state.selectedSword]
      return sword.rank
    }
    return ''
  }

  getSwordDetails() {
    var swords = this.state.swords
    if (swords[this.state.selectedSword]) {
      var sword = swords[this.state.selectedSword]
      console.log(sword)
      return (
        <div className='sword-details'>
          <img className="modal-sword-img" src={sword.image} />
          <div className='rankings'>
          <Tabs defaultActiveKey="rank" id="tab-button" className="mb-3">
            <Tab className='rank' eventKey="rank" title="Rarity">
              <div>
                <div className='rank-item'><p className='rank-text'><b>Trait Count:</b> {sword['Trait Count']}</p>
                  <b className='green'>{'+' + sword.rarity['Trait Count'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Blade Material:</b> {sword['Blade Material']}</p>
                  <b className='green'>{'+' + sword.rarity['Blade Material'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Blade Type:</b> {sword['Blade Type']}</p>
                  <b className='green'>{'+' + sword.rarity['Blade Type'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Hilt:</b> {sword['Hilt']}</p>
                  <b className='green'>{'+' + sword.rarity['Hilt'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Manastone:</b> {sword['Manastone']}</p>
                  <b className='green'>{'+' + sword.rarity['Manastone'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Manastone Shape:</b> {sword['Manastone Shape']}</p>
                  <b className='green'>{'+' + sword.rarity['Manastone Shape'].toFixed(2)}</b></div>
                <div className='rank-item'><p className='rank-text'><b>Border:</b> {sword['Background']}</p>
                  <b className='green'>{'+' + sword.rarity['Background'].toFixed(2)}</b></div>
                {
                  sword["Legendary Name"] ? (
                    <div className='rank-item'><p className='rank-text'><b>Legendary Name:</b> {sword['Legendary Name']}</p>
                      <b className='green'>{'+' + sword.rarity['Legendary Name'].toFixed(2)}</b></div>
                  ) : (
                    sword["Godly Name"] ? (
                      <div className='rank-item'><p className='rank-text'><b>Legendary Name:</b> {sword['Godly Name']}</p>
                        <b className='green'>{'+' + sword.rarity['Godly Name'].toFixed(2)}</b></div>
                    ) : (
                      <></>
                    )
                  )
                }
                <div className='rank-item'><p className='rank-text'><b>Total Score:</b></p> <b className='green'>~{sword['totalScore'].toFixed(2)}</b></div>
                {sword.totalScore == 0 ? <p className='rank-reveal-disclaimer'>***Ranks will be revealed after all blades are minted</p> : ""}
              </div>
            </Tab>
            <Tab eventKey="attack" title="Attack">
              <div>
                Coming soon...
              </div>
            </Tab>
          </Tabs>
          </div>
        </div>)
    }
    return ''
  }

  sortBy(type) {
    if (type === 'ID') {
      var newSwords = this.state.swords.sort((a, b) => {
        return a.name - b.name;
      });
      if (this.state.filterDirection === false) {
        newSwords.reverse();
      }
      this.setState({ swords: newSwords })
      this.setState({ sortMethod: 'ID' })
    }
    if (type === 'rank') {
      var newSwords = this.state.swords.sort((a, b) => {
        return a.rank - b.rank;
      });
      if (this.state.filterDirection === false) {
        newSwords.reverse();
      }
      this.setState({ swords: newSwords })
      this.setState({ sortMethod: 'rank' })
    }
  }

  reverseSort() {
    if (this.state.sortMethod === 'ID') {
      var newSwords = this.state.swords.sort((a, b) => {
        return a.name - b.name;
      })
      if (!this.state.filterDirection === false) {
        newSwords.reverse();
      }
      this.setState({ swords: newSwords })
    }
    if (this.state.sortMethod === 'rank') {
      var newSwords = this.state.swords.sort((a, b) => {
        return a.rank - b.rank;
      })
      if (!this.state.filterDirection === false) {
        newSwords.reverse();
      }
      this.setState({ swords: newSwords })
    }
    this.setState({ filterDirection: !this.state.filterDirection })
  }

  render() {
    return (
      <div className="sword">
        <div className="sword">
          <div className='sword-search'>
            <div>
              <p className='filter-text'>Blade ID</p>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    Search for a blade by <strong>{'ID'}</strong>
                  </Tooltip>
                }
              >
                <InputGroup className="mb-3 filter id">
                  <InputGroup.Text id="basic-addon1">ID</InputGroup.Text>
                  <FormControl
                    placeholder="Blade ID"
                    aria-label="Blade ID"
                    className="bladeID"
                    aria-describedby="basic-addon1"
                    onChange={(e) => this.filterEvent(e, "bladeId")}
                    defaultValue={this.state.bladeId}
                    type="number"
                    min="0"
                  />
                </InputGroup>
              </OverlayTrigger>
            </div>
            {this.makeDropdown(this.state.typeOptions, 'Blade Type')}
            {this.makeDropdown(this.state.materialOptions, 'Blade Material')}
            {this.makeDropdown(this.state.hiltOptions, 'Hilt')}
            {this.makeDropdown(this.state.manastoneOptions, 'Manastone')}
            {this.makeDropdown(this.state.manastoneShapeOptions, 'Manastone Shape')}
            {this.makeDropdown(this.state.borderOptions, 'Border')}
            <div className='filter multi sort'>
              <p className='filter-text' style={{ paddingBottom: "10px" }}>Sort Blades</p>
              <ButtonGroup className="mb-2">
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-top`} hidden={this.state.sortMethod === 'rank'}>
                      Sort results by <strong>rank</strong>
                    </Tooltip>
                  }
                >
                  <Button variant='custom' disabled={this.state.sortMethod === 'rank'} onClick={() => this.sortBy('rank')}>Rank</Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-top`} hidden={this.state.sortMethod === 'ID'}>
                      Sort results by <strong>ID</strong>
                    </Tooltip>
                  }
                >
                  <Button variant='custom' disabled={this.state.sortMethod === 'ID'}
                    onClick={() => this.sortBy('ID')}
                  >ID</Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      Reverse sort order
                    </Tooltip>
                  }
                >
                  <Button variant='custom' onClick={() => this.reverseSort()} className=" sortDirection">
                    <FontAwesomeIcon
                      icon={this.state.filterDirection === true ? faArrowUp : faArrowDown}
                      size="1x" />
                  </Button>
                </OverlayTrigger>
                {/* <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      View your swords in your wallet
                    </Tooltip>
                  }
                >
                <Button className='myBlades' onClick={() => {}}>
                ⚔️ My Blades
                </Button>
                </OverlayTrigger> */}
              </ButtonGroup>
            </div>
          </div>
          {this.state.loading ? (
            <div className='sword-holder'>
              <div class="lds-dual-ring"></div>
            </div>
          ) : (
            <div className='sword-holder'>
              <div className='page-holder'>
                {this.getPages()}
              </div>
              <div className='page-holder'>
                <p>Showing page {this.state.pageNumber} of {Math.ceil(this.state.swords.length / this.state.pageSize)}</p>
              </div>
              {this.getRows()}
            </div>
          )}

          <Modal size='lg' show={this.state.show} onHide={() => this.handleClose()}>
            <Modal.Header className='sword-popup' closeButton>
              <Modal.Title>{this.getSwordTitle()} <p class='right-modal'>{this.getRank() == 0 ? '' : ('Rank ' + this.getRank())}</p></Modal.Title>
            </Modal.Header>
            <Modal.Body className='sword-popup dark'>
              {this.getSwordDetails()}
            </Modal.Body>
            <Modal.Footer className='sword-popup'>
              <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
};

export default Sword;
