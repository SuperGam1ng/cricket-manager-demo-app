import http from "k6/http";
import exec from "k6/execution";

export default function () {
  const backendhost =
    "https://cricket-manager-backend-982880605381.asia-south1.run.app/";
  const demohost =
    "https://cricket-manager-demo-app-894136132206.asia-south1.run.app/";
  const adminPrivateKey =
    "650d9f993da85046ceefe05d9c7c930fa2712b7a282e8f54c245ea1c2b03e3f1";

  const currentIteration = exec.scenario.iterationInTest;
  const r1 = http.post(
    backendhost + "cricketer/create-token",
    JSON.stringify({
      name: "Test01" + currentIteration,
      adminWalletAddress: "0xb46be61fb0dd88fb5eb2f5ad7163454304314b82",
      symbol: "T" + currentIteration,
      initialSupply: 10,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  const payload = r1.json();

  const r2 = http.post(
    demohost + "api/sign",
    JSON.stringify({
      transactionPayload: payload.transactionPayload,
      privateKey: adminPrivateKey,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  const jobId = r2.json().jobId;

  const r3 = http.post(
    backendhost + "jobs/submit-transaction",
    JSON.stringify(r2.json()),
    { headers: { "Content-Type": "application/json" } }
  );
  console.log(JSON.stringify(r3.json()));
}
