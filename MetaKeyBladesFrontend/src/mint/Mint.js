
import React from "react";
import Web3 from "web3";
import { Button, ProgressBar } from 'react-bootstrap'
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import SmartContract from "../contracts/MetaKeyBlades.json";

import Select from 'react-select';

import swordGIF from '../img/slideshow.gif'

import './Mint.css'



class Mint extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            swords: [],
            wallet: '',
            status: '',
            claimingNft: false,
            smartContract: '',
            web3: null,
            blockchain: null,
            errorMsg: '',
            feedback: '',
            totalSupply: '',
            totalMinted: '',
            typeOptions: [
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
                { value: 5, label: 5 },
                { value: 6, label: 6 },
                { value: 7, label: 7 },
                { value: 8, label: 8 },
                { value: 9, label: 9 },
                { value: 10, label: 10 }
            ],
            mintingAmount: 1
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
                if (/*NetworkData*/networkId == 1) {
                    const SmartContractObj = new web3.eth.Contract(
                        SmartContract.abi,
                        // NetworkData.address
                        //Rinkeby test contract
                        //"0x73727B0Cc45cAa049A738c6e4c71207ec967e81c"
                        //Live Contract
                        "0x8bEa2b168fb0E5935bd251B1BccB142FEd006171"
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
                value: web3.utils.toWei((0.06 * _amount).toString(), "ether")
            }).then((receipt) => {
                this.setFeedback('Token(s) Successfully Minted!')
                this.setClaimingNft(false)
                this.getTotals()
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

    getTotals(){
        this.state.smartContract.methods.totalSupply().call().then((data) => {
            this.setState({ totalMinted: data })
        }).catch((err) => {
            console.log(err)
        })

        this.state.smartContract.methods.maxSupply().call().then((data) => {
            this.setState({ totalSupply: data })
        }).catch((err) => {
            console.log(err)
        })
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

            try {
                this.getTotals()
            } catch (e) {
                this.setFeedback('You are on the wrong network! Please connect to ETH mainnet')
            }
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

    walletOfOwner() {
        var smartContract = this.state.smartContract
        var wallet = this.state.wallet
        var web3 = this.state.web3
        try {
            console.log(smartContract.methods)
            smartContract.methods.walletOfOwner(wallet).call().then((data) => {
                console.log(data)
            }).catch((err) => {
                console.log(err)
            })
        } catch (err) {
            console.log(err);
        }
    }

    connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        await this.setStatus(walletResponse.status);
        await this.setWallet(walletResponse.address);
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            try{
                this.state.smartContract.methods.totalSupply().call().then((data) => {
                    this.setState({
                        totalMinted: data
                    })
                }).catch((err) => {
                    console.log(err)
                })
    
                this.state.smartContract.methods.maxSupply().call().then((data) => {
                    this.setState({
                        totalSupply: data
                    })
                }).catch((err) => {
                    console.log(err)
                })
            } catch(e){

            }
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

    async handleSelect(options, names) {
        await this.setState({
            mintingAmount: options.value
        })
    }


    render() {
        var wallet = this.state.wallet
        var errorMsg = this.state.errorMsg
        var feedback = this.state.feedback
        var claimingNft = this.state.claimingNft
        var totalMinted = this.state.totalMinted
        var maxSupply = this.state.totalSupply

        return (
            <div>
                <div className="mint">
                    <div className='info'>
                        <h1>Mint a MetaKey Blade</h1>
                        <p>Mint price is 0.06 ETH for each ERC721 Token</p>
                    </div>
                    <Button id="walletButton" className='btn2' onClick={this.connectWalletPressed}>
                        {wallet.length > 0 ? (
                            "Wallet: " +
                            String(wallet).substring(0, 6) +
                            "..." +
                            String(wallet).substring(38)
                        ) : (
                            <span>Connect Wallet</span>
                        )}
                    </Button>
                    <div className='minter'>
                        {wallet.length > 0 ? (
                            <div class='btn-holder'>
                                <div class='total'>
                                    <h2>{totalMinted ? totalMinted : 0}/{maxSupply ? maxSupply : 1500} minted</h2>
                                </div>
                                <div class='progress'>
                                    <ProgressBar now={((totalMinted / maxSupply) * 100)} />
                                </div>
                                <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                                    Select amount to mint
                                </h2>
                                <div className='mint-action'>
                                    <Select
                                        name="filter"
                                        onChange={(e) => this.handleSelect(e)}
                                        options={this.state.typeOptions}
                                        defaultValue={this.state.typeOptions[0]}
                                        className="mint-select select2"
                                        classNamePrefix="test"
                                    />
                                    <Button
                                        disabled={this.state.claimingNft ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.claimNFTs(this.state.mintingAmount);
                                        }}
                                        className='mint-button btn2'
                                    >
                                        {claimingNft ? "Loading..." : "Mint"}
                                    </Button>
                                </div>
                            </div>
                        ) : (<></>)}
                    </div>
                    <b><p style={{ textAlign: "center", color: "darkred" }}>{feedback}</p></b>
                    <div class='img-holder'>
                        <img class='slideshowGIF' src={swordGIF}></img>
                    </div>
                </div>
                <div className='footer'>
                    <div className='footerText'>
                        <h1>Join the Community</h1>
                        <p className="listItem">Come talk to us in Discord if you have any questions or concerns.</p>
                        <button className='footer-button'><a className="footerDisc" href="https://discord.gg/metakeyblades">Join Our Discord</a></button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Mint;
