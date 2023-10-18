import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WalletConnect from "../components/walletConnect";
import Logo from "../assets/logo.svg";
import TicketOnEth from "../assets/ethereum.png";
import TicketOnOpt from "../assets/optimism.png";
import TicketOnPolygon from "../assets/polygon.png";
import viewQR from "../assets/viewqr.png";
import OrangeSmile from "../assets/orangeSmile.svg";
import whiteSmile from "../assets/whiteSmile.svg";
import "./style.css";
import { useAccount, useContractReads, useNetwork } from "wagmi";
import {
  mainnet,
  sepolia,
  optimism,
  optimismGoerli,
  goerli,
  polygon,
} from "wagmi/chains";
import { getConfig } from "../config/config";
import { Link } from "react-router-dom";
import axios from "axios";
import { july5_3, messed_wallets } from "../data/messed_wallets";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2vw 10vw;
  min-height: 100vh;
  background: #e5dcd0;

  @media screen and (max-width: 768px) {
    padding: 0 20px 50px 20px;
  }
`;

export const Navbar = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    padding: 20px 0;
  }
`;
export const TicketDisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Footer = styled.div`
  margin-top: 25vh;
  text-align: left;
  display: flex;
  justify-content: space-between;
`;
export const ProfileContainer = styled.div`
  width: 80px;
  margin: 0 50px;
  height: 80px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #bc563c;
  :hover {
    background: #bc563c;
    .smile {
      content: url(${whiteSmile});
    }
  }

  @media screen and (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin: 0 0 00px 0px;
  }
`;

export const FooterDescriptionTitle = styled.div`
  font-family: "Dahlia-RC";
  font-style: normal;
  font-weight: 400;
  margin-right: 10px;
  font-size: 40px;
  line-height: 48px;
  display: inline-block;
  color: #bc563c;
`;

export const FooterDescriptionTitleBold = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 400;
  display: inline-block;
  font-size: 40px;
  line-height: 48px;
  color: #bc563c;
`;

export const FooterDescriptionTitleBold2 = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 400;
  display: inline-block;
  font-size: 40px;
  line-height: 48px;
  color: #bc563c;
  :hover {
    cursor: pointer;
  }
`;

export const FooterDescription = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  margin-top: 16px;
  font-weight: 500;
  font-size: 18px;
  line-height: 17px;
  color: #bc563c;
`;

export const YY = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

export const TT = styled.div`
  border: 1px solid #bc563c;
  border-radius: 100px;
  width: auto; // 200px;

  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 15px;

  @media screen and (max-width: 768px) {
    width: 00px;
    height: 00px;
    margin: 0 90px 15px 90px;
    border: none;
  }
`;

export const TikcetId = styled.div`
  text-decoration: none;
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #bc563c;
  text-underline: none;

  a {
    text-decoration: none;
    color: inherit;
    text-underline: none;
  }
`;

export const TicketBox = styled.div`
  margin: 10px;
  border: 2px solid #bc563c;
  padding-bottom: 5px;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(0.8);
    cursor: pointer;
    position: relative;
  }

  &:hover::after {
    /* content: "Redeem Now"; */
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #bc563c;
    color: #fff;
    padding: 5px;
    font-family: "Montserrat";
    font-weight: 500;
    font-size: 14px;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const RedeemedTicketBox = styled(TicketBox)`
  &:hover::after {
    content: "";
    padding: 0px;
  }
`;

const Left = styled.div``;
const Right = styled.div``;

const Profile = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [redeemedTokens, setRedeemedTokens] = useState([]);

  const useChain =
    chain?.id in getConfig
      ? chain
      : getConfig.env === "testnet"
      ? sepolia
      : mainnet;

  const {
    data: tokensData,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      {
        address:
          getConfig?.[getConfig.env === "mainnet" ? mainnet.id : sepolia.id]
            ?.ticketContractAddress,
        abi: getConfig?.[getConfig.env === "mainnet" ? mainnet.id : sepolia.id]
          ?.ticketAbi,
        functionName: "walletQuery",
        args: [address],
        chainId: getConfig.env === "mainnet" ? mainnet.id : sepolia.id,
      },
      {
        address:
          getConfig?.[
            getConfig.env === "mainnet" ? optimism.id : optimismGoerli.id
          ]?.ticketContractAddress,
        abi: getConfig?.[
          getConfig.env === "mainnet" ? optimism.id : optimismGoerli.id
        ]?.ticketAbi,
        functionName: "walletQuery",
        args: [address],
        chainId: getConfig.env === "mainnet" ? optimism.id : optimismGoerli.id,
      },
      {
        address:
          getConfig?.[getConfig.env === "mainnet" ? polygon.id : goerli.id]
            ?.ticketContractAddress,
        abi: getConfig?.[getConfig.env === "mainnet" ? polygon.id : goerli.id]
          ?.ticketAbi,
        functionName: "walletQuery",
        args: [address],
        chainId: getConfig.env === "mainnet" ? polygon.id : goerli.id,
      },
    ],
  });

  // console.log("Wallet query: ", { address, tokensData });

  const getRedeemedTokens = async () => {
    try {
      const url = `${getConfig.apiBaseUrl}/getRedeemedTokens/${address}`;
      const { data } = await axios.get(url, {
        headers: {
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      });
      // console.log({ address, redeemedTokens: data });
      setRedeemedTokens(data);
    } catch (err) {}
  };

  useEffect(() => {
    getRedeemedTokens();
  }, [address]);

  return (
    <div>
      <Container>
        <Navbar>
          <a href="https://ethbarcelona.com/">
            <img src={Logo} className="logo" />
          </a>
          <YY>
            <TT>
              <WalletConnect />
            </TT>
            <ProfileContainer>
              <a href="/">
                <img src={OrangeSmile} className="smile" />
              </a>
            </ProfileContainer>
          </YY>
        </Navbar>
        <TicketDisplayContainer>
          {tokensData?.[0]?.map((tokenId) => {
            return (
              <TicketBox>
                <Link
                  to={`/redeem/ethereum/${
                    getConfig.env === "mainnet" ? mainnet.id : sepolia.id
                  }/${tokenId}/${tokenId}`}
                  key={tokenId}
                >
                  <img src={TicketOnEth} alt="" className="ticket" />
                  <TikcetId>#{tokenId.toString()}</TikcetId>
                </Link>
              </TicketBox>
            );
          })}
          {tokensData?.[2]?.map((tokenId) => {
            return (
              <TicketBox>
                <Link
                  to={`/redeem/polygon/${
                    getConfig.env === "mainnet" ? polygon.id : goerli.id
                  }/${tokenId}/${tokenId.add(500)}`}
                  key={tokenId}
                >
                  <img src={TicketOnPolygon} alt="" className="ticket" />
                  <TikcetId>#{tokenId.add(500).toString()}</TikcetId>
                </Link>
              </TicketBox>
            );
          })}
          {tokensData?.[1]?.map((tokenId, index) => {
            // console.log({ index, tokenId });
            if (
              messed_wallets.includes(address) &&
              parseInt(tokenId.toString()) > 3000
            ) {
              // console.log("extra airdropped ticket..");
              if (redeemedTokens.length >= 2) {
                // console.log(
                //   "already redeemed speaker + 1 tickets, no more tickets available for redeem"
                // );
                return null;
              }
              if (redeemedTokens.length >= 1 && index >= 1) return null;
              if (index >= 2) {
                return null;
              }
            }

            if (
              july5_3.includes(address) &&
              parseInt(tokenId.toString()) > 3000
            ) {
              // console.log("extra airdropped ticket..");
              if (redeemedTokens.length >= 1) {
                // console.log(
                // );
                return null;
              }
              if (redeemedTokens.length >= 1 && index >= 0) return null;
              if (index >= 1) {
                return null;
              }
            }
            return (
              <TicketBox>
                <Link
                  to={`/redeem/optimism/${
                    getConfig.env === "mainnet"
                      ? optimism.id
                      : optimismGoerli.id
                  }/${tokenId}/${tokenId.add(750)}`}
                  key={tokenId}
                >
                  <img src={TicketOnOpt} alt="" className="ticket" />
                  <TikcetId>#{tokenId.add(750).toString()}</TikcetId>
                </Link>
              </TicketBox>
            );
            // else return null;
          })}

          {redeemedTokens?.map(({ ticketId, tokenId, chainId }, index) => {
            if (
              parseInt(tokenId.toString()) > 3000 &&
              index >= 2 &&
              messed_wallets.includes(address)
            ) {
              // console.log("redeemed extra tickets..");
              return null;
            }

            if (
              parseInt(tokenId.toString()) > 3000 &&
              index >= 1 &&
              july5_3.includes(address)
            ) {
              // console.log("redeemed extra tickets..");
              return null;
            }
            return (
              <RedeemedTicketBox>
                <Link
                  to={`/tickets/${chainId}/${tokenId}/${ticketId}/qrcode`}
                  key={ticketId}
                >
                  <img src={viewQR} className="ticket" alt="" />
                  <TikcetId>#{ticketId.toString()}</TikcetId>
                </Link>
              </RedeemedTicketBox>
            );
          })}
          {/* <img src={TicketPlaceholder} className="ticket" />
          <img src={TicketPlaceholder} className="ticket" />
          <img src={TicketPlaceholder} className="ticket" /> */}
        </TicketDisplayContainer>
        <Footer>
          <Left>
            <FooterDescriptionTitle>
              Redeem your NFTicket
            </FooterDescriptionTitle>
            <FooterDescriptionTitleBold>
              to get a QR <br />
              {/* code to enter the event */}
            </FooterDescriptionTitleBold>
            <br />
            <FooterDescriptionTitleBold>
              code to enter the event
            </FooterDescriptionTitleBold>
            <FooterDescription>Redeem is Live Now</FooterDescription>
          </Left>

          <Right>
            <a href="/mint">
              <FooterDescriptionTitleBold2 href="/mint">
                Buy Tickets
              </FooterDescriptionTitleBold2>
            </a>
          </Right>
        </Footer>
      </Container>
    </div>
  );
};

export default Profile;
