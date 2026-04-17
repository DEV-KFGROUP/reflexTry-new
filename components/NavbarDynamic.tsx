"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(
  () => import("@/components/Navbar").then((m) => m.Navbar),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-border bg-background/95 backdrop-blur-md"
        aria-hidden
      />
    ),
  },
);

export function NavbarDynamic() {
  return <Navbar />;
}
