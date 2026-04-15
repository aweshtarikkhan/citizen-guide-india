import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const RANKS = [
  { min: 0, label: "Noob", emoji: "🐣" },
  { min: 10, label: "Rookie", emoji: "🎯" },
  { min: 25, label: "Amateur", emoji: "⚡" },
  { min: 50, label: "Skilled", emoji: "🔥" },
  { min: 100, label: "Pro", emoji: "💀" },
  { min: 200, label: "Legend", emoji: "👑" },
];

const getRank = (score: number) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
};

interface Enemy {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  shape: number; // 0-4
  rotation: number;
  rotSpeed: number;
  hp: number;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
}

const NotFound = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);
  const gunXRef = useRef(0);
  const frameRef = useRef(0);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const shootTimerRef = useRef(0);
  const difficultyRef = useRef(1);
  const gameOverRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const { user } = useAuth();

  // Load high score
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("game_high_score")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.game_high_score) setHighScore(data.game_high_score);
      });
  }, [user]);

  const saveScore = useCallback(
    async (finalScore: number) => {
      if (!user || finalScore <= highScore) return;
      setHighScore(finalScore);
      await supabase
        .from("profiles")
        .update({ game_high_score: finalScore })
        .eq("id", user.id);
    },
    [user, highScore]
  );

  const createParticles = (x: number, y: number, count = 6) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * (1.5 + Math.random() * 3),
        vy: Math.sin(angle) * (1.5 + Math.random() * 3),
        life: 1,
        size: 1.5 + Math.random() * 3,
      });
    }
  };

  const initStars = (w: number, h: number) => {
    starsRef.current = [];
    for (let i = 0; i < 80; i++) {
      starsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.3 + Math.random() * 1.2,
        size: 0.5 + Math.random() * 1.5,
      });
    }
  };

  const drawGun = (ctx: CanvasRenderingContext2D, x: number, h: number) => {
    const gunW = 28;
    const gunH = 40;
    const barrelW = 4;
    const barrelH = 18;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";

    // barrel
    ctx.fillRect(x - barrelW / 2, h - gunH - barrelH, barrelW, barrelH);
    ctx.strokeRect(x - barrelW / 2, h - gunH - barrelH, barrelW, barrelH);

    // body
    ctx.beginPath();
    ctx.moveTo(x - gunW / 2, h - 5);
    ctx.lineTo(x - gunW / 2 + 4, h - gunH);
    ctx.lineTo(x + gunW / 2 - 4, h - gunH);
    ctx.lineTo(x + gunW / 2, h - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // small detail lines
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 6, h - gunH + 8);
    ctx.lineTo(x + 6, h - gunH + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 8, h - gunH + 14);
    ctx.lineTo(x + 8, h - gunH + 14);
    ctx.stroke();
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, e: Enemy) => {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rotation);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    const s = e.size;

    switch (e.shape) {
      case 0: // circle
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.stroke();
        // inner circle
        ctx.beginPath();
        ctx.arc(0, 0, s / 4, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 1: // square with X
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.beginPath();
        ctx.moveTo(-s / 3, -s / 3);
        ctx.lineTo(s / 3, s / 3);
        ctx.moveTo(s / 3, -s / 3);
        ctx.lineTo(-s / 3, s / 3);
        ctx.stroke();
        break;
      case 2: // triangle
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(-s / 2, s / 2);
        ctx.lineTo(s / 2, s / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s / 6);
        ctx.lineTo(-s / 6, s / 6);
        ctx.lineTo(s / 6, s / 6);
        ctx.closePath();
        ctx.stroke();
        break;
      case 3: // diamond
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(s / 2, 0);
        ctx.lineTo(0, s / 2);
        ctx.lineTo(-s / 2, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s / 6, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 4: { // star / asteroid
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          const r = i % 2 === 0 ? s / 2 : s / 3.5;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  };

  const restartGame = useCallback(() => {
    enemiesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    missedRef.current = 0;
    difficultyRef.current = 1;
    spawnTimerRef.current = 0;
    shootTimerRef.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setGameOver(false);
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gunXRef.current = canvas.width / 2;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Input handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      gunXRef.current = (e.clientX - rect.left) * (canvas.width / rect.width);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      gunXRef.current = (t.clientX - rect.left) * (canvas.width / rect.width);
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      gunXRef.current = (t.clientX - rect.left) * (canvas.width / rect.width);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    let running = true;

    const loop = () => {
      if (!running) return;
      const W = canvas.width;
      const H = canvas.height;

      // White background
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);

      // Stars (moving down for space feel)
      ctx.fillStyle = "#ccc";
      starsRef.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > H) {
          star.y = 0;
          star.x = Math.random() * W;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // Big 404 in background
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      ctx.font = `bold ${Math.min(W * 0.35, 300)}px Quicksand, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("404", W / 2, H / 2);

      if (!gameOverRef.current) {
        // Spawn enemies
        spawnTimerRef.current++;
        const spawnRate = Math.max(15, 55 - scoreRef.current * 0.5);
        if (spawnTimerRef.current >= spawnRate) {
          const size = 18 + Math.random() * 22;
          enemiesRef.current.push({
            id: nextIdRef.current++,
            x: size + Math.random() * (W - size * 2),
            y: -size,
            size,
            speed: 1.2 + Math.random() * 1.5 * difficultyRef.current,
            shape: Math.floor(Math.random() * 5),
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            hp: 1,
          });
          spawnTimerRef.current = 0;
        }

        // Auto-shoot bullets
        shootTimerRef.current++;
        if (shootTimerRef.current >= 8) {
          bulletsRef.current.push({
            x: gunXRef.current,
            y: H - 62,
            vy: -10,
          });
          shootTimerRef.current = 0;
        }

        // Update bullets
        bulletsRef.current = bulletsRef.current.filter((b) => {
          b.y += b.vy;
          if (b.y < -10) return false;

          // Draw bullet as a line
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x, b.y + 8);
          ctx.stroke();

          // Small dot at tip
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Check collision with enemies
          let hitIdx = -1;
          for (let i = 0; i < enemiesRef.current.length; i++) {
            const e = enemiesRef.current[i];
            const dx = e.x - b.x;
            const dy = e.y - b.y;
            if (Math.sqrt(dx * dx + dy * dy) < e.size * 0.6) {
              hitIdx = i;
              break;
            }
          }
          if (hitIdx >= 0) {
            const e = enemiesRef.current[hitIdx];
            createParticles(e.x, e.y, 8);
            enemiesRef.current.splice(hitIdx, 1);
            scoreRef.current++;
            setScore(scoreRef.current);
            difficultyRef.current = 1 + Math.floor(scoreRef.current / 12) * 0.25;
            return false;
          }
          return true;
        });

        // Update enemies
        enemiesRef.current = enemiesRef.current.filter((e) => {
          e.y += e.speed;
          e.rotation += e.rotSpeed;
          drawEnemy(ctx, e);

          if (e.y > H + e.size) {
            missedRef.current++;
            if (missedRef.current >= 10) {
              gameOverRef.current = true;
              setGameOver(true);
              void saveScore(scoreRef.current);
            }
            return false;
          }
          return true;
        });

        // Draw gun
        drawGun(ctx, gunXRef.current, H);

        // Muzzle flash (every other shot frame)
        if (shootTimerRef.current <= 2) {
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          const muzzleY = H - 58;
          for (let i = 0; i < 3; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            const len = 8 + Math.random() * 6;
            ctx.beginPath();
            ctx.moveTo(gunXRef.current, muzzleY);
            ctx.lineTo(
              gunXRef.current + Math.cos(angle) * len,
              muzzleY + Math.sin(angle) * len
            );
            ctx.stroke();
          }
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      // HUD
      ctx.fillStyle = "#000";
      ctx.font = "bold 16px Quicksand, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`Score: ${scoreRef.current}`, 16, 16);

      // Missed bar
      const missed = missedRef.current;
      ctx.fillText(`Lives: ${"●".repeat(Math.max(0, 10 - missed))}${"○".repeat(missed)}`, 16, 40);

      const rank = getRank(scoreRef.current);
      ctx.textAlign = "right";
      ctx.fillText(`${rank.emoji} ${rank.label}`, W - 16, 16);

      if (user && highScore > 0) {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.font = "12px Quicksand, sans-serif";
        ctx.fillText(`Best: ${highScore}`, W - 16, 40);
      }

      // "Page not found" subtitle
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.font = "14px Quicksand, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("page not found — enjoy the game!", W / 2, H - 10);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, [saveScore, highScore, user]);

  const rank = getRank(score);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden select-none" style={{ cursor: "none" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/90">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-1 font-[Quicksand]">GAME OVER</h2>
          <p className="text-5xl mb-2">{rank.emoji}</p>
          <p className="text-xl font-bold text-black mb-1">{rank.label}</p>
          <p className="text-base text-black/60 mb-1">Score: {score}</p>
          {user && score >= highScore && score > 0 && (
            <p className="text-sm text-black/50 mb-3">🏆 New High Score!</p>
          )}
          {user && score < highScore && (
            <p className="text-sm text-black/50 mb-3">Best: {highScore}</p>
          )}
          {!user && (
            <p className="text-xs text-black/40 mb-3">
              <Link to="/signup" className="underline">Sign up</Link> to save scores
            </p>
          )}

          {/* Rank progression */}
          <div className="flex gap-2 flex-wrap justify-center px-4 mb-6">
            {RANKS.map((r) => (
              <div
                key={r.label}
                className={`text-center text-[10px] px-2 py-1 border ${
                  score >= r.min ? "border-black text-black" : "border-black/15 text-black/25"
                }`}
              >
                <span className="text-sm">{r.emoji}</span>
                <p className="font-semibold">{r.label}</p>
                <p>{r.min}+</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={restartGame}
              className="px-6 py-2.5 bg-black text-white font-bold rounded-none border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              PLAY AGAIN
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 bg-white text-black font-bold rounded-none border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center"
            >
              GO HOME
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFound;
