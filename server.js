import express from "express";
import bodyParser from "body-parser";
import * as secp from "ethereum-cryptography/secp256k1-compat";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import {
  concatBytes,
  hexToBytes,
  toHex,
  utf8ToBytes,
} from "ethereum-cryptography/utils";

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("hello worlds");
});

app.post("/", (req, res) => {
  console.log(req.body);
  const { r, s, v, msg } = req.body;
  const signature = concatBytes(hexToBytes(r), hexToBytes(s));
  const senderPubKey = secp.ecdsaRecover(signature, v, hexToBytes(msg));

  const messageHash = keccak256(utf8ToBytes(JSON.stringify(req.body.message)));

  res.send({
    validSignature: toHex(senderPubKey) == req.body.pubKey,
    validMessage: req.body.msg == toHex(messageHash),
  });
});

app.listen(port, () => {});
