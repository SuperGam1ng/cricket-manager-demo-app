import http from "k6/http";
import exec from "k6/execution";

export default function () {
  const backendhost =
    "https://cricket-manager-backend-982880605381.asia-south1.run.app/";
  const demohost =
    "https://cricket-manager-demo-app-894136132206.asia-south1.run.app/";
  const adminPrivateKey =
    "325efc05101dc6e427b306f61426ae4bb438ed2e5627ed0a2169c9d1da292892";

  const currentIteration = exec.scenario.iterationInTest;
  const r1 = http.post(
    backendhost + "wallet/approval",
    JSON.stringify({
      fromWalletAddress: "0x75933a1aaa8576585cf9608d242c25e1f497904f",
      toWalletAddress: "0xb46be61fb0dd88fb5eb2f5ad7163454304314b82",
      quantity: 10,
      contractAddress: "0x54DB4850BdF3B1E62f6116cb6071c4c6177D6a6d",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  const payload = r1.json();
  const forwarderNonce = payload.transactionPayload.forwardRequest.nonce;

  const r2 = http.post(
    demohost + "api/sign",
    JSON.stringify({
      transactionPayload: payload.transactionPayload,
      privateKey: adminPrivateKey,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  const r3 = http.post(
    backendhost + "jobs/submit-transaction",
    JSON.stringify(r2.json()),
    { headers: { "Content-Type": "application/json" } }
  );
  console.log(JSON.stringify({ ...r3.json(), forwarderNonce }));
}
