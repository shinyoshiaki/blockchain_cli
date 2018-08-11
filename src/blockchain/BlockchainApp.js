import Blockchain from "./BlockChain";
import type from "../constants/type";
import * as format from "../constants/format";
import Events from "events";

let node;

export default class BlockchainApp extends Blockchain {
  constructor(_node) {
    super();
    this.ev = new Events.EventEmitter();

    node = _node;

    node.ev.on("blockchainCli", networkLayer => {
      const transportLayer = JSON.parse(networkLayer);

      this.ev.emit(transportLayer.session, transportLayer.body);
      const body = transportLayer.body;

      switch (transportLayer.session) {
        case type.NEWBLOCK:
          console.log("blockchainApp", "new block");
          if (body.index > this.chain.length + 1 || this.chain.length === 1) {
            (async () => {
              await this.checkConflicts();
            })();
          } else {
            this.addBlock(body);
          }
          break;
        case type.TRANSACRION:
          console.log("blockchainApp transaction", body);
          if (
            !JSON.stringify(this.currentTransactions).includes(
              JSON.stringify(body)
            )
          ) {
            this.addTransaction(body);
          }
          break;
        case type.CONFLICT:
          console.log("blockchain app check conflict");
          if (this.chain.length > body.size) {
            console.log("blockchain app check is conflict");
            node.send(
              body.nodeId,
              format.sendFormat(type.RESOLVE_CONFLICT, this.chain)
            );
          }
          break;
        default:
          break;
      }
    });
  }

  checkConflicts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(false);
      }, 4 * 1000);
      console.log("this.checkConflicts");
      node.broadCast(
        format.sendFormat(type.CONFLICT, {
          nodeId: node.nodeId,
          size: this.chain.length
        })
      );
      this.ev.on(type.RESOLVE_CONFLICT, body => {
        console.log("resolve conflict");
        if (this.chain.length < body.length) {
          console.log("conflict my chain short");
          if (this.validChain(body)) {
            console.log("conflict swap chain");
            this.chain = body;
          } else {
            console.log("conflict wrong chain");
          }
        }
        resolve(true);
      });
    });
  }

  mine() {
    return new Promise(resolve => {
      const proof = this.proofOfWork();

      const lastBlock = this.lastBlock();
      const previousHash = this.hash(lastBlock);
      const block = this.newBlock(proof, previousHash);

      console.log("new block forged", JSON.stringify(block));

      node.broadCast(format.sendFormat(type.NEWBLOCK, block));

      resolve(block);
    });
  }

  //sessionLayer
  makeTransaction(recipient, amount, data) {
    const tran = this.newTransaction(this.address, recipient, amount, data);
    console.log("makeTransaction", tran);

    node.broadCast(format.sendFormat(type.TRANSACRION, tran));
  }

  getChain() {
    return this.chain;
  }
}
