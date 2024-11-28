import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface NFTDisplayProps {
  account: string;
}

export const NFTDisplay = ({ account }: NFTDisplayProps) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Fetch NFTs from contract
    setLoading(false);
  }, []);

  const handleMint = async (nftId: string) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement minting logic
      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading NFTs...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Placeholder NFT Card */}
      <Card className="bg-muted p-4">
        <div className="aspect-square rounded-lg bg-secondary mb-4"></div>
        <h3 className="text-xl font-bold mb-2">Sample NFT</h3>
        <p className="text-gray-400 mb-4">Available for minting</p>
        <Button
          onClick={() => handleMint("1")}
          disabled={!account}
          className="w-full btn-primary"
        >
          Mint Now
        </Button>
      </Card>
    </div>
  );
};