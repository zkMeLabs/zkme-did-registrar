import { updateDidDocument, privateKey, network, url } from "./test.data";
import { registerDID } from '../src/zkme-did-registrar';
import { updateDidDoc } from '../src/zkme-did-update';
import { deleteDidDoc } from '../src/zkme-did-delete';
import { BaseResponse } from "../src/base-response";
import { createDID } from "../src/test-utils";
import { ethers } from "ethers";

jest.setTimeout(3000000);
let zkMeDID: string;
let createDidRes: BaseResponse;
let wallet: ethers.Wallet;

describe("test create did function", () => {

  

  it('should be privateKey for create DID', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');

    if (network === 'testnet') {
      await expect(network).not.toBeNull();
      await expect(network).not.toBe('');
      await expect(network).toMatch('testnet');
    } else {
      await expect(network).not.toBeNull();
      await expect(network).not.toBe('');
      await expect(network).toMatch('mainnet');
    }
  })

  beforeAll(async () => {
    createDidRes = await createDID(network, privateKey);
    return true;
  })

  it('should get address', async () => {
    await expect(createDidRes.data.address).toBeDefined();
    await expect(createDidRes.data.address).not.toBeNull();
    await expect(createDidRes.data.address).not.toBe('');
    await expect(createDidRes.data.address.slice(0, 2)).toMatch('0x');
    await expect(createDidRes.data.address.length).toBe(42);
  })

  it('should get public key base58', async () => {
    await expect(createDidRes.data.publicKeyBase58).toBeDefined();
    await expect(createDidRes.data.publicKeyBase58).not.toBeNull();
    await expect(createDidRes.data.publicKeyBase58).not.toBe('');
  })

  it('should get zkMe DID', async () => {

    if (createDidRes && createDidRes.data && createDidRes.data.did.split(':')[2] === 'testnet') {

      await expect(createDidRes.data.did).toBeDefined();
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 16)).toMatch('did:zkme:testnet');
      await expect(createDidRes.data.did.slice(17, 19)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[3].length).toBe(42);

      zkMeDID = createDidRes.data.did;
    } else {
      await expect(createDidRes.data.did).toBeDefined();
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 8)).toMatch('did:zkme');
      await expect(createDidRes.data.did.slice(9, 11)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[2].length).toBe(42);

      zkMeDID = createDidRes.data.did;
    }
  })
})


describe("test register DID function", () => {

  let registerDidRes: BaseResponse;

  it('should be zkMe DID for register DID', async () => {

    await expect(zkMeDID).not.toBeNull();
    await expect(zkMeDID).not.toBe('');
    await expect(zkMeDID.slice(0, 9)).toMatch('did:zkme:');
  })

  beforeAll(async () => {
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
        url
      )
      wallet = new ethers.Wallet(privateKey, provider);
      createDidRes = await createDID(network, privateKey);
      registerDidRes= await registerDID(zkMeDID, createDidRes.data.publicKey, wallet);
  })

  it('should get register zkMe DID for register DID', async () => {

    if (registerDidRes && registerDidRes.data && registerDidRes.data.did) {
      if (registerDidRes.data.did.split(':')[2] === 'testnet') {

        await expect(registerDidRes.data.did).toBeDefined();
        await expect(registerDidRes.data.did).not.toBeNull();
        await expect(registerDidRes.data.did).not.toBe('');
        await expect(registerDidRes.data.did.slice(0, 16)).toMatch('did:zkme:testnet');
        await expect(registerDidRes.data.did.slice(17, 19)).toMatch('0x');
        await expect(registerDidRes.data.did.split(":")[3].length).toBe(42);
      } else {

        await expect(registerDidRes.data.did).toBeDefined();
        await expect(registerDidRes.data.did).not.toBeNull();
        await expect(registerDidRes.data.did).not.toBe('');
        await expect(registerDidRes.data.did.slice(0, 8)).toMatch('did:zkme');
        await expect(registerDidRes.data.did.slice(8, 10)).toMatch('0x');
        await expect(registerDidRes.data.did.split(":")[2].length).toBe(42);
      }
    } else {
      await expect(registerDidRes).toBeFalsy();
    }
  })

  it('should get transaction hash after DID register ', async () => {

    if (registerDidRes && registerDidRes.data && registerDidRes.data.txnHash) {
      await expect(registerDidRes.data.txnHash).toBeDefined();
      await expect(registerDidRes.data.txnHash).not.toBeNull();
      await expect(registerDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(registerDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(registerDidRes).toBeFalsy();
    }
  })
})

describe("test update DID doc function", () => {

  let updateDidRes: BaseResponse;

  it('should be zkMe DID for update DID document', async () => {

    if (zkMeDID && zkMeDID.split(':')[2] === 'testnet') {

      await expect(zkMeDID).toBeDefined();
      await expect(zkMeDID).not.toBeNull();
      await expect(zkMeDID).not.toBe('');
      await expect(zkMeDID.slice(0, 16)).toMatch('did:zkme:testnet');
      await expect(zkMeDID.slice(17, 19)).toMatch('0x');
      await expect(zkMeDID.split(":")[3].length).toBe(42);
    } else {

      await expect(zkMeDID).toBeDefined();
      await expect(zkMeDID).not.toBeNull();
      await expect(zkMeDID).not.toBe('');
      await expect(zkMeDID.slice(0, 8)).toMatch('did:zkme');
      await expect(zkMeDID.slice(9, 11)).toMatch('0x');
      await expect(zkMeDID.split(":")[2].length).toBe(42);
    }
  })

  it('should be updated DID Document for update DID document', async () => {

    await expect(updateDidDocument).not.toBeNull();
    await expect(updateDidDocument).not.toBe('');
    const updateDidDocumentJson = JSON.parse(updateDidDocument);
    await expect(Object.keys(updateDidDocumentJson)).toEqual(expect.arrayContaining(['@context', 'id', 'verificationMethod']));
  })

  it('should be private key for update DID document', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');
  })

  beforeAll(async () => {
        const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
        url
      )
      wallet = new ethers.Wallet(privateKey, provider);
    updateDidRes = await updateDidDoc(zkMeDID, updateDidDocument, wallet);
  })

  it('should get transaction hash after update DID document', async () => {

    if (updateDidRes && updateDidRes.data && updateDidRes.data.txnHash) {
      await expect(updateDidRes.data.txnHash).toBeDefined();
      await expect(updateDidRes.data.txnHash).not.toBeNull();
      await expect(updateDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(updateDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(updateDidRes.data.txnHash).toBeFalsy();
    }
  })
})

describe("test delete function", () => {

  let deleteDidRes: BaseResponse;

  it('should be zkMe DID for delete DID document', async () => {

    if (zkMeDID && zkMeDID.split(':')[2] === 'testnet') {

      await expect(zkMeDID).toBeDefined();
      await expect(zkMeDID).not.toBeNull();
      await expect(zkMeDID).not.toBe('');
      await expect(zkMeDID.slice(0, 16)).toMatch('did:zkme:testnet');
      await expect(zkMeDID.slice(17, 19)).toMatch('0x');
      await expect(zkMeDID.split(":")[3].length).toBe(42);
    } else {

      await expect(zkMeDID).toBeDefined();
      await expect(zkMeDID).not.toBeNull();
      await expect(zkMeDID).not.toBe('');
      await expect(zkMeDID.slice(0, 8)).toMatch('did:zkme');
      await expect(zkMeDID.slice(8, 10)).toMatch('0x');
      await expect(zkMeDID.split(":")[2].length).toBe(42);
    }
  })

  it('should be private key for delete DID document', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');
  })

  beforeAll(async () => {
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
        url
      )
      wallet = new ethers.Wallet(privateKey, provider);
    deleteDidRes = await deleteDidDoc(zkMeDID, wallet);
  })

  it('should get transaction hash after delete DID document', async () => {

    if (deleteDidRes && deleteDidRes.data && deleteDidRes.data.txnHash) {

      await expect(deleteDidRes.data.txnHash).toBeDefined();
      await expect(deleteDidRes.data.txnHash).not.toBeNull();
      await expect(deleteDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(deleteDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(deleteDidRes.data.txnHash).toBeFalsy();
    }
  })
})