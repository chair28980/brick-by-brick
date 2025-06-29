"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// Floating decorative elements component
const FloatingElements = () => {
  const elements = [
    { emoji: "💎", delay: "0s", duration: "6s", x: "10%", y: "20%" },
    { emoji: "🪙", delay: "1s", duration: "8s", x: "80%", y: "30%" },
    { emoji: "⭐", delay: "2s", duration: "7s", x: "15%", y: "70%" },
    { emoji: "💎", delay: "3s", duration: "9s", x: "85%", y: "80%" },
    { emoji: "🪙", delay: "4s", duration: "5s", x: "45%", y: "15%" },
    { emoji: "✨", delay: "0.5s", duration: "10s", x: "65%", y: "60%" },
  ];

  return (
    <div className="floating-elements">
      {elements.map((element, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            left: element.x,
            top: element.y,
            animationDelay: element.delay,
            animationDuration: element.duration,
          }}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
}) => (
  <div className="stats-card">
    <div className="stats-icon">{icon}</div>
    <div className="stats-content">
      <h3 className="stats-title">{title}</h3>
      <div className="stats-value">{value}</div>
      <p className="stats-desc">{description}</p>
    </div>
  </div>
);

// Builder Card Component
const BuilderCard = ({ address, index }: { address: string; index: number }) => (
  <div className="builder-card">
    <div className="builder-number">#{index + 1}</div>
    <Address address={address} />
    <div className="builder-badge">🧱</div>
  </div>
);

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Read contract data
  const { data: totalBricks } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getTotalBuilders",
  });

  const { data: builders } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getAllBuilders",
  });

  const { data: hasSigned } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "hasAddressSigned",
    args: [connectedAddress],
  });

  // Write contract function
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const handleSignGuestbook = async () => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet first!");
      return;
    }

    if (hasSigned) {
      notification.info("You have already signed the guestbook!");
      return;
    }

    try {
      setIsLoading(true);
      await writeYourContractAsync({
        functionName: "signGuestbook",
      });
      notification.success("Successfully signed the guestbook! 🧱");
    } catch (error) {
      console.error("Error signing guestbook:", error);
      notification.error("Failed to sign guestbook");
    } finally {
      setIsLoading(false);
    }
  };

  const brickCount = totalBricks ? Number(totalBricks) : 0;

  return (
    <>
      <div className="landing-page">
        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Build the Wall
                <span className="title-accent">Together</span>
              </h1>
              <p className="hero-subtitle">
                Join the revolution of decentralized building. Every signature adds a brick to our collective wall,
                creating something greater than the sum of its parts.
              </p>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <button
                  className={`cta-primary ${isLoading ? "loading" : ""} ${hasSigned ? "completed" : ""}`}
                  onClick={handleSignGuestbook}
                  disabled={!connectedAddress || hasSigned || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing...
                    </>
                  ) : hasSigned ? (
                    <>✅ Already Built!</>
                  ) : (
                    <>🧱 Add Your Brick</>
                  )}
                </button>

                {connectedAddress && (
                  <div className="connected-address">
                    <span>Building as:</span>
                    <Address address={connectedAddress} />
                  </div>
                )}
              </div>
            </div>

            {/* Hero Illustration/Stats */}
            <div className="hero-visual">
              <div className="wall-illustration">
                <div className="wall-container">
                  {Array.from({ length: Math.min(brickCount, 50) }, (_, i) => (
                    <div key={i} className="animated-brick" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <div className="wall-glow"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="section-container">
            <h2 className="section-title">Building Progress</h2>
            <div className="stats-grid">
              <StatsCard
                title="Total Builders"
                value={brickCount}
                description="Unique signatures collected"
                icon="🏗️"
              />
              <StatsCard
                title="Your Status"
                value={connectedAddress ? (hasSigned ? "Builder" : "Ready") : "Connect"}
                description={
                  connectedAddress ? (hasSigned ? "You've added your brick!" : "Ready to sign") : "Connect your wallet"
                }
                icon={connectedAddress ? (hasSigned ? "✅" : "⏳") : "🔗"}
              />
              <StatsCard
                title="Wall Strength"
                value={`${Math.min((brickCount / 100) * 100, 100)}%`}
                description="Towards our first milestone"
                icon="💪"
              />
            </div>
          </div>
        </section>

        {/* Builders Section */}
        {builders && builders.length > 0 && (
          <section className="builders-section">
            <div className="section-container">
              <h2 className="section-title">Our Builders ({builders.length})</h2>
              <p className="section-subtitle">Every builder who helped construct our decentralized wall</p>
              <div className="builders-grid">
                {builders.slice(0, 12).map((builder, index) => (
                  <BuilderCard key={index} address={builder} index={index} />
                ))}
              </div>
              {builders.length > 12 && <div className="builders-more">And {builders.length - 12} more builders...</div>}
            </div>
          </section>
        )}

        {/* Getting Started Section */}
        {brickCount === 0 && (
          <section className="getting-started-section">
            <div className="section-container">
              <div className="getting-started-content">
                <h2 className="section-title">Be the First Builder!</h2>
                <p className="getting-started-text">
                  You have the honor of laying the foundation stone. Connect your wallet and sign the guestbook to add
                  the very first brick to our wall. Make history with us!
                </p>
                <div className="getting-started-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Connect Wallet</h3>
                      <p>Use the connect button in the header</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Sign Guestbook</h3>
                      <p>Click the &quot;Add Your Brick&quot; button</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Make History</h3>
                      <p>Become the first builder!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #4a9b8e 0%, #5b9bd5 100%);
          position: relative;
          overflow-x: hidden;
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          font-size: 2rem;
          animation: float infinite ease-in-out;
          opacity: 0.6;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .hero-section {
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .title-accent {
          background: linear-gradient(45deg, #8b5cf6, #f59e0b);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          display: block;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cta-primary {
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          min-width: 200px;
        }

        .cta-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
        }

        .cta-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cta-primary.completed {
          background: linear-gradient(45deg, #34d399, #10b981);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .connected-address {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .connected-address span {
          font-size: 0.9rem;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wall-illustration {
          position: relative;
          width: 300px;
          height: 300px;
        }

        .wall-container {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 2px;
          padding: 20px;
          position: relative;
          z-index: 2;
        }

        .animated-brick {
          width: 25px;
          height: 15px;
          background: linear-gradient(45deg, #f59e0b, #fbbf24);
          border-radius: 2px;
          animation: brickAppear 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        @keyframes brickAppear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wall-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.5;
          }
        }

        .stats-section,
        .builders-section,
        .getting-started-section {
          padding: 4rem 2rem;
          position: relative;
          z-index: 10;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .section-subtitle {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .stats-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .stats-icon {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .stats-content {
          flex: 1;
        }

        .stats-title {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-value {
          font-size: 2rem;
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 0.5rem;
        }

        .stats-desc {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .builders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .builder-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .builder-card:hover {
          transform: translateY(-3px);
        }

        .builder-number {
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          color: white;
          font-weight: 600;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          font-size: 0.9rem;
          min-width: 50px;
          text-align: center;
        }

        .builder-badge {
          font-size: 1.5rem;
        }

        .builders-more {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin-top: 2rem;
          font-style: italic;
        }

        .getting-started-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .getting-started-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .getting-started-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .step {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .step-number {
          background: linear-gradient(45deg, #f59e0b, #fbbf24);
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .step-content h3 {
          color: #1f2937;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #6b7280;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .wall-illustration {
            width: 250px;
            height: 250px;
          }

          .wall-container {
            grid-template-columns: repeat(8, 1fr);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .getting-started-steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
