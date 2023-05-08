import * as log4js from "log4js";
import * as networkConfiguration from "./configuration.json";

const logger = log4js.getLogger();
logger.level = `debug`;

export class DidUriValidation {
  /**
   * zkMe DID match or not.
   * @param did
   * @returns Returns true after zkMe DID match successfully.
   */
  async zkMeDidMatch(did: string): Promise<Boolean> {
    let errorMessage: string;
    const didWithTestnet: string = await this.splitZkMeDid(did);

    if (
      (did &&
        didWithTestnet === "testnet" &&
        did.match(/^did:zkme:testnet:0x[0-9a-fA-F]{40}$/)) ||
      (did && did.match(/^did:zkme:0x[0-9a-fA-F]{40}$/))
    ) {
      if (
        (didWithTestnet === "testnet" &&
          did.match(/^did:zkme:testnet:\w{0,42}$/)) ||
        did.match(/^did:zkme:\w{0,42}$/)
      ) {
        return true;
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
  }

  /**
   * zkMe DID and Network match or not.
   * @param did
   * @param url
   * @param contractAddress
   * @returns Returns network url and contract address.
   */
  async networkMatch(
    did: string,
    url?: string,
    contractAddress?: string
  ): Promise<any> {
    let errorMessage: string;
    const didWithTestnet: string = await this.splitZkMeDid(did);
    if (
      url &&
      url === `${networkConfiguration[0].testnet?.URL}` &&
      did &&
      didWithTestnet === "testnet"
    ) {
      url = `${networkConfiguration[0].testnet?.URL}`;
      contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;

      return {
        url,
        contractAddress,
      };
    } else if (!url && did && didWithTestnet === "testnet") {
      url = `${networkConfiguration[0].testnet?.URL}`;
      contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;
      return {
        url,
        contractAddress,
      };
    } else if (!url && did && didWithTestnet !== "testnet") {
      url = `${networkConfiguration[1].mainnet?.URL}`;
      contractAddress = `${networkConfiguration[1].mainnet?.CONTRACT_ADDRESS}`;
      return {
        url,
        contractAddress,
      };
    } else {
      errorMessage = `The DID and url do not match!`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Split zkMe DID.
   * @param did
   * @returns Returns Split data value to zkMe DID.
   */
  async splitZkMeDid(did: string): Promise<string> {
    const splitDidValue: string = did.split(":")[2];
    return splitDidValue;
  }
}
