import React, { useEffect, useState } from "react";
import { Container } from "./mint";
import { FooterDescriptionTitleBold, FooterDescription } from "./profile";
import styled from "styled-components";
// import TicketPlaceholder from "../assets/ethereum.png";

import TicketOnEth from "../assets/ethereum.png";
import TicketOnOpt from "../assets/optimism.png";
import TicketOnPolygon from "../assets/polygon.png";

import whiteSmile from "../assets/whiteSmile.svg";
import { Navbar, YY, TT, ProfileContainer } from "./profile";
import WalletConnect from "../components/walletConnect";
import Logo from "../assets/logo.svg";
import OrangeSmile from "../assets/orangeSmile.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  mainnet,
  sepolia,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getConfig } from "../config/config";
import ticketAbi from "../ethereum/build/TicketAbi.json";
import axios from "axios";
import ErrorPage from "../components/ErrorPage";

export const RedeemContainer = styled.div`
  border: 1px solid #bc563c;
  margin: 0 auto;
  width: 30vw;
  border-radius: 20px;
  padding: 50px 0;

  @media screen and (max-width: 768px) {
    width: 90vw;
    padding: 20px 0;
    margin: 20px 0;
  }
`;

export const Title = styled.div`
  font-family: "Dahlia-Bold";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  text-align: left;
  color: #bc563c;
  margin: 0 50px;
`;

const Input = styled.input`
  border: 1px solid #bc563c;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px 15px;
  margin-bottom: 10px;
  width: 70%;
  align-items: left;
  justify-content: left;
  margin: 10px 40px 10px 0;

  &:focus {
    outline: none;
    border-color: #6bb0f4;
  }

  @media screen and (max-width: 768px) {
    margin: 10px 0 10px 20px;
  }
`;

const TicketImageWrapper = styled.div`
  border: 3px solid #bc563c;
  height: 185px;
  width: 160px;
  margin: 10px auto;
  padding: 20px 0;
`;

const MintButton = styled.button`
  border: 1px solid #bc563c;
  font-family: "Dahlia-Bold";
  font-size: 24px;
  color: #bc563c;
  border-radius: 100px;
  width: 350px;
  margin: 20px auto;
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    background: #bc563c;
    color: #e5dcd0;
  }

  @media screen and (max-width: 767px) {
    margin: 10px auto;
    width: 225px;
  }
`;

const Redeem = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [user, setUser] = useState({
    fullName: "",
    displayName: "",
    email: "",
  });

  const [tokenOwned, setTokenOwned] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const { chainName, chainId, tokenId, ticketId } = useParams();
  const navigate = useNavigate();

  // console.log({ chainId, tokenId });

  const useChain =
    chain?.id in getConfig
      ? chain
      : getConfig.env === "testnet"
      ? sepolia
      : mainnet;

  const { data: owner, error } = useContractRead({
    address: getConfig?.[chainId]?.ticketContractAddress,
    abi: getConfig?.[chainId]?.ticketAbi,
    functionName: "ownerOf",
    args: [tokenId],
    chainId: parseInt(chainId), //useChain?.id,
  });

  // console.log({ owner, error });

  const checkIfTokenOwned = async () => {
    try {
      // const owner = await TicketToken.methods.ownerOf(id).call();

      if (owner === address && !error) setTokenOwned(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (address) checkIfTokenOwned();
  }, [owner, error, address]);

  // switch network
  useEffect(() => {
    console.log(`switch to ${chainId}`);
    if (chain?.id !== parseInt(chainId)) switchNetwork?.(parseInt(chainId));
  }, [chain?.id, chainId, switchNetwork]);

  const { config } = usePrepareContractWrite({
    address: getConfig?.[chainId]?.ticketContractAddress,
    abi: getConfig?.[chainId]?.ticketAbi,
    functionName: "burn",
    args: [tokenId],
    chainId: parseInt(chainId),
    overrides: {
      from: address,
    },
    // enabled: false,
  });

  const { data: burnData, write: burn } = useContractWrite(config);

  // console.log("BURN: ", burnData, burn);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: burnData?.hash,
  });

  useEffect(() => {
    const run = async () => {
      if (burnData?.hash) {
        if (isSuccess && !isError) {
          const url = `${getConfig.apiBaseUrl}/qrcode`;
          const tkt_data = {
            walletAddress: address,
            // tokenID: tokenId,
            tokenId,
            chainId: chainId,
            hash: burnData?.hash,
          };
          const res = await axios.post(url, tkt_data, {
            headers: {
              "Content-Type": "application/json",
              validate: process.env.REACT_APP_VALIDATE_TOKEN,
            },
          });
          // console.log(res);
        }
        // const ticketId =
        //   chainName === "optimism"
        //     ? parseInt(tokenId) + 750
        //     : chainName === "polygon"
        //     ? parseInt(tokenId) + 500
        //     : parseInt(tokenId);

        if (isSuccess || isError) setRedeeming(false);
        if (isSuccess)
          navigate(`/tickets/${chainId}/${tokenId}/${ticketId}/qrcode`);
      }
    };
    run();
  }, [burnData, isSuccess, isError, tokenId, navigate, isLoading, address]);

  const onBurn = async (e) => {
    e.preventDefault();
    setRedeeming(true);
    await saveData();
    try {
      // console.log("Burning the ticket");

      burn();
      // console.log("burning2..");
    } catch (err) {
      console.error(err);
    }
  };

  const saveData = async () => {
    try {
      const url = `${getConfig.apiBaseUrl}/users`;
      const post_data = {
        name: user.fullName,
        optionalName: user.displayName ? user.displayName : user.fullName,
        email: user.email,
        walletAddress: address,
        tokenId,
        // ticketId: tokenId,
        chainId: chainId,
      };

      const { data } = await axios.get(
        url + `?tokenId=${tokenId}&chainId=${chainId}`,
        {
          headers: {
            validate: process.env.REACT_APP_VALIDATE_TOKEN,
          },
        }
      );

      // console.log(data?.user);

      if (!user?.displayName)
        setUser({ ...user, displayName: data?.user?.optionalName });

      if (data.user?.ticketId) {
        await axios.patch(
          url + `?tokenId=${tokenId}&chainId=${chainId}`,
          post_data,
          {
            headers: {
              validate: process.env.REACT_APP_VALIDATE_TOKEN,
            },
          }
        );
      } else {
        await axios.post(url, post_data, {
          headers: {
            "Content-Type": "application/json",
            validate: process.env.REACT_APP_VALIDATE_TOKEN,
          },
        });
      }

      // console.log("user data posted successfully...");
    } catch (err) {
      setRedeeming(false);
      throw err;
    }
  };

  return (
    <>
      {tokenOwned ? (
        <div>
          <Container>
            <Navbar>
              <a href="/">
                <img src={Logo} />
              </a>
              <YY>
                <TT>
                  <WalletConnect></WalletConnect>
                </TT>
                <ProfileContainer>
                  <a href="/">
                    <img src={OrangeSmile} alt="" className="smile" />
                  </a>
                </ProfileContainer>
              </YY>
            </Navbar>
            <RedeemContainer>
              <FooterDescriptionTitleBold>
                Redeem NFTicket
              </FooterDescriptionTitleBold>
              <FooterDescription>
                Redeem your NFTicket to get a QR code to
                <br /> enter the event
              </FooterDescription>
              <TicketImageWrapper>
                {chainName === "optimism" ? (
                  <>
                    <img src={TicketOnOpt} alt="" />
                    <FooterDescription>#{ticketId}</FooterDescription>
                  </>
                ) : chainName === "polygon" ? (
                  <>
                    <img src={TicketOnPolygon} alt="" />
                    <FooterDescription>#{ticketId}</FooterDescription>
                  </>
                ) : (
                  <>
                    <img src={TicketOnEth} alt="" />
                    <FooterDescription>#{ticketId}</FooterDescription>
                  </>
                )}
              </TicketImageWrapper>

              <form onSubmit={onBurn}>
                <Title>Full Name</Title>
                <Input
                  type="text"
                  required
                  placeholder="Enter your name"
                  name="name"
                  id="name"
                  value={user?.fullName}
                  onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                  }
                />
                <Title>Email</Title>
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  name="name"
                  id="name"
                  value={user?.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <Title>Display Name</Title>
                <Input
                  type="text"
                  placeholder="Enter your display name"
                  name="name"
                  id="name"
                  value={user?.displayName}
                  onChange={(e) =>
                    setUser({ ...user, displayName: e.target.value })
                  }
                />

                <MintButton>
                  {isLoading ? (
                    <span>Burning..</span>
                  ) : redeeming ? (
                    <span>Redeeming...</span>
                  ) : (
                    <span>Redeem Now</span>
                  )}
                </MintButton>
              </form>
            </RedeemContainer>
          </Container>
        </div>
      ) : (
        <ErrorPage text={""} /> // "Loading" or "You do not own this token id"
      )}
    </>
  );
};

export default Redeem;
