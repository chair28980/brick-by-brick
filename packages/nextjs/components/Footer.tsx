import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <footer className="bg-gray-100 border-t p-4 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex gap-2">
          {isLocalNetwork && (
            <>
              <Faucet />
              <Link href="/blockexplorer" className="text-blue-500 hover:underline">
                Block Explorer
              </Link>
            </>
          )}
        </div>
        <SwitchTheme />
      </div>
    </footer>
  );
};
