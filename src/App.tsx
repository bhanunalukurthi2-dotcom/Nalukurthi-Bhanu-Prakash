/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { Gamepad2, Info } from 'lucide-react';

export default function App() {
  return (
    <main id="app-root" className="min-h-screen relative flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-neon-pink/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-neon-blue/20 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 bg-[#050508]/40 backdrop-blur-[100px]" />
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Info & Controls */}
        <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full w-fit">
              <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse shadow-neon-blue" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neon-blue font-bold">System Online</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Neon<br/>
              <span className="text-neon-pink neon-text-pink">Rhythm</span><br/>
              Snake
            </h1>
            <p className="text-white/40 text-sm max-w-[200px] font-mono leading-relaxed">
              Navigate the grid. Feed the pulse. survive the circuit.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border-white/5 space-y-4"
          >
            <div className="flex items-center gap-2 text-neon-blue mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">How to Play</span>
            </div>
            <div className="space-y-4 text-xs font-mono text-white/60">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Move</span>
                <span className="text-white">Arrows</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Pause</span>
                <span className="text-white">Space</span>
              </div>
              <div className="flex flex-col gap-2 mt-4 pt-2">
                <p className="flex items-start gap-2 italic">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  Snake wraps through screen edges. Don't hit yourself!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Game Window */}
        <div className="lg:col-span-12 xl:col-span-6 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Side: Music Player */}
        <div className="lg:col-span-12 xl:col-span-3 order-3 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-20 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.5em] uppercase">Built for the Cyberpunk Arcade</span>
        <div className="h-[1px] w-12 bg-white" />
      </div>
    </main>
  );
}

