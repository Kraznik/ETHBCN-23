import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import ErrorPage from "../components/ErrorPage";
import whiteSmile from "../assets/whiteSmile.svg";
import OrangeSmile from "../assets/orangeSmile.svg";
import WalletConnect from "../components/walletConnect";
import Logo from "../assets/logo.svg";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { getConfig } from "../config/config";
import { useAccount, useNetwork } from "wagmi";
// import Poap from "../../../assets/poap.jpeg";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2vw 10vw;
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
`;

export const Footer = styled.div`
  margin-top: 50px;
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
    content: "Redeem Now";
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

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 530px;
  height: 536px;
  padding: 0 50px;
  border: 1px solid #bc563c;
  border-radius: 4px;
  margin: 40px auto;

  @media (max-width: 800px) {
    width: auto;
    margin: 10px;
    height: 600px;
    padding: 10px;
  }
`;
const Left = styled.div``;
const Right = styled.div``;
const Title = styled.div`
  font-family: "KnockOut";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  margin-top: 25px;
  display: flex;
  align-items: center;
  text-align: center;
  /* Green Leaf */
  color: #354b37;
  /* Inside auto layout */
  flex: none;
  order: 0;
  padding-top: 5%;
  flex-grow: 0;
  margin: 24px 0px;
`;

const DetailsBox = styled.div`
  margin: 20px 0;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #bc563c;
`;

const Code = styled.div`
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
  justify-content: center;
`;

const QrCode = () => {
  const { address } = useAccount();
  const [encryptedHash, setEncryptedHash] = useState(null);
  const [redeemData, setRedeemData] = useState({
    name: "",
    optionalName: "",
    email: "",
  });
  const [tokenOwned, setTokenOwned] = useState(false);
  const [tokenScanned, setTokenScanned] = useState(false);

  const { tokenId, chainId, ticketId } = useParams();
  const navigate = useNavigate();

  const getIfTokenScanned = async () => {
    try {
      const url = `${getConfig.apiBaseUrl}/event?ticketId=${ticketId}`;
      const res = await axios.get(url, {
        headers: {
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      });
      // console.log(res.data);

      if (res.data?.data?.timeOfScan) {
        setTokenScanned(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getIfTokenScanned();
  }, [address]);

  const getTokenRedeemData = async () => {
    try {
      const url = `${getConfig.apiBaseUrl}/users?tokenId=${tokenId}&chainId=${chainId}`;
      const { data } = await axios.get(url, {
        headers: {
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      });
      // console.log(data);
      if (data?.user?.name) setTokenOwned(true);
      // wallet address is not lowercased here
      if (data?.user?.walletAddress === address) setTokenOwned(true);
      setRedeemData(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (address) getTokenRedeemData();
  }, [address]);

  useEffect(() => {
    const run = async () => {
      const url = `${getConfig.apiBaseUrl}/qrcode?tokenId=${tokenId}&chainId=${chainId}`;

      let hashFound = false;
      while (!hashFound) {
        const { data } = await axios.get(url, {
          headers: {
            validate: process.env.REACT_APP_VALIDATE_TOKEN,
          },
        });

        // console.log("encrypted data model wallet address: ", data);

        // wallet address lowercased here
        if (
          data?.walletAddress === address.toLowerCase() || // from evnets txn in defender
          data?.walletAddress === address
        ) {
          // console.log("encypted hash: ", data);
          setEncryptedHash(data?.encrypted);
          setTokenOwned(true);
          hashFound = true;
        }
      }
    };
    if (address) run();
  }, [redeemData, address]);

  const options = {
    headers: {
      validate: process.env.REACT_APP_VALIDATE_TOKEN,
    },
  };

  const onDownload = async () => {
    console.log("download..");
    try {
      const url = `${
        getConfig.mainApiBaseUrl
      }/createDownload?encrypted=${encodeURIComponent(encryptedHash)}`;

      // console.log({ encryptedHash });
      var { data } = await axios.get(url, options);
      console.log(data);

      const downloadUrl = `${getConfig.mainApiBaseUrl}/download/${data?.fileName}`;

      fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          // Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `ETH-BCN-QR.pdf`);

          // Append to html link element page
          document.body.appendChild(link);

          // Start download
          link.click();

          // Clean up and remove the link
          link.parentNode.removeChild(link);
        });
    } catch (err) {
      console.error(err);
    }
  };

  if (tokenScanned) {
    return (
      // <Poap />
      // <Navigate to={`/tickets/${tokenId}/poap`} replace />
      <div padding="10%">
        {/* <img alt="POAP" width="100%" height=""></img> */}
        Congratulations!! you attended ETH BCN!!
      </div>
    );
  }

  return (
    <>
      {tokenOwned ? (
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
          <Box style={{ position: "relative" }}>
            <FooterDescription onClick={() => navigate(-1)}>
              Back
            </FooterDescription>
            <FooterDescriptionTitleBold>
              Hurray! <br /> You redeemed it successfully{" "}
            </FooterDescriptionTitleBold>

            <FooterDescription>
              You are going to ETH BCN! This QR code is your access to the
              event. You could download it or access here with your wallet to
              use it.
            </FooterDescription>

            <DetailsBox>
              <FooterDescription>
                Name: {redeemData?.optionalName}
              </FooterDescription>
              {/* <FooterDescription>Email: {redeemData.email} </FooterDescription> */}
              {/* <div>Phone Number: {redeemData.optionalName}</div> */}
              <FooterDescription>NFTTicket ID: {ticketId} </FooterDescription>
            </DetailsBox>

            {encryptedHash ? (
              <Code>
                <QRCodeSVG
                  value={`${getConfig.appBaseUrl}/scan?tkid=${ticketId}&owner=${address}&name=${redeemData.name}&hash=${encryptedHash}`}
                ></QRCodeSVG>
              </Code>
            ) : (
              <Code>
                Please wait while the qr code is being generated...
                <br />
                Reload and connect wallet if not displayed in 2 mins..
              </Code>
            )}

            <div>
              <FooterDescription
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (encryptedHash) onDownload();
                }}
              >
                <img alt=""></img>
                Download
              </FooterDescription>
            </div>
          </Box>
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
      ) : (
        <ErrorPage text={""} />
      )}
    </>
  );
};

export default QrCode;
