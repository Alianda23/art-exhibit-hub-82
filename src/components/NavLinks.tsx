
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NavLinks = () => {
  const { isAuthenticated, isAdmin, isCorporate, logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {currentUser?.name || "Account"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAdmin ? (
              <DropdownMenuItem asChild>
                <Link to="/admin">Admin Dashboard</Link>
              </DropdownMenuItem>
            ) : isCorporate ? (
              <DropdownMenuItem asChild>
                <Link to="/corporate">Corporate Dashboard</Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sign In</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/login" className="w-full">Personal Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/corporate-login" className="w-full">Corporate Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/artist-login" className="w-full">Artist Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin-login" className="w-full">Admin Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Register</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/signup" className="w-full">Personal Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/corporate-signup" className="w-full">Corporate Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/artist-signup" className="w-full">Artist Account</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default NavLinks;
