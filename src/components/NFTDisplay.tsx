import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import MinterCastABI from "../contracts/MinterCast.json";
import { AllDetails } from "./AllDetails.tsx";
import { InfoNft } from "./InfoNft";
import { fetchAllNFTs, type NFTData } from "@/utils/nftUtils";

interface NFTDisplayProps {
  account: string;
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const NFTDisplay = ({ account }: NFTDisplayProps) => {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleMetadataLoad = useCallback((index: number, metadata: { image: string; description: string; name: string }) => {
    setNfts(prev => {
      const newNfts = [...prev];
      if (newNfts[index]) {
        newNfts[index] = { ...newNfts[index], ...metadata };
      }
      return newNfts;
    });
  }, []);

  const handleMint = async (nftId: number) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MinterCastABI.abi, signer);

      toast({
        title: "Processing",
        description: "Please confirm the transaction in MetaMask...",
      });

      const tx = await contract.mint(nftId);
      
      toast({
        title: "Processing",
        description: "Minting in progress...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });

      // Refresh NFT data
      const updatedNfts = await fetchAllNFTs(provider, CONTRACT_ADDRESS);
      setNfts(updatedNfts);

    } catch (error) {
      console.error("Mint error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mint NFT",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadNFTs = async () => {
      if (!window.ethereum) {
        toast({
          title: "Error",
          description: "Please install MetaMask to view NFTs",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftList = await fetchAllNFTs(provider, CONTRACT_ADDRESS);
        setNfts(nftList);
      } catch (error) {
        console.error("Error loading NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load NFTs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [toast]); // Only depend on toast

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-muted-foreground">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-muted-foreground">No NFTs available to mint</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
      {nfts.map((nft, index) => (
        <div key={nft.id} className="bg-card rounded-xl overflow-hidden">
          <InfoNft 
            tokenURI={nft.tokenURI} 
            onMetadataLoad={(metadata) => handleMetadataLoad(index, metadata)} 
          />
          <AllDetails
            {...nft}
            onMint={handleMint}
            disabled={
              !account ||
              !nft.active ||
              nft.minted >= nft.supply ||
              new Date(nft.mintEndTime * 1000) <= new Date()
            }
          />
        </div>
      ))}
    </div>
  );
};