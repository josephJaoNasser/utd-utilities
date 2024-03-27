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

      const AllBlocksString = "All blocks";

      const categories = [];
      for (const block of data.payload) {
        if (!categories.includes(block.category)) {
          categories.push(block.category);
        }
      }

      categories.sort();

      const sortedBlocks = {
        [AllBlocksString]: data.payload,
      };

      for (const category of categories) {
        sortedBlocks[category] = data.payload.filter(
          (block) => block.category === category
        );
      }

      categories.unshift(AllBlocksString);

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

      if (!data.success) {
        throw new Error("Error while getting block code");
      }

      return data.payload;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Searches for blocks given a search string
   * @param {string} searchString
   * @returns
   */
  async searchBlocks(searchString) {
    const url = `https://www.uptodateconnect.com/api/v1/site-builder/blocks?version=2&developer=true&search=${searchString}`;

    try {
      const { data } = await this.axiosInstance.get(url);
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getBlocksByCategory() {
    try {
    } catch (e) {
      throw e;
    }
  }
}

export default BlockService;
