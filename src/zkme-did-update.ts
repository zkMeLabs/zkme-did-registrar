import * as log4js from "log4js";
import { DidUriValidation } from "./did-uri-validation";
import { BaseResponse } from "./base-response";
import { RegistryContractInitialization } from "./registry-contract-initialization";
import { ethers, Signer, providers } from "ethers";

const logger = log4js.getLogger();
logger.level = `debug`;

/**
 * Update DID document on matic chain.
 * @param did
 * @param didDocJson
 * @param signerOrProvider
 * @param url
 * @param contractAddress
 * @returns Returns transaction hash after updating DID Document on chain.
 */
export async function updateDidDoc(
      did: string,
      didDocJson: string,
      signerOrProvider: Signer | providers.Provider, // Todo: look for better way to address private key passing mechanism
      url?: string,
      contractAddress?: string
): Promise<BaseResponse> {
      try {
            let errorMessage: string;
            const didUriValidation: DidUriValidation = new DidUriValidation();
            const registryContractInitialization: RegistryContractInitialization = new RegistryContractInitialization();
            const didMethodCheck: Boolean = await didUriValidation.zkMeDidMatch(did);
            const didWithTestnet: string = await didUriValidation.splitZkMeDid(did);

            if (didMethodCheck) {
                  const networkCheckWithUrl: any = await didUriValidation.networkMatch(
                        did,
                        url,
                        contractAddress
                  );

                  const registry: ethers.Contract = await registryContractInitialization.instanceCreation(
                        signerOrProvider,
                        networkCheckWithUrl.contractAddress
                  );

                  if (didDocJson && JSON.parse(didDocJson)) {
                        if (
                              "@context" in JSON.parse(didDocJson) &&
                              "id" in JSON.parse(didDocJson) &&
                              "verificationMethod" in JSON.parse(didDocJson)
                        ) {
                              const didAddress: string =
                                    didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;

                              // Calling smart contract with update DID document on matic chain
                              let txnHash: any = await registry.functions
                                    .updateDIDDoc(didAddress, didDocJson)
                                    .then((resValue: any) => {
                                          return resValue;
                                    });

                              logger.debug(
                                    `[updateDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                              );

                              return BaseResponse.from(txnHash, "Update DID document successfully");
                        } else {
                              errorMessage = `Invalid method-specific identifier has been entered!`;
                              logger.error(errorMessage);
                              throw new Error(errorMessage);
                        }
                  } else {
                        errorMessage = `Invalid DID has been entered!`;
                        logger.error(errorMessage);
                        throw new Error(errorMessage);
                  }
            } else {
                  errorMessage = `DID does not match!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      } catch (error) {
            logger.error(`Error occurred in updateDidDoc function ${error}`);
            throw error;
      }
}
