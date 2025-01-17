"use client";

import { siteConfig } from "@/data/config/site.settings";
import { headerNavLinks } from "@/data/config/headerNavLinks";
import Link from "./Link";
import MobileNav from "./MobileNav";
import ThemeSwitch from "./ThemeSwitch";
// import SearchButton from "../search/SearchButton";
import ActiveLink from "@/components/shared/ActiveLink";
import Image from "next/image";
import { LoginDialog } from "@/components/auth/login-dialog";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

import { Button } from "./ui/button";
import { signOut } from "@/lib/auth/authConfig";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="flex items-center justify-between py-2 flex-wrap w-full max-w-7xl mx-auto mb-1 lg:mb-1 pt-2 px-4">
        <div>
          <Link href="/" aria-label={siteConfig.logoTitle}>
            <div className="flex items-center gap-3 justify-between">
              <Image
                src="/logo.webp"
                alt="AI Song generator logo"
                height={50}
                width={50}
                className="group-hover:animate-wiggle relative top-0.5"
              />
              <div className="hidden text-xl font-semibold md:flex h-full">
                AI Song generator
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center leading-5 gap-4 md:gap-6">
          {headerNavLinks.map((link) => (
            <ActiveLink
              key={link.title}
              href={link.href}
              className="nav-link hidden md:block"
              activeClassName="nav-link-active"
            >
              <span>{link.title}</span>
            </ActiveLink>
          ))}
          <a
            key="download"
            href="/ai-song-generator"
            target="_self"
            className="nav-link hidden md:block"
          >
            <span className="bg-clip-text bg-gradient-to-r text-transparent from-fuchsia-500 to-cyan-600 dark:from-fuchsia-500 dark:to-cyan-500">
              AI Song Generator
            </span>
          </a>
          {/* <SearchButton /> */}
          <ThemeSwitch />
          <MobileNav />

          <Button
            variant="primary"
            className="text-base hover:text-primary"
            onClick={() => setShowLoginDialog(true)}
          >
            Login
          </Button>
        </div>
      </div>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
};

export default Header;
