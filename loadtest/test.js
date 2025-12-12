import http from 'k6/http';

export default function () {
    const backendhost = "https://cricket-manager-backend-894136132206.asia-south1.run.app/"
    const demohost = "https://cricket-manager-demo-app-894136132206.asia-south1.run.app/"
    const adminPrivateKey = "650d9f993da85046ceefe05d9c7c930fa2712b7a282e8f54c245ea1c2b03e3f1";


    // const r1 = http.post(backendhost + "contract/setContract", JSON.stringify(
    //     {
    //         "contractAddress": "0xAbE8C14C6501db6892B07B918E7F06F276D2976c",
    //         "adminWalletAddress": "0xb46be61fb0dd88fb5eb2f5ad7163454304314b82",
    //         "action": "Unpause"
    //     }
    // ), { headers: { 'Content-Type': 'application/json' } });
    // const payload = r1.json();

    const r1 = http.post(backendhost + "cricketer/add-supply", JSON.stringify(
        {
            "contractAddress": "0x9F4DfDb029350C77da2cB024c68b81bE80DAc0a7",
            "adminWalletAddress": "0xb46be61fb0dd88fb5eb2f5ad7163454304314b82",
            "additionalSupply": 1
        }
    ), { headers: { 'Content-Type': 'application/json' } });
    const payload = r1.json();
    console.log(r1.json());


    const r2 = http.post(demohost + "api/sign", JSON.stringify({
        transactionPayload: payload.transactionPayload,
        privateKey: adminPrivateKey
    }), { headers: { 'Content-Type': 'application/json' } });

    const jobId = r2.json().jobId;
    console.log("JobID: " + jobId);
    console.log(r2.json());

    const r3 = http.post(backendhost + "jobs/submit-transaction", JSON.stringify(
        r2.json()
    ), { headers: { 'Content-Type': 'application/json' } });
    console.log(r3.json());

}
