import * as log4js from "log4js";
import { DidUriValidation } from "./did-uri-validation";
import { BaseResponse } from "./base-response";
import { RegistryContractInitialization } from "./registry-contract-initialization";
import { ethers, Signer, providers } from "ethers";

const logger = log4js.getLogger();
logger.level = `debug`;

/**
 * Delete DID Document.
 * @param did
 * @param signer
 * @param url
 * @param contractAddress
 * @returns Return transaction hash after deleting DID Document on chain.
 */
export async function deleteDidDoc(
      did: string,
      signerOrProvider: Signer | providers.Provider,
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
                  const didAddress: string =
                        didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;

                  let txnHash: any = await registry.functions
                        .deleteDIDDoc(didAddress)
                        .then((resValue: any) => {
                              return resValue;
                        });

                  logger.debug(
                        `[deleteDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                  );

                  return BaseResponse.from(txnHash, "Delete DID document successfully");
            } else {
                  errorMessage = `DID does not match!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      } catch (error) {
            logger.error(`Error occurred in deleteDidDoc function ${error}`);
            throw error;
      }
}
