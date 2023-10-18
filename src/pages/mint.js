import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WalletConnect from "../components/walletConnect";
import Logo from "../assets/logo.svg";
import TicketPlaceholder from "../assets/Ticket.png";
import OrangeSmile from "../assets/orangeSmile.svg";
import whiteSmile from "../assets/whiteSmile.svg";
import Ticket from "../assets/TicketMint.svg";
import "./style.css";
import Arrow from "../assets/Icon.png";
import Minus from "../assets/Minus.png";
import Plus from "../assets/Plus.png";
import { TT, Navbar, ProfileContainer, YY } from "./profile";
import { getConfig } from "../config/config";
import {
  erc20ABI,
  mainnet,
  sepolia,
  useAccount,
  useContractRead,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { BigNumber, ethers } from "ethers";
import ApproveUsdc from "../components/ApproveUsdc";
import MintTicket from "../components/MintTicket";
import ticketAbi from "../ethereum/build/TicketAbi.json";
import { optimism } from "wagmi/chains";

import { wertDetails as wert } from "../config/utils";
import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";

import Web3 from "web3";

// const { network } = getConfig;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2vw;
  min-height: 100vh;
  background: #e5dcd0;

  @media screen and (max-width: 768px) {
    padding: 0 20px 50px 20px;
  }
`;

// export const Navbar = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

export const TicketDisplayContainer = styled.div``;

export const Footer = styled.div`
  margin-top: auto;
`;

// const YY = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-between;
//   align-items: center;
// `;
// export const ProfileContainer = styled.div`
//   width: 80px;
//   margin: 0 50px;
//   height: 80px;
//   border-radius: 100px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border: 1px solid #bc563c;
//   :hover {
//     background: #bc563c;
//     .smile {
//       content: url(${whiteSmile});
//     }
//   }
// `;

export const FooterDescriptionTitle = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 48px;
  line-height: 48px;
  text-align: left;
  color: #424242;
  width: 100%;

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;

export const FooterDescription = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  color: #424242;
  text-align: left;
  width: 100%;
  margin-bottom: 8px;

  @media screen and (max-width: 768px) {
  }
`;

export const MintContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    padding: 0 0 40px 0;
  }
`;

export const TicketVideoWrapper = styled.div`
  margin: 0 200px;
  @media screen and (max-width: 767px) {
    margin: 0;
  }
`;
export const TicketInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: -125px;
  align-items: flex-start;
  padding: 16px;
  position: relative; /* added this */

  @media screen and (max-width: 767px) {
    width: 100%;
    padding: 20px 0 20px 0;
    margin: 0;
  }
`;

const Line = styled.div`
  border-bottom: 1px solid #bc563c;
  width: 350px;
  margin-top: 40px;

  @media screen and (max-width: 767px) {
    width: 100%;
    margin: 20px auto;
  }
`;

const FiatText = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 20px;
  text-align: left;
  color: #424242;
  display: inline-block;

  margin: 10px 70px 0 0;

  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 767px) {
    text-align: center;
    margin: 0 60px 0 0;
    font-size: 20px;
  }
`;

const TicketInfoContainer = styled.div`
  margin: 50px 0 10px 0;
  align-items: center;
  text-align: left;

  @media screen and (max-width: 767px) {
    margin: 20px 0;
  }
`;

const HeadingSmall = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #424242;
  display: inline;
  margin: 0 80px 0 0;

  @media screen and (max-width: 767px) {
    margin: 0 50px 0 0;
  }
`;

const HeadingSmallOrange = styled(HeadingSmall)`
  color: #bc563c;
`;

const TicketPrice = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-decoration-line: line-through;
  display: inline-block;
  color: #424242;
  text-align: left;
`;

const TicketPriceOrange = styled(TicketPrice)`
  color: #bc563c;
  font-size: 24px;
  text-decoration-line: none;
  margin: 20px 10px;

  @media screen and (max-width: 767px) {
    margin: 10px 5px 0 0;
  }
`;

export const TicketPriceBlack = styled.div`
  color: #bc563c;
  font-size: 24px;
  color: #424242;
  font-family: "Dahlia-Bold";

  @media screen and (max-width: 767px) {
    margin: 10px 5px 0 0;
  }

  a {
    text-decoration: none;
  }
`;

export const BuyWithContainer = styled.div`
  display: inline;
`;
export const CounterWrapper = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 19px;
  display: inline-block;
  color: #424242;
  text-align: left;
  margin-left: -100px;

  @media screen and (max-width: 767px) {
    margin-left: 0;
  }
`;

const Counter = ({ numberOfTokens, setNumberOfTokens }) => {
  const incrementCount = () => {
    setNumberOfTokens(numberOfTokens + 1);
  };

  const decrementCount = () => {
    setNumberOfTokens(numberOfTokens - 1 > 1 ? numberOfTokens - 1 : 1);
  };

  return (
    <div>
      <img src={Minus} className="minus" onClick={decrementCount} />
      {numberOfTokens}
      <img src={Plus} className="add" onClick={incrementCount} />
    </div>
  );
};

const Mint = () => {
  const { address, isConnected } = useAccount();
  const [numberOfTokens, setNumberOfTokens] = useState(1);
  const [approved, setApproved] = useState();
  const [lowBalance, setLowBalance] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const useChain =
    chain?.id in getConfig
      ? chain
      : getConfig.env === "testnet"
      ? sepolia
      : mainnet;

  const tokenToPay = "usdc";

  let bignumber = ethers.BigNumber.from(0);

  // let waveRead = { price: bignumber }; //contractRead?.[0]; //
  // let allowance = bignumber; //contractRead?.[1]; // ;
  // let usdcBalance = bignumber;

  // const { data: contractRead } = useContractReads({
  //   contracts: [
  //     {
  //       address: getConfig.ticketContractAddress,
  //       abi: ticketAbi,
  //       functionName: "waves",
  //       args: [ethers.BigNumber.from("0")],
  //       chainId: network.id,
  //     },
  //     {
  //       address: getConfig.usdcAddress,
  //       abi: erc20ABI,
  //       functionName: "allowance",
  //       args: [address, getConfig.ticketContractAddress],
  //       chainId: network.id,
  //     },
  //   ],
  // });

  const { data: usdcBalance = bignumber } = useContractRead({
    address: getConfig?.[useChain?.id]?.[tokenToPay]?.address,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: getConfig?.[useChain?.id]?.network?.id,
  });

  const { data: waveRead = { price: bignumber } } = useContractRead({
    address: getConfig?.[useChain?.id]?.ticketContractAddress,
    abi: getConfig?.[useChain?.id]?.ticketAbi,
    functionName: "waves",
    args: [
      ethers.BigNumber.from(getConfig?.[useChain?.id]?.waveNum.toString()),
    ],
    chainId: getConfig?.[useChain?.id]?.network?.id,
  });

  // console.log({ waveRead });

  const { data: allowance = bignumber } = useContractRead({
    address: getConfig?.[useChain?.id]?.[tokenToPay]?.address, //.usdcAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, getConfig?.[useChain?.id]?.ticketContractAddress],
    chainId: getConfig?.[useChain?.id]?.network?.id,
  });

  // waveRead = waveRead1 ? waveRead1 : waveRead;
  // allowance = allowance1 ? allowance1 : allowance;

  // console.log(" contract read: ", contractRead);

  // console.log("wave read: ", waveRead?.price?.mul(numberOfTokens)?.toString());
  // console.log(
  //   "low bal: ",
  //   usdcBalance.lt(waveRead?.price?.mul(numberOfTokens))
  // );
  // console.log("number of tokens: ", numberOfTokens);
  // console.log("allowance: ", allowance);
  // console.log(`USDC balance of ${address}: `, usdcBalance.toString());

  // const data = [allowance, waveRead];

  // const data = [bignumber, { price: bignumber }];

  useEffect(() => {
    setLowBalance(usdcBalance.lt(waveRead?.price?.mul(numberOfTokens)));
    setApproved(allowance >= waveRead?.price?.mul(numberOfTokens));
  }, [waveRead, allowance, numberOfTokens, isConnected, address]);

  const openWertWidget = () => {
    console.log("opening wert widget...");
    // Get user address
    const web3 = new Web3();
    const userAddress = address;

    console.log({ userAddress });

    let mint_nft = wert.mintAbi;
    let mint_args = [wert.waveNum, userAddress, 1];

    // Encode the call to mintNFT(address = userAddress, numberOfTokens = 1)
    const scInputData = web3.eth.abi.encodeFunctionCall(mint_nft, mint_args);
    const privateKey = wert.privateKey;

    // Create signed SC data for wert-widget
    // Please do this on backend
    const signedData = signSmartContractData(
      {
        address: userAddress, // user's address
        commodity: wert.commodity,
        commodity_amount: wert.ticketPrice, // the crypto amount that should be sent to the contract method
        network: wert.network,
        sc_address: wert.contractAddress, //"0x6af35a72b2490a44c0e88ae635b9b38516544db1", // your SC address
        sc_input_data: scInputData,
      },
      privateKey
    );
    const otherWidgetOptions = {
      partner_id: wert.partnerId, // your partner id
      click_id: uuidv4(), // unique id of purhase in your system
      origin: wert.origin, // this option needed only in sandbox
    };
    const nftOptions = {
      extra: {
        item_info: {
          author: "ETH Barcelona",
          image_url:
            "https://tickets.ethbarcelona.com/static/media/TicketMint.5a295194b77a5635019e46708d84e06e.svg", // "./Ticket.png",
          name: "ETH Barcelona Tickets",
          seller: "ETH BCN",
        },
      },
    };

    const wertWidget = new WertWidget({
      ...signedData,
      ...otherWidgetOptions,
      ...nftOptions,
    });

    wertWidget.mount();
  };

  return (
    <div>
      <Container>
        <Navbar>
          <a href="/https://ethbarcelona.com/">
            {" "}
            <img src={Logo} className="logo" />
          </a>
          <YY>
            <TT>
              <WalletConnect></WalletConnect>
            </TT>
            <ProfileContainer>
              {" "}
              <a href="/">
                <img src={OrangeSmile} className="smile" />
              </a>
            </ProfileContainer>
          </YY>
        </Navbar>

        <MintContainer>
          <TicketVideoWrapper>
            <img src={Ticket} className="mintTicket" />
            {/* <video
              src="https://firebasestorage.googleapis.com/v0/b/eth-bcn-2023.appspot.com/o/Ticket%20Animation.mp4?alt=media&token=bee93d8d-7d38-4083-8d16-cd25ef959332"
              controls
              className="mintTicket"
            ></video> */}
          </TicketVideoWrapper>
          <TicketInfoWrapper>
            <FooterDescription>ETHBarcelona</FooterDescription>
            <FooterDescriptionTitle>
              General <br /> Attendee Ticket
            </FooterDescriptionTitle>
            <TicketInfoContainer>
              <HeadingSmall>
                Price <HeadingSmallOrange>-6%</HeadingSmallOrange>
              </HeadingSmall>

              <HeadingSmall>
                {waveRead?.minted?.toString()}/{waveRead?.supply?.toString()}
              </HeadingSmall>

              <br />
              <TicketPrice>
                $ 499 USDC
                <TicketPriceOrange>
                  {/* $ 399  */}&nbsp;$&nbsp;
                  {waveRead?.price /
                    (getConfig.env === "mainnet" ? 10 ** 6 : 10 ** 18)}
                </TicketPriceOrange>
              </TicketPrice>

              <CounterWrapper>
                <Counter
                  numberOfTokens={numberOfTokens}
                  setNumberOfTokens={setNumberOfTokens}
                />
              </CounterWrapper>
              <TicketPriceBlack>
                Total cost:&nbsp;
                <TicketPriceOrange>
                  $
                  {waveRead?.price?.mul(numberOfTokens) /
                    (getConfig.env === "mainnet" ? 10 ** 6 : 10 ** 18)}{" "}
                  USDC
                </TicketPriceOrange>{" "}
              </TicketPriceBlack>

              {/* <TicketPriceBlack>
                USDC balance:
                <TicketPriceOrange>
                  ${ethers.utils.formatEther(usdcBalance)}
                </TicketPriceOrange>{" "}
              </TicketPriceBlack> */}
            </TicketInfoContainer>

            {!isConnected ? (
              <div className="mintHomePage">
                {" "}
                <WalletConnect label={"Mint"} />
              </div>
            ) : lowBalance ? (
              <div>balance is low</div>
            ) : !approved ? (
              <ApproveUsdc
                lowBalance={lowBalance}
                ticketPrice={waveRead?.price}
                numberOfTokens={numberOfTokens}
                setApproved={setApproved}
              />
            ) : (
              <MintTicket
                lowBalance={lowBalance}
                numberOfTokens={numberOfTokens}
              />
            )}
            <Line></Line>
            <BuyWithContainer>
              <a href="https://ethbarcelona.myshopify.com/">
                <FiatText>
                  Buy with <img src={Arrow} className="arrow" /> <br /> Shopify
                </FiatText>
              </a>

              {chain?.id === 1 ? (
                <FiatText onClick={() => switchNetwork?.(optimism.id)}>
                  Buy on <img src={Arrow} className="arrow" /> <br /> Optimism
                </FiatText>
              ) : (
                <FiatText onClick={() => switchNetwork?.(mainnet.id)}>
                  Buy on <img src={Arrow} className="arrow" /> <br /> Ethereum
                </FiatText>
              )}
            </BuyWithContainer>

            <br />
            <FiatText onClick={() => openWertWidget()}>
              Buy with <img src={Arrow} className="arrow" /> <br /> Card
            </FiatText>
          </TicketInfoWrapper>
        </MintContainer>
      </Container>
    </div>
  );
};

export default Mint;
