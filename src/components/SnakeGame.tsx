import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check self-collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          setIsPaused(false);
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          setIsPaused(false);
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          setIsPaused(false);
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          setIsPaused(false);
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    const speed = Math.max(BASE_SPEED - Math.floor(score / 50) * 10, 80);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00a3ab';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * size + padding,
        segment.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = '#ff007a';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007a';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 2 - 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm tracking-widest">
        <div className="flex flex-col gap-1">
          <span className="text-white/40 uppercase">Score</span>
          <span className="text-neon-blue text-2xl font-bold neon-text-blue">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-white/40 uppercase">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-pink" />
            <span className="text-neon-pink text-2xl font-bold neon-text-pink">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-pink rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg border border-white/10 shadow-2xl overflow-hidden cursor-none"
        />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
            >
              <div className="text-center p-8 glass-panel rounded-2xl border-neon-blue/20">
                {gameOver ? (
                  <>
                    <h2 className="text-4xl font-black text-neon-pink mb-2 neon-text-pink uppercase tracking-tighter italic">Game Over</h2>
                    <p className="text-white/60 mb-6 font-mono text-sm">Final Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 mx-auto px-6 py-3 bg-neon-pink/20 border border-neon-pink rounded-full text-neon-pink hover:bg-neon-pink hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black text-neon-blue mb-4 neon-text-blue uppercase tracking-tighter">Paused</h2>
                    <p className="text-white/60 mb-6 font-mono text-xs">Press ARROWS or SPACE to play</p>
                    <div className="flex gap-4 items-center justify-center">
                      <div className="p-2 border border-white/20 rounded-md text-xs font-mono">ARROWS</div>
                      <span className="text-white/20">TO MOVE</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
