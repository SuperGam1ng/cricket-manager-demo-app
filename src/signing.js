import { ethers } from "ethers";
// We will need to get the forwarderABI from the user, as it is not provided in the GEMINI.md file.
// For now, we will use a placeholder.
const forwarderABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "deadline",
        type: "uint48",
      },
    ],
    name: "ERC2771ForwarderExpiredRequest",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "ERC2771ForwarderInvalidSigner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestedValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "msgValue",
        type: "uint256",
      },
    ],
    name: "ERC2771ForwarderMismatchedValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "ERC2771UntrustfulTarget",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "deadline",
            type: "uint48",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct ERC2771Forwarder.ForwardRequestData",
        name: "request",
        type: "tuple",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "deadline",
            type: "uint48",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct ERC2771Forwarder.ForwardRequestData[]",
        name: "requests",
        type: "tuple[]",
      },
      {
        internalType: "address payable",
        name: "refundReceiver",
        type: "address",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256",
      },
    ],
    name: "InvalidAccountNonce",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "ExecutedForwardRequest",
    type: "event",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "deadline",
            type: "uint48",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct ERC2771Forwarder.ForwardRequestData",
        name: "request",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const RPC_URL = process.env.REACT_APP_RPC_URL;

if (!RPC_URL) {
  console.error("Missing REACT_APP_RPC_URL");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const forwarderInterface = new ethers.Interface(forwarderABI);

function encodeExecuteCalldata(request, signature) {
  const exec = forwarderInterface.getFunction("execute");
  const firstInput = exec.inputs?.[0];

  const hasSignatureInside = firstInput?.components?.some(
    (c) => c.name === "signature"
  );

  if (hasSignatureInside) {
    console.log("Detected execute(requestWithSignature) variant.");
    const reqStruct = { ...request, signature };

    if (firstInput.components.some((c) => c.name === "nonce")) {
      reqStruct.nonce = request.nonce;
    }

    return forwarderInterface.encodeFunctionData("execute", [reqStruct]);
  }

  console.log("Detected execute(request, signature) variant.");
  return forwarderInterface.encodeFunctionData("execute", [request, signature]);
}

export async function buildRelayerTransaction(
  userPrivateKey,
  domain,
  types,
  forwardRequest
) {
  console.log(domain, "domain");
  console.log(types, "types");
  console.log(forwardRequest, "forwardRequest");
  console.log;
  const signer = new ethers.Wallet(userPrivateKey, provider);

  const signature = await signer.signTypedData(domain, types, forwardRequest);
  console.log("Signature:", signature);
  const executeCalldata = encodeExecuteCalldata(forwardRequest, signature);

  const txPayload = {
    to: process.env.REACT_APP_FORWARDER_ADDRESS,
    value: "0",
    data: executeCalldata,
    gasLimit: "200000",
    speed: "average",
  };

  console.log("Prepared txPayload:", txPayload);

  return { signature, txPayload };
}
