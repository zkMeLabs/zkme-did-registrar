import * as log4js from "log4js";
import * as bs58 from "bs58";
import { ethers, Signer, providers, utils } from "ethers";
import { BaseResponse } from "./base-response";
import { DidUriValidation } from "./did-uri-validation";
import { RegistryContractInitialization } from "./registry-contract-initialization";

const logger = log4js.getLogger();
logger.level = `debug`;

/**
 * Create DID Document.
 * @param did
 * @param address
 * @returns Returns the DID Document.
 */
export async function wrapDidDocument(
  did: string,
  publicKeyBase58: string,
  serviceEndpoint?: string
): Promise<object> {
  if (serviceEndpoint) {
    return {
      "@context": "https://w3id.org/did/v1",
      id: did,
      verificationMethod: [
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
      authentication: [
        did,
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
      assertionMethod: [
        did,
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
      service: [
        {
          id: `${did}#linked-domain`,
          type: "LinkedDomains",
          serviceEndpoint: `${serviceEndpoint}`,
        },
      ],
    };
  } else {
    return {
      "@context": "https://w3id.org/did/v1",
      id: did,
      verificationMethod: [
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
      authentication: [
        did,
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
      assertionMethod: [
        did,
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
          controller: did,
          publicKeyBase58: publicKeyBase58,
        },
      ],
    };
  }
}

/**
 * Registers DID document on matic chain.
 * @param did
 * @param publicKey
 * @param signerOrProvider
 * @param url
 * @param contractAddress
 * @returns Returns DID and transaction hash.
 */
export async function registerDID(
  did: string,
  publicKey: string,
  signerOrProvider: Signer | providers.Provider,
  url?: string,
  contractAddress?: string,
  serviceEndpoint?: string
): Promise<BaseResponse> {
  try {
    let errorMessage: string;
    let didDoc: object;
    const didUriValidation: DidUriValidation = new DidUriValidation();
    const registryContractInitialization: RegistryContractInitialization =
      new RegistryContractInitialization();

    const didMethodCheck: Boolean = await didUriValidation.zkMeDidMatch(did);
    const didWithTestnet: string = await didUriValidation.splitZkMeDid(did);

    if (didMethodCheck) {
      const networkCheckWithUrl: any = await didUriValidation.networkMatch(
        did,
        url,
        contractAddress
      );

      const address = utils.computeAddress(publicKey);

      if (
        (did &&
          didWithTestnet === "testnet" &&
          did.split(":")[3] === address) ||
        (did && didWithTestnet === address)
      ) {
        const registry: ethers.Contract =
          await registryContractInitialization.instanceCreation(
            signerOrProvider,
            networkCheckWithUrl.contractAddress
          );

        const didAddress: string =
          didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;

        let resolveDidDoc: any = await registry.functions
          .getDIDDoc(didAddress)
          .then((resValue: any) => {
            return resValue;
          });
        const bufferPublicKey: Buffer = Buffer.from(publicKey);
        const publicKeyBase58: string = bs58.encode(bufferPublicKey);
        if (resolveDidDoc.includes("")) {
          // Get DID document
          if (serviceEndpoint) {
            didDoc = await wrapDidDocument(
              did,
              publicKeyBase58,
              serviceEndpoint
            );
          } else {
            didDoc = await wrapDidDocument(did, publicKeyBase58);
          }

          const stringDidDoc: string = JSON.stringify(didDoc);

          const txnHash: any = await registry.functions
            .createDID(didAddress, stringDidDoc, { gasLimit: 1300000, maxFeePerGas: 3000000000, maxPriorityFeePerGas: 1000000000  })
            .then((resValue: any) => {
              return resValue;
            })
            .catch((error: any) => {
              logger.debug(
                `[registerDID] error - ${JSON.stringify(error)} \n\n\n`
              );
            });

          logger.debug(
            `[registerDID] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
          );

          return BaseResponse.from(
            { did, txnHash },
            "Registered DID document successfully."
          );
        } else {
          errorMessage = `The DID document already registered!`;
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        errorMessage = `Private key and DID uri do not match!`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      errorMessage = `DID does not match!`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    logger.error(`Error occurred in registerDID function  ${error}`);
    throw error;
  }
}
