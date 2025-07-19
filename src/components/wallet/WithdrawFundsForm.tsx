
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { withdrawFunds } from '@/services/walletService';
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Loader, XCircle } from 'lucide-react';
import axios from 'axios';

const WithdrawFundsForm: React.FC<{ currentBalance: number; userId: string }> = ({ currentBalance, userId }) => {
  const [loading, setLoading] = useState(false);

  const [method, setMethod] = useState("flutterwave");
    const [details, setDetails] = useState<any>({});
    const [loadingField, setLoadingField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<"success" | "fail" | null>(null);
    const [isBankValid, setIsBankValid] = useState(false);
  const [bankCheckLoading, setBankCheckLoading] = useState(false);
  const [accountName, setAccountName] = useState("")
  const [amount, setAmount]= useState("")
  const [bankCode, setBankCode]=useState("")
  const [accountNumber, setAccountNumber]=useState("")
  

  
const schema = z.object({
  amount: z.coerce.number().min(10, "Minimum withdrawal is $10"),
  withdrawalMethod: z.enum(["bank", "paypal", "payoneer", "crypto"]),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  paypalEmail: z.string().optional(),
  payoneerEmail: z.string().optional(),
  coin: z.string().optional(),
  wallet: z.string().optional(),
});

const form = useForm<z.infer<typeof schema>>({
  defaultValues: {
    amount: 0,
    withdrawalMethod: "bank",
    bankCode: "",
    accountNumber: "",
    paypalEmail: "",
    payoneerEmail: "",
    coin: "",
    wallet: "",
  },
  mode: "onBlur",
});
  const withdrawalMethod = form.watch("withdrawalMethod");
  

  
    const verifyBankDetails = async (bankCode: string, accountNumber: string) => {
    setAccountName("")
  if (bankCode.length < 3 || accountNumber.length < 10) return;

  try {
    setBankCheckLoading(true);
    const res = await axios.post("https://aitool.asoroautomotive.com/api/flutterwave/checkBankDet", {
      bank_code: bankCode,
      account_number: accountNumber,
    });

    console.log(res.data)

    if (res.data.status === "success") {
      setIsBankValid(true);
      setAccountName(res.data.account_name || "Unknown Account");
    } else {
      setIsBankValid(false);
    }
  } catch (error) {
    console.error("Verification failed:", error);
      // onComplete("fail", "Check internet connection or try again later");
    // setIsBankValid(false);
  } finally {
    setBankCheckLoading(false);
  }
};


  const handleWithdraw = async () => {
    const numericAmount = Number(amount);
 const details = {
    bankCode,
    accountNumber,
  };
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > currentBalance) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/flutterwave/withdraw/${userId}`,
        {
          method,
          details,
          amount: numericAmount,
        }
      );

      if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaypalWithdraw = async () => {
    const numericAmount = Number(amount);
 const details = {
    paypalEmail: form.getValues("paypalEmail"),
  };
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > currentBalance) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/paypal/${userId}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

     if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePayoneerWithdraw = async () => {
    const numericAmount = Number(amount);
 const details = {
    payoneerEmail: form.getValues("payoneerEmail"),
  };
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > currentBalance) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/payoneer/${userId}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

       if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCryptoWithdraw = async () => {
    const numericAmount = Number(amount);
const details = {
    coin: form.getValues("coin"),
    wallet: form.getValues("wallet"),
  };
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > currentBalance) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/crypto/${userId}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

    if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };

const onSubmit = async () => {
  const numericAmount = Number(amount);

  console.log(numericAmount)
  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    toast({
      title: "Please enter a valid amount.",
      variant: "destructive",
    });
    return;
  }

  if (numericAmount > currentBalance) {
    toast({
      title: "Insufficient wallet balance.",
      variant: "destructive",
    });
    return;
  }

  if (!method || !details) {
    toast({
      title: "Withdrawal method or details missing.",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsSubmitting(true);

  if (method === "flutterwave") {
    // You may want to call handleWithdraw() or similar here
    await handleWithdraw();
  } else if (method === "crypto") {
    await handleCryptoWithdraw();
  }else if (method === "payoneer") {
    await handlePayoneerWithdraw();
  }else if (method === "paypal") {
    await handlePaypalWithdraw();
  }
    if (result === "success") {
      toast({
        title: "Withdrawal request submitted successfully.",
        variant: "default",
      });
    } else {
      toast({
        title: "Failed to submit withdrawal request.",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "An error occurred. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  // const onSubmit = async (values: FormValues) => {
  //   if (values.amount > currentBalance) {
  //     form.setError('amount', {
  //       type: 'manual',
  //       message: 'Withdrawal amount exceeds your current balance'
  //     });
  //     return;
  //   }
    
  //   if (values.amount < 10) {
  //     form.setError('amount', {
  //       type: 'manual',
  //       message: 'Minimum withdrawal amount is $10'
  //     });
  //     return;
  //   }
    
  //   try {
  //     setLoading(true);
  //     const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
      
  //     // Store withdrawal method and account info in request description
  //     const withdrawalRequest = {
  //       userId: userDetails.id,
  //       amount: values.amount,
  //       method: values.withdrawalMethod,
  //       accountInfo: values.accountNumber
  //     };
      
  //     // We'll need to stringify the extra data since our API only expects userId and amount
  //     const response = await withdrawFunds({
  //       userId: userDetails.id,
  //       amount: values.amount
  //     });
      
  //     toast({
  //       title: "Withdrawal request submitted",
  //       description: `${values.amount} USD withdrawal is being processed to your ${values.withdrawalMethod} account.`,
  //     });
      
  //     form.reset({ 
  //       amount: 0, 
  //       accountNumber: '',
  //       withdrawalMethod: 'bank'
  //     });
      
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Failed to process withdrawal",
  //       description: error.message || "There was an error processing your request. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Withdraw money from your wallet to your preferred account.</CardDescription>
      </CardHeader>

      <CardContent>
        {result ? (
          <div className="text-center py-6 space-y-4">
            {result === "success" ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <p className="font-semibold text-lg">Withdrawal Submitted</p>
                <p className="text-muted-foreground">Funds will arrive within 1–3 days.</p>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-600 mx-auto" />
                <p className="font-semibold text-lg">Failed to Submit</p>
                <p className="text-muted-foreground">Please try again.</p>
              </>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
            {...field}
            type="number"
            min={10}
            max={currentBalance}
            className="pl-8"
            onChange={e => {
              field.onChange(e);
              setAmount(e.target.value); // <-- set state here
            }}
          />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">Available: ${currentBalance.toFixed(2)}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Withdrawal Method */}
              <FormField
                control={form.control}
                name="withdrawalMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Withdrawal Method</FormLabel>
                    <Select  onValueChange={value => {
    field.onChange(value);
    setMethod(value); // <-- Add this line to sync state!
  }}
  defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer (Nigerians Only)</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="payoneer">Payoneer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank-specific fields */}
              {withdrawalMethod === "bank" && (
                <>
                  <FormField
                    control={form.control}
                    name="bankCode"
                    render={({ field }) => (
                      <FormItem>
  <FormLabel>Select Bank</FormLabel>
  <Select
    onValueChange={(value) => {
      field.onChange(value); // update form state
      setBankCode(value);    // update local state if needed
      verifyBankDetails(value, accountNumber); // trigger verification
    }}
    defaultValue={field.value}
  >
    <FormControl>
      <SelectTrigger>
        <SelectValue placeholder="Choose a bank" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectItem value="044">Access Bank</SelectItem>
      <SelectItem value="050">Ecobank</SelectItem>
      <SelectItem value="070">Fidelity Bank</SelectItem>
      <SelectItem value="011">First Bank</SelectItem>
      <SelectItem value="214">FCMB</SelectItem>
      <SelectItem value="058">GTBank</SelectItem>
      <SelectItem value="232">Sterling Bank</SelectItem>
      <SelectItem value="057">Zenith Bank</SelectItem>
      <SelectItem value="033">UBA</SelectItem>
      <SelectItem value="035">Wema Bank</SelectItem>
      <SelectItem value="215">Unity Bank</SelectItem>
      <SelectItem value="221">Stanbic IBTC</SelectItem>
      <SelectItem value="082">Keystone Bank</SelectItem>
      <SelectItem value="030">Heritage Bank</SelectItem>
      <SelectItem value="032">Union Bank</SelectItem>
      <SelectItem value="090110">VFD Microfinance</SelectItem>
      <SelectItem value="999991">OPay</SelectItem>
    </SelectContent>
  </Select>
  <FormMessage />
</FormItem>

                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
  {...field}
  type="text"
  placeholder="Enter account number"
  onChange={e => {
    field.onChange(e);
    setAccountNumber(e.target.value); // <-- set state here
  }}
/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* PayPal */}
              {withdrawalMethod === "paypal" && (
                <FormField
                  control={form.control}
                  name="paypalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your PayPal email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Payoneer */}
              {withdrawalMethod === "payoneer" && (
                <FormField
                  control={form.control}
                  name="payoneerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payoneer Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your Payoneer email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Crypto */}
{withdrawalMethod === "crypto" && (
  <>
    <FormField
      control={form.control}
      name="coin"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Coin</FormLabel>
          <FormControl>
            <Input {...field} placeholder="e.g. USDT, BTC, ETH" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="wallet"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Wallet Address</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter your wallet address" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
)}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Withdraw Funds"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>Withdrawals are typically processed within 1–3 business days.</p>
        <p className="mt-1">Minimum withdrawal amount is $10.</p>
      </CardFooter>
    </Card>
  );
};

export default WithdrawFundsForm;
