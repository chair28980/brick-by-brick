import React from "react";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Brick = ({ address, position }: { address: string; position: number }) => {
  return (
    <div
      className="relative bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-900 rounded-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={{
        width: "120px",
        height: "60px",
        margin: "2px",
      }}
    >
      <div className="absolute inset-0 bg-red-700 opacity-30 rounded-sm"></div>
      <div className="relative z-10 p-2 flex flex-col justify-center items-center text-white text-xs">
        <div className="font-bold mb-1">Brick #{position + 1}</div>
        <div className="text-xs opacity-90 truncate w-full text-center">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
      {/* Mortar lines */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-base-content opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-base-content opacity-20"></div>
      <div className="absolute top-0 left-0 w-0.5 h-full bg-base-content opacity-20"></div>
      <div className="absolute top-0 right-0 w-0.5 h-full bg-base-content opacity-20"></div>
    </div>
  );
};

const Wall = () => {
  const { data: builders, isLoading } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getAllBuilders",
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-base-100 rounded-lg border-2 border-dashed border-base-300">
        <div className="text-base-content opacity-70 text-lg">Loading wall...</div>
      </div>
    );
  }

  if (!builders || builders.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-base-100 rounded-lg border-2 border-dashed border-base-300">
        <div className="text-6xl mb-4">🧱</div>
        <div className="text-base-content text-lg font-semibold">No bricks yet!</div>
        <div className="text-base-content opacity-60 text-sm mt-2">Sign the guestbook to add the first brick</div>
      </div>
    );
  }

  const renderWallRows = () => {
    const bricks = [...builders];
    const rows = [];
    const bricksPerRow = 5;

    for (let i = 0; i < bricks.length; i += bricksPerRow) {
      const rowBricks = bricks.slice(i, i + bricksPerRow);
      const isEvenRow = Math.floor(i / bricksPerRow) % 2 === 0;

      rows.push(
        <div key={i} className={`flex justify-center ${isEvenRow ? "" : "ml-16"} mb-1`}>
          {rowBricks.map((builder, index) => (
            <Brick key={builder} address={builder} position={i + index} />
          ))}
        </div>,
      );
    }

    return rows;
  };

  return (
    <div className="w-full min-h-96 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-base-content mb-2">🏗️ The Wall</h2>
        <p className="text-base-content opacity-70">
          {builders.length} brick{builders.length !== 1 ? "s" : ""} built by our community
        </p>
      </div>

      <div className="flex flex-col items-center">{renderWallRows()}</div>

      {builders.length > 0 && (
        <div className="mt-8 text-center">
          <div className="text-sm text-base-content opacity-60 mb-4">Latest Builders:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {builders.slice(-3).map(builder => (
              <div key={builder} className="bg-base-100 rounded-lg p-2 shadow-sm border border-base-300">
                <Address address={builder} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wall;
