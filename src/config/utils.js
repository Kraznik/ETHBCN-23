const mintAbi = {
  inputs: [
    {
      internalType: "uint256",
      name: "_waveNum",
      type: "uint256",
    },
    {
      internalType: "address",
      name: "_account",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "_numberOfTokens",
      type: "uint256",
    },
  ],
  name: "mintTicketTo",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};

export const wertDetails =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? {
        origin: "https://widget.wert.io",
        partnerId: process.env.REACT_APP_WERT_PARTNER_ID,
        privateKey: process.env.REACT_APP_WERT_PRIVATE_KEY,
        contractAddress: "0x6052ed5C646574D12c27E8D219C49C3394598b00",
        network: "polygon",
        commodity: "USDC",
        waveNum: 2, // 0
        ticketPrice: 499, // 469, //444, //usdc on polygon
        mintAbi,
      }
    : {
        origin: "https://sandbox.wert.io",
        partnerId: process.env.REACT_APP_WERT_TEST_PARTNER_ID,
        privateKey: process.env.REACT_APP_WERT_TEST_PRIVATE_KEY,
        contractAddress: "0x25e302dF0d301AF5874Fd3C7B461d46be60473dF",
        network: "goerli",
        commodity: "ETH",
        waveNum: 0,
        ticketPrice: 0.001, //usdc on polygon
        mintAbi,
      };
