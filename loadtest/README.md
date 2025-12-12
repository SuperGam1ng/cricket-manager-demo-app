## LoadTest Framework

Loadtest is done using k6. Install it.
On Mac it was 
```
brew install k6
```
K6 doesn't run on node it just have javascript scripting. 

## Our LoadTest

CD to the /loadtest/tests folder and run

```
k6 run --vus 1 --iterations 100  createtokens.js --console-output ctokens.log
```

--vus => number of virtual users
--iterations => number of iterations


Create tokens test includes three steps
* Step 1 call backend to get payload for create tokens
* Step 2 call demo API to sign the payload using a key
* Step 3 submit the transaction and console.log the jobId

k6 just submits the transactions after that *remove the trailing data in the log file* i.e. there is some random data in each line remove it using multiline edit or something and edit parse_results.js with the log file as input and run

```
node parse_results.js
```

the above will call the status API and log how long it took (diff between first status and last status)
