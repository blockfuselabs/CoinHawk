const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 500 });

function setToCache(key, value) {
  cache.set(key, value);
}


function getFromCache(key) {
  return cache.get(key);
}

function deleteFromCache(key) {
  cache.del(key);
}

module.exports = {
  setToCache,
  getFromCache,
  deleteFromCache
};


