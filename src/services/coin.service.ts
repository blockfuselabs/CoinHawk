import { getCoinsNew, getCoin, getCoinsTopGainers, ExploreResponse } from "@zoralabs/coins-sdk";
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

export async function fetchSingleCoin(address: string) {
  const response = await getCoin({ address, chain: base.id });
  return response.data?.zora20Token;
}

export async function fetchTopGainers(count: number = 20) {
  try {
    const response = await getCoinsTopGainers({ count });

    console.log("Fetched top gainers coins:", response.data?.exploreList?.edges?.length);

    const top20CoinGainers = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!top20CoinGainers?.length) return [];
    
    
    return top20CoinGainers;

  } catch (error) {
    console.error("Error fetching top gainers coins:", error);
    throw error;
  }
}