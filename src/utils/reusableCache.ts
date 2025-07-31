import nodeCache from "node-cache";


class Cache{
  private cache: nodeCache;
  constructor(ttlSeconds: number = 500){
    this.cache = new nodeCache({
      stdTTL: ttlSeconds,
      checkperiod: Math.floor(ttlSeconds * 0.2),
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined{
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean{
    return this.cache.set(key, value, ttl as number);
  }

  del(key: string): number {
    return this.cache.del(key);
  }


}

const cache = new Cache();
export default cache

// const cache = new NodeCache({ stdTTL: 500 });

// function setToCache(key, value) {
//   cache.set(key, value);
// }


// function getFromCache(key) {
//   return cache.get(key);
// }

// function deleteFromCache(key) {
//   cache.del(key);
// }

// module.exports = {
//   setToCache,
//   getFromCache,
//   deleteFromCache
// };


