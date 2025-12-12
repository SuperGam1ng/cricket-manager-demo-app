import fs from 'fs';
import readline from 'readline';
import fetch from 'node-fetch';

// Input log file
const inputFile = './tests/ctokens.log';
// Output CSV file
const outputFile = inputFile + '.csv';

// Write CSV header
fs.writeFileSync(outputFile, "jobId,status,timeDiffSeconds\n");

async function processLine(line) {
    if (!line.trim()) return;

    let parsed;
    try {
        parsed = JSON.parse(line);
    } catch (err) {
        console.error("Invalid JSON line:", line);
        return;
    }

    const jobId = parsed.jobId;
    if (!jobId) {
        console.error("No jobId found in line:", line);
        return;
    }

    const url = `https://cricket-manager-backend-894136132206.asia-south1.run.app/jobs/status?jobId=${jobId}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const status = data.status || "N/A";
        const logs = data.resultLogs || [];

        let diffSeconds = "N/A";

        if (logs.length >= 2) {
            const first = new Date(logs[0].timestamp);
            const last = new Date(logs[logs.length - 1].timestamp);
            diffSeconds = (last - first) / 1000;
        }

        const csvLine = `${jobId},${status},${diffSeconds}\n`;
        fs.appendFileSync(outputFile, csvLine);

        console.log(`Processed jobId=${jobId}`);
    } catch (err) {
        console.error(`Error processing jobId=${jobId}:`, err);
    }
}

async function main() {
    const rl = readline.createInterface({
        input: fs.createReadStream(inputFile),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        await processLine(line);
    }

    console.log("Done. Output written to", outputFile);
}

main();
