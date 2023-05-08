import { BaseResponse } from "./base-response";
import { ethers } from "ethers";
import { Wallet } from "@ethersproject/wallet";
import * as bs58 from "bs58";
import { computeAddress } from "@ethersproject/transactions";
import { computePublicKey } from "@ethersproject/signing-key";

/**
 * Create public and private key and generate address.
 * @param privateKey
 * @returns Returns the address and public key of type base58.
 */
async function createKeyPair(privateKey: string): Promise<any> {
  try {
    const publicKey: string = computePublicKey(privateKey, true);
    const bufferPublicKey: Buffer = Buffer.from(publicKey);
    const publicKeyBase58: string = bs58.encode(bufferPublicKey);

    const address: string = computeAddress(privateKey);
    return { address, publicKeyBase58, publicKey };
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a DID Uri.
 * @param privateKey
 * @returns Returns the address, public key of type base58, private key and DID Uri.
 */
export async function createDID(
  network: string,
  privateKey?: string
): Promise<BaseResponse> {
  try {
    let errorMessage: string;
    let did: string;
    let _privateKey: string;

    if (privateKey) {
      _privateKey = privateKey;
    } else {
      const wallet: ethers.Wallet = Wallet.createRandom();
      _privateKey = wallet.privateKey;
    }

    const { address, publicKeyBase58, publicKey } = await createKeyPair(_privateKey);

    if (network === "testnet") {
      did = `did:zkme:testnet:${address}`;
    } else if (network === "mainnet") {
      did = `did:zkme:${address}`;
    } else {
      errorMessage = `Wrong network enter!`;
      throw new Error(errorMessage);
    }

    return BaseResponse.from(
      { address, publicKeyBase58, _privateKey, did, publicKey },
      "Created DID uri successfully"
    );
  } catch (error) {
    throw error;
  }
}
