import React, { useEffect } from "react";
import {
  erc20ABI,
  mainnet,
  sepolia,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getConfig } from "../config/config";
// import erc20ABI from "../ethereum/build/ERC20Abi.json";
import styled from "styled-components";
import { TicketPriceBlack } from "../pages/mint";

const Button = styled.button`
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

const ApproveUsdc = ({
  lowBalance,
  ticketPrice,
  numberOfTokens,
  setApproved,
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const useChain =
    chain?.id in getConfig
      ? chain
      : getConfig.env === "testnet"
      ? sepolia
      : mainnet;

  const tokenToPay = "usdc";

  // console.log(
  //   "tokens to approve: ",
  //   ticketPrice.mul(numberOfTokens).toString()
  // );

  const { config } = usePrepareContractWrite({
    address: getConfig?.[useChain?.id]?.[tokenToPay]?.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      getConfig?.[useChain?.id]?.ticketContractAddress,
      // "10000000000000000000",
      ticketPrice?.mul(numberOfTokens),
    ],
    // enabled: false, // parseInt(numberOfTokens) > 0,
    overrides: {
      from: address,
    },
    // onSuccess(data) {
    //   setApproved(true);
    //   console.log("usdc approved");
    // },
    // onError(data) {
    //   console.log("Usdc approval error");
    // },
  });
  const { data, write } = useContractWrite(config);
  // console.log("approval write: ", write);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    setApproved(isSuccess || !isError);
  }, [isSuccess, isError]);

  return (
    <Button
      disabled={!write || isLoading || isSuccess || lowBalance}
      onClick={() => {
        // console.log("approving..");
        write?.();
      }}
    >
      {isLoading ? (
        <TicketPriceBlack>Approving...</TicketPriceBlack>
      ) : (
        <TicketPriceBlack>Approve USDC</TicketPriceBlack>
      )}
    </Button>
  );
};

export default ApproveUsdc;
