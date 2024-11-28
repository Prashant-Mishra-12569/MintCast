import { useState, useEffect } from "react";
import { processIPFSUrl } from "@/utils/ipfsUtils";

interface InfoNftProps {
  tokenURI: string;
  onMetadataLoad: (metadata: { image: string; description: string; name: string }) => void;
}

export const InfoNft = ({ tokenURI, onMetadataLoad }: InfoNftProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoading(true);
      
      if (!tokenURI) {
        const defaultData = {
          image: "/placeholder.svg",
          description: "This NFT is available to mint",
          name: "Available NFT"
        };
        setImageUrl(defaultData.image);
        onMetadataLoad(defaultData);
        setIsLoading(false);
        return;
      }

      try {
        const ipfsHash = tokenURI.replace('ipfs://', '');
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        const response = await fetch(gatewayUrl);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        
        const metadata = await response.json();
        const imageGatewayUrl = await processIPFSUrl(metadata.image || '');
        
        setImageUrl(imageGatewayUrl);
        onMetadataLoad({
          image: imageGatewayUrl,
          description: metadata.description || '',
          name: metadata.name || ''
        });
      } catch (error) {
        console.error("Error loading metadata:", error);
        setImageUrl("/placeholder.svg");
        onMetadataLoad({
          image: "/placeholder.svg",
          description: "Error loading NFT metadata",
          name: "Loading Error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [tokenURI]); // Only depend on tokenURI changes

  return (
    <div className="aspect-square relative bg-gray-900 rounded-t-xl overflow-hidden">
      {isLoading ? (
        <div className="animate-pulse bg-gray-700 h-full w-full" />
      ) : (
        <img
          src={imageUrl}
          alt="NFT"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      )}
    </div>
  );
};