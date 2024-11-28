const IPFS_GATEWAYS = [
    "https://ipfs.io/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
  ];
  
  export const processIPFSUrl = async (url: string): Promise<string> => {
    if (!url) return "/placeholder.svg";
    
    // Handle IPFS URLs
    if (url.startsWith("ipfs://")) {
      const hash = url.replace("ipfs://", "");
      
      // Try different IPFS gateways
      for (const gateway of IPFS_GATEWAYS) {
        try {
          const response = await fetch(gateway + hash);
          if (response.ok) {
            return gateway + hash;
          }
        } catch (error) {
          console.error(`Failed to fetch from gateway ${gateway}:`, error);
          continue;
        }
      }
      return "/placeholder.svg";
    }
    
    // Handle HTTP URLs
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    
    return url;
  };
  
  export const fetchMetadata = async (uri: string) => {
    if (!uri) {
      return {
        image: "/placeholder.svg",
        description: "No description available",
        name: "Unnamed NFT"
      };
    }
  
    try {
      const cleanUri = await processIPFSUrl(uri);
      const response = await fetch(cleanUri);
      if (!response.ok) throw new Error("Failed to fetch metadata");
      
      const metadata = await response.json();
      
      return {
        image: await processIPFSUrl(metadata.image || ""),
        description: metadata.description || "No description available",
        name: metadata.name || "Unnamed NFT"
      };
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return {
        image: "/placeholder.svg",
        description: "No description available",
        name: "Unnamed NFT"
      };
    }
  };