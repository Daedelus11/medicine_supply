const { useState, useEffect, useRef } = React;
const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

const REALMS = [
    { id: 'Lime', name: 'BELLEAU', theme: 'theme-liyue', icon: '🔶', core: '#fbbf24' },
    { id: 'Ava', name: 'FONTAINE', theme: 'theme-fontaine', icon: '💧', core: '#60a5fa' },
    { id: 'Ash', name: 'BERYL', theme: 'theme-inazuma', icon: '⚡', core: '#a855f7' }
];

const ArtifactScreen = ({ realm, audioReady }) => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState([]);
    const audioRef = useRef(new Audio(plinkUrl));
    const isLowSupply = count <= 2;

    const fetchData = async () => {
        const { data: c } = await supabaseClient.from('medicine_supply').select('value').eq('label', realm.id).single();
        const { data: h } = await supabaseClient.from('medicine_log').select('timestamp, change_type').eq('supply_type', realm.id).order('timestamp', { ascending: false }).limit(3);
        if (c) setCount(c.value);
        if (h) setHistory(h);
    };

    useEffect(() => {
        fetchData();
        const channel = supabaseClient.channel(`realtime-${realm.id}`).on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medicine_supply' }, () => fetchData()
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

    return (
        <div className={`artifact-card w-[90vw] max-w-sm h-[75vh] p-8 rounded-2xl text-center flex flex-col justify-between transition-all ${isLowSupply ? 'border-red-500' : ''}`}>
            <div className="corner tc_l"></div><div className="corner bc_r"></div>

            <div className="flex flex-col items-center">
                <div className="rarity-slot bg-gradient-to-b from-[#d29762] to-[#7d5a3c] border-2 border-[#f9f0d1] w-20 h-20 rounded-br-2xl flex items-center justify-center">
                    <svg width="67" height="67" viewBox="0 0 100 100">
                        <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
                        <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : realm.core} className="animate-pulse" />
                        <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" /><circle cx="50" cy="82" r="6" fill="#f3e5ab" />
                    </svg>
                </div>
                <div className="flex gap-1 mt-2 text-[#f3e5ab] text-xs">★ ★ ★ ★ ★</div>
            </div>

            {/* Enlarged Legendary Supply Title */}
            <h1 className="chiseled-text uppercase tracking-[0.6em] text-[#d4af37] font-black text-sm mt-4">
                LEGENDARY SUPPLY
            </h1>
            
            <div className={`chiseled-text uppercase tracking-widest font-black ${realm.id === 'Ava' ? 'text-[#d4af37] text-base' : 'text-yellow-600/60 text-[11px]'}`}>
                {realm.name} REALM
            </div>

            <div className={`chiseled-text text-[13vh] font-black leading-none tabular-nums my-4 ${isLowSupply ? 'text-red-500' : 'text-white'}`}>
                {count}
            </div>
            
            {/* Enlarged Buttons for phone visibility */}
            <div className="flex justify-center gap-10">
                <button onClick={() => updateCount(count - 1)} className="action-orb w-20 h-20 rounded-full text-4xl font-light">−</button>
                <button onClick={() => updateCount(count + 1)} className="action-orb w-20 h-20 rounded-full text-5xl font-bold">+</button>
            </div>

            {isLowSupply && (
                <div className="mt-4 text-[18.5px] text-red-500 font-black animate-bounce chiseled-text drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                    Ava Wagner Needs Meds!!!
                </div>
            )}

            {/* RESTORED COUNTER LOG */}
            <div className="mt-4 pt-4 border-t border-yellow-600/20 text-left bg-black/40 rounded-b-xl px-4">
                <h2 className="chiseled-text text-[8px] uppercase tracking-[0.3em] text-yellow-600/40 font-bold mb-2 text-center italic">Recent Chronicles</h2>
                {history.map((l, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5 chiseled-text text-[10px] text-yellow-600/80 font-bold uppercase">
                        <span>{l.change_type}</span>
                        <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [currentIdx, setCurrentIdx] = useState(1);
    const [audioReady, setAudioReady] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 60 && currentIdx < 2) setCurrentIdx(currentIdx + 1);
        if (distance < -60 && currentIdx > 0) setCurrentIdx(currentIdx - 1);
        setTouchStart(null); setTouchEnd(null);
    };

    useEffect(() => {
        document.body.className = REALMS[currentIdx].theme;
    }, [currentIdx]);

    return (
        <div 
            onClick={() => setAudioReady(true)} 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="min-h-screen flex flex-col items-center justify-center p-4"
        >
            <ArtifactScreen realm={REALMS[currentIdx]} audioReady={audioReady} />
            
            <div className="flex gap-6 mt-10">
                {REALMS.map((r, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`indicator-dot ${currentIdx === idx ? 'active' : ''}`} />
                        <span className={`chiseled-text text-[8px] font-black ${currentIdx === idx ? 'text-[#d4af37]' : 'text-yellow-600/20'}`}>
                            {r.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
