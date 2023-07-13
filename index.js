import axios from "axios";
import * as secp from "ethereum-cryptography/secp256k1-compat";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

async function main() {
  const message = {
    transferTo: "chris",
    amount: 12,
  };

  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
  const privateKey = await secp.createPrivateKey();

  const pubKey = secp.publicKeyCreate(privateKey);
  const signature = secp.ecdsaSign(messageHash, privateKey);
  const sig = {
    r: toHex(signature.signature.slice(0, 32)),
    s: toHex(signature.signature.slice(32, 64)),
    v: signature.recid,
    msg: toHex(messageHash),
    pubKey: toHex(pubKey),
    message: message,
  };

  const res = await axios.post("http://localhost:8080/", sig);
  console.log(res.data);
}

main();
