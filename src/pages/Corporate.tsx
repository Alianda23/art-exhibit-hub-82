
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Users, ShoppingCart, CalendarDays, FileText, CreditCard } from "lucide-react";

const CorporateDashboard = () => {
  const { isAuthenticated, isCorporate, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated or not a corporate user
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/corporate-login");
      return;
    }

    if (!isCorporate) {
      toast({
        title: "Access Denied",
        description: "You need a corporate account to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, isCorporate, navigate, toast]);

  if (!isAuthenticated || !isCorporate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-serif text-primary">Corporate Dashboard</h1>
          <span className="text-sm text-muted-foreground">Welcome, {currentUser?.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-medium">2</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-medium">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <CalendarDays className="h-5 w-5" />
                <span>Exhibition Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Upcoming</p>
                  <p className="text-2xl font-medium">1</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Attended</p>
                  <p className="text-2xl font-medium">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Invoices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Unpaid</p>
                  <p className="text-2xl font-medium">1</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Paid</p>
                  <p className="text-2xl font-medium">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Exhibition Bookings</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View all your company's art purchase orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Order ID</th>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Items</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">ORD-2025-001</td>
                        <td className="py-3">May 15, 2025</td>
                        <td className="py-3">3</td>
                        <td className="py-3">KSh 125,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span></td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">ORD-2025-002</td>
                        <td className="py-3">May 10, 2025</td>
                        <td className="py-3">1</td>
                        <td className="py-3">KSh 45,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span></td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3">ORD-2025-003</td>
                        <td className="py-3">May 5, 2025</td>
                        <td className="py-3">2</td>
                        <td className="py-3">KSh 78,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Exhibition Bookings</CardTitle>
                <CardDescription>
                  Manage your team's exhibition attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Exhibition</th>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Slots</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">Modern Art Showcase</td>
                        <td className="py-3">Jun 10, 2025</td>
                        <td className="py-3">5</td>
                        <td className="py-3">KSh 25,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Upcoming</span></td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">African Heritage Exhibition</td>
                        <td className="py-3">May 5, 2025</td>
                        <td className="py-3">3</td>
                        <td className="py-3">KSh 15,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Attended</span></td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3">Contemporary Art Forum</td>
                        <td className="py-3">Apr 20, 2025</td>
                        <td className="py-3">4</td>
                        <td className="py-3">KSh 20,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Attended</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  View and manage all invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Invoice #</th>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Description</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">INV-2025-001</td>
                        <td className="py-3">May 15, 2025</td>
                        <td className="py-3">Artwork Purchase</td>
                        <td className="py-3">KSh 125,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Unpaid</span></td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3">INV-2025-002</td>
                        <td className="py-3">May 10, 2025</td>
                        <td className="py-3">Exhibition Booking</td>
                        <td className="py-3">KSh 25,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3">INV-2025-003</td>
                        <td className="py-3">May 5, 2025</td>
                        <td className="py-3">Artwork Purchase</td>
                        <td className="py-3">KSh 78,000</td>
                        <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your corporate account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Corporate Details
                      </h3>
                      <div className="rounded-md border p-4 mt-2">
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-muted-foreground">Company Name</dt>
                            <dd>{currentUser?.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Number</dt>
                            <dd>REG-123456</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Tax ID</dt>
                            <dd>TAX-789012</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" /> Contact Information
                      </h3>
                      <div className="rounded-md border p-4 mt-2">
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-muted-foreground">Primary Contact</dt>
                            <dd>John Doe</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Position</dt>
                            <dd>Procurement Manager</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd>john.doe@company.com</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Phone</dt>
                            <dd>+254 712 345 678</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Billing Information
                      </h3>
                      <div className="rounded-md border p-4 mt-2">
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-muted-foreground">Billing Address</dt>
                            <dd className="whitespace-pre-line">123 Business Park,
Westlands, Nairobi,
Kenya</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Payment Terms</dt>
                            <dd>Net 30</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Credit Limit</dt>
                            <dd>KSh 500,000</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">Benefits</h3>
                      <div className="rounded-md border p-4 mt-2">
                        <ul className="space-y-1">
                          <li className="text-sm flex items-center">
                            <span className="mr-2 flex-shrink-0 rounded-full bg-green-100 p-1">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            Invoice payment option (30 days)
                          </li>
                          <li className="text-sm flex items-center">
                            <span className="mr-2 flex-shrink-0 rounded-full bg-green-100 p-1">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            10% discount on bulk purchases
                          </li>
                          <li className="text-sm flex items-center">
                            <span className="mr-2 flex-shrink-0 rounded-full bg-green-100 p-1">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            Free exhibition previews
                          </li>
                          <li className="text-sm flex items-center">
                            <span className="mr-2 flex-shrink-0 rounded-full bg-green-100 p-1">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            Priority artwork reservations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CorporateDashboard;
