import { client } from '../models';

class CacheHelper {
  static async deleteKeysByPattern(pattern: string): Promise<void> {
    for await (const key of client.scanIterator({
      TYPE: 'string',
      MATCH: `*${pattern}*`,
      COUNT: 100
    })) {
      await client.del(key);
    }
  }
}

export default CacheHelper;