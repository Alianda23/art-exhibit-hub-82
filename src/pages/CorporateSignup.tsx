
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const CorporateSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { corporateSignup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword || 
        !companyName || !billingAddress || !contactPerson) {
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
      const success = await corporateSignup(
        name, 
        email, 
        password, 
        phone,
        companyName,
        registrationNumber,
        taxId,
        billingAddress,
        contactPerson,
        contactPosition
      );
      
      console.log("Corporate signup result:", success);
      
      if (success) {
        toast({
          title: "Success",
          description: "Corporate account created successfully! You are now logged in.",
        });
        navigate("/corporate");
      } else {
        setError("Failed to create account. This email may already be registered.");
        toast({
          title: "Error",
          description: "Failed to create account. This email may already be registered.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Corporate signup error:", error);
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
      <Card className="w-full max-w-4xl animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">Create Corporate Account</CardTitle>
          <CardDescription className="text-center">
            Register your company for bulk purchases, invoices, and special offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Manager Name*</Label>
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
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
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
                <Label htmlFor="companyName">Company Name*</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="REG12345"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">TAX ID / VAT Number</Label>
                <Input
                  id="taxId"
                  placeholder="TAX12345"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="billingAddress">Billing Address*</Label>
                <Textarea
                  id="billingAddress"
                  placeholder="123 Business Street, Nairobi, Kenya"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  disabled={loading}
                  required
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person*</Label>
                <Input
                  id="contactPerson"
                  placeholder="Jane Doe"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPosition">Position</Label>
                <Input
                  id="contactPosition"
                  placeholder="Procurement Manager"
                  value={contactPosition}
                  onChange={(e) => setContactPosition(e.target.value)}
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
                  Creating corporate account...
                </>
              ) : (
                "Create Corporate Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            <div className="mb-2">
              Already have a corporate account?{" "}
              <Link to="/corporate-login" className="text-gold hover:underline">
                Sign in
              </Link>
            </div>
            <div>
              Need a personal account?{" "}
              <Link to="/signup" className="text-gold hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CorporateSignup;
