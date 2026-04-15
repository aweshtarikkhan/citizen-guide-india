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
  shape: number;
  rotation: number;
  rotSpeed: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
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
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const frameRef = useRef(0);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const shootTimerRef = useRef(0);
  const difficultyRef = useRef(1);
  const gameOverRef = useRef(false);
  const playingRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { user } = useAuth();

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

  const createParticles = (x: number, y: number) => {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
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
        speed: 0.3 + Math.random() * 1,
        size: 0.5 + Math.random() * 1.5,
      });
    }
  };

  const GUN_Y_OFFSET = 60; // gun sits this far from bottom

  const drawGun = (ctx: CanvasRenderingContext2D, cx: number, h: number, aimX: number, aimY: number) => {
    const gunBaseY = h - GUN_Y_OFFSET;
    const barrelLen = 22;
    const angle = Math.atan2(aimY - gunBaseY, aimX - cx);

    ctx.save();
    ctx.translate(cx, gunBaseY);

    // body (trapezoid)
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-10, -20);
    ctx.lineTo(10, -20);
    ctx.lineTo(14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // barrel rotates toward mouse
    ctx.save();
    ctx.translate(0, -20);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-2.5, 0, 5, -barrelLen);
    ctx.strokeRect(-2.5, 0, 5, -barrelLen);
    ctx.restore();

    // detail lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(-6, -8);
    ctx.lineTo(6, -8);
    ctx.stroke();

    ctx.restore();
  };

  const drawCrosshair = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    const s = 10;
    // circle
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.stroke();
    // cross lines
    ctx.beginPath();
    ctx.moveTo(x - s - 4, y);
    ctx.lineTo(x - s + 4, y);
    ctx.moveTo(x + s - 4, y);
    ctx.lineTo(x + s + 4, y);
    ctx.moveTo(x, y - s - 4);
    ctx.lineTo(x, y - s + 4);
    ctx.moveTo(x, y + s - 4);
    ctx.lineTo(x, y + s + 4);
    ctx.stroke();
    // center dot
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, e: Enemy) => {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rotation);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    const s = e.size;
    switch (e.shape) {
      case 0:
        ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, s / 4, 0, Math.PI * 2); ctx.stroke();
        break;
      case 1:
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.beginPath();
        ctx.moveTo(-s / 3, -s / 3); ctx.lineTo(s / 3, s / 3);
        ctx.moveTo(s / 3, -s / 3); ctx.lineTo(-s / 3, s / 3);
        ctx.stroke();
        break;
      case 2:
        ctx.beginPath();
        ctx.moveTo(0, -s / 2); ctx.lineTo(-s / 2, s / 2); ctx.lineTo(s / 2, s / 2);
        ctx.closePath(); ctx.stroke();
        break;
      case 3:
        ctx.beginPath();
        ctx.moveTo(0, -s / 2); ctx.lineTo(s / 2, 0); ctx.lineTo(0, s / 2); ctx.lineTo(-s / 2, 0);
        ctx.closePath(); ctx.stroke();
        break;
      case 4: {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          const r = i % 2 === 0 ? s / 2 : s / 3.5;
          i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.stroke();
        break;
      }
    }
    ctx.restore();
  };

  const startGame = useCallback(() => {
    enemiesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    missedRef.current = 0;
    difficultyRef.current = 1;
    spawnTimerRef.current = 0;
    shootTimerRef.current = 0;
    gameOverRef.current = false;
    playingRef.current = true;
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseXRef.current = canvas.width / 2;
      mouseYRef.current = canvas.height / 2;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseYRef.current = (e.clientY - rect.top) * (canvas.height / rect.height);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseXRef.current = (t.clientX - rect.left) * (canvas.width / rect.width);
      mouseYRef.current = (t.clientY - rect.top) * (canvas.height / rect.height);
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseXRef.current = (t.clientX - rect.left) * (canvas.width / rect.width);
      mouseYRef.current = (t.clientY - rect.top) * (canvas.height / rect.height);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    let running = true;
    const loop = () => {
      if (!running) return;
      const W = canvas.width;
      const H = canvas.height;
      const gunCX = W / 2;
      const gunBaseY = H - GUN_Y_OFFSET;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "#ddd";
      starsRef.current.forEach((s) => {
        s.y += s.speed;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // 404 bg text
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      ctx.font = `bold ${Math.min(W * 0.35, 300)}px Quicksand, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("404", W / 2, H / 2);

      if (playingRef.current && !gameOverRef.current) {
        // Spawn
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
          });
          spawnTimerRef.current = 0;
        }

        // Auto-shoot toward mouse
        shootTimerRef.current++;
        if (shootTimerRef.current >= 8) {
          const dx = mouseXRef.current - gunCX;
          const dy = mouseYRef.current - gunBaseY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = 11;
          bulletsRef.current.push({
            x: gunCX,
            y: gunBaseY - 20,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
          });
          shootTimerRef.current = 0;
        }

        // Update bullets
        bulletsRef.current = bulletsRef.current.filter((b) => {
          b.x += b.vx;
          b.y += b.vy;
          if (b.y < -10 || b.y > H + 10 || b.x < -10 || b.x > W + 10) return false;

          // Draw bullet line
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 0.6, b.y - b.vy * 0.6);
          ctx.stroke();
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Collision
          let hitIdx = -1;
          for (let i = 0; i < enemiesRef.current.length; i++) {
            const e = enemiesRef.current[i];
            const edx = e.x - b.x;
            const edy = e.y - b.y;
            if (Math.sqrt(edx * edx + edy * edy) < e.size * 0.6) {
              hitIdx = i;
              break;
            }
          }
          if (hitIdx >= 0) {
            const e = enemiesRef.current[hitIdx];
            createParticles(e.x, e.y);
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

        // Muzzle flash
        if (shootTimerRef.current <= 2) {
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          const angle = Math.atan2(mouseYRef.current - gunBaseY, mouseXRef.current - gunCX);
          for (let i = 0; i < 3; i++) {
            const a = angle + (Math.random() - 0.5) * 0.5;
            const len = 6 + Math.random() * 8;
            ctx.beginPath();
            ctx.moveTo(gunCX, gunBaseY - 20);
            ctx.lineTo(gunCX + Math.cos(a) * len, gunBaseY - 20 + Math.sin(a) * len);
            ctx.stroke();
          }
        }

        // Draw gun (fixed at bottom center)
        drawGun(ctx, gunCX, H, mouseXRef.current, mouseYRef.current);

        // Crosshair at mouse position
        drawCrosshair(ctx, mouseXRef.current, mouseYRef.current);

        // HUD
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Quicksand, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Score: ${scoreRef.current}`, 16, 16);
        const missed = missedRef.current;
        ctx.fillText(`Lives: ${"●".repeat(Math.max(0, 10 - missed))}${"○".repeat(Math.min(missed, 10))}`, 16, 40);
        const rank = getRank(scoreRef.current);
        ctx.textAlign = "right";
        ctx.fillText(`${rank.emoji} ${rank.label}`, W - 16, 16);
      }

      // Particles (always render)
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

      // Subtle footer
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.font = "12px Quicksand, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("page not found", W / 2, H - 4);

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

      {/* Start screen */}
      {!playing && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-7xl md:text-9xl font-black text-black mb-2" style={{ fontFamily: "Quicksand, sans-serif" }}>404</h1>
          <p className="text-base text-black/50 mb-8" style={{ fontFamily: "Quicksand, sans-serif" }}>This page doesn't exist</p>
          <button
            onClick={startGame}
            className="px-10 py-3 bg-white text-black font-bold text-lg border-2 border-black rounded-none hover:bg-black hover:text-white transition-all duration-200"
            style={{ fontFamily: "Quicksand, sans-serif", cursor: "pointer" }}
          >
            PLAY GAME
          </button>
          {highScore > 0 && (
            <p className="mt-4 text-xs text-black/40">Best: {highScore} {getRank(highScore).emoji} {getRank(highScore).label}</p>
          )}
          <Link to="/" className="mt-6 text-sm text-black/30 underline hover:text-black transition-colors" style={{ cursor: "pointer" }}>
            ← Back to Home
          </Link>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/90" style={{ cursor: "default" }}>
          <h2 className="text-4xl md:text-6xl font-black text-black mb-1" style={{ fontFamily: "Quicksand, sans-serif" }}>GAME OVER</h2>
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
              <Link to="/signup" className="underline" style={{ cursor: "pointer" }}>Sign up</Link> to save scores
            </p>
          )}
          <div className="flex gap-2 flex-wrap justify-center px-4 mb-6">
            {RANKS.map((r) => (
              <div key={r.label} className={`text-center text-[10px] px-2 py-1 border ${score >= r.min ? "border-black text-black" : "border-black/15 text-black/25"}`}>
                <span className="text-sm">{r.emoji}</span>
                <p className="font-semibold">{r.label}</p>
                <p>{r.min}+</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-white text-black font-bold border-2 border-black rounded-none hover:bg-black hover:text-white transition-all duration-200"
              style={{ cursor: "pointer" }}
            >
              PLAY AGAIN
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 bg-white text-black font-bold border-2 border-black rounded-none hover:bg-black hover:text-white transition-all duration-200 flex items-center"
              style={{ cursor: "pointer" }}
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
