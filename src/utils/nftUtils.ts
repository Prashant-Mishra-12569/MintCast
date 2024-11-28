import { ethers } from "ethers";
import MinterCastABI from "../contracts/MinterCast.json";

export interface NFTData {
  id: number;
  name: string;
  supply: number;
  minted: number;
  mintEndTime: number;
  active: boolean;
  tokenURI: string;  // We keep this name in the interface for consistency with frontend
  image: string;
  description: string;
}

const DEFAULT_NFT_DATA = {
  image: "/placeholder.svg",
  description: "This NFT is available to mint",
  name: "Available NFT"
};

export const fetchNFTInfo = async (
  contract: ethers.Contract,
  tokenId: number
): Promise<NFTData | null> => {
  try {
    // Note: getNFTInfo now returns uri as the last parameter
    const [name, supply, minted, mintEndTime, active, uri] = await contract.getNFTInfo(tokenId);
    
    return {
      id: Number(tokenId),
      name: name || DEFAULT_NFT_DATA.name,
      supply: Number(supply),
      minted: Number(minted),
      mintEndTime: Number(mintEndTime),
      active,
      tokenURI: uri, // Map uri to tokenURI for frontend consistency
      image: DEFAULT_NFT_DATA.image,
      description: DEFAULT_NFT_DATA.description
    };
  } catch (error) {
    console.error(`Error fetching NFT ${tokenId} info:`, error);
    return null;
  }
};

export const fetchAllNFTs = async (
  provider: ethers.Provider,
  contractAddress: string
): Promise<NFTData[]> => {
  try {
    const contract = new ethers.Contract(contractAddress, MinterCastABI.abi, provider);
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlock - 10000);

    const filter = contract.filters.NFTListed();
    const events = await contract.queryFilter(filter, fromBlock);
    
    const nftPromises = events.map(async (event) => {
      const eventLog = event as ethers.EventLog;
      if (!eventLog.args) return null;
      return fetchNFTInfo(contract, eventLog.args[0]);
    });

    const nftList = (await Promise.all(nftPromises)).filter((nft): nft is NFTData => nft !== null);
    console.log("Fetched NFTs:", nftList);
    return nftList;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};