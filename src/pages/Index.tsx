import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ConnectButton } from "@/components/ConnectButton";
import { HowToMint } from "@/components/HowToMint";
import { AboutSection } from "@/components/AboutSection";
import { UploadNFT } from "@/components/UploadNFT";
import { NFTDisplay } from "@/components/NFTDisplay";
import { Navigation } from "@/components/Navigation";
import { ethers } from "ethers";
import MinterCastABI from "../contracts/MinterCast.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const Index = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [account, setAccount] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const checkOwner = async () => {
      if (!account || !window.ethereum) return;
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MinterCastABI.abi, provider);
        const contractOwner = await contract.owner();
        setIsOwner(account.toLowerCase() === contractOwner.toLowerCase());
      } catch (error) {
        console.error("Error checking owner:", error);
        setIsOwner(false);
      }
    };
    
    checkOwner();
  }, [account]);

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center">
          <div className="container">
            <div className="text-center animate-fade-up">
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">MinterCast</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Exclusive NFT Collections for True Collectors
              </p>
              <div className="flex gap-4 justify-center">
                <ConnectButton onConnect={setAccount} />
                <Button
                  variant="secondary"
                  className="btn-secondary"
                  onClick={() => document.getElementById("mint")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Collections
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* How to Mint Section */}
        <HowToMint />

        {/* NFT Display Section */}
        <section id="mint" className="py-20">
          <div className="container">
            <h2 className="section-title text-center mb-12">Available NFTs</h2>
            <NFTDisplay account={account} />
          </div>
        </section>

        {/* Upload NFT Section (Owner Only) */}
        {isOwner && (
          <section id="upload" className="py-20 bg-muted">
            <div className="container">
              <h2 className="section-title text-center mb-12">Upload NFT</h2>
              <UploadNFT />
            </div>
          </section>
        )}
      </main>

      <footer className="bg-secondary py-8">
        <div className="container text-center text-gray-400">
          <p>&copy; 2024 MinterCast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;