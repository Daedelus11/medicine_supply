const { useState, useEffect, useRef } = React;
const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

const REALMS = [
    { id: 'Lime', name: 'LIYUE', theme: 'theme-liyue', icon: '🔶' },
    { id: 'Ava', name: 'FONTAINE', theme: 'theme-fontaine', icon: '💧' },
    { id: 'Ash', name: 'INAZUMA', theme: 'theme-inazuma', icon: '⚡' }
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
        if (audioReady) { audioRef.current.currentTime = 0; audioRef.current.play(); }
        setCount(v);
        await supabaseClient.from('medicine_supply').update({ value: v }).eq('label', realm.id);
        await supabaseClient.from('medicine_log').insert([{ supply_type: realm.id, change_type: v > count ? 'RESTOCK' : 'CONSUMED' }]);
    };

    return (
        <div className={`artifact-card w-full h-[75vh] max-w-sm p-10 rounded-2xl text-center flex flex-col justify-between ${isLowSupply ? 'border-red-500' : ''}`}>
            <div className="corner tc_l"></div><div className="corner bc_r"></div>

            <div className="flex flex-col items-center">
                <div className="rarity-slot flex items-center justify-center">
                    <svg width="67" height="67" viewBox="0 0 100 100">
                        <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
                        <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : "#60a5fa"} className="animate-pulse" />
                        <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" /><circle cx="50" cy="82" r="6" fill="#f3e5ab" />
                    </svg>
                </div>
                <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => <span key={i} className="star text-[#f3e5ab] text-[14px]">★</span>)}
                </div>
            </div>

            <h1 className="chiseled-text text-[14px] uppercase tracking-[0.6em] text-[#d4af37] font-black mt-4">
                {realm.id === 'Ava' ? "Ava's Legendary Supply" : `${realm.id} Supply`}
            </h1>
            
            <div className={`chiseled-text text-[15vh] font-black leading-none tabular-nums my-4 ${isLowSupply ? 'text-red-500 drop-shadow-[0_0_20px_#ef4444]' : 'text-white'}`}>
                {count}
            </div>
            
            <div className="flex justify-center gap-10">
                <button onClick={() => updateCount(count - 1)} className="action-orb text-3xl font-light">−</button>
                <button onClick={() => updateCount(count + 1)} className="action-orb text-4xl font-bold">+</button>
            </div>

            {isLowSupply && (
                <div className="mt-4 text-[18.5px] text-red-500 font-black animate-bounce chiseled-text drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                    {realm.id === 'Ava' ? "Ava Wagner Needs her Meds!!!" : `${realm.id} Needs a Restock!!!`}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-yellow-600/20 text-left bg-black/40 rounded-b-xl px-4">
                {history.map((l, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5 chiseled-text text-[10px] text-yellow-600/80 font-bold">
                        <span>{l.change_type}</span>
                        <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [currentIdx, setCurrentIdx] = useState(1); // Default to Fontaine (Ava)
    const [audioReady, setAudioReady] = useState(false);

    return (
        <div onClick={() => setAudioReady(true)} className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${REALMS[currentIdx].theme}`}>
            <ArtifactScreen realm={REALMS[currentIdx]} audioReady={audioReady} />

            {/* NAVIGATION BAR */}
            <div className="nav-bar fixed bottom-0 left-0 right-0 flex px-4">
                {REALMS.map((r, idx) => (
                    <button key={r.id} onClick={() => setCurrentIdx(idx)} className={`nav-button ${currentIdx === idx ? 'active' : ''}`}>
                        <span className="text-xl">{r.icon}</span>
                        <span className="chiseled-text text-[10px] tracking-widest font-bold text-[#d4af37]">{r.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
