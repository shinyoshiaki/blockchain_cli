import PortalNode from "../node/PortalNode";
import BlockChainApp from "./BlockChainApp";

const responce = {};
const reader = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

let node, blockchainApp;

reader.on("line", data => line(data));

function line(data) {
  const rpc = data.toString().split(" ")[0];
  const req = data.toString().split(" ")[1];

  if (Object.keys(responce).includes(rpc)) {
    responce[rpc](req);
  }
}

responce.connect = req => {
  console.log("connect to network");
  const body = req.split(",");
  node = new PortalNode(body[0], body[1], body[2], body[3]);
  blockchainApp = new BlockChainApp(node);
};

responce.mining = () => {
  blockchainApp.mine();
};

responce.makeTransaction = req => {
  const body = req.split(",");
  //recipient, amount, data
  blockchainApp.makeTransaction(body[0], body[1], body[2]);
};

responce.balance = () => {
  console.log("now balance", blockchainApp.nowAmount());
};

responce.blockchain = () => {
  console.log("now blockchain", blockchainApp.chain);
};

responce.address = () => {
  console.log("my address", blockchainApp.address);
};

console.log(Object.keys(responce));
