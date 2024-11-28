import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import MinterCastABI from "../contracts/MinterCast.json";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const UploadNFT = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const uploadToPinata = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Pinata');
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const formData = new FormData(e.currentTarget);
      const file = formData.get("image") as File;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const supply = formData.get("supply") as string;
      const duration = 2592000; // 30 days in seconds

      toast({
        title: "Processing",
        description: "Uploading image to IPFS...",
      });

      const imageUrl = await uploadToPinata(file);

      // Create metadata and upload to IPFS
      const metadata = {
        name,
        description,
        image: imageUrl,
      };

      const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: JSON.stringify(metadata),
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to upload metadata to Pinata');
      }

      const metadataResult = await metadataResponse.json();
      const uri = `ipfs://${metadataResult.IpfsHash}`; // Changed from tokenUri to uri

      toast({
        title: "Processing",
        description: "Please confirm the transaction in MetaMask...",
      });

      // Connect to contract and create NFT using ethers v6 syntax
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MinterCastABI.abi, signer);

      // Call listNFT function with uri instead of tokenUri
      const tx = await contract.listNFT(
        name,
        uri, // Changed from tokenUri to uri to match smart contract
        supply,
        duration
      );

      toast({
        title: "Processing",
        description: "Waiting for transaction confirmation...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: "NFT uploaded successfully!",
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload NFT",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div>
        <Label htmlFor="name">NFT Name</Label>
        <Input id="name" name="name" required className="bg-secondary" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          required
          className="bg-secondary"
        />
      </div>

      <div>
        <Label htmlFor="supply">Supply</Label>
        <Input
          id="supply"
          name="supply"
          type="number"
          min="1"
          required
          className="bg-secondary"
        />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          className="bg-secondary"
        />
      </div>

      <Button
        type="submit"
        disabled={uploading}
        className="w-full btn-primary"
      >
        {uploading ? "Uploading..." : "Upload NFT"}
      </Button>
    </form>
  );
};