import { useState } from "react";
import GameCanvas from "./components/GameCanvas";
import LandingPage from "./components/LandingPage";

export type AppView = "landing" | "game";

export default function App() {
  const [view, setView] = useState<AppView>("landing");

  return (
    <div className="min-h-screen bg-white">
      {view === "landing" ? (
        <LandingPage onPlayGame={() => setView("game")} />
      ) : (
        <GameCanvas onBackToMenu={() => setView("landing")} />
      )}
    </div>
  );
}
