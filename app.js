const { useState, useEffect, useRef } = React;

// PROJECT CONFIGURATION
const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// AUDIO ASSETS
const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

const SupplyCard = ({ label, audioReady }) => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState([]);
    const audioRef = useRef(new Audio(plinkUrl));
    const isLowSupply = count <= 2;

    const fetchData = async () => {
        const { data: c } = await supabaseClient
            .from('medicine_supply')
            .select('value')
            .eq('label', label)
            .single();
        
        const { data: h } = await supabaseClient
            .from('medicine_log')
            .select('timestamp, change_type')
            .eq('supply_type', label)
            .order('timestamp', { ascending: false })
            .limit(2);

        if (c) setCount(c.value);
        if (h) setHistory(h);
    };

    useEffect(() => {
        fetchData();
        // Listen for realtime updates specifically for this label
        const channel = supabaseClient.channel(`realtime-${label}`).on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medicine_supply' }, 
            () => fetchData()
        ).subscribe();
        
        return () => supabaseClient.removeChannel(channel);
    }, []);

    const updateCount = async (newVal) => {
        const v = newVal < 0 ? 0 : newVal;
        
        // Play subtle plink
        if (audioReady) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.8;
            audioRef.current.play();
        }

        setCount(v);
        await supabaseClient.from('medicine_supply').update({ value: v }).eq('label', label);
        await supabaseClient.from('medicine_log').insert([{ 
            supply_type: label, 
            change_type: v > count ? 'RESTOCK' : 'CONSUMED',
            timestamp: new Date().toISOString()
        }]);
    };

    return (
        <div className={`artifact-card p-4 rounded-xl text-center flex flex-col justify-between transition-all duration-500 ${isLowSupply ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : ''}`}>
            {/* TWO CORNER GEOMETRY */}
            <div className="corner tc_l"></div>
            <div className="corner bc_r"></div>

            <div className="flex flex-col items-center">
                <div className="rarity-slot flex items-center justify-center">
                    {/* MAXIMIZED ICON (+20%) */}
                    <svg width="67" height="67" viewBox="0 0 100 100">
                        <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
                        <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : "#60a5fa"} className="animate-pulse" />
                        <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" />
                        <circle cx="50" cy="82" r="6" fill="#f3e5ab" />
                    </svg>
                </div>
                <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <span key={i} className="star text-[#f3e5ab]">★</span>)}
                </div>
            </div>

            {/* LEGIBILITY UPGRADE */}
            <h1 className="chiseled-text text-[11px] uppercase tracking-[0.5em] text-[#d4af37] mt-3 font-black">
                {label}
            </h1>
            
            {/* DYNAMIC SCALE NUMBER (13vh) */}
            <div className={`chiseled-text text-[11vh] font-black leading-none tabular-nums my-2 ${isLowSupply ? 'text-red-500' : 'text-white'}`}>
                {count}
            </div>
            
            {/* TACTILE BUTTONS */}
            <div className="flex justify-center gap-6">
                <button onClick={() => updateCount(count - 1)} className="action-orb text-2xl">−</button>
                <button onClick={() => updateCount(count + 1)} className="action-orb text-3xl">+</button>
            </div>

            {/* NOTIFICATION (+15% SIZE) */}
            {isLowSupply && (
                <div className="mt-2 text-[14px] text-red-500 font-black animate-bounce chiseled-text leading-tight">
                    Ava Wagner Needs Meds!!!
                </div>
            )}

            {/* CHRONICLE LOG */}
            <div className="mt-2 pt-2 border-t border-yellow-600/10 text-left bg-black/40 px-2 rounded-b-lg">
                {history.map((l, i) => (
                    <div key={i} className="flex justify-between text-[8px] text-yellow-600/60 font-bold uppercase py-1 border-b border-white/5">
                        <span>{l.change_type}</span>
                        <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [audioReady, setAudioReady] = useState(false);
    return (
        <div onClick={() => setAudioReady(true)} className="flex flex-row gap-6 w-full h-full p-4">
            {['Ash', 'A', 'Lime'].map(label => (
                <SupplyCard key={label} label={label} audioReady={audioReady} />
            ))}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
