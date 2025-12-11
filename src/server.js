import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

import { buildRelayerTransaction } from './signing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());

// Backend API
app.post('/api/sign', async (req, res) => {
  const data = req.body;   // <-- JSON body here
  console.log('Received:', data);
  const payload = data.transactionPayload;
  const { signature, txPayload } = await buildRelayerTransaction(
    data.privateKey,
    payload.domain,
    payload.types,
    payload.forwardRequest
  );

  const jobId = crypto.randomUUID();
  let apiName = "NA";
  try {
    apiName = JSON.parse(requestBody)?.apiName || "NA";
  } catch { }

  const updatedPayload = {
    jobId,
    apiName,
    signedTransactionPayload: txPayload,
  };
  res.json(updatedPayload);
});

// Serve frontend bundle
app.use(express.static(path.join(__dirname, '..', 'dist')));

// For React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(2020, () => console.log('Server running on http://localhost:2020'));
