import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import "./WalletConnect.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletConnect = ({ label = "Connect Wallet" }) => {
  return (
    <div>
      <ConnectButton
        label={label}
        chainStatus="icon"
        showBalance={{
          smallScreen: false,
          largeScreen: false,
        }}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full",
        }}
      />
    </div>
  );
};

export default WalletConnect;
