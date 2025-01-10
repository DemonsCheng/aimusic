import "@/app/globals.css";

import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | ${"metadata.title"}`,
      default: "metadata.title",
    },
    description: "metadata.description",
    keywords: "metadata.keywords",
  };
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <Headers /> */}
        <div>
          <a className="text-base-content cursor-pointer" href="/">
            <MdOutlineHome className="text-2xl mx-8 my-8" />
            {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
          </a>
          <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
