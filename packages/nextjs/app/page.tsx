"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import Wall from "~~/components/Wall";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: totalBuilders } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getTotalBuilders",
  });

  const { data: hasSigned } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "hasAddressSigned",
    args: [connectedAddress],
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const handleSign = async () => {
    if (!connectedAddress || hasSigned) return;
    try {
      await writeYourContractAsync({ functionName: "signGuestbook" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Build the Wall</h1>

          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalBuilders ? Number(totalBuilders) : 0}</div>
              <div className="text-sm text-gray-600">Total builders</div>
            </div>

            {connectedAddress && (
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  Status: {hasSigned ? "Signed" : "Ready to sign"}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mb-4">
            {connectedAddress ? (
              <button
                onClick={handleSign}
                disabled={hasSigned}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  hasSigned
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                }`}
              >
                {hasSigned ? "Already signed" : "Sign & Add Your Brick"}
              </button>
            ) : (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-3 text-yellow-800">
                Connect your wallet to sign and add a brick to the wall
              </div>
            )}
          </div>

          {connectedAddress && (
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Your Address:</div>
                <Address address={connectedAddress} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wall Section */}
      <div className="max-w-6xl mx-auto p-6">
        <Wall />
      </div>
    </div>
  );
};

export default Home;
