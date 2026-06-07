/**
 * Footer.jsx
 * 
 * Production footer component for Clean Match DSS.
 * 
 * Features:
 * - Structured corporate directory and platform layout
 * - Verified regulatory and regional compliance declarations
 * - Localized support coordinates for the East African region
 * - Unified design accents that avoid artificial tech jargon
 */

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
  FileSpreadsheet,
  CheckCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white border-t border-slate-200 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Identity & Location Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck size={18} strokeWidth={2} />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-900">
                Clean<span className="text-blue-600">Match</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs font-medium">
              The premier vendor-neutral decision support platform providing structured inventory modeling for Ugandan commercial cleaning enterprises.
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                <MapPin size={14} className="text-slate-400" />
                <span>Industrial Area, Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                <Mail size={14} className="text-slate-400" />
                <span>support@cleanmatch.ug</span>
              </div>
            </div>
          </div>

          {/* Platform Directory Navigation */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-5">Platform Portal</h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { name: 'System Home', href: '/' },
                { name: 'Equipment Matcher', href: '/machine-type' },
                { name: 'Operator Guidelines', href: '/training' },
                { name: 'Procurement Logs', href: '/history' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Resource Integration */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-5">Operational Resources</h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { name: 'Local TCO Evaluation Manual', format: 'PDF' },
                { name: 'Surface Detergent Guidelines', format: 'DOC' },
                { name: 'Logistics Costs & Taxes', format: 'API' },
                { name: 'Authorized Supplier Registry', format: 'LIST' }
              ].map((item) => (
                <li key={item.name} className="flex items-center justify-between group max-w-[220px]">
                  <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                    {item.name}
                    <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    {item.format}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Panel & Disclaimers */}
          <div className="space-y-5">
            <div>
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Corporate Accounts</h4>
              <div className="flex gap-2">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Data Verification Note</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Equipment specifications, maintenance estimates, and cost mappings are regularly audited to match active Ugandan market baselines.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <CheckCircle size={12} className="text-emerald-600" />
                <span>Verified Baseline: Kampala Metro</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Professional Utility Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">
            © 2026 Clean Match DSS. Strategic facility engineering resources for East Africa.
          </div>
          
          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-md text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Inventory Feeds Connected
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;