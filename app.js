const { useState, useEffect, useRef } = React;
const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

// 3. Unique Realm Visual Assets
const REALMS = [
    { id: 'Lime', name: 'BELLEAU', theme: 'theme-liyue', corePulse: '#fbbf24', gearType: 'fluid' },
    { id: 'Ava', name: 'FONTAINE', theme: 'theme-fontaine', corePulse: '#60a5fa', gearType: 'industrial' },
    { id: 'Ash', name: 'BERYL', theme: 'theme-inazuma', corePulse: '#a855f7', gearType: 'obsidian' }
];

const SupplyIcon = ({ corePulse, isLowSupply }) => (
    <div className="rarity-slot flex items-center justify-center">
        {/* Preserved Icon, Hydro core color */}
        <svg width="67" height="67" viewBox="0 0 100 100">
            <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
            <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : corePulse} className="animate-pulse" />
            <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" /><circle cx="50" cy="82" r="6" fill="#f3e5ab" />
        </svg>
    </div>
);

const SupplyCounter = ({ realm, audioReady, onSwipe }) => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState([]);
    const audioRef = useRef(new Audio(plinkUrl));
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const isLowSupply = count <= 2;
    const isPrimary = realm.id === 'Ava';

    const fetchData = async () => {
        const { data: c } = await supabaseClient.from('medicine_supply').select('value').eq('label', realm.id).single();
        const { data: h } = await supabaseClient.from('medicine_log').select('timestamp, change_type').eq('supply_type', realm.id).order('timestamp', { ascending: false }).limit(3);
        if (c) setCount(c.value);
        if (h) setHistory(h);
    };

    useEffect(() => {
        fetchData();
        const channel = supabaseClient.channel(`realtime-${realm.id}`).on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medicine_supply', filter: `label=eq.${realm.id}` }, () => fetchData()
        ).subscribe();
        return () => supabaseClient.removeChannel(channel);
    }, [realm.id]);

    const updateCount = async (newVal) => {
        const v = newVal < 0 ? 0 : newVal;
        if (audioReady) { audioRef.current.currentTime = 0; audioRef.current.volume = 0.9; audioRef.current.play(); }
        setCount(v);
        await supabaseClient.from('medicine_supply').update({ value: v }).eq('label', realm.id);
        await supabaseClient.from('medicine_log').insert([{ supply_type: realm.id, change_type: v > count ? 'RESTOCK' : 'CONSUMED', timestamp: new Date().toISOString() }]);
    };

    // Standard Swipe logic
    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 60) onSwipe(1); // Swipe left (next)
        if (distance < -60) onSwipe(-1); // Swipe right (prev)
        setTouchStart(null); setTouchEnd(null);
    };

    return (
        <div 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd}
            className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${realm.theme}`}
        >
            {/* Standard Kinetic Gear background (with unique opacity) */}
            <svg class="gear" style="top: -10%; right: -10%; width: 650px;" viewBox="0 0 100 100">
                <path fill="#d4af37" d="M95,50c0-2.2-1.4-4-3.4-4.8l-4.5-1.8c-0.6-1.9-1.4-3.7-2.5-5.4l2.5-4.2c1.1-1.9,0.7-4.3-1-5.8L78,21c-1.6-1.4-4-1.2-5.4,0.6l-3.2,4.1c-1.8-0.9-3.7-1.6-5.7-2.1l-0.8-4.8c-0.4-2.1-2.2-3.7-4.3-3.7H51.4c-2.1,0-4,1.6-4.3,3.7l-0.8,4.8c-2,0.5-3.9,1.2-5.7,2.1l-3.2-4.1c-1.4-1.8-3.8-2-5.4-0.6L22,28.1c-1.7,1.5-2.1,3.9-1,5.8l2.5,4.2c-1.1,1.7-1.9,3.5-2.5,5.4l-4.5,1.8c-2,0.8-3.4,2.6-3.4,4.8v10c0,2.2,1.4,4,3.4,4.8l4.5,1.8c0.6,1.9,1.4,3.7,2.5,5.4l-2.5,4.2c-1.1,1.9-0.7,4.3,1,5.8L32,79c1.6,1.4,4,1.2,5.4-0.6l3.2-4.1c1.8,0.9,3.7,1.6,5.7,2.1l0.8,4.8c0.4,2.1,2.2,3.7,4.3,3.7h17.1c2.1,0,4-1.6,4.3-3.7l0.8-4.8c2-0.5,3.9-1.2,5.7-2.1l3.2,4.1c1.4,1.8,3.8,2,5.4,0.6L88,71.9c1.7-1.5,2.1-3.9,1-5.8l-2.5-4.2c1.1-1.7,1.9-3.5,2.5-5.4l4.5-1.8c2-0.8,3.4-2.6,3.4-4.8V50z M50,65c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S58.3,65,50,65z"/>
            </svg>

            <div className={`artifact-card w-[90vw] max-w-sm h-[75vh] p-8 rounded-2xl text-center flex flex-col justify-between transition-all ${isLowSupply ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.7)]' : ''}`}>
                <div className="corner tc_l"></div><div className="corner bc_r"></div>

                <div className="flex flex-col items-center">
                    <div className="flex gap-2">
                        {/* 3. BELLEAU/BERYL specific iconography added here if needed */}
                        <SupplyIcon corePulse={realm.corePulse} isLowSupply={isLowSupply} />
                    </div>
                    <div className="flex gap-1 mt-2 text-[#f3e5ab] text-[10px]">★ ★ ★ ★ ★</div>
                </div>

                {/* 2. Larger, Legible "Legendary Supply" title */}
                <h1 className="font-serif uppercase tracking-[0.6em] text-[#d4af37] font-extrabold text-xs mt-4 drop-shadow-[0_0_10px_black]">
                    Legendary Supply
                </h1>
                
                {/* Legibility priorities: Ava larger */}
                <div className={`font-serif tracking-widest uppercase font-black tabular-nums leading-none ${isPrimary ? 'text-[#d4af37] text-base' : 'text-yellow-600/60 text-[11px]'}`}>
                    {realm.name} Realm
                </div>

                <div className={`font-serif text-[13vh] font-black leading-none tabular-nums my-2 ${isLowSupply ? 'text-red-500 drop-shadow-[0_0_20px_#ef4444]' : 'text-white'}`}>
                    {count}
                </div>
                
                {/* 1. Larged Orb Buttons (condensed scaling) */}
                <div className="flex justify-center gap-6 condensed-scaling">
                    <button onClick={() => updateCount(count - 1)} className="action-orb w-20 h-20 rounded-full text-3xl font-light">−</button>
                    <button onClick={() => updateCount(count + 1)} className="action-orb w-20 h-20 rounded-full text-4xl font-bold">+</button>
                </div>

                {/* 18.5px Alert legibility priority */}
                {isLowSupply && isPrimary && (
                    <div className="mt-4 text-[18.5px] text-red-500 font-black animate-bounce font-serif drop-shadow-[0_0_10px_black]">
                        Ava Wagner Needs Meds!!!
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-yellow-600/20 text-left bg-black/40 rounded-b-xl px-4">
                    {history.map((l, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-white/5 font-serif text-[9px] text-yellow-600/80 font-bold uppercase">
                            <span>{l.change_type}</span>
                            <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function App() {
    const [currentIdx, setCurrentIdx] = useState(1); // Default to Fontaine (Ava)
    const [audioReady, setAudioReady] = useState(false);

    const handleSwipe = (direction) => {
        const nextIdx = currentIdx + direction;
        if (nextIdx >= 0 && nextIdx < REALMS.length) {
            setCurrentIdx(nextIdx);
        }
    };

    return (
        <div onClick={() => setAudioReady(true)}>
            <SupplyCounter realm={REALMS[currentIdx]} audioReady={audioReady} onSwipe={handleSwipe} />
            
            {/* indicators retained */}
            <div className="flex gap-4 fixed bottom-12 left-1/2 -translate-x-1/2">
                {REALMS.map((_, idx) => (
                    <div key={idx} className={`indicator-dot ${currentIdx === idx ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
