import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle, ArrowRight, Zap, TrendingUp, TrendingDown, Check, AlertTriangle, Sliders, Layers, FileText, Activity } from 'lucide-react';

export default function DocsTab() {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="clean-card p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-[#C2856A]/15 text-[#C2856A] rounded-2xl border border-[#C2856A]/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2C3218] tracking-tight">How the Data Watcher Works</h2>
            <p className="text-xs text-[#786C5A]">A simple, friendly guide to understanding how unusual events get caught</p>
          </div>
        </div>

        <p className="text-sm text-[#2C3218] leading-relaxed bg-[#FAF6F0] p-4 rounded-xl border border-[#DCC8B2]">
          Think of this app as your business security guard for spreadsheets. When you upload a file, the app looks back at recent days to see what is normal for your store. If today's number jumps or drops way out of line, the app flags it as unusual, explains why in plain words, and alerts your team right away.
        </p>
      </div>

      {/* SECTION 1: Everyday Examples of How Events Get Flagged */}
      <div className="clean-card p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C3218] tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C2856A]" />
            <span>1. Real Examples from car_sales.csv: What Gets Flagged and Why</span>
          </h3>
          <p className="text-xs text-[#786C5A] mt-1">Here is how the app decides what counts as a normal day vs. an unusual event using real dealership data.</p>
        </div>

        {/* Badge Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-md inline-block">
              SPIKE HIGH
            </span>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Means the number <strong>jumped way higher</strong> than what is normal for recent days.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-1">
            <span className="px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-300 font-bold text-xs rounded-md inline-block">
              DROP LOW
            </span>
            <p className="text-xs text-red-900 leading-relaxed font-medium">
              Means the number <strong>fell way lower</strong> than what is normal for recent days.
            </p>
          </div>
        </div>

        {/* Worked Examples Cards from car_sales.csv */}
        <div className="space-y-4">
          {/* Example 1: Units Sold & Revenue Spike */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3218]">Example 1: Units Sold & Revenue Spike</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-md">SPIKE HIGH</span>
            </div>
            <p className="text-xs text-[#2C3218] leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-[#DCC8B2]">
              "On <strong>2026-08-09</strong>, <strong>units_sold</strong> jumped to <strong>19 cars</strong> (generating <strong>$437,000</strong> in revenue), far above the typical <strong>6–7 cars</strong> ($150,000–$180,000) expected. Since sales nearly tripled the recent 7-day baseline, the app flagged it as <strong className="text-emerald-700">SPIKE HIGH</strong>."
            </p>
          </div>

          {/* Example 2: Test Drives Surge */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3218]">Example 2: Test Drives Surge</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-md">SPIKE HIGH</span>
            </div>
            <p className="text-xs text-[#2C3218] leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-[#DCC8B2]">
              "On <strong>2026-08-21</strong>, customer <strong>test_drives</strong> surged to <strong>31 test drives</strong>, compared to the usual <strong>13–15 test drives</strong>. With customer interest spiking sharply, the app flagged it as <strong className="text-emerald-700">SPIKE HIGH</strong>."
            </p>
          </div>

          {/* Example 3: Units Sold Drop */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3218]">Example 3: Low Sales Day</span>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-300 font-bold text-[11px] rounded-md">DROP LOW</span>
            </div>
            <p className="text-xs text-[#2C3218] leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-[#DCC8B2]">
              "On <strong>2026-08-16</strong>, <strong>units_sold</strong> dropped down to <strong>1 car</strong> ($90,052 revenue), significantly below the expected baseline of <strong>6–7 cars</strong>. Because this drop was far below normal daily wobble, the app flagged it as <strong className="text-red-700">DROP LOW</strong>."
            </p>
          </div>

          {/* Example 4: Normal Sales Day (Not Flagged) */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3218]">Example 4: Regular Sales Day (Normal Wobble)</span>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] rounded-md">NOT FLAGGED</span>
            </div>
            <p className="text-xs text-[#2C3218] leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-[#DCC8B2]">
              "On <strong>2026-08-05</strong>, the dealership sold <strong>7 cars</strong> ($155,162 revenue) with <strong>18 test drives</strong>. Since this falls right within normal expected day-to-day variation, the app correctly left it <strong className="text-slate-700">NOT FLAGGED</strong> to avoid unnecessary notifications."
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: How the Logic Works in Everyday Language */}
      <div className="clean-card p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C3218] tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#667035]" />
            <span>2. How the App Thinks in Everyday Language</span>
          </h3>
          <p className="text-xs text-[#786C5A] mt-1">Simple answers to how the app measures what is normal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Concept A: What is Normal Bounce / Standard Deviation */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <h4 className="text-xs font-bold text-[#667035] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#667035]" />
              <span>What is Normal Bounce?</span>
            </h4>
            <p className="text-xs text-[#2C3218] leading-relaxed">
              Every business number naturally bobs up and down a little bit each day. We look at recent days to measure how much a metric usually bobs around. Today's number is only flagged if it jumps far outside that expected bounce area.
            </p>
          </div>

          {/* Concept B: Why Recent History */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <h4 className="text-xs font-bold text-[#C2856A] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#C2856A]" />
              <span>Why Look at Recent Days?</span>
            </h4>
            <p className="text-xs text-[#2C3218] leading-relaxed">
              Businesses grow and seasons change. Comparing today's sales against numbers from 3 years ago would be misleading. By looking at the <strong>last 7 days</strong>, the app adapts to your store's current pace.
            </p>
          </div>

          {/* Concept C: Why Bounce Context Matters */}
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2] space-y-2">
            <h4 className="text-xs font-bold text-[#96543A] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#96543A]" />
              <span>Why Average Alone Isn't Enough</span>
            </h4>
            <p className="text-xs text-[#2C3218] leading-relaxed">
              An average tells you what a typical day looks like, but it doesn't tell you how calm or wild that number usually is. Adding the normal bounce range tells us whether a change is just a minor wobble or a real surprise.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Sensitivity Settings Explained */}
      <div className="clean-card p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C3218] tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C2856A]" />
            <span>3. Adjusting the Surprise Sensitivity Slider</span>
          </h3>
          <p className="text-xs text-[#786C5A] mt-1">Control how strict or relaxed your alarm guard should be.</p>
        </div>

        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#DCC8B2] space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#DCC8B2] space-y-2">
            <h4 className="text-xs font-bold text-[#2C3218] flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C2856A] text-white text-[11px] font-bold rounded-md">Standard Setting</span>
              <span>Why is the default setting recommended for most stores?</span>
            </h4>
            <p className="text-xs text-[#2C3218] leading-relaxed">
              The standard setting strikes a comfortable middle ground. It is strict enough to catch real operational problems, but relaxed enough to ignore ~95% of ordinary daily wobbles so your inbox isn't flooded with false alarms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#DCC8B2] space-y-1.5">
              <h5 className="text-xs font-bold text-[#667035] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> High Sensitivity (Slider Right)
              </h5>
              <p className="text-xs text-[#786C5A] leading-relaxed">
                Catches smaller, subtle changes. Best for strict daily quality audits, but produces more warnings and potential false alarms.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DCC8B2] space-y-1.5">
              <h5 className="text-xs font-bold text-[#C2856A] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Low Sensitivity (Slider Left)
              </h5>
              <p className="text-xs text-[#786C5A] leading-relaxed">
                Only flags major emergencies and huge crises. Great for high-level executive monitoring, but might miss smaller early warnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
