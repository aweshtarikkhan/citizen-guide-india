import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const RANKS = [
  { min: 0, label: "Noob", emoji: "🐣" },
  { min: 10, label: "Rookie", emoji: "🎯" },
  { min: 25, label: "Amateur", emoji: "⚡" },
  { min: 50, label: "Intermediate", emoji: "🔥" },
  { min: 100, label: "Pro", emoji: "💀" },
  { min: 200, label: "Legend", emoji: "👑" },
];

const getRank = (score: number) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
};

interface FallingObject {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  shape: "circle" | "square" | "triangle" | "diamond" | "star";
  rotation: number;
  rotSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const NotFound = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectsRef = useRef<FallingObject[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [started, setStarted] = useState(false);
  const frameRef = useRef(0);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const difficultyRef = useRef(1);
  const { user } = useAuth();
  const gameOverRef = useRef(false);

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

  const spawnObject = useCallback((canvasW: number) => {
    const shapes: FallingObject["shape"][] = ["circle", "square", "triangle", "diamond", "star"];
    const size = 20 + Math.random() * 25;
    const obj: FallingObject = {
      id: nextIdRef.current++,
      x: size + Math.random() * (canvasW - size * 2),
      y: -size,
      size,
      speed: 1.5 + Math.random() * 2 * difficultyRef.current,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
    };
    objectsRef.current.push(obj);
  }, []);

  const createParticles = (x: number, y: number) => {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
        life: 1,
        size: 2 + Math.random() * 4,
      });
    }
  };

  const drawShape = (ctx: CanvasRenderingContext2D, obj: FallingObject) => {
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.rotation);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "transparent";
    const s = obj.size;

    switch (obj.shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "square":
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(-s / 2, s / 2);
        ctx.lineTo(s / 2, s / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case "diamond":
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(s / 2, 0);
        ctx.lineTo(0, s / 2);
        ctx.lineTo(-s / 2, 0);
        ctx.closePath();
        ctx.stroke();
        break;
      case "star": {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          const ox = Math.cos(outerAngle) * s / 2;
          const oy = Math.sin(outerAngle) * s / 2;
          const ix = Math.cos(innerAngle) * s / 4;
          const iy = Math.sin(innerAngle) * s / 4;
          if (i === 0) ctx.moveTo(ox, oy);
          else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  };

  const handleShoot = useCallback(
    (clientX: number, clientY: number) => {
      if (gameOverRef.current || !started) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);

      let hit = false;
      objectsRef.current = objectsRef.current.filter((obj) => {
        const dx = obj.x - x;
        const dy = obj.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < obj.size) {
          hit = true;
          createParticles(obj.x, obj.y);
          return false;
        }
        return true;
      });

      if (hit) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        difficultyRef.current = 1 + Math.floor(scoreRef.current / 15) * 0.3;
      }
    },
    [started]
  );

  const startGame = useCallback(() => {
    objectsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    missedRef.current = 0;
    difficultyRef.current = 1;
    spawnTimerRef.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const loop = () => {
      if (!running) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Spawn
      spawnTimerRef.current++;
      const spawnRate = Math.max(20, 60 - scoreRef.current);
      if (spawnTimerRef.current >= spawnRate) {
        spawnObject(W);
        spawnTimerRef.current = 0;
      }

      // Update & draw objects
      objectsRef.current = objectsRef.current.filter((obj) => {
        obj.y += obj.speed;
        obj.rotation += obj.rotSpeed;
        drawShape(ctx, obj);

        if (obj.y > H + obj.size) {
          missedRef.current += 1;
          setMissed(missedRef.current);
          if (missedRef.current >= 10) {
            gameOverRef.current = true;
            setGameOver(true);
            void saveScore(scoreRef.current);
          }
          return false;
        }
        return true;
      });

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#000";
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
        return true;
      });

      // Crosshair at center-ish (drawn via CSS cursor)
      // HUD
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Quicksand, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);
      ctx.fillText(`Missed: ${missedRef.current}/10`, 20, 68);

      const rank = getRank(scoreRef.current);
      ctx.textAlign = "right";
      ctx.fillText(`${rank.emoji} ${rank.label}`, W - 20, 40);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [started, gameOver, spawnObject, saveScore]);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onClick = (e: MouseEvent) => handleShoot(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      handleShoot(t.clientX, t.clientY);
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    return () => {
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouch);
    };
  }, [handleShoot]);

  const rank = getRank(score);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden select-none" style={{ cursor: "crosshair" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 404 background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black text-black/5 leading-none select-none">404</span>
      </div>

      {/* Start screen */}
      {!started && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/90">
          <h1 className="text-6xl md:text-8xl font-black text-black mb-2">404</h1>
          <p className="text-lg md:text-xl text-black/60 mb-2 font-medium">Page Not Found</p>
          <p className="text-sm text-black/40 mb-8 max-w-md text-center px-4">
            The page you're looking for doesn't exist. But hey, why not shoot some shapes while you're here?
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-black text-white font-bold text-lg rounded-none border-2 border-black hover:bg-white hover:text-black transition-colors"
          >
            START GAME
          </button>
          {highScore > 0 && (
            <p className="mt-4 text-sm text-black/50">
              Your Best: {highScore} {getRank(highScore).emoji} {getRank(highScore).label}
            </p>
          )}
          <Link to="/" className="mt-6 text-sm text-black/40 underline hover:text-black transition-colors">
            ← Back to Home
          </Link>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/95">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-1">GAME OVER</h2>
          <p className="text-6xl mb-2">{rank.emoji}</p>
          <p className="text-2xl font-bold text-black mb-1">{rank.label}</p>
          <p className="text-lg text-black/60 mb-1">Score: {score}</p>
          {score > highScore - score && user && (
            <p className="text-sm text-black/40 mb-4">
              {score >= highScore ? "🏆 New High Score!" : `Best: ${highScore}`}
            </p>
          )}
          {!user && (
            <p className="text-xs text-black/40 mb-4">
              <Link to="/signup" className="underline">Sign up</Link> to save your scores!
            </p>
          )}
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-black text-white font-bold text-lg rounded-none border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              PLAY AGAIN
            </button>
            <Link
              to="/"
              className="px-8 py-3 bg-white text-black font-bold text-lg rounded-none border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              GO HOME
            </Link>
          </div>

          {/* Rank progression */}
          <div className="mt-8 flex gap-3 flex-wrap justify-center px-4">
            {RANKS.map((r) => (
              <div
                key={r.label}
                className={`text-center text-xs px-3 py-1 border ${
                  score >= r.min ? "border-black text-black" : "border-black/20 text-black/30"
                }`}
              >
                <span className="text-base">{r.emoji}</span>
                <p className="font-semibold">{r.label}</p>
                <p className="text-[10px]">{r.min}+</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFound;
