
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const CorporateSignup = () => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [taxId, setTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signupCorporate } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword || !companyName || !businessType) {
      setError("Please fill in all required fields");
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting corporate signup with:", { name, email, companyName });
      const success = await signupCorporate(name, email, password, phone, companyName, businessType, taxId);
      
      console.log("Corporate signup result:", success);
      
      if (success) {
        toast({
          title: "Success",
          description: "Corporate account created successfully! You are now logged in.",
        });
        navigate("/");
      } else {
        setError("Failed to create account. This email may already be registered.");
        toast({
          title: "Error",
          description: "Failed to create corporate account. This email may already be registered.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Connection error. Please try again later.");
      toast({
        title: "Connection Error",
        description: "Could not reach the server. Please check if the server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-secondary">
      <Card className="w-full max-w-2xl animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">Create a Corporate Account</CardTitle>
          <CardDescription className="text-center">
            Enter your business details to create a corporate account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Person Name*</Label>
                <Input
                  id="name"
                  placeholder="John Kamau"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name*</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Galleries Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Business Phone*</Label>
                <Input
                  id="phone"
                  placeholder="+254 712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type*</Label>
                <Input
                  id="businessType"
                  placeholder="Gallery, Museum, Corporate, etc."
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                <Input
                  id="taxId"
                  placeholder="Optional"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm py-2">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold-dark text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Creating account...
                </>
              ) : (
                "Create Corporate Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-center text-sm w-full">
            Not a business?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Create personal account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CorporateSignup;
