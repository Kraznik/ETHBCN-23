import React, { useEffect } from "react";
import styled from "styled-components";
import {
  mainnet,
  sepolia,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getConfig } from "../config/config";
import { ethers } from "ethers";
import ticketAbi from "../ethereum/build/TicketAbi.json";

const MintButton = styled.button`
  border: 1px solid #bc563c;
  font-family: "Dahlia-Bold";
  font-size: 24px;
  color: #bc563c;
  border-radius: 100px;
  width: 350px;
  height: 80px;
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
    margin: 0;
    width: 300px;
  }
`;

export const TicketPriceBlack = styled.div`
  color: #bc563c;
  font-size: 24px;
  color: #424242;
  font-family: "Dahlia-Bold";
`;
export const TicketPriceBlack2 = styled.div`
  color: #bc563c;
  font-size: 24px;
  color: #424242;
  font-family: "Dahlia-Bold";
  margin: 20px auto 0 auto;
  text-decoration: none; /* add this line */
  a {
    text-decoration: none;
  }
`;

const MintTicket = ({ lowBalance, numberOfTokens }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  // console.log({ chain });

  const useChain =
    chain?.id in getConfig
      ? chain
      : getConfig.env === "testnet"
      ? sepolia
      : mainnet;

  const tokenToPay = "usdc";

  const { config } = usePrepareContractWrite({
    address: getConfig?.[useChain?.id]?.ticketContractAddress,
    abi: getConfig?.[useChain?.id]?.ticketAbi,
    functionName: "mintTicket",
    args: [
      // ...getConfig?.[useChain?.id]?.mintArgs[tokenToPay],
      getConfig?.[useChain?.id]?.waveNum,
      parseInt(numberOfTokens),
      // {
      //   gasLimit: "1000000",
      // },
    ],
    chainId: getConfig?.[useChain?.id]?.network?.id,
    // enabled: false, // parseInt(numberOfTokens) > 0,
    overrides: {
      from: address,
    },
    // onSuccess(data) {
    //   console.log(`Minted ${numberOfTokens} tickets`);
    // },
    // onError(data) {
    //   console.log("Some error");
    // },
  });

  // console.log(config);

  const { data, write } = useContractWrite(config);

  // console.log(data, write);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <MintButton
        disabled={
          lowBalance || !write || parseInt(numberOfTokens) <= 0 || isLoading
        }
        onClick={() => {
          // console.log(`Minting ${numberOfTokens} tickets for ${address}`);
          write?.();
        }}
      >
        {isLoading ? (
          <TicketPriceBlack>Minting..</TicketPriceBlack>
        ) : (
          <TicketPriceBlack>Mint</TicketPriceBlack>
        )}
      </MintButton>

      <a
        href={`${getConfig?.[useChain?.id].explorerUrl}/tx/${data?.hash}`}
        target={"_blank"}
        rel="noreferrer"
      >
        {isSuccess ? (
          <TicketPriceBlack2>
            Successfully minted {numberOfTokens} ticket
          </TicketPriceBlack2>
        ) : isLoading ? (
          <TicketPriceBlack2>
            Pending txn {data?.hash.substring(0, 4)}...
            {data?.hash.substring(data?.hash.length - 2)}
          </TicketPriceBlack2>
        ) : null}
      </a>
    </>
  );
};

export default MintTicket;
