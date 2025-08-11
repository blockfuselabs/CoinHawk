import { getCoinsNew,getCoinsTopVolume24h, getCoin, getCoinsTopGainers, getCoinsMostValuable } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

const BASEAPP_REFERRER_ADDRESS = process.env.BASEAPP_REFERRER_ADDRESS?.toLowerCase();

// Helper function to calculate pagination parameters
function calculatePaginationParams(count: number = 10, page: number = 1) {
  const limit = Math.min(Math.max(count, 1), 100); // Ensure count is between 1 and 100
  return { limit };
}

export async function fetchNewCoins(count: number = 10, page: number = 1) {
  const { limit } = calculatePaginationParams(count, page);
  
  const response = await getCoinsNew({ count: limit });

  console.log("Fetched new coins:", response.data?.exploreList?.edges?.length);

  const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
  if (!tokens?.length) {
    return {
      coins: [],
      pagination: {
        page,
        count: limit,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        cursor: undefined
      }
    };
  }

  const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
    const details = await fetchSingleCoin(coin.address);

    const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

    return {
      ...coin,
      details,
      isFromBaseApp,
    };

  }));

  return {
    coins: detailedCoins,
    pagination: {
      page,
      count: limit,
      total: tokens.length,
      hasNextPage: response.data?.exploreList?.pageInfo?.hasNextPage || false,
      hasPreviousPage: page > 1,
      cursor: response.data?.exploreList?.pageInfo?.endCursor
    }
  };
} 

//=== Fetches the top trending ===//
export async function fetchTrendingCoins(count: number = 20, page: number = 1) {
  try {
    const { limit } = calculatePaginationParams(count, page);
    
    const response = await getCoinsTopVolume24h({ count: limit });

    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!tokens?.length) {
      return {
        coins: [],
        pagination: {
          page,
          count: limit,
          total: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          cursor: undefined
        }
      };
    }

    const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
      const details = await fetchSingleCoin(coin.address);
      const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

      return {
        ...coin,
        details,
        isFromBaseApp,
      };
    }));
    
    return {
      coins: detailedCoins,
      pagination: {
        page,
        count: limit,
        total: tokens.length,
        hasNextPage: response.data?.exploreList?.pageInfo?.hasNextPage || false,
        hasPreviousPage: page > 1,
        cursor: response.data?.exploreList?.pageInfo?.endCursor
      }
    };

  } catch (error) {
    console.error("Error fetching trending coins:", error);
    throw new Error("Failed to fetch trending coins");
  }
}

//=== Fetches coins with the highest market cap ===//

export async function fetchMostValuableCoins(count: number = 100, page: number = 1) {
  try {
    const { limit } = calculatePaginationParams(count, page);
    
    const response = await getCoinsMostValuable({ count: limit });
    
    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!tokens?.length) {
      return {
        coins: [],
        pagination: {
          page,
          count: limit,
          total: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          cursor: undefined
        }
      };
    }

    const detailedCoins = await Promise.all(
      tokens.map(async (coin: any) => {
        const details = await fetchSingleCoin(coin.address);
        const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;
        const percentChange = coin.marketCapDelta24h
          ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
          : "N/A";

        return {
          ...coin,
          details,
          percentChange,
          isFromBaseApp,
        };
      })
    );

    return {
      coins: detailedCoins,
      pagination: {
        page,
        count: limit,
        total: tokens.length,
        hasNextPage: response.data?.exploreList?.pageInfo?.hasNextPage || false,
        hasPreviousPage: page > 1,
        cursor: response.data?.exploreList?.pageInfo?.endCursor
      }
    };

  } catch (error) {
    console.error("Error fetching top gainers:", error);
    throw new Error("Failed to fetch top gainers");
  }
}

export async function fetchSingleCoin(address: string) {
  const response = await getCoin({ address, chain: base.id });
  return response.data?.zora20Token;
}

export async function fetchTopGainers(count: number = 100, page: number = 1) {
  try {
    const { limit } = calculatePaginationParams(count, page);
    
    const response = await getCoinsTopGainers({ count: limit });
    
    const top20CoinGainers = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!top20CoinGainers?.length) {
      return {
        coins: [],
        pagination: {
          page,
          count: limit,
          total: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          cursor: undefined
        }
      };
    }

    console.log("Fetched top gainers coins unfiltered:", top20CoinGainers.length);

     const filteredCoinGainers = BASEAPP_REFERRER_ADDRESS
      ? top20CoinGainers.filter(
          (coin: any) =>
            coin.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS.toLowerCase()
        )
      : [];

      console.log("Fetched top gainers coins filtered from base app:", filteredCoinGainers.length);

    return {
      coins: filteredCoinGainers,
      pagination: {
        page,
        count: limit,
        total: filteredCoinGainers.length,
        hasNextPage: response.data?.exploreList?.pageInfo?.hasNextPage || false,
        hasPreviousPage: page > 1,
        cursor: response.data?.exploreList?.pageInfo?.endCursor
      }
    };

  } catch (error) {
    console.error("Error fetching top gainers coins:", error);
    throw error;
  }
}