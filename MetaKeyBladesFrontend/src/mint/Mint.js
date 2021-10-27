
import React from "react";
import Web3 from "web3";
import {Button} from 'react-bootstrap'
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import SmartContract from "../contracts/SmartContract.json";



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
            feedback: ''
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
                console.log(web3)
                const NetworkData = await SmartContract.networks[networkId];
                if (networkId == 4) {
                    const SmartContractObj = new web3.eth.Contract(
                        SmartContract.abi,
                        // NetworkData.address
                        //Rinkeby test contract
                        "0x497300D61a706d773F0B224a5cb77cef0E4563Bb"
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
        try{
            smartContract.methods.mint(wallet, _amount).send({
                from: wallet,
                value: web3.utils.toWei((0.06 * _amount).toString(), "ether")
            }).then((receipt) => {
                this.setFeedback('Success')
                this.setClaimingNft(false)
            }).catch((err) => {
                console.log(err)
                this.setFeedback("Transaction failed")
                this.setClaimingNft(false)
            })
        } catch (err){
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
        if(this.state.wallet !== ''){
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()
        }
    }

    connectFailed(errorMsg){
        this.setState({errorMsg})
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

    connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        await this.setStatus(walletResponse.status);
        await this.setWallet(walletResponse.address);
        if(this.state.wallet !== ''){
            await this.setState({ web3: new Web3(window.ethereum) });
            await this.connect()
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


    render() {
        var wallet = this.state.wallet
        var errorMsg = this.state.errorMsg
        var feedback = this.state.feedback
        var claimingNft = this.state.claimingNft
        return (
            <div className="mint">
                <button id="walletButton" onClick={this.connectWalletPressed}>
                    {wallet.length > 0 ? (
                        "Connected: " +
                        String(wallet).substring(0, 6) +
                        "..." +
                        String(wallet).substring(38)
                    ) : (
                        <span>Connect Wallet</span>
                    )}
                </button>
                {wallet.length > 0 ? (
                    <div>
                        <h1 style={{ textAlign: "center" }}>
                            MetaKey Blades 
                        </h1>
                        <p style={{ textAlign: "center" }}>{feedback}</p>
                        <Button
                            disabled={this.state.claimingNft ? 1 : 0}
                            onClick={(e) => {
                                e.preventDefault();
                                this.claimNFTs(1);
                            }}
                        >
                            {claimingNft ? "Processing..." : "Mint 1 NFT"}
                        </Button>
                        <Button
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                                e.preventDefault();
                                this.claimNFTs(5);
                            }}
                        >
                            {claimingNft ? "Processing..." : "Mint 5 NFT"}
                        </Button>
                    </div>
                ) : (<></>)}
            </div>
        );
    }
};

export default Mint;
