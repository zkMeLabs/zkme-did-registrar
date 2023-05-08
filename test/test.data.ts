export const testDid = '';

export const privateKey = "";

export const url = "https://api.athens2.zetachain.com/evm";

export const contractAddress = "0x29d4D59277984C2bd03E1BacB19A6C9fe4FC96Af";

export const network = "testnet";

const publicKeyBase58 = "";

export const updateDidDocument = JSON.stringify({
    "@context": "https://w3id.org/did/v1",
    id: testDid,
    verificationMethod: [
      {
        id: `${testDid}#key-1`,
        type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
        controller: testDid,
        publicKeyBase58: publicKeyBase58,
      },
    ],
    authentication: [
        testDid,
      {
        id: `${testDid}#key-1`,
        type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
        controller: testDid,
        publicKeyBase58: publicKeyBase58,
      },
    ],
    assertionMethod: [
        testDid,
      {
        id: `${testDid}#key-1`,
        type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
        controller: testDid,
        publicKeyBase58: publicKeyBase58,
      },
    ]
  });