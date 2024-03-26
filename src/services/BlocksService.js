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
        if (!categories.find((cat) => cat.category === block.category)) {
          categories.push(block);
        }
      }

      const sortedBlocks = {};

      for (const categoryBlock of categories) {
        sortedBlocks[categoryBlock.category] = data.payload.filter(
          (block) => block.category === categoryBlock.category
        );
      }

      return {
        blocks: sortedBlocks,
        categoryBlocks: categories,
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

      if (!data.success) {
        throw new Error("Error while getting block code");
      }

      return data.payload;
    } catch (e) {
      throw e;
    }
  }
}

export default BlockService;
