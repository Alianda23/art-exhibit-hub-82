
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Building, User, FileText, Package, Loader2 } from "lucide-react";

const CorporateProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Redirect if not logged in or not a corporate user
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (!currentUser.isCorporate) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!currentUser || !currentUser.isCorporate) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Building className="mr-2" /> Corporate Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <Label className="text-sm text-muted-foreground">Company Name</Label>
                  <p className="font-medium">{currentUser.companyName}</p>
                </div>
                <div className="border-b pb-4">
                  <Label className="text-sm text-muted-foreground">Contact Person</Label>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
                <div className="border-b pb-4">
                  <Label className="text-sm text-muted-foreground">Business Type</Label>
                  <p className="font-medium">{currentUser.businessType}</p>
                </div>
                {currentUser.taxId && (
                  <div className="border-b pb-4">
                    <Label className="text-sm text-muted-foreground">Tax ID/VAT</Label>
                    <p className="font-medium">{currentUser.taxId}</p>
                  </div>
                )}
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="bulk-orders">
              <TabsList className="w-full">
                <TabsTrigger value="bulk-orders" className="flex-1">
                  <Package className="mr-2 h-4 w-4" /> Bulk Orders
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" /> Invoices
                </TabsTrigger>
                <TabsTrigger value="account" className="flex-1">
                  <User className="mr-2 h-4 w-4" /> Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bulk-orders" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Order Requests</CardTitle>
                    <CardDescription>
                      Submit requests for bulk artwork orders with custom pricing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="artworkType">Type of Artworks</Label>
                        <Input
                          id="artworkType"
                          placeholder="E.g., Paintings, Sculptures, Mixed Media"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Approximate Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range (USD)</Label>
                        <Input
                          id="budget"
                          placeholder="E.g., 5000-10000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Special Requirements</Label>
                        <textarea
                          id="notes"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any specific requirements for your order"
                        />
                      </div>
                      <Button disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Processing...
                          </>
                        ) : (
                          "Submit Bulk Order Request"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>
                      View and download your invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      No invoices available yet.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your business information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person Name</Label>
                        <Input
                          id="contactName"
                          defaultValue={currentUser.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          defaultValue={currentUser.companyName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={currentUser.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          defaultValue={currentUser.businessType}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                        <Input
                          id="taxId"
                          defaultValue={currentUser.taxId}
                        />
                      </div>
                    </div>
                    <Button className="mt-6 w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateProfile;
