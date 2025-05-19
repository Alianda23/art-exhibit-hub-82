
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, ShoppingCart, CalendarDays, FileText, CreditCard, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CorporateLayoutProps {
  children: React.ReactNode;
}

const CorporateLayout = ({ children }: CorporateLayoutProps) => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/corporate",
      icon: Building2,
      current: location.pathname === "/corporate",
    },
    {
      name: "Orders",
      href: "/corporate/orders",
      icon: ShoppingCart,
      current: location.pathname === "/corporate/orders",
    },
    {
      name: "Exhibitions",
      href: "/corporate/exhibitions",
      icon: CalendarDays,
      current: location.pathname === "/corporate/exhibitions",
    },
    {
      name: "Invoices",
      href: "/corporate/invoices",
      icon: FileText,
      current: location.pathname === "/corporate/invoices",
    },
    {
      name: "Billing",
      href: "/corporate/billing",
      icon: CreditCard,
      current: location.pathname === "/corporate/billing",
    },
    {
      name: "Settings",
      href: "/corporate/settings",
      icon: Settings,
      current: location.pathname === "/corporate/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow border-r bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-serif font-medium">Corporate Portal</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? "bg-gold text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? "text-white" : "text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                Log Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden border-b bg-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-serif font-medium">Corporate Portal</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navigation.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link to={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CorporateLayout;
