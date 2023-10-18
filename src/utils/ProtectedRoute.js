import React from "react";
import { Navigate } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import { TT, Navbar, ProfileContainer, YY } from "../pages/profile";
import WalletConnect from "../components/walletConnect";
import Logo from "../assets/logo.svg";
import OrangeSmile from "../assets/orangeSmile.svg";

const ProtectedRoute = ({ permit, children }) => {
  if (!permit) {
    return (
      <>
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
        <ErrorPage text={"Only Organizer Access"} />
        <a href="/">Go to Main page</a>
        {/* <Navigate to="/" replace /> */}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
