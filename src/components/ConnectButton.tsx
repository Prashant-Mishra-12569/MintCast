import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ConnectButtonProps {
  onConnect: (account: string) => void;
}

export const ConnectButton = ({ onConnect }: ConnectButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setConnectedAccount(accounts[0]);
            onConnect(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [onConnect]);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setConnectedAccount("");
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
        variant: "destructive",
      });
    } else {
      setConnectedAccount(accounts[0]);
      onConnect(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAccount(accounts[0]);
      onConnect(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="btn-primary"
    >
      {isConnecting 
        ? "Connecting..." 
        : connectedAccount 
          ? `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}` 
          : "Connect Wallet"
      }
    </Button>
  );
};