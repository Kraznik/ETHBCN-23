import {
  sepolia,
  mainnet,
  optimism,
  optimismGoerli,
  goerli,
  polygon,
} from "wagmi/chains";
import ethTicketAbi from "../ethereum/build/TicketAbi.json";
import optimismTicketAbi from "../ethereum/build/optimism/TicketAbi.json";
import polyTicketAbi from "../ethereum/build/polygon/TicketAbi.json";

const waveNum = {
  mainnet: 6, // 5,
  optimism: 4, //2,
  polygon: 2, //1,
  sepolia: 0,
  opGoerli: 0,
  goerli: 0,
};

const usdcAddress = {
  mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  sepolia: "0xBe473174D3913A13Ce80C157e685b994ad1c17C8",
  optimismGoerli: "0x3d8A919062Ea2Ad81189e906669f4890edf3A0c6",
};

export const getConfig =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? {
        env: "mainnet",
        networks: [mainnet, optimism, polygon],
        alchemyKey: process.env.REACT_APP_ALCHEMY_API_KEY,
        apiBaseUrl: "https://ethbcn-backend.herokuapp.com",
        mainApiBaseUrl: "https://ethbcn-backend.herokuapp.com",
        appBaseUrl: "https://tickets.ethbarcelona.com",
        /*mainnet*/ 1: {
          network: mainnet,
          waveNum: waveNum.mainnet,
          alchemyUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x6052ed5C646574D12c27E8D219C49C3394598b00",
          usdc: {
            address: usdcAddress.mainnet,
          },
          explorerUrl: "https://etherscan.io",
          ticketAbi: ethTicketAbi,
        },
        /*optimism*/ 10: {
          network: optimism,
          waveNum: waveNum.optimism,
          alchemyUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x1175f205ad133BF36227976b110E93Ad5dcBEe74",
          usdc: {
            address: usdcAddress.optimism,
          },
          explorerUrl: "https://optimism.etherscan.io",
          ticketAbi: optimismTicketAbi,
        },
        /*polygon-for-wert*/ 137: {
          network: polygon,
          waveNum: waveNum.polygon,
          alchemyUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x6052ed5C646574D12c27E8D219C49C3394598b00",
          // usdc: {
          //   address: usdcAddress.optimismGoerli,
          // },
          // explorerUrl: "https://goerli-optimism.etherscan.io",
          ticketAbi: polyTicketAbi,
          // mintArgs: {
          //   usdc: [waveNum.testnet, usdcAddress.optimismGoerli],
          //   dai: [waveNum.testnet, daiAddress.optimismGoerli],
          // },
        },
      }
    : {
        env: "testnet",
        networks: [sepolia, optimismGoerli, goerli],
        alchemyKey: process.env.REACT_APP_ALCHEMY_API_KEY,
        apiBaseUrl: "https://ethbcn-staging-9d6664ef21c5.herokuapp.com", //"http://52.20.253.53", //"http://localhost:3456",
        mainApiBaseUrl: "https://ethbcn-staging-9d6664ef21c5.herokuapp.com", //"http://52.20.253.53", //"https://eth-bcn-2023.herokuapp.com",
        appBaseUrl: "https://eth-bcn-test-23.web.app", //"http://localhost:3000", // "https://eth-bcn-2023.web.app"
        /*sepolia*/ 11155111 /*chainId*/: {
          network: sepolia,
          waveNum: waveNum.sepolia,
          alchemyUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x7f45a4812BeC3Ce048196c87c71Ea54196DD41DF",
          usdc: {
            address: usdcAddress.sepolia,
          },
          explorerUrl: "https://sepolia.etherscan.io",
          ticketAbi: ethTicketAbi,
        },
        /*optimismGoerli*/ 420: {
          network: optimismGoerli,
          waveNum: waveNum.opGoerli,
          alchemyUrl: `https://opt-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x66E1DFa5685546a559596Fc2295c82B95f3fDF02",
          usdc: {
            address: usdcAddress.optimismGoerli,
          },
          explorerUrl: "https://goerli-optimism.etherscan.io",
          ticketAbi: optimismTicketAbi,
        },
        /*goerli-for-wert*/ 5: {
          network: goerli,
          waveNum: waveNum.goerli,
          alchemyUrl: `https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          ticketContractAddress: "0x25e302dF0d301AF5874Fd3C7B461d46be60473dF",
          // ticketContractAddress: "0x6052ed5C646574D12c27E8D219C49C3394598b00",
          // usdc: {
          //   address: usdcAddress.optimismGoerli,
          // },
          // explorerUrl: "https://goerli.etherscan.io",
          ticketAbi: polyTicketAbi,
        },
      };
