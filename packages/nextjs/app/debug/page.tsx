import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug contracts",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div className="text-center mt-8 p-4">
        <h1 className="text-2xl font-bold mb-2">Debug Contracts</h1>
        <p className="text-gray-600">Interact with deployed contracts</p>
      </div>
    </>
  );
};

export default Debug;
