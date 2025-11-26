import React, { useState } from "react";
import "./App.css";
import { buildRelayerTransaction } from "./signing";

function App() {
  const [apiUrl, setApiUrl] = useState("");
  const [apiMethod, setApiMethod] = useState("POST"); // <--- NEW
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [transactionPayload, setTransactionPayload] = useState("");
  const [signedPayload, setSignedPayload] = useState("");
  const [submitResponse, setSubmitResponse] = useState("");
  const [txnStatusResponse, setTxnStatusResponse] = useState("");
  const [jobStatusResponse, setJobStatusResponse] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // NEW LOADING STATES
  const [loadingApiCall, setLoadingApiCall] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingJobStatus, setLoadingJobStatus] = useState(false);
  const [loadingTxnStatus, setLoadingTxnStatus] = useState(false);

  const handleApiCall = async () => {
    setLoadingApiCall(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}${apiUrl.startsWith("/") ? "" : "/"}${apiUrl}`;
      console.log(url);
      let res;

      if (apiMethod === "GET") {
        res = await fetch(url, {
          method: "GET",
        });
      } else {
        res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        });
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      if (data.transactionPayload) {
        setTransactionPayload(JSON.stringify(data.transactionPayload, null, 2));
      }
    } catch (error) {
      setResponse(error.message);
    }
    setLoadingApiCall(false);
  };

  const handleSignPayload = async () => {
    setLoadingSign(true);
    try {
      const payload = JSON.parse(transactionPayload);
      const { signature, txPayload } = await buildRelayerTransaction(
        privateKey,
        payload.domain,
        payload.types,
        payload.forwardRequest
      );
      const jobId = crypto.randomUUID();

      let apiName = "NA";
      try {
        apiName = JSON.parse(requestBody)?.apiName || "NA";
      } catch {}

      const updatedPayload = {
        jobId,
        apiName,
        signedTransactionPayload: txPayload,
      };
      setSignedPayload(JSON.stringify(updatedPayload, null, 2));
    } catch (error) {
      setSignedPayload(error.message);
    }
    setLoadingSign(false);
  };

  const handleSubmitTransaction = async () => {
    setLoadingSubmit(true);
    try {
      const convertedObj = JSON.parse(signedPayload);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs/submit-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(convertedObj),
        }
      );
      const data = await res.json();
      setSubmitResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setSubmitResponse(error.message);
    }
    setLoadingSubmit(false);
  };
  const handleGetJobStatus = async () => {
    setLoadingJobStatus(true);
    try {
      const convertedObj = JSON.parse(signedPayload);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/jobs/status?jobId=${convertedObj.jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(convertedObj),
        }
      );
      const data = await res.json();
      setJobStatusResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setJobStatusResponse(error.message);
    }
    setLoadingJobStatus(false);
  };
  const handleGetTxnStatus = async () => {
    setLoadingTxnStatus(true);
    try {
      const convertedObj = JSON.parse(signedPayload);
      const res = await fetch(
        `${process.env.REACT_APP_RELAYER_API_URL}/api/v1/relayers/glhf-example/transactions/${convertedObj.jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(convertedObj),
        }
      );
      const data = await res.json();
      setTxnStatusResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setTxnStatusResponse(error.message);
    }
    setLoadingTxnStatus(false);
  };

  return (
    <div>
      <h1>API Showcase</h1>

      <div>
        <h2>1. Get Transaction Payload</h2>

        <select
          value={apiMethod}
          onChange={(e) => setApiMethod(e.target.value)}
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
        </select>

        <br />
        <input
          type="text"
          placeholder="API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <br />

        {apiMethod === "POST" && (
          <textarea
            placeholder="Request Body"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
          ></textarea>
        )}

        <br />
        {/* DISABLED BUTTON */}
        <button onClick={handleApiCall} disabled={loadingApiCall}>
          {loadingApiCall ? "Sending..." : "Send Request"}
        </button>
        <pre>{response}</pre>
      </div>

      <div>
        <h2>2. Sign Transaction Payload</h2>
        <input
          type="text"
          placeholder="Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Transaction Payload"
          value={transactionPayload}
          readOnly
        />
        <br />
        {/* DISABLED BUTTON */}
        <button onClick={handleSignPayload} disabled={loadingSign}>
          {loadingSign ? "Signing..." : "Sign Payload"}
        </button>
        <pre>{signedPayload}</pre>
      </div>

      <div>
        <h2>3. Submit Transaction</h2>
        <textarea placeholder="Signed Payload" value={signedPayload} readOnly />
        <br />
        {/* DISABLED BUTTON */}
        <button onClick={handleSubmitTransaction} disabled={loadingSubmit}>
          {loadingSubmit ? "Submitting..." : "Submit Transaction"}
        </button>
        <pre>{submitResponse}</pre>
      </div>

      <div>
        {submitResponse.jobId && (
          <>
            <h2>4. Get Job Status</h2>
            <textarea
              placeholder="Job Id"
              value={submitResponse.jobId}
              readOnly
            />
            <br />

            {/* DISABLED BUTTON */}
            <button onClick={handleGetJobStatus} disabled={loadingJobStatus}>
              {loadingJobStatus ? "Fetching..." : "Get Job Status"}
            </button>

            <pre>{jobStatusResponse}</pre>
          </>
        )}
      </div>

      <div>
        {jobStatusResponse.transactionId && (
          <>
            <h2>5. Get Transaction Status</h2>

            <textarea
              placeholder="Transaction ID"
              value={jobStatusResponse.transactionId}
              readOnly
            />
            <br />

            {/* DISABLED BUTTON */}
            <button onClick={handleGetTxnStatus} disabled={loadingSubmit}>
              {loadingSubmit ? "Fetching..." : "Get Transaction Status"}
            </button>

            <pre>{txnStatusResponse}</pre>
          </>
        )}
      </div>

      <div>
        {txnStatusResponse.transactionHash && (
          <>
            <h2>6. Verify on Chain</h2>
            <button
              onClick={() =>
                window.open(
                  `https://glhf-testnet.explorer.caldera.xyz/tx/${txnStatusResponse.transactionHash}`,
                  "_blank"
                )
              }
            >
              View Transaction
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
