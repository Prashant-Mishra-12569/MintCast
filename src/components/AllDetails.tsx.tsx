import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AllDetailsProps {
  id: number;
  name: string;
  description: string;
  image: string;
  supply: number;
  minted: number;
  mintEndTime: number;
  active: boolean;
  onMint: (id: number) => void;
  disabled: boolean;
}

export const AllDetails = ({
  id,
  name,
  description,
  supply,
  minted,
  mintEndTime,
  active,
  onMint,
  disabled
}: AllDetailsProps) => {
  const getMintStatus = () => {
    if (!active) return "Inactive";
    if (minted >= supply) return "Sold Out";
    if (new Date(mintEndTime * 1000) <= new Date()) return "Ended";
    return "Active";
  };

  return (
    <div className="bg-[#1a1b1f] rounded-b-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <Badge 
          variant="outline"
          className={active ? "bg-[#00ff9d] text-black border-0" : "bg-gray-600"}
        >
          {getMintStatus()}
        </Badge>
      </div>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {description || "Loading..."}
      </p>
      <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
        <span>Minted: {minted}/{supply}</span>
        <span>{new Date(mintEndTime * 1000).toLocaleDateString()}</span>
      </div>
      <Button
        onClick={() => onMint(id)}
        disabled={disabled}
        className={`w-full ${
          disabled 
            ? "bg-gray-700 text-gray-300" 
            : "bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black"
        }`}
      >
        {disabled ? getMintStatus() : "Mint Now"}
      </Button>
    </div>
  );
};