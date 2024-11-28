import { Wallet, MousePointerClick, CheckCircle2, Package } from "lucide-react";

export const HowToMint = () => {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Connect your MetaMask wallet to get started",
      icon: Wallet,
      color: "text-blue-500",
    },
    {
      number: 2,
      title: "Select Your Quantity",
      description: "Choose how many NFTs you want to mint",
      icon: MousePointerClick,
      color: "text-purple-500",
    },
    {
      number: 3,
      title: "Confirm Transaction",
      description: "Approve the transaction in your wallet",
      icon: CheckCircle2,
      color: "text-yellow-500",
    },
    {
      number: 4,
      title: "Receive Your NFTs",
      description: "Your NFTs will appear in your wallet",
      icon: Package,
      color: "text-green-500",
    },
  ];

  return (
    <section id="how-to-mint" className="py-20 bg-muted">
      <div className="container">
        <h2 className="section-title text-center mb-16">How To Mint</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg animate-fade-up"
              style={{ animationDelay: `${step.number * 100}ms` }}
            >
              <div className={`mb-4 ${step.color}`}>
                <step.icon size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};