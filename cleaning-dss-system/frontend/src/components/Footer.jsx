import React from 'react';
import { 
  ShieldCheck, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  MapPin, 
  Mail,
  ExternalLink,
  Zap,
  Terminal
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-slate-200 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Identity */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <div className="font-black text-xl tracking-tight">
                <span className="text-slate-900">Clean</span>
                <span className="text-cyan-600">Match</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              The premier vendor‑neutral decision support system engineered specifically for the Ugandan industrial cleaning landscape.
            </p>
            
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <MapPin size={14} className="text-cyan-500" />
                <span>Industrial Area, Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Mail size={14} className="text-blue-500" />
                <span>support@cleanmatch.ug</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-6 font-mono">Platform</h4>
            <ul className="space-y-3 text-sm">
              {['Home', 'New Recommendation', 'Training Modules', 'User History'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-cyan-600 transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-px bg-cyan-400 mr-0 group-hover:mr-2 transition-all"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Intelligence */}
          <div>
            <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-6 font-mono">Intelligence</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Local TCO Guide', hot: true },
                { name: 'Chemical Compatibility', hot: false },
                { name: 'URA Duty Calculator', hot: false },
                { name: 'Service Network', hot: false }
              ].map((item) => (
                <li key={item.name} className="flex items-center justify-between group max-w-[180px]">
                  <a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-1">
                    {item.name}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  {item.hot && (
                    <span className="text-[9px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded font-mono font-bold">PDF</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Status */}
          <div className="space-y-6">
            <div>
              <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-6 font-mono">Connect</h4>
              <div className="flex gap-3">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-300">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={14} className="text-cyan-600" />
                <span className="text-[10px] font-mono font-black text-cyan-800 uppercase tracking-widest">system heartbeat</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                "Optimized for national safety standards under industry oversight."
              </p>
              <div className="mt-3 flex items-center gap-2 text-[9px] font-mono text-slate-400">
                <Zap size={10} className="text-amber-500" />
                <span>Active Node: Kampala_01</span>
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                <span>Uptime 99.98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono font-bold tracking-wide text-slate-400">
            © 2026 CLEAN MATCH SYSTEMS — ENGINEERED FOR THE PEARL OF AFRICA.
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-widest">
            <a href="#" className="text-slate-400 hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-800 transition-colors">Terms</a>
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-50 rounded-full text-cyan-700">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              System Live
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;