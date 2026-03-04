import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Get these from Project Settings > API in your Daedelus11 project
const supabase = createClient(https://mrhgitbdobfnelnulnbg.supabase.co, sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh);

const themes = {
  liyue: { name: 'Liyue', bg: 'bg-[#ECE5D8]', border: 'border-[#D3BC8E]', text: 'text-[#5C4D32]', btn: 'bg-[#D3BC8E] text-[#1A1C24]', card: 'bg-[#1A1C24]/90' },
  inazuma: { name: 'Inazuma', bg: 'bg-[#1A1C24]', border: 'border-[#8168B1]', text: 'text-[#E0D7F0]', btn: 'bg-[#8168B1] text-white', card: 'bg-[#0F1014]/95' },
  fontaine: { name: 'Fontaine', bg: 'bg-[#D9E6EF]', border: 'border-[#5B99C2]', text: 'text-[#1E3A5F]', btn: 'bg-[#5B99C2] text-white', card: 'bg-[#FFFFFF]/80' }
};

export default function SharedSupplyLog() {
  const [count, setCount] = useState(0);
  const [activeTheme, setActiveTheme] = useState('liyue');
  const t = themes[activeTheme];

  useEffect(() => {
    // 1. Initial Data Fetch
    const getInitialData = async () => {
      const { data } = await supabase.from('medicine_supply').select('value').eq('label', 'cartridge_count').single();
      if (data) setCount(data.value);
    };
    getInitialData();

    // 2. Realtime Sync (The "Magic" part)
    const channel = supabase.channel('table_db_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'medicine_supply' }, 
      (payload) => {
        setCount(payload.new.value); // Updates instantly when Mom or Dad clicks a button
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updateCount = async (newValue) => {
    setCount(newValue); // Fast local update
    await supabase.from('medicine_supply').update({ value: newValue }).eq('label', 'cartridge_count');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all ${t.bg} p-6 font-serif`}>
      <div className={`w-full max-w-sm p-8 rounded-xl border-2 ${t.border} ${t.card} backdrop-blur-lg shadow-2xl relative`}>
        <h1 className={`text-center text-[10px] uppercase tracking-[0.3em] mb-10 opacity-60 ${t.text}`}>Cartridge Supply Log</h1>
        
        <div className="flex flex-col items-center gap-12">
          <div className={`text-9xl font-bold tracking-tighter drop-shadow-sm ${t.text}`}>{count}</div>
          <div className="flex justify-between w-full px-4">
            <button onClick={() => updateCount(count - 1)} className={`w-20 h-20 rounded-full border-2 ${t.border} text-4xl ${t.text}`}>–</button>
            <button onClick={() => updateCount(count + 1)} className={`w-20 h-20 rounded-full shadow-xl text-4xl ${t.btn}`}>+</button>
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-4">
          {Object.keys(themes).map(key => (
            <button key={key} onClick={() => setActiveTheme(key)} className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${activeTheme === key ? `${t.border} opacity-100` : 'border-transparent opacity-30'}`}>
              {themes[key].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}