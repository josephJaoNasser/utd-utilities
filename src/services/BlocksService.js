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

      const categories = [];
      for (const block of data.payload) {
        if (!categories.includes(block.category)) {
          categories.push(block.category);
        }
      }

      const sortedBlocks = {};

      for (const category of categories) {
        sortedBlocks[category] = data.payload.filter(
          (block) => block.category === category
        );
      }

      return {
        blocks: sortedBlocks,
        categories,
      };
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

export default BlockService;
