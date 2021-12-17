
import React from "react";
import Web3 from "web3";
import { Button, ProgressBar } from 'react-bootstrap'
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import SmartContract from "../contracts/MetaKeyBlades.json";

import axios from 'axios';

import './treasure.css'



class Treasure extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            swords: [],
            wallet: '',
            status: '',
            smartContract: '',
            web3: null,
            blockchain: null,
            errorMsg: '',
            feedback: '',
            bladeId: this.props.bladeId,
            isOwner: false
        };

        this.timer = null;

    }

    async connect() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const networkId = await window.ethereum.request({
                    method: "net_version",
                });
                var web3 = this.state.web3
                console.log(networkId)
                const NetworkData = await SmartContract.networks[networkId];
                console.log('test' + NetworkData)
                if (/*NetworkData*/networkId == 4) {
                    const SmartContractObj = new web3.eth.Contract(
                        SmartContract.abi,
                        // NetworkData.address
                        //Rinkeby test contract
                        "0x73727B0Cc45cAa049A738c6e4c71207ec967e81c"
                        //Live Contract
                        //"0x8bEa2b168fb0E5935bd251B1BccB142FEd006171"
                    );
                    await this.setState({
                        wallet: accounts[0],
                        smartContract: SmartContractObj,
                        web3: web3,
                    })
                } else {
                    this.connectFailed("Please change to main ETH net.");
                }
            } catch (err) {
                this.connectFailed("Something went wrong.");
            }
        } else {
            this.connectFailed("Please install Metamask.");
        }
    }

    claimNFTs = (_amount) => {
        this.setClaimingNft(true);
        var smartContract = this.state.smartContract;
        var wallet = this.state.wallet
        var web3 = this.state.web3
        try {
            smartContract.methods.mint(wallet, _amount).send({
                from: wallet,
                value: web3.utils.toWei((0.03 * _amount).toString(), "ether")
            }).then((receipt) => {
                this.setFeedback('Token(s) Successfully Minted!')
                this.setClaimingNft(false)
            }).catch((err) => {
                console.log(err)
                this.setFeedback("Transaction failed")
                this.setClaimingNft(false)
            })
        } catch (err) {
            console.log(err);
            this.setFeedback("There was an error or you are on the wrong network.")
            this.setClaimingNft(false)
        }
    };

    async setOwnership(){
        try{
            var res = await this.ownerOf(this.state.bladeId)
            await this.setState({isOwner: res})
        } catch(e){
            console.log(e)
        }
    }

    async componentDidMount() {
        const { address, status } = await getCurrentWalletConnected();
        this.setWallet(address)
        this.setStatus(status);

        console.log(this.state.smartContract)

        await this.addWalletListener();
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            await this.setOwnership()
        }
    }

    connectFailed(errorMsg) {
        this.setState({ errorMsg })
    }

    setWallet(wallet) {
        this.setState({
            wallet
        })
    }

    setStatus(status) {
        this.setState({
            status
        })
    }

    setFeedback(feedback) {
        this.setState({
            feedback
        })
    }

    setClaimingNft(claimingNft) {
        this.setState({
            claimingNft
        })
    }

    async ownerOf(bladeId) {
        var smartContract = this.state.smartContract
        var wallet = this.state.wallet
        var web3 = this.state.web3
        var owner
        try{
            owner = await smartContract.methods.ownerOf(bladeId).call()
        } catch(e){
            console.log(e)
        }
        if(owner.toLowerCase() === wallet.toLowerCase()){
            return true
        }
        return false
    }

    connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        await this.setStatus(walletResponse.status);
        await this.setWallet(walletResponse.address);
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            await this.setOwnership()
        }
    };

    async addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length) {
                    this.setWallet(accounts[0]);
                    this.setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    this.setWallet("");
                    this.setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        } else {
            this.setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    handleClaim = async () => {
        const publicAddress = this.state.wallet
        var signData = await this.handleSignMessage(publicAddress)

        // Now verify the signData
        var authenticated = await this.getAuth(publicAddress, signData)

        if(authenticated){
            // Check claim or generate JWT token on backend???
        } else {
            await this.setState({
                feedback: "Authentication signing failed."
            })
        }
    }

    getAuth = async (publicAddress, signData)=> {
        var res;
        var headers = { headers: { 'x-api-key': process.env.REACT_APP_API_KEY } }
        var options = {
            address: publicAddress,
            signature: signData
        }
        console.log(signData)
        try {
            res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/auth', options, headers);
        } catch (e) {
            console.log(e)
            return false;
        }

        if(res.data.statusCode === 200){
            return true
        } else {
            return false
        }
    }

    getUser = async (publicAddress)=> {
        var res;
        var headers = { headers: { 'x-api-key': process.env.REACT_APP_API_KEY } }
        var options = {
            address: publicAddress
        }
        try {
            res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/users', options, headers);
        } catch (e) {
            console.log(e)
            return -1;
        }

        console.log(res.data)
        return res.data.nonce
    }

    handleSignMessage = async (publicAddress) => {
        var web3 = this.state.web3;

        var nonce = await this.getUser(publicAddress.toLowerCase())
        console.log(publicAddress.toLowerCase())

        var signData = await web3.eth.personal.sign("Sigining to check claim: " + nonce, publicAddress.toLowerCase())
        return signData
    };

    async handleSelect(options, names) {
        await this.setState({
            mintingAmount: options.value
        })
    }


    render() {
        var wallet = this.state.wallet
        var feedback = this.state.feedback

        return (
            <div>
                <div className="treasure">
                    <Button id="walletButton" className='btn2' onClick={this.connectWalletPressed}>
                        {wallet.length > 0 ? (
                            "Wallet: " +
                            String(wallet).substring(0, 6) +
                            "..." +
                            String(wallet).substring(38)
                        ) : (
                            <span>Connect Wallet to Verify Blade Ownership ⚔️</span>
                        )}
                    </Button>
                    <div className='minter'>
                        {wallet.length > 0 ? (
                            <div className='btn-holder'>
                                {this.state.isOwner ? 
                                <Button id="walletButton"
                                 className='btn2' 
                                 onClick={this.handleClaim}>
                                    Check for Treasure Reward 💰
                                </Button> 
                                : <p>You are not the owner of this blade...</p>}
                            </div>
                        ) : (<></>)}
                    </div>
                    <b><p style={{ textAlign: "center", color: "darkred" }}>{feedback}</p></b>
                </div>
            </div>
        );
    }
};

export default Treasure;
