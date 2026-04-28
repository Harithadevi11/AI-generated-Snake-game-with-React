/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Activity, Terminal } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { GameStatus } from './types';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-sans selection:bg-magenta-500 selection:text-white overflow-hidden flex flex-col relative text-[14px]">
      {/* Visual Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 scanline opacity-30" />
      <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-5" />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[#0a000a] [background-image:radial-gradient(#ff00ff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Main Header */}
      <header className="relative z-10 p-4 flex justify-between items-center border-b-2 border-magenta-500 bg-black shadow-[0_5px_20px_rgba(255,0,255,0.15)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-magenta-500 flex items-center justify-center text-black font-black text-2xl skew-x-[-10deg] glitch-hover">
            NG
          </div>
          <div>
            <h1 className="text-3xl font-mono font-black uppercase tracking-[-0.1em] italic leading-none">
              NEON_GROOVE<span className="text-magenta-500">_SYSTEM</span>
            </h1>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-[8px] bg-cyan-950 px-1 font-bold text-cyan-500 border border-cyan-800">KERNEL_VER_1.0.4RC</span>
              <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div 
                  animate={{ x: [-100, 100] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
                  className="h-full w-1/3 bg-magenta-500 shadow-[0_0_8px_#ff00ff]" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-10">
          <div className="text-right">
            <p className="text-[10px] text-magenta-500 uppercase font-bold tracking-widest leading-none mb-1">DATA_UPLINK</p>
            <p className="text-sm font-mono uppercase leading-none truncate max-w-[120px]">ASIA_BACKBONE</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cyan-700 uppercase font-bold tracking-widest leading-none mb-1">SEC_PROTOCOL</p>
            <p className="text-sm font-mono uppercase leading-none">ROOT_ACCESS</p>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 relative z-10 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-[1600px] mx-auto w-full">
        
        {/* Left Side: Telemetry */}
        <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full border-l-4 border-magenta-500 pl-6 py-6 bg-magenta-500/5 backdrop-blur-sm"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-magenta-500 mb-8 flex items-center gap-2">
              <Trophy size={14} /> LINK_SCORE_BUFFER
            </h2>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] text-cyan-900 uppercase mb-2 font-black tracking-widest">ACTIVE_PAYLOAD</p>
                <p className="text-7xl font-mono font-black text-cyan-400 tracking-[-0.05em] leading-none [text-shadow:0_0_15px_rgba(0,255,255,0.3)]">
                  {score.toString().padStart(4, '0')}
                </p>
              </div>
              <div className="w-full h-px bg-magenta-900/30" />
              <div>
                <p className="text-[10px] text-magenta-900 uppercase mb-2 font-black tracking-widest">PEAK_BUFFER</p>
                <p className="text-4xl font-mono font-black text-magenta-600 leading-none italic">
                  {highScore.toString().padStart(4, '0')}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="w-full border border-cyan-900/30 p-4 bg-black/40">
            <h2 className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest mb-4">I/O_MAPPING</h2>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              {['V_NORTH', 'V_SOUTH', 'V_WEST', 'V_EAST'].map((label, i) => (
                <div key={label} className={`p-2 border ${i % 2 === 0 ? 'border-magenta-500 text-magenta-500' : 'border-cyan-500 text-cyan-500'} flex justify-between items-center skew-x-[-5deg]`}>
                  <span>{label}</span>
                  <div className={`w-1 h-1 ${i % 2 === 0 ? 'bg-magenta-500' : 'bg-cyan-500'} animate-pulse`} />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: The Neural Grid */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative group">
            {/* HUD Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <SnakeGame 
              onScoreChange={handleScoreChange} 
              status={gameStatus} 
              onStatusChange={setGameStatus}
            />
            
            {/* Grid Status Text */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between font-mono text-[8px] text-cyan-900 uppercase">
              <span>SCAN_DEPTH: 0.0042</span>
              <span>PARITY_CHECK: PASS</span>
            </div>
          </div>
          
          <div className="mt-16 flex gap-6">
            {(gameStatus === 'playing' || gameStatus === 'paused') && (
              <button 
                onClick={() => setGameStatus(gameStatus === 'playing' ? 'paused' : 'playing')}
                className="group relative px-8 py-2 bg-black overflow-hidden border-2 border-cyan-500"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                <span className="relative z-10 font-mono font-black text-[10px] text-cyan-500 group-hover:text-black transition-colors uppercase italic tracking-tighter">
                  {gameStatus === 'paused' ? 'RESUME_SYNC' : 'BREAK_THREAD'}
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Right Side: Audio Coprocessor */}
        <aside className="lg:col-span-3 flex flex-col items-center lg:items-end gap-12 order-3">
          <MusicPlayer />

          <div className="w-full bg-black border-2 border-cyan-950 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 scanline" />
            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Terminal size={14} /> NEURAL_PROCESS_VIZ
            </h2>
            <div className="flex items-end gap-1 h-20">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: gameStatus === 'playing' ? [5, 60, 20, 80, 5] : (i % 2 === 0 ? 40 : 10),
                    backgroundColor: gameStatus === 'playing' ? ['#06b6d4', '#ff00ff', '#06b6d4'] : '#083344'
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.2 + (i * 0.03), 
                    ease: "linear"
                  }}
                  className="flex-1 min-w-[2px]"
                />
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer System Tray */}
      <footer className="relative z-10 border-t-2 border-cyan-900 bg-black px-6 py-3 flex flex-col md:flex-row justify-between items-center text-[9px] font-mono font-bold text-cyan-900 uppercase tracking-widest">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span>IO_LINK: ACTIVE</span>
          </div>
          <span>LOAD: <span className="text-cyan-700">0.024ms</span></span>
          <span className="hidden sm:inline">BUFFER: <span className="text-magenta-900">OVERFLOW_SHIELD_ON</span></span>
        </div>
        <div className="mt-3 md:mt-0 opacity-40">
          [ 1982-202X // GLOBAL_GRID_UPLINK // LOG_END ]
        </div>
      </footer>
    </div>
  );
}
