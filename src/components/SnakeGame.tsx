/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameStatus, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame({ 
  onScoreChange, 
  status, 
  onStatusChange 
}: { 
  onScoreChange: (score: number) => void;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const lastUpdate = useRef(0);
  const nextDirection = useRef<Point>({ x: 0, y: -1 });

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    const newFood = generateFood([{ x: 10, y: 10 }]);
    setFood(newFood);
    setDirection({ x: 0, y: -1 });
    nextDirection.current = { x: 0, y: -1 };
    setScore(0);
    setSpeed(INITIAL_SPEED);
    onScoreChange(0);
  }, [generateFood, onScoreChange]);

  useEffect(() => {
    if (status === 'playing' && score === 0 && snake.length === 1) {
      // Game started or restarted
    }
  }, [status, score, snake.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y !== -1) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x !== -1) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, direction]);

  const update = useCallback((time: number) => {
    if (status !== 'playing') return;

    if (time - lastUpdate.current > speed) {
      lastUpdate.current = time;
      setDirection(nextDirection.current);

      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: (head.x + nextDirection.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.current.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision with self
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          onStatusChange('gameover');
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            onScoreChange(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
          setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    requestAnimationFrame(update);
  }, [status, speed, food, generateFood, onScoreChange, onStatusChange]);

  useEffect(() => {
    if (status === 'playing') {
      const id = requestAnimationFrame(update);
      return () => cancelAnimationFrame(id);
    }
  }, [status, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#220022';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00FFFF' : '#00AAAA';
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = '#00FFFF';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      
      // Screen tear effect on head
      if (isHead && Math.random() > 0.9) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(
          (segment.x + (Math.random() - 0.5)) * cellSize,
          segment.y * cellSize,
          cellSize,
          2
        );
      }
    });

    // Draw food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF00FF';
    ctx.fillRect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );
  }, [snake, food]);

  return (
    <div className="relative group p-1 bg-magenta-500/20 border-2 border-magenta-500 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="cursor-none grayscale-[0.2] contrast-[1.2]"
      />
      
      {status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
          <h2 className="text-6xl font-mono text-cyan-400 mb-8 tracking-[-0.1em] italic uppercase animate-pulse">
            INIT_STREAK
          </h2>
          <button
            onClick={() => {
              resetGame();
              onStatusChange('playing');
            }}
            className="px-10 py-4 bg-cyan-500 text-black font-black uppercase tracking-tighter hover:bg-magenta-500 hover:text-white transition-all transform hover:skew-x-[-12deg] active:scale-95 glitch-hover border-4 border-cyan-300"
          >
            EXECUTE_LINK
          </button>
        </div>
      )}

      {status === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-magenta-900/90 backdrop-blur-md">
          <h2 className="text-5xl font-mono text-white mb-2 tracking-tighter uppercase font-black italic">
            KERN_PANIC
          </h2>
          <p className="text-black bg-cyan-400 px-4 py-1 mb-10 font-mono font-bold">SEGMENTATION_FAULT: {score}</p>
          <button
            onClick={() => {
              resetGame();
              onStatusChange('playing');
            }}
            className="px-10 py-4 bg-black text-white font-black uppercase tracking-tighter border-4 border-white hover:bg-white hover:text-black transition-all transform hover:skew-x-[12deg] glitch-hover"
          >
            RESTORE_STATE
          </button>
        </div>
      )}

      {status === 'paused' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-900/40 backdrop-blur-[2px]">
          <h2 className="text-4xl font-mono text-cyan-400 mb-6 tracking-tighter uppercase">
            SYNC_HALTED
          </h2>
          <button
            onClick={() => onStatusChange('playing')}
            className="px-8 py-3 bg-cyan-400 text-black font-black uppercase tracking-tighter border-2 border-white hover:skew-x-[-10deg] transition-transform"
          >
            RESUME_THREAD
          </button>
        </div>
      )}
    </div>
  );
}
