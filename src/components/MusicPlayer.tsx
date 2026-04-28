/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Echoes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 180
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Synth Queen',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1633545505436-19349886477e?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 210
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Flux Zero',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 155
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-sm bg-black border-2 border-cyan-500 p-0 relative overflow-hidden shadow-[10px_10px_0px_#FF00FF]">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      {/* Header Bar */}
      <div className="bg-cyan-500 text-black px-3 py-1 flex justify-between items-center font-mono text-[10px] uppercase font-bold">
        <span>AUDIO_DECODER_v4.2</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-black animate-pulse" />
          <div className="w-2 h-2 bg-black opacity-40" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-square border-2 border-magenta-500 grayscale brightness-75 contrast-150"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div>
            <h3 className="text-2xl font-mono font-black text-white italic leading-none truncate uppercase tracking-tighter shadow-magenta-500">
              {currentTrack.title}
            </h3>
            <p className="text-magenta-500 font-mono text-xs mt-1 uppercase tracking-widest bg-magenta-500/10 inline-block px-1">
              SRC: {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between font-mono text-[8px] text-cyan-500/60 uppercase">
            <span>BIT_STREAM_POS</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-zinc-900 border border-cyan-900 overflow-hidden relative">
            <motion.div 
              className="h-full bg-cyan-500"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 flex">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-black/20" />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handlePrev}
            className="p-3 text-cyan-500 border border-cyan-500 hover:bg-cyan-500 hover:text-black transition-all active:translate-y-1"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-1 py-3 bg-magenta-500 text-black flex items-center justify-center font-mono font-black uppercase hover:bg-cyan-500 transition-colors glitch-hover"
          >
            {isPlaying ? (
              <span className="flex items-center gap-2"><Pause size={24} /> SUSPEND</span>
            ) : (
              <span className="flex items-center gap-2"><Play size={24} fill="currentColor" /> EXEC_STREAM</span>
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-cyan-500 border border-cyan-500 hover:bg-cyan-500 hover:text-black transition-all active:translate-y-1"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="border-t border-cyan-500/20 px-4 py-2 flex justify-between font-mono text-[8px] text-cyan-500/40 uppercase">
        <span>FREQ: 44.1KHZ</span>
        <span>ENC: FLAC_NULL</span>
        <span>BUF: OK_STATE</span>
      </div>
    </div>
  );
}
