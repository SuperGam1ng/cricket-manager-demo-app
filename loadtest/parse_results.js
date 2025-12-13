import fs from "fs";
import readline from "readline";
import fetch from "node-fetch";

// Input log file
const inputFile = `./tests/${process.argv[2]}`;
// Output CSV file
const outputFile = inputFile + ".csv";

// Write CSV header
fs.writeFileSync(
  outputFile,
  "jobId,jobStatus,transactionStatus,transactionHash,statusReason,forwarderNonce,nonce,speed,gasLimit,timeDiffSeconds\n"
);

async function processLine(line) {
  if (!line.trim()) return;

  let parsed;
  try {
    const jsonMatch = line.match(/\{.*\}/);
    if (!jsonMatch) return;
    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Invalid JSON line:", line);
    return;
  }

  const jobId = parsed.jobId;
  const forwarderNonce = parsed.forwarderNonce;
  if (!jobId) {
    console.error("No jobId found in line:", line);
    return;
  }

  const url = `https://cricket-manager-backend-982880605381.asia-south1.run.app/get-info/get-relayer-transaction?jobId=${jobId}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const jobStatus = data.jobStatus || "N/A";
    const transactionStatus = data.transactionStatus || "N/A";
    const transactionHash = data.relayerTransaction.hash || "N/A";
    const statusReason = data.relayerTransaction.status_reason || "N/A";
    const speed = data.relayerTransaction.speed || "N/A";
    const gasLimit = data.relayerTransaction.gas_limit || "N/A";
    const nonce = data.relayerTransaction.nonce || "N/A";
    const logs = data.resultLogs || [];

    let diffSeconds = "N/A";

    if (logs.length >= 2) {
      const first = new Date(logs[0].timestamp);
      const last = new Date(logs[logs.length - 1].timestamp);
      diffSeconds = (last - first) / 1000;
    }

    const csvLine = `${jobId},${jobStatus},${transactionStatus},${transactionHash},${statusReason},${forwarderNonce},${nonce},${speed},${gasLimit},${diffSeconds}\n`;
    fs.appendFileSync(outputFile, csvLine);

    console.log(`Processed jobId=${jobId}`);
  } catch (err) {
    console.error(`Error processing jobId=${jobId}:`, err);
  }
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await processLine(line);
  }

  console.log("Done. Output written to", outputFile);
}

main();
