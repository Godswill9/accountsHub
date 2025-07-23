import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Globe, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import countries from '@/components/auth/phone-code-en.json'; // adjust path if needed

interface AuthResponse {
  id: string;
  email: string;
  name?: string;
  messsage:string; // Add other fields if needed
}

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [code, setVerificationCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, verifyCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
const [dialCode, setDialCode] = useState("");
const [emoji, setEmoji]=useState("")



  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async (): Promise<any> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.verifyUser();
      if (response.email) {
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.error("Auth status check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
  const selected = countries.find(c => c.name === e.target.value);
  setCountry(selected.name);
  setDialCode(selected.phoneCode);
  setEmoji(selected.flagEmoji)
};

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!verificationStep) {
      // Step 1: Register user
      if (!name || !email || !password || !confirmPassword || !country || !phoneNumber) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

         // ✅ Check for at least two words in the name
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
      toast({
        title: "Invalid Name",
        description: "Please enter at least a first and last name.",
        variant: "destructive",
      });
      return;
    }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

 try {
  const fullPhoneNumber = `${dialCode} ${phoneNumber}`;
  const data = await signup(name, email, password, "code", country, fullPhoneNumber); 
  if (data.message === "User already exists but not verified. Verify your email") {
    toast({
      title: "Notice",
      description: "User already exists but not verified. Check your email for the code.",
      variant: "success",
    });
    setVerificationStep(true);
    return;
  }

  if (data.message === "User registered and email sent") {
    toast({
      title: "Success",
      description: "Signup successful. Check your email for the code."
    });
    setVerificationStep(true);
    return;
  }

  // Catch-all fallback for unexpected messages
  toast({
    title: "Error",
    description: data.message || "Signup failed unexpectedly",
    variant: "destructive",
  });
} catch (error) {
  toast({
    title: "Error",
    description: error.message || "Signup failed",
    variant: "destructive",
  });
  console.error("Signup error:", error);
}

    } else {
      // Step 2: Verify email with code
      if (!code) {
        toast({
          title: "Error",
          description: "Please enter the verification code",
          variant: "destructive",
        });
        return;
      }
try {
  await verifyCode(email, code).then((res)=>{
    if(res.status === "disallowed"){
       toast({
    title: "Error",
    description: res.message,
     variant: "destructive",
  })}
  else{
     toast({
    title: "Success",
    description: "Your account has been verified.",
  });
  
  setTimeout(() => navigate("/"), 1000);
  }
  })
} catch (error) {
  toast({
    title: "Error",
    description: error.message || "Verification failed",
    variant: "destructive",
  });
  console.error("Verification error:", error);
}

    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {!verificationStep ? (
        // Step 1: Registration form
        <>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

      <div className="space-y-2">
  {/* Email input */}
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Mail className="h-4 w-4 text-gray-500" />
    </div>
    <Input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="pl-10"
      required
    />
  </div>

{/* Country Dropdown */}
<div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Globe className="h-4 w-4 text-gray-500" />
  </div>
  <select
    id="country"
    value={country}
    onChange={handleCountryChange}
    className="pl-10 pr-4 py-2 border rounded w-full"
    required
  >
    <option value="">Select Country</option>
    {countries.map((c) => (
      <option key={c.code} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>
</div>

{/* Phone Number Input */}
<div className="relative mt-4">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
    <Phone className="h-4 w-4 text-gray-500" />
  </div>
  <div className="absolute inset-y-0 text-[13px] left-8 flex items-center text-gray-700">
    {dialCode}
  </div>
  <Input
    id="phoneNumber"
    type="number"
    placeholder="Phone Number"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    className="pl-20 no-spinner"
    required
  />
</div>

</div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </label>
          </div>
        </>
      ) : (
        // Step 2: Verification code
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification code to your email. Please enter it below
            to verify your account.
          </p>
          <Input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full"
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Processing..."
          : verificationStep
          ? "Verify Account"
          : "Sign up"}
      </Button>

      {!verificationStep && (
        <>
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Facebook
            </Button>
          </div> */}
        </>
      )}
    </form>
  );
};

export default SignupForm;
