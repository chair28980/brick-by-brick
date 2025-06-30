"use client";

import Link from "next/link";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <header className="bg-base-100 border-b border-base-300 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-base-content hover:text-primary transition-colors">
          Brick by Brick
        </Link>

        <div className="flex items-center gap-4">
          <SwitchTheme />
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </header>
  );
};
