import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./utils/interact";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { Button } from "react-bootstrap";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [feedback, setFeedback] = useState("Maybe it's your lucky day!");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) =>{
    setClaimingNft(true);
    blockchain.smartContract.methods.mint(blockchain.account, _amount).send({
      from: blockchain.account,
      value: blockchain.web3.utils.toWei((0.06 * _amount).toString(), "ether")
    }).once("error", (err) => {
      console.log(err);
      setFeedback("Error")
      setClaimingNft(false)
    }).then((receipt) => {
      setFeedback('Success')
      setClaimingNft(false)
    })
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);
 
  useEffect(async () => { //TODO: implement
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    
    addWalletListener(); 
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => { //TODO: implement
    
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
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

  return (
    <div className="Minter">
        {blockchain.account === "" || blockchain.smartContract === null ? (
        <div>
          <s.TextTitle>Connect to the Network</s.TextTitle>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </Button>
          {blockchain.errorMsg !== "" ? (
            <p>{blockchain.errorMsg}</p>
          ) : null}
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center" }}>
              Name: {data.name}.
            </h1>
            <p style={{ textAlign: "center" }}>{feedback}</p>
            <Button
            disabled={claimingNft ? 1:0}
              onClick={(e) => {
                e.preventDefault();
                claimNFTs(1);
              }}
            >
              {claimingNft ? "Processing..." : "Mint 1 NFT"}
            </Button>
            <Button
            disabled={claimingNft ? 1:0}
              onClick={(e) => {
                e.preventDefault();
                claimNFTs(5);
              }}
            >
              {claimingNft ? "Processing..." : "Mint 5 NFT"}
            </Button>
          </div>
        )}
      {/* <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button> */}
    </div>
  );
};

export default Minter;
