import UTDService from "./UTDService";
class BlockService extends UTDService {
  constructor(token) {
    super(token);
  }

  /**
   * Gets the block data
   * @returns
   */
  async getBlocks() {
    try {
      const { data } = await this.axiosInstance.get(
        `https://www.uptodateconnect.com/api/v1/site-builder/blocks?version=2&developer=true`
      );

      return data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Gets the HTML Code for a block
   * @param {string | number} blockId
   * @returns
   */
  async getBlockCode(blockId) {
    try {
      const { data } = await this.axiosInstance.get(
        `https://www.uptodateconnect.com/api/v1/site-builder/blocks/${blockId}`
      );

      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default BlockService
