import PortalNode from "../node/PortalNode";
import BlockchainApp from "../blockchain/BlockchainApp";
var reader = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

let node, blockchainApp;
// let node = new PortalNode(null),
//   blockchainApp = new BlockchainApp(null);

reader.on("line", data => line(data));

const responce = {};

responce.connect = req => {
  const body = req.split(",");
  node = new PortalNode(body[0], body[1], body[2], body[3]);
  blockchainApp = new BlockchainApp(node);
};

responce.mining = () => {
  blockchainApp.mine();
};

responce.makeTransaction = req => {
  blockchainApp.makeTransaction(req[0], req[1], req[2]);
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

function line(data) {
  const rpc = data.toString().split(" ")[0];
  const req = data.toString().split(" ")[1];

  if (Object.keys(responce).includes(rpc)) {
    responce[rpc](req);
  }
}
