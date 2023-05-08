import { ethers, Signer, providers } from "ethers";
const abi = require("./abi.json");

export class RegistryContractInitialization {
      /**
       * Creates an instance of the zkMe DID registry smart contract.
       * @param url
       * @param signerOrProvider
       * @param contractAddress
       * @returns Returns the instance created.
       */
      async instanceCreation(
            signerOrProvider: Signer | providers.Provider,
            contractAddress: string
      ): Promise<ethers.Contract> {
            const registry: ethers.Contract = new ethers.Contract(
                  contractAddress,
                  abi,
                  signerOrProvider
            );
            return registry;
      }
}
