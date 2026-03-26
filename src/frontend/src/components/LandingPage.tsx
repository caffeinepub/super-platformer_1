import {
  ArrowRight,
  Coins,
  Gamepad2,
  Heart,
  Skull,
  Star,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetTopScores } from "../hooks/useQueries";

interface Props {
  onPlayGame: () => void;
}

export default function LandingPage({ onPlayGame }: Props) {
  const { data: scores, isLoading } = useGetTopScores();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-navy sticky top-0 z-50 border-b-4 border-dark-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-game-orange border-2 border-dark-border flex items-center justify-center">
              <span className="text-white text-xs font-pixel">SP</span>
            </div>
            <span className="font-pixel text-white text-xs tracking-wide hidden sm:block">
              SUPER PLATFORMER
            </span>
          </div>
          <nav className="flex items-center gap-4 md:gap-8">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="nav-link"
              data-ocid="nav.home_link"
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-to-play")}
              className="nav-link"
              data-ocid="nav.howto_link"
            >
              HOW TO PLAY
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("leaderboard")}
              className="nav-link"
              data-ocid="nav.leaderboard_link"
            >
              SCORES
            </button>
          </nav>
          <button
            type="button"
            onClick={onPlayGame}
            className="pixel-btn-orange px-4 py-2 text-xs"
            data-ocid="nav.play_button"
          >
            PLAY NOW
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ minHeight: 520 }}
      >
        {/* Pixel art sky background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #1a78c2 0%, #3EA7E8 40%, #5dc0f0 70%, #7dd4f8 100%)",
          }}
        />

        {/* Clouds */}
        <div
          className="absolute top-8 left-[8%] w-20 h-8 bg-white opacity-90"
          style={{
            boxShadow:
              "16px 0 0 white, -8px 8px 0 white, 8px 8px 0 white, 24px 8px 0 white",
          }}
        />
        <div
          className="absolute top-16 left-[35%] w-16 h-6 bg-white opacity-80"
          style={{
            boxShadow:
              "12px 0 0 white, -6px 6px 0 white, 6px 6px 0 white, 18px 6px 0 white",
          }}
        />
        <div
          className="absolute top-6 right-[20%] w-24 h-8 bg-white opacity-85"
          style={{
            boxShadow:
              "20px 0 0 white, -8px 8px 0 white, 8px 8px 0 white, 28px 8px 0 white",
          }}
        />

        {/* Hills far background */}
        <div className="absolute bottom-20 left-0 right-0 flex">
          <div
            style={{
              width: 200,
              height: 80,
              background: "#2d8c30",
              borderRadius: "50% 50% 0 0",
            }}
          />
          <div
            style={{
              width: 280,
              height: 100,
              background: "#31922e",
              borderRadius: "50% 50% 0 0",
              marginLeft: -60,
              marginTop: 20,
            }}
          />
          <div
            style={{
              width: 240,
              height: 90,
              background: "#28862a",
              borderRadius: "50% 50% 0 0",
              marginLeft: -40,
            }}
          />
          <div
            style={{
              width: 320,
              height: 110,
              background: "#2d8c30",
              borderRadius: "50% 50% 0 0",
              marginLeft: -80,
              marginTop: 10,
            }}
          />
          <div
            style={{
              width: 260,
              height: 85,
              background: "#31922e",
              borderRadius: "50% 50% 0 0",
              marginLeft: -60,
            }}
          />
          <div
            style={{
              width: 300,
              height: 95,
              background: "#28862a",
              borderRadius: "50% 50% 0 0",
              marginLeft: -70,
            }}
          />
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-5 bg-grass-green border-t-4 border-dark-border" />
          <div
            className="h-16 bg-dirt-brown"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(180deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 16px)",
            }}
          />
        </div>

        {/* Pixel decorations on ground */}
        <div className="absolute bottom-16 left-[15%]">
          {/* Question block */}
          <div
            className="w-10 h-10 bg-game-yellow border-3 border-dark-border flex items-center justify-center font-pixel text-dark-border text-sm"
            style={{ border: "3px solid #2B1A10" }}
          >
            ?
          </div>
        </div>
        <div className="absolute bottom-16 left-[25%]">
          <div
            className="w-10 h-10 bg-game-yellow border-3 border-dark-border flex items-center justify-center font-pixel text-dark-border text-sm"
            style={{ border: "3px solid #2B1A10", marginRight: 4 }}
          >
            ?
          </div>
        </div>
        <div className="absolute bottom-16 right-[20%]">
          <div
            className="w-8 h-8 rounded-full bg-game-yellow border-2 border-dark-border animate-coin-spin"
            style={{ border: "2px solid #2B1A10" }}
          />
        </div>
        <div className="absolute bottom-20 right-[18%]">
          <div
            className="w-8 h-8 rounded-full bg-game-yellow border-2 border-dark-border animate-coin-spin"
            style={{ border: "2px solid #2B1A10", animationDelay: "0.3s" }}
          />
        </div>

        {/* HUD top-right */}
        <div
          className="absolute top-4 right-4 bg-navy bg-opacity-80 border-2 border-game-yellow px-3 py-2"
          style={{ border: "2px solid #F6C64A" }}
        >
          <p className="font-pixel text-white text-xs">
            SCORE <span className="text-game-yellow">00000</span>
          </p>
          <p className="font-pixel text-white text-xs mt-1">
            COINS <span className="text-game-yellow">×00</span>
          </p>
        </div>

        {/* Hearts top-left */}
        <div className="absolute top-4 left-4 flex gap-1">
          {["h1", "h2", "h3"].map((hk) => (
            <Heart key={hk} className="w-6 h-6 fill-red-500 text-red-600" />
          ))}
        </div>

        {/* Main hero text */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 md:px-16 pt-12 pb-32 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pixel-heading text-white text-xl md:text-2xl lg:text-3xl leading-relaxed mb-4"
          >
            WELCOME TO THE ADVENTURE!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white text-sm md:text-base mb-8 max-w-sm font-sans"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
          >
            Jump, run and stomp enemies in this classic 8-bit platformer.
            Collect coins, beat every level and claim the top score!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={onPlayGame}
            className="pixel-btn-yellow px-8 py-4 text-sm animate-float"
            data-ocid="hero.play_button"
          >
            ▶ START GAME
          </motion.button>
        </div>
      </section>

      {/* How to Play */}
      <section id="how-to-play" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-pixel text-center text-navy text-lg md:text-xl mb-4"
          >
            HOW TO PLAY
          </motion.h2>
          <div className="w-24 h-1 bg-game-orange mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "←→",
                title: "01. MOVE",
                desc: "Use Arrow Keys or A/D to run left and right across platforms.",
                color: "#3EA7E8",
              },
              {
                icon: "↑",
                title: "02. JUMP",
                desc: "Press Space, Up Arrow, or W to jump over gaps and onto platforms.",
                color: "#4AAE4F",
              },
              {
                icon: "★",
                title: "03. STOMP",
                desc: "Jump on top of Goombas to defeat them. Avoid touching them from the side!",
                color: "#F57C2A",
              },
              {
                icon: "●",
                title: "04. COLLECT",
                desc: "Grab golden coins to earn +10 points each. Reach the flag to win!",
                color: "#F6C64A",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="platform-card p-6 text-center"
                data-ocid={`howto.item.${i + 1}`}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-3 border-dark-border font-pixel text-xl"
                  style={{
                    background: item.color,
                    border: "3px solid #2B1A10",
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-pixel text-navy text-xs mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Levels */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-pixel text-center text-navy text-lg md:text-xl mb-4"
          >
            FEATURED LEVELS
          </motion.h2>
          <div className="w-24 h-1 bg-game-orange mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "GRASSLANDS",
                subtitle: "World 1-1",
                desc: "A sunny meadow full of coins and bouncy Goombas. Perfect for beginners!",
                skyColor: "#3EA7E8",
                groundColor: "#4AAE4F",
                stars: 3,
                badge: "STARTER",
                badgeColor: "#4AAE4F",
              },
              {
                name: "COIN CAVES",
                subtitle: "World 2-1",
                desc: "Underground caverns packed with treasures. Watch out for extra enemies!",
                skyColor: "#2B1A10",
                groundColor: "#8B6347",
                stars: 4,
                badge: "CLASSIC",
                badgeColor: "#F57C2A",
              },
              {
                name: "SKYWAY RUSH",
                subtitle: "World 3-1",
                desc: "Race across tiny floating platforms high above the clouds. Don't fall!",
                skyColor: "#1a4a8c",
                groundColor: "#B8D4F0",
                stars: 5,
                badge: "EXPERT",
                badgeColor: "#e53e3e",
              },
            ].map((level, i) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="platform-card overflow-hidden"
                data-ocid={`levels.item.${i + 1}`}
              >
                {/* Level thumbnail */}
                <div
                  className="relative h-32 overflow-hidden"
                  style={{ background: level.skyColor }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 h-8"
                    style={{
                      background: level.groundColor,
                      borderTop: "3px solid #2B1A10",
                    }}
                  />
                  {[40, 100, 160].map((x, j) => (
                    <div
                      key={x}
                      className="absolute w-8 h-3"
                      style={{
                        left: x,
                        bottom: 32 + (j % 2) * 20,
                        background: level.groundColor,
                        border: "2px solid #2B1A10",
                      }}
                    />
                  ))}
                  <div
                    className="absolute top-2 right-2 px-2 py-1 font-pixel text-white text-xs"
                    style={{
                      background: level.badgeColor,
                      border: "2px solid #2B1A10",
                    }}
                  >
                    {level.badge}
                  </div>
                  {/* Pixel player icon */}
                  <div
                    className="absolute w-6 h-8 bg-red-500"
                    style={{ left: 20, bottom: 8, border: "2px solid #2B1A10" }}
                  />
                  {/* Coins */}
                  {[120, 145, 170].map((x, j) => (
                    <div
                      key={x}
                      className="absolute w-4 h-4 rounded-full bg-game-yellow"
                      style={{
                        left: x,
                        bottom: 48 + j * 4,
                        border: "2px solid #2B1A10",
                      }}
                    />
                  ))}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-pixel text-navy text-xs">
                      {level.name}
                    </h3>
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((starIdx) => (
                        <Star
                          key={`${level.name}-star-${starIdx}`}
                          className="w-3 h-3"
                          fill={starIdx < level.stars ? "#F6C64A" : "#e2e8f0"}
                          color={starIdx < level.stars ? "#2B1A10" : "#cbd5e0"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-pixel text-game-orange text-xs mb-2">
                    {level.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">{level.desc}</p>
                  <button
                    type="button"
                    onClick={onPlayGame}
                    className="pixel-btn-orange w-full py-2 text-xs"
                    data-ocid={`levels.play_button.${i + 1}`}
                  >
                    ▶ PLAY
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-pixel text-center text-navy text-lg md:text-xl mb-4"
          >
            GLOBAL LEADERBOARD
          </motion.h2>
          <div className="w-24 h-1 bg-game-orange mx-auto mb-12" />

          {isLoading ? (
            <div
              className="text-center py-12"
              data-ocid="leaderboard.loading_state"
            >
              <div className="font-pixel text-navy text-xs animate-blink">
                LOADING...
              </div>
            </div>
          ) : (
            <div
              className="platform-card overflow-hidden"
              data-ocid="leaderboard.table"
            >
              {/* Table header */}
              <div className="bg-navy grid grid-cols-3 px-6 py-3">
                <span className="font-pixel text-game-yellow text-xs">
                  RANK
                </span>
                <span className="font-pixel text-game-yellow text-xs">
                  PLAYER
                </span>
                <span className="font-pixel text-game-yellow text-xs text-right">
                  SCORE
                </span>
              </div>
              {/* Rows */}
              {scores && scores.length > 0 ? (
                scores.slice(0, 10).map((entry, i) => (
                  <div
                    key={`score-${entry.playerName}-${i}`}
                    className={`grid grid-cols-3 px-6 py-3 border-b border-gray-100 ${i === 0 ? "bg-game-yellow bg-opacity-20" : i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    data-ocid={`leaderboard.row.${i + 1}`}
                  >
                    <span className="font-pixel text-xs flex items-center gap-2">
                      {i === 0
                        ? "🥇"
                        : i === 1
                          ? "🥈"
                          : i === 2
                            ? "🥉"
                            : `#${i + 1}`}
                    </span>
                    <span className="font-pixel text-navy text-xs">
                      {entry.playerName}
                    </span>
                    <span className="font-pixel text-game-orange text-xs text-right">
                      {Number(entry.score).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  className="py-12 text-center"
                  data-ocid="leaderboard.empty_state"
                >
                  <Trophy className="w-12 h-12 text-game-yellow mx-auto mb-3" />
                  <p className="font-pixel text-navy text-xs mb-1">
                    NO SCORES YET
                  </p>
                  <p className="text-gray-500 text-sm">
                    Be the first to claim the top spot!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              type="button"
              onClick={onPlayGame}
              className="pixel-btn-orange px-8 py-3 text-xs inline-flex items-center gap-2"
              data-ocid="leaderboard.play_button"
            >
              PLAY & CLAIM YOUR RANK <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t-4 border-dark-border py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-game-orange border-2 border-dark-border flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-pixel text-white text-xs">
              SUPER PLATFORMER
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="nav-link"
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-to-play")}
              className="nav-link"
            >
              HOW TO PLAY
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("leaderboard")}
              className="nav-link"
            >
              LEADERBOARD
            </button>
          </div>
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-game-yellow hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
