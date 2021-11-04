
import React from "react";
import Web3 from "web3";
import { Button, ProgressBar } from 'react-bootstrap'
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import SmartContract from "../contracts/SmartContract.json";

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
                if (NetworkData/*networkId == 4*/) {
                    const SmartContractObj = new web3.eth.Contract(
                        SmartContract.abi,
                        NetworkData.address
                        //Rinkeby test contract
                        //"0x497300D61a706d773F0B224a5cb77cef0E4563Bb"
                    );
                    await this.setState({
                        wallet: accounts[0],
                        smartContract: SmartContractObj,
                        web3: web3,
                    })
                    // Add listeners end
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
                this.setFeedback('Token Successfully Minted!')
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

    async componentDidMount() {
        const { address, status } = await getCurrentWalletConnected();
        this.setWallet(address)
        this.setStatus(status);

        console.log(this.state.smartContract)

        await this.addWalletListener();
        if (this.state.wallet !== '') {
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()

            this.state.smartContract.methods.totalSupply().call().then((data) => {
                this.setState({ totalMinted: data})
            }).catch((err) => {
                console.log(err)
            })

            this.state.smartContract.methods.maxSupply().call().then((data) => {
                this.setState({ maxSupply: data})
            }).catch((err) => {
                console.log(err)
            })
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

    walletOfOwner(){
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
            
            this.state.smartContract.methods.totalSupply().call().then((data) => {
                console.log(data)
            }).catch((err) => {
                console.log(err)
            })

            this.state.smartContract.methods.maxSupply().call().then((data) => {
                console.log(data)
            }).catch((err) => {
                console.log(err)
            })
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
        var maxSupply = this.state.maxSupply

        return (
            <div className="mint">
                <div className='info'>
                    <h1>Mint a MetaKey Blade</h1>
                    <p>Mint price is 0.06 ETH for each ERC721 Token</p>
                </div>
                <div class='total'>
                    <h2>{totalMinted}/{maxSupply} minted</h2>
                </div>
                <div class='progress'>
                    <ProgressBar now={(totalMinted / maxSupply)} />
                </div>
                <div className='minter'>
                    <Button id="walletButton" onClick={this.connectWalletPressed}>
                        {wallet.length > 0 ? (
                            "Wallet: " + 
                            String(wallet).substring(0, 6) +
                            "..." +
                            String(wallet).substring(38)
                        ) : (
                            <span>Connect Wallet</span>
                        )}
                    </Button>
                    {wallet.length > 0 ? (
                        <div class='btn-holder'>
                            <h2 style={{ textAlign: "center" }}>
                                Mint MKB Token
                            </h2>
                            <p style={{ textAlign: "center" }}>{feedback}</p>
                            <Select
                                name="filter"
                                onChange={(e) => this.handleSelect(e)}
                                options={this.state.typeOptions}
                                defaultValue={this.state.typeOptions[0]}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                />
                            <Button
                                disabled={this.state.claimingNft ? 1 : 0}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.claimNFTs(this.state.mintingAmount);
                                }}
                            >
                                {claimingNft ? "Processing..." : "Mint"}
                            </Button>
                            {/* <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.walletOfOwner();
                                }}
                            >
                                {claimingNft ? "Processing..." : "My Swords"}
                            </Button> */}
                        </div>
                    ) : (<></>)}
                    <div class='img-holder'>
                        <img class='slideshowGIF' src={swordGIF}></img>
                    </div>
                </div>
            </div>
        );
    }
};

export default Mint;
