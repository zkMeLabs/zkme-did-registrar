# zkMe DID Method

The zkMe DID method library uses Ethereum based address as fully functional DID's or Decentralized identifers.
Third party users can use this to create zkMe DID identities. It allows the controller to perform actions like 
resolve, update and delete by encapsulating zkMeDID registry and zkMeDID resolver. The DID identifier allows the 
controller to resolve DID document for usage in different scenarios.

### Example of zkMe DID document resolved using zkMeDIDResolver:
```js
{
	"@context": "https://w3id.org/did/v1",
	"id": "did:zkme:0x2acE1D0d919293D10Ef7611bC768F5386d908fc2",
	"verificationMethod": [{
		"id": "did:zkme:testnet:0x2acE1D0d919293D10Ef7611bC768F5386d908fc2",
		"type": "EcdsaSecp256k1VerificationKey2019",
		"controller": ["did:zkme:testnet:0x2acE1D0d919293D10Ef7611bC768F5386d908fc2"],
		"publicKeyBase58": "7Lnm1ahzuSRNzCuMHWQpzZCeWg8jFT1RfTxBCaBMSxw1qWMk1UJc28rQwfG2Gewb1z48guTmEtJy1p7Y42ECLsecVeJYb"
	}]
}
```

# DID Method or DID schema
The DID method is a specific implementation of a DID scheme that will be identified by method name. For this case the method name is “zkme”, and the identifier is an Ethereum address.

## The DID for zkMe looks like:

### On Zetachain testnet
```
did:zkme:testnet:0x2acE1D0d919293D10Ef7611bC768F5386d908fc2
```

### On Zetachain mainnet
Comming soon...

## DID On-Chain

Every DID on chain has the same structure, defined as:

```js 
struct zkMeDID{
        address controller;
        uint created;
        uint updated;
        string doc;
    }
```
Where,
- controller : the address of the person who creates and manages the DID
- created : holds the timestamp of the block when DID was created
- updated : initially holds the timestamp of when the DID was created, but is updated if the controller updates the DID on chain, and
- doc : holds the entire DID document in form of string.

# DID Operations

## Register

Register of DID is done by logging the transaction on the zkme-did-registry smart contract, by invoking

```js
import { registerDID } from "zkme-did-registrar";
const txHash = await registerDID(did, publicKey, signerOrProvier, url?, contractAddress?);
```
The function returns a txhash and DID uri on successful execution.

## Update

The DID controller requests for the update functionality, if the controller wishes to edit the did doc store on the ledger using :

```js
import { updateDidDoc } from "zkme-did-registrar";
const txHash = await updateDidDoc(did, didDoc, signerOrProvier, url?, contractAddress?);
```

## Delete

To remove the instance of DID from the ledger the above function is used as follows :

```js
import { deleteDidDoc } from "zkme-did-registrar";
const txHash = await deleteDidDoc(did, signerOrProvier, url?, contractAddress?);
```