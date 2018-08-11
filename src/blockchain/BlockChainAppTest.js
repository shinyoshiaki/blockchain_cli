import PortalNode from "../node/PortalNode";
import BlockchainApp from "../blockchain/BlockchainApp";

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
  blockchainApp = new BlockchainApp(node);
};

responce.mining = () => {
  blockchainApp.mine();
};

responce.makeTransaction = req => {
  const body = req.split(",");
  blockchainApp.makeTransaction(body[0], body[1], body[2]);
};

responce.balance = () => {
  console.log("now balance", blockchainApp.blockchain.nowAmount());
};

responce.blockchain = () => {
  console.log("now blockchain", blockchainApp.blockchain.chain);
};

responce.address = () => {
  console.log("my address", blockchainApp.blockchain.address);
};

console.log(Object.keys(responce));
