import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import TicketPlaceholder from "../assets/Ticket.png";
import OrangeSmile from "../assets/orangeSmile.svg";
import {
  Container,
  Navbar,
  YY,
  ProfileContainer,
  FooterDescriptionTitle,
} from "./profile";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getConfig } from "../config/config";

const Box = styled.div`
  border: 1px solid #bc563c;
  width: 80vw;
  margin: 30px auto;
  padding: 20px 0;
  border-radius: 30px;
`;

const Heading = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  color: black;
  border-radius: 20px;
  width: 60vw;
  margin: 10px auto;
  text-align: left;
`;

const DisplayInfo = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #bc563c;
  background: white;
  border-radius: 20px;
  width: 60vw;
  margin: 10px auto;
  text-align: left;
  padding: 5px 0 5px 20px;
`;

const DisplayInfo2 = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #bc563c;
  background: white;
  border-radius: 20px;
  width: 60vw;
  margin: 10px auto;
  padding: 5px 20px;
`;

const Confirm = styled.button`
  background-color: #bc563c;
  text-decoration: none;
  border-radius: 20px;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 0;
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;

  :hover {
    background: white;
    color: #bc563c;
    cursor: pointer;
  }
`;

const Scan = ({ account, orgId }) => {
  const [confirmed, setConfirmed] = React.useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = React.useState(false);
  const [scannedMessage, setScannedMessage] = useState("");
  const [tokenScanned, setTokenScanned] = useState(false);
  const [scanInfo, setScanInfo] = useState({
    orgId: "",
    orgName: "",
    timeOfScan: "",
  });

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();

  const getIfTokenScanned = async () => {
    try {
      const url = `${getConfig.apiBaseUrl}/event/?ticketId=${query.get(
        "tkid"
      )}`;
      const res = await axios.get(url, {
        headers: {
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      });
      // console.log(res.data?.data);
      if (res.data?.data?.timeOfScan) {
        const { orgId, orgName, timeOfScan } = res.data.data;
        setTokenScanned(true);
        setScanInfo({
          orgId,
          orgName,
          timeOfScan,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getIfTokenScanned();
  }, []);

  const confirmScan = async () => {
    setConfirming(true);
    console.log("scanning...");
    try {
      const url = `${getConfig.apiBaseUrl}/event`;
      const scan_data = {
        organiserID: orgId,
        orgName: "test",
        organizerAddress: account,
        ticketOwnerAddress: query.get("owner"),
        ticketTokenId: query.get("tkid"),
        encrypted: query.get("hash"),
      };

      // console.log("scan data: ", scan_data);

      const res = await axios.post(url, scan_data, {
        headers: {
          validate: process.env.REACT_APP_VALIDATE_TOKEN,
        },
      });
      // console.log(res);
      setScannedMessage(res.data.message);
      // console.log("scanned token succesfully added");
      setConfirming(false);
      setConfirmed(true);
    } catch (err) {
      console.error(err);
      setConfirming(false);
      setError(true);
    }
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
            <ProfileContainer>
              {" "}
              <a href="/">
                <img src={OrangeSmile} className="smile" />
              </a>
            </ProfileContainer>
          </YY>
        </Navbar>
        <Box>
          <Heading>Name</Heading>
          <DisplayInfo>{query.get("name")}</DisplayInfo>

          <Heading>NFTicket ID</Heading>
          <DisplayInfo>{query.get("tkid")}</DisplayInfo>

          {!tokenScanned ? (
            confirmed || error ? (
              confirmed ? (
                <DisplayInfo2>
                  🎉 🎉 <br />
                  Thank you for Confirming <br />
                  {scannedMessage}!!
                </DisplayInfo2>
              ) : (
                <DisplayInfo>
                  🚨 🚨 <br />
                  Error!!
                  <br />
                  {scannedMessage}!!
                </DisplayInfo>
              )
            ) : (
              <Confirm onClick={confirmScan}>Confirm</Confirm>
            )
          ) : (
            <DisplayInfo>
              NFTicket has already been scanned at {scanInfo.timeOfScan} by
              Device 1
            </DisplayInfo>
          )}

          {/* <Confirm>Confirm</Confirm> */}

          {/* <DisplayInfo2>
            🎉 🎉 <br />
            Thank you for Confirming{" "}
          </DisplayInfo2> */}

          {/* <DisplayInfo2>
            🚨 🚨 <br />
            NFTicket has already been scanned at 11:59 by Device 1
          </DisplayInfo2> */}
        </Box>
      </Container>
    </div>
  );
};

export default Scan;
