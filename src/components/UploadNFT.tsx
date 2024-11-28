import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const UploadNFT = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // TODO: Implement IPFS upload and contract interaction
      toast({
        title: "Success",
        description: "NFT uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload NFT",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div>
        <Label htmlFor="name">NFT Name</Label>
        <Input id="name" required className="bg-secondary" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" required className="bg-secondary" />
      </div>

      <div>
        <Label htmlFor="supply">Supply</Label>
        <Input
          id="supply"
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