import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { authService } from "@/services/authService";
import { live } from "@/lib/live";

// Header button showing the buyer's wallet balance (kept fresh in the background); click opens the wallet.
const WalletButton: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const user = await authService.verifyUser();
        if (user && user.wallet_balance !== undefined && user.wallet_balance !== null) {
          setBalance(Number(user.wallet_balance));
        }
      } catch {
        // not logged in or offline: keep the last value / "My Wallet"
      }
    };
    fetchBalance();
    return live(fetchBalance, 15000);
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
      onClick={() => navigate("/wallet")}
      aria-label={balance !== null ? `Wallet balance ${balance.toFixed(2)} US dollars` : "My wallet"}
    >
      <Wallet className="h-4 w-4 mr-1" />
      <span>
        {balance !== null
          ? balance.toLocaleString("en-US", { style: "currency", currency: "USD" })
          : "My Wallet"}
      </span>
    </Button>
  );
};

export default WalletButton;
