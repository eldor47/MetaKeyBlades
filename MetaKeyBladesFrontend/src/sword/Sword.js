import React from "react";

import axios from 'axios';

import { Button, InputGroup, FormControl, OverlayTrigger, Tooltip, Pagination, Card, Modal } from 'react-bootstrap';

import Select from 'react-select';

import './Sword.css'


class Sword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      swords: [],
      pageSize: 10,
      pageNumber: 1,
      loading: true,
      bladeId: -1,
      checked: false,
      show: false,
      selectedSword: 0,
      options: [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]
    };

    this.timer = null;
    
  }

  async componentDidMount() {
      var initialSwords = await this.getSwordData({})
      initialSwords.sort((a, b) => {
        return a.name - b.name;
      });
      this.setState({swords: initialSwords})
      this.setState({loading: false})
  }

  getRows() {
    var pageSize = this.state.pageSize
    var swords = this.state.swords
    var pageNumber = this.state.pageNumber
    
    var rows = []
    var count = 0;
    for (var i = (pageNumber-1)*pageSize; i < pageSize * pageNumber && swords.length > 0 && i < swords.length; i++) {
      var sword = swords[i]
      rows.push(
        // <div className='sword-item' key={sword.name}>
        //   <img className="sword-img" src={sword.image} />
        //   <p>{!sword["Legendary Name"] ? ("#" + sword.name) : (sword["Legendary Name"] + "#" + sword.name)}</p>
        // </div>
        <Card onClick={(e)=>this.handleCardClick(e)} key={sword.name} datakey={i} className='sword-item' style={{ width: '18rem' }}>
        <Card.Img datakey={i} variant="top" src={sword.image} />
        <Card.Body datakey={i}>
          <Card.Title datakey={i}>{!sword["Legendary Name"] ? ("#" + sword.name) : (sword["Legendary Name"] + " - #" + sword.name)}</Card.Title>
          <Card.Text datakey={i}>
          {!sword["Legendary Name"] ? ("This is a Randomly Generated Blade") : 'This is a Legendary Blade'}
          </Card.Text>
          {/* <Button variant="primary">Attack Stats</Button> */}
        </Card.Body>
        </Card>
      )
      count++;
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
    this.setState({pageNumber: selectedIndex})
  }

  getPageNumbers(){
    var rows = [];
    var swords = this.state.swords;
    var pageSize = this.state.pageSize;
    var currentPage = this.state.pageNumber;
    for(var i = 1; i < (swords.length / pageSize)+1; i++){
      rows.push(
        <Pagination.Item key={i} datakey={i} onClick={(e) => this.handleClick(e)} active={i==currentPage}>{i}</Pagination.Item>
      )
    }
    return rows;
  }
  
  getPages() {
    return (<Pagination>
      <Pagination.First onClick={()=>this.setState({pageNumber: 1})} />
      <Pagination.Prev onClick={()=>this.setState({pageNumber: this.state.pageNumber-1})}/>
      {this.getPageNumbers()}
      <Pagination.Next onClick={()=>this.setState({pageNumber: this.state.pageNumber+1})}/>
      <Pagination.Last onClick={()=>this.setState({pageNumber: Math.floor(this.state.swords.length / this.state.pageSize)})}/>
    </Pagination>);
  }

  async getSwordData(options) {
    var headers = {headers: {'x-api-key': 'kVEsMM7Kwy8Ow1o7ES4W71MoLAeMcWyK3LizKOca'}}
    var res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/getblades', options, headers);
    //swords = res.data.body.blades
    return res.data.body.blades;
  }

  handleSelect(options) {
    console.log(options)
  }

  makeDropdown(options, name) {
    return (
      <div className="filter multi">
        <p><b>{name}</b></p>
        <Select
          isMulti
          name="filter"
          onChange={this.handleSelect}
          options={this.state.options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    )
  }

  componentDidUpdate (prevProps, prevState) {
    if(prevState.bladeId !== this.state.bladeId) {
      this.handleCheck();
    }
  }

  handleCheck = () => {
    // Clears running timer and starts a new one each time the user types
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getData();
    }, 500);
  }

  getData = async () => {
    var swords = await this.getSwordData({bladeId: this.state.bladeId})
    swords.sort((a, b) => {
      return a.name - b.name;
    });
    await this.setState({
      swords 
    })
    await this.setState({loading: false})
  }

  async filterEvent(e, filterEvent){
    await this.setState({loading: true})
    await this.setState({pageNumber: 1})
    if(filterEvent == "bladeId"){
      if(!e.target.value){
        await this.setState({bladeId: -1})
      }else {
        await this.setState({bladeId: parseInt(e.target.value)})
      }
    }
  }

  handleClose(e){
    this.setState({show: false})
  }

  getSwordTitle(){
    var swords = this.state.swords
    if(swords[this.state.selectedSword]){
      var sword = swords[this.state.selectedSword]
      return !sword["Legendary Name"] ? ("#" + sword.name) : (sword["Legendary Name"] + " - #" + sword.name)
    }
    return ''
  }

  getSwordDetails(){
    var swords = this.state.swords
    if(swords[this.state.selectedSword]){
      var sword = swords[this.state.selectedSword]
      console.log(sword)
      return (<div className='sword-details'>
        <p><b>Blade Material:</b> {sword['Blade Material']}</p>
        <p><b>Blade Type:</b> {sword['Blade Type']}</p>
        <p><b>Hilt:</b> {sword['Hilt']}</p>
        <p><b>Manastone:</b> {sword['Manastone']}</p>
        <p><b>Manastone Shape:</b> {sword['Manastone Shape']}</p>
        <p><b>Border:</b> {sword['Background']}</p>
        {
          sword["Legendary Name"] ? (
            <p><b>Legendary Name:</b> {sword['Legendary Name']}</p>
          ) : (
            <p><b>Legendary Name:</b> N/A</p>
          )
        }
      </div>)
    }
    return ''
  }

  render() {
    var swords = this.state.swords;
    return (
    <div className="sword">
        <div className="sword">
          <div className='sword-search'>
            <div>
              <p><b>Blade ID</b></p>
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
                    aria-describedby="basic-addon1"
                    onChange={(e) => this.filterEvent(e, "bladeId")}
                    type="number"
                    min="0"
                  />
                </InputGroup>
              </OverlayTrigger>
            </div>
            {this.makeDropdown(this.state.options, 'Blade Type')}
            {this.makeDropdown(this.state.options, 'Blade Material')}
            {this.makeDropdown(this.state.options, 'Hilt')}
            {this.makeDropdown(this.state.options, 'Manastone')}
            {this.makeDropdown(this.state.options, 'Manastone Shape')}
            {this.makeDropdown(this.state.options, 'Border')}
            <Button className='search-button'>Search</Button>
          </div>
          { this.state.loading ? (
          <div className='sword-holder'>
            <div class="lds-dual-ring"></div>
          </div>
          ) : (
            <div className='sword-holder'>
              {this.getRows()}
              <div className='page-holder'>
                {this.getPages()}
              </div>
            </div>
          )}

        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getSwordTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getSwordDetails()}</Modal.Body>
          <Modal.Footer>
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
