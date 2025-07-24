import { getCoinsNew,getCoinsTopVolume24h, getCoin, getCoinsTopGainers } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

const BASEAPP_REFERRER_ADDRESS = process.env.BASEAPP_REFERRER_ADDRESS?.toLowerCase();


export async function fetchNewCoins(count: number = 10) {
  const response = await getCoinsNew({ count });

  console.log("Fetched new coins:", response.data?.exploreList?.edges?.length);

  const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
  if (!tokens?.length) return [];

  const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
    const details = await fetchSingleCoin(coin.address);

    const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

    return {
      ...coin,
      details,
      isFromBaseApp,
    };

  }));

  return detailedCoins;
} 

//=== Fetches the top trending ===//
export async function fetchTrendingCoins(count: number = 20) {
  try {
    const response = await getCoinsTopVolume24h({ count });

    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!tokens?.length) return [];

    const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
      const details = await fetchSingleCoin(coin.address);
      const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

      return {
        ...coin,
        details,
        isFromBaseApp,
      };
    }));
    return detailedCoins;

  } catch (error) {
    console.error("Error fetching trending coins:", error);
    throw new Error("Failed to fetch trending coins");
  }
}

export async function fetchSingleCoin(address: string) {
  const response = await getCoin({ address, chain: base.id });
  return response.data?.zora20Token;
}

export async function fetchTopGainers(count: number = 100) {
  try {
    const response = await getCoinsTopGainers({ count });


    const top20CoinGainers = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!top20CoinGainers?.length) return [];
    console.log("Fetched top gainers coins unfiltered:", top20CoinGainers.length);

     const filteredCoinGainers = BASEAPP_REFERRER_ADDRESS
      ? top20CoinGainers.filter(
          (coin: any) =>
            coin.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS.toLowerCase()
        )
      : [];

      console.log("Fetched top gainers coins filtered from base app:", filteredCoinGainers.length);

    return filteredCoinGainers;


  } catch (error) {
    console.error("Error fetching top gainers coins:", error);
    throw error;
  }
}