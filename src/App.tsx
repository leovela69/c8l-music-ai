import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Mic2, 
  Music, 
  Video, 
  Sparkles, 
  Play, 
  Settings, 
  PenTool, 
  Terminal,
  Trophy,
  ArrowRight,
  Download,
  Share2,
  Layers,
  History,
  LayoutDashboard,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

// --- COMPONENTES DE PÁGINA ---

const Home = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12"
  >
    <header className="space-y-4 relative">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      <h1 className="text-display text-8xl tracking-tighter uppercase font-black leading-none">
        ESTUDIO <span className="text-fuchsia-600 drop-shadow-[0_0_30px_rgba(192,38,211,0.5)]">PREMIUM</span>
      </h1>
      <p className="text-white/40 text-xl tracking-[0.2em] uppercase font-bold pl-2 flex items-center gap-4">
        <div className="w-12 h-[2px] bg-fuchsia-600" />
        Selecciona tu herramienta de producción musical
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProductCard 
        to="/studio"
        icon={<Video className="w-12 h-12" />}
        title="AI VIDEOCLIP"
        desc="Generación One-Image-To-Video con Sincronización Labial y motor Veo v2."
        color="bg-fuchsia-600"
      />
      <ProductCard 
        to="/community"
        icon={<Trophy className="w-12 h-12" />}
        title="BARÓMETRO CUÁNTICO"
        desc="Hub de Comunidad: Rankings en tiempo real, Viralidad y Monetización."
        color="bg-amber-500"
      />
      <ProductCard 
        to="/ghostwriter"
        icon={<PenTool className="w-12 h-12" />}
        title="GHOSTWRITER V4"
        desc="Composición asistida con Negative Prompt Shield y el Sello Leo Vela."
        color="bg-blue-600"
      />
      <ProductCard 
        to="/producer"
        icon={<Terminal className="w-12 h-12" />}
        title="STUDIO PRO"
        desc="Desglosado de Stems, Re-Mix dinámico y Masterización Industrial."
        color="bg-white/10"
      />
    </div>
  </motion.div>
);

const GhostwriterPage = () => {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('Bolero-House');
  const [negativePrompt, setNegativePrompt] = useState('Baja calidad, robótico, amateur, ruidos');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useLeoVelaOutro, setUseLeoVelaOutro] = useState(true);

  const handleRefine = async () => {
    if (!lyrics) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/ghostwriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, style, negativePrompt, useLeoVelaOutro })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (e) {
      setResult({
        refinedLyrics: "(VERSO 1)\nEn el silencio de la noche eterna\nC8L brilla como luz de taberna\n\n(ESTRIBILLO)\nRitmo cuántico, rima espacial\nProducción de nivel mundial." + (useLeoVelaOutro ? "\n\n(OUTRO)\nY vivieron felices... Porque nosotros quisimos." : ""),
        stylePrompt: "High-end Bolero-House, ukelele brillante, silbido icónico, bajo 808 seda, 115 BPM.",
        metadata: { bpm: 115, key: "A menor", instruments: ["Ukelele", "Silbido", "Silk Bass"] },
        producerNotes: "Añadir brillo en los 12kHz para el silbido."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h2 className="text-display text-5xl uppercase font-black tracking-tighter">GHOSTWRITER <span className="text-blue-500 italic">V4</span></h2>
        <div className="flex gap-4">
          <select value={style} onChange={e => setStyle(e.target.value)} className="bg-white/5 border border-white/20 p-2 text-xs font-bold uppercase outline-none focus:border-blue-500">
            <option>Bolero-House</option>
            <option>Reggae-Seda</option>
            <option>Quantum-Industrial</option>
            <option>Trap-Espacial</option>
          </select>
          <div className="flex items-center gap-2 bg-fuchsia-600/20 px-4 py-2 border border-fuchsia-500/50">
            <span className="text-[10px] font-black uppercase tracking-tighter">Sello Leo Vela</span>
            <input type="checkbox" checked={useLeoVelaOutro} onChange={e => setUseLeoVelaOutro(e.target.checked)} className="accent-fuchsia-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Idea de Letra / Concepto</label>
            <textarea 
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="w-full h-64 bg-white/5 border-2 border-white/10 p-6 text-lg focus:border-blue-500 outline-none transition-all resize-none font-medium"
              placeholder="Escribe tu idea aquí... Ej: Un bolero sobre la soledad en Marte."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em] flex justify-between">
              NEGATIVE PROMPT SHIELD
              <span className="text-[8px] opacity-50">PROTECCIÓN ACTIVA</span>
            </label>
            <input 
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="w-full bg-red-500/5 border border-red-500/20 p-3 text-xs font-mono text-red-400 outline-none"
            />
          </div>
          <button onClick={handleRefine} disabled={loading} className="btn-brutal w-full !bg-blue-600 disabled:opacity-50">
            {loading ? 'PROCESANDO OMNI-PROTOCOLO...' : 'REFINAR LÍRICA MAESTRA'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Resultado del Barómetro Cuántico</label>
            <div className="w-full h-80 bg-black border-2 border-white/5 p-8 text-xl text-blue-400 overflow-y-auto font-bold whitespace-pre-wrap shadow-inner custom-scrollbar relative">
              {result ? (
                <div className="relative">
                  {result.refinedLyrics}
                  {useLeoVelaOutro && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 pt-6 border-t border-fuchsia-500/30 text-fuchsia-500 italic"
                    >
                      (OUTRO)
                      <br />
                      Y vivieron felices... Porque nosotros quisimos.
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest bg-fuchsia-500 text-black inline-block px-2 py-0.5 shadow-[0_0_10px_rgba(217,70,239,0.5)]">SELLO LEO VELA</div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/10 uppercase tracking-widest text-sm italic">
                  Esperando entrada del Generador Core...
                </div>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white/5 border border-white/10 space-y-4"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-fuchsia-500 uppercase italic">STYLE PROMPT (MOTOR DE AUDIO)</span>
                  <div className="flex gap-2 text-[10px] font-mono opacity-50">
                    <span>{result.metadata.bpm} BPM</span>
                    <span>{result.metadata.key}</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-white/60 leading-relaxed italic">"{result.stylePrompt}"</p>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.instruments.map((inst: string) => (
                    <span key={inst} className="px-2 py-1 bg-white/10 text-[8px] font-black uppercase tracking-tighter border border-white/10">{inst}</span>
                  ))}
                </div>
                <div className="pt-4 flex gap-4">
                  <button className="flex-1 bg-blue-600/20 border border-blue-500/50 text-[10px] font-black py-3 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                    COPIAR AL PORTAPAPELES
                  </button>
                  <button className="flex-1 bg-white/10 border border-white/20 text-[10px] font-black py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    DESCARGAR TXT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StudioPage = () => {
  const [status, setStatus] = useState('ESPERANDO CONCEPTO');
  const [pumping, setPumping] = useState(1);
  const [mode, setMode] = useState('One-Image-To-Video');
  const [loading, setLoading] = useState(false);
  const [videoGenerated, setVideoGenerated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status.includes('GENERANDO') || status.includes('ACTIVE')) {
        setPumping(1 + Math.random() * 0.1);
      } else {
        setPumping(1);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [status]);

  const handleMaster = () => {
    setLoading(true);
    setStatus('GENERANDO CINEMÁTICA VEO...');
    setTimeout(() => {
      setLoading(false);
      setVideoGenerated(true);
      setStatus('REPRODUCTOR REACTIVO ACTIVO');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h2 className="text-display text-5xl italic tracking-tighter uppercase font-black">STUDIO <span className="text-fuchsia-600">VEO / RUNWAY</span></h2>
        <div className="flex gap-2">
          <button onClick={() => setMode('One-Image-To-Video')} className={`px-4 py-2 text-[10px] font-black border transition-all ${mode === 'One-Image-To-Video' ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500' : 'border-white/10 text-white/40'}`}>IMAGE-TO-VIDEO</button>
          <button onClick={() => setMode('Lip-Sync')} className={`px-4 py-2 text-[10px] font-black border transition-all ${mode === 'Lip-Sync' ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500' : 'border-white/10 text-white/40'}`}>LIP-SYNC PRO</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 relative aspect-video bg-black border-4 border-white/10 overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          <motion.div 
            animate={{ scale: pumping }}
            className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-all duration-1000 ${videoGenerated ? 'grayscale-0' : 'grayscale opacity-30'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_40px_rgba(217,70,239,0.3)]" />
                  <span className="text-display text-4xl mb-2 tracking-tighter uppercase animate-pulse">{status}</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  className="flex flex-col items-center"
                >
                  <div className={`w-24 h-24 border-2 ${videoGenerated ? 'border-fuchsia-500' : 'border-white/20'} rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(217,70,239,0.2)] bg-black/50 backdrop-blur-md cursor-pointer hover:scale-110 transition-transform`}>
                    <Play className={`w-10 h-10 ${videoGenerated ? 'text-fuchsia-500 fill-fuchsia-500' : 'text-white/20'}`} />
                  </div>
                  <span className="text-display text-4xl mb-2 tracking-tighter uppercase">{status}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {videoGenerated && (
              <div className="flex gap-4 items-center mt-4">
                 <div className="h-1 w-24 bg-white/10 overflow-hidden"><motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full w-1/2 bg-fuchsia-600" /></div>
                 <p className="text-fuchsia-500/80 text-[10px] font-black tracking-[0.4em] uppercase italic">Audio Reactivity Engine Active</p>
                 <div className="h-1 w-24 bg-white/10 overflow-hidden"><motion.div animate={{ x: [100, -100] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full w-1/2 bg-fuchsia-600" /></div>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 flex gap-2">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[8px] font-black uppercase tracking-widest text-fuchsia-500">
              VEO_V2_CORE
            </div>
            <div className="px-3 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/50">
              4K_ULTRA_HD
            </div>
          </div>
        </div>

        <div className="brutal-card p-6 border-white/10 space-y-6 flex flex-col justify-between bg-black">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Especificaciones Técnicas</h4>
              <ul className="space-y-3">
                 <SpecItem label="RESOLUCIÓN" value="4K CINEMATIC" />
                 <SpecItem label="SYNC BPM" value="ACTIVADO" />
                 <SpecItem label="LIP SYNC" value="DEEP-MESH" />
                 <SpecItem label="DYNAMICS" value="AUDIO-REACTIVE" />
                 <SpecItem label="ENGINE" value="C8L_VEO_2" />
              </ul>
           </div>
           <div className="space-y-4">
              <button 
                onClick={handleMaster} 
                disabled={loading}
                className="btn-brutal w-full !bg-white !text-black hover:!bg-fuchsia-600 hover:!text-white disabled:opacity-50"
              >
                 {loading ? 'MASTERIZANDO...' : 'GENERAR VIDEOCLIP'}
              </button>
              {videoGenerated && (
                <motion.a 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  href="#" 
                  className="flex items-center justify-center gap-2 w-full p-4 border-2 border-fuchsia-500 text-fuchsia-500 text-xs font-black uppercase tracking-[0.2em] hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_20px_rgba(217,70,239,0.2)]"
                >
                  <Download className="w-4 h-4" /> DESCARGAR RENDER 4K
                </motion.a>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value }: any) => (
  <li className="flex justify-between border-b border-white/5 pb-2">
    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-bold text-fuchsia-500">{value}</span>
  </li>
);

const MasterControl = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10 group hover:border-amber-500 transition-colors">
    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-bold text-amber-500 group-hover:scale-105 transition-transform">{value}</span>
  </div>
);

const FeatureItem = ({ label }: any) => (
  <div className="flex items-center gap-3 text-[9px] font-black text-white/60 uppercase tracking-widest">
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
    {label}
  </div>
);

const HistoryItem = ({ name, status, date }: any) => (
  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-white uppercase tracking-tighter">{name}</span>
      <span className="text-[7px] text-white/30 uppercase">{date}</span>
    </div>
    <span className={`text-[8px] font-black px-2 py-0.5 ${status === 'LISTO' ? 'text-green-500 border border-green-500/20 bg-green-500/5' : 'text-amber-500 border border-amber-500/20 bg-amber-500/5'}`}>
      {status}
    </span>
  </div>
);

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('top100');
  
  const ranking = [
    { rank: 1, title: "Bolero del Sol", artist: "Leo Vela AI", views: "1.2M", gifts: 450, shares: "45K", status: "VIRAL" },
    { rank: 2, title: "Quantum Reggae", artist: "Antigravity", views: "890K", gifts: 210, shares: "12K", status: "EN TENDENCIA" },
    { rank: 3, title: "Seda Industrial", artist: "User_C8L_882", views: "500K", gifts: 120, shares: "5K", status: "TOP VENTAS" },
    { rank: 4, title: "Marte en Bolero", artist: "Space_Producer", views: "420K", gifts: 95, shares: "2K", status: "NUEVO" },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h2 className="text-display text-5xl tracking-tighter uppercase font-black">BARÓMETRO <span className="text-amber-500 italic">CUÁNTICO</span></h2>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('top100')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'top100' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/20'}`}>TOP 100 GLOBAL</button>
          <button onClick={() => setActiveTab('recent')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'recent' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/20'}`}>RECIENTES</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="ENGAGEMENT REAL" value="98.4%" trend="+2.1%" />
        <StatCard label="VIRALIDAD GLOBAL" value="X4.2" trend="MÁXIMO" />
        <StatCard label="MONETIZACIÓN (GIFTS)" value="$12,502" trend="ALTO" />
        <StatCard label="VALOR DE OBRA" value="45K DSC" trend="ESTABLE" />
      </div>
      
      <div className="brutal-card overflow-hidden border-white/10 bg-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5">
                <th className="p-6">POSICIÓN</th>
                <th className="p-6">OBRA / ARTISTA</th>
                <th className="p-6">VISTAS</th>
                <th className="p-6">VIRALIDAD (SHARES)</th>
                <th className="p-6">BARÓMETRO (REGALOS)</th>
                <th className="p-6">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(r => (
                <tr key={r.rank} className="border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
                  <td className="p-6 font-black text-4xl italic tracking-tighter">
                     <span className={r.rank <= 3 ? 'text-amber-500' : 'text-white/10'}>{r.rank < 10 ? `0${r.rank}` : r.rank}</span>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-xl group-hover:text-amber-500 transition-colors uppercase tracking-tighter">{r.title}</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500/20 rounded-full" /> {r.artist}
                    </div>
                  </td>
                  <td className="p-6 font-mono text-fuchsia-500 font-bold text-lg">{r.views}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                       <Share2 className="w-4 h-4" />
                       <span className="font-mono">{r.shares}</span>
                    </div>
                  </td>
                  <td className="p-6">
                     <div className="flex flex-col gap-2 min-w-[150px]">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-amber-500 font-bold text-xs">🎁 {r.gifts}</span>
                          <button className="text-[8px] font-black bg-amber-500 text-black px-2 py-0.5 hover:bg-white transition-colors">ENVIAR REGALO</button>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(r.gifts/500)*100}%` }}
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400" 
                          />
                        </div>
                     </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 text-[8px] font-black border tracking-[0.2em] uppercase ${r.status === 'VIRAL' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-amber-500 text-amber-500 bg-amber-500/10'}`}>{r.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend }: any) => (
  <div className="brutal-card p-6 border-white/5 bg-gradient-to-br from-white/5 to-transparent">
    <div className="flex justify-between items-start">
       <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</div>
       <span className="text-[8px] font-black text-amber-500 border border-amber-500/20 px-2 py-0.5">{trend}</span>
    </div>
    <div className="text-3xl font-black mt-2 tracking-tighter">{value}</div>
  </div>
);

const ProducerPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [concept, setConcept] = useState('');

  const handleProduce = async () => {
    if (!concept) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept })
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (e) {
      // Demo Fallback
      setData({
        title: concept.toUpperCase() || "MASTER LEO VELA #1",
        bpm: 120,
        mood: "Seda y Groove Cuántico",
        stems: {
          vocal: { volume: 0.9, effect: "Seda" },
          bass: { volume: 0.8, effect: "Calidez" },
          ukulele: { volume: 0.9, effect: "Sello Leo Vela" },
          drums: { volume: 0.7, effect: "Natural" },
          harmony: { volume: 0.6, effect: "Pad Velvet" }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h2 className="text-display text-5xl italic tracking-tighter uppercase font-black">STUDIO <span className="text-white/20 font-light">PRO / EXECUTIVE</span></h2>
        <div className="text-[10px] font-black text-amber-500 border border-amber-500 px-6 py-2.5 bg-amber-500/10 tracking-[0.3em] shadow-[0_0_30px_rgba(245,158,11,0.15)] uppercase italic">DESBLOQUEADO: SELLO LEO VELA</div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">CONCEPTO DE PRODUCCIÓN / PROMPT DE AUDIO</label>
        <div className="flex gap-4">
          <input 
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ej: Bolero-House con ukelele y silbido nostálgico..."
            className="flex-1 bg-white/5 border-2 border-white/10 p-4 focus:border-amber-500 outline-none text-lg font-bold"
          />
          <button onClick={handleProduce} disabled={loading} className="btn-brutal !bg-amber-500 px-8">
             {loading ? 'PROCESANDO...' : 'PRODUCIR'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 brutal-card p-12 space-y-12 border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Layers className="w-8 h-8 text-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="font-black text-amber-500 uppercase tracking-[0.4em] text-[10px] border-b border-amber-500/20 pb-2">Motor de Masterización</h4>
              <div className="space-y-6">
                <MasterControl label="TEXTURA" value="SEDA / SILK" />
                <MasterControl label="CALIDEZ" value="ORO 24K" />
                <MasterControl label="ESPACIO" value="HALL C8L" />
                <MasterControl label="DINÁMICA" value="PUMPING PRO" />
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-fuchsia-500 uppercase tracking-[0.4em] text-[10px] border-b border-fuchsia-500/20 pb-2 text-center">Mezclador Omni-Seda (Premium)</h4>
              <div className="grid grid-cols-1 gap-4">
                <MixerChannel label="VOZ PRINCIPAL" color="bg-blue-500" active={!!data} />
                <MixerChannel label="BAJO CUÁNTICO" color="bg-amber-500" active={!!data} />
                <MixerChannel label="UKELELE LEO VELA" color="bg-fuchsia-600" active={!!data} />
                <MixerChannel label="TIMBALES / PERC" color="bg-green-500" active={!!data} />
                <MixerChannel label="ARMONÍAS SEDA" color="bg-purple-500" active={!!data} />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button className="btn-brutal flex-1 !bg-white !text-black hover:!bg-amber-500 hover:!text-white transition-all">
              <Play className="w-4 h-4 inline mr-2 fill-current" /> REPRODUCIR MASTER
            </button>
            <button className="btn-brutal flex-1 !bg-black !border-white/20 hover:!border-amber-500">
              <Download className="w-4 h-4 inline mr-2" /> EXPORTAR STEMS (WAV)
            </button>
          </div>
        </div>
        
        <div className="space-y-8">
           <div className="brutal-card p-8 bg-amber-500/5 border-amber-500/20 space-y-6 relative overflow-hidden group">
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-amber-500/10 pointer-events-none" 
              />
              <div className="flex justify-between items-center relative z-10">
                 <h3 className="text-display text-2xl text-amber-500 uppercase tracking-tighter">Ultra Premium</h3>
                 <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed uppercase font-black tracking-widest border-l-3 border-amber-500 pl-4 relative z-10">
                Acceso exclusivo al algoritmo de desglosado multicapa "Omni-Seda" optimizado para alta fidelidad.
              </p>
              <div className="space-y-4 relative z-10">
                <FeatureItem label="VOCES DE LEYENDA DISPONIBLES" />
                <FeatureItem label="SILBIDO ICÓNICO AUTO-GEN" />
                <FeatureItem label="MASTERIZACIÓN ANALÓGICA AI" />
              </div>
           </div>

           <div className="brutal-card p-6 border-white/5 space-y-4 bg-black/40">
              <div className="flex items-center gap-2 mb-2">
                 <History className="w-4 h-4 text-white/20" />
                 <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Historial de Producción</h4>
              </div>
              <div className="space-y-3">
                 <HistoryItem name="BOLERO_SPACIAL_V4.WAV" status="LISTO" date="HOY" />
                 <HistoryItem name="REGGAE_SEDA_MASTER.WAV" status="PROCESANDO" date="AYER" />
                 <HistoryItem name="QUANTUM_BEAT_882.WAV" status="ARCHIVADO" date="22/10" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const ProductCard = ({ to, icon, title, desc, color }: any) => (
  <Link to={to} className="group brutal-card p-10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden bg-black">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 blur-[100px] group-hover:opacity-20 transition-opacity`} />
    <div className={`w-20 h-20 ${color} flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="text-display text-4xl mb-4 group-hover:text-fuchsia-500 transition-colors tracking-tighter uppercase font-black">{title}</h3>
    <p className="text-white/40 leading-relaxed mb-10 text-lg font-medium">{desc}</p>
    <div className="flex items-center gap-3 text-fuchsia-500 font-black text-xs tracking-[0.3em] uppercase">
      INICIAR MÓDULO <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
    </div>
  </Link>
);

const MixerChannel = ({ label, color, active }: any) => {
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(80);

  return (
    <div className={`p-4 border-2 transition-all ${active ? 'border-white/10 bg-white/5' : 'border-white/5 bg-black/40 opacity-30 grayscale'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{label}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setMuted(!muted)}
            className={`px-3 py-1 text-[8px] font-black border transition-colors ${muted ? 'bg-red-500 border-red-500 text-white' : 'border-white/20 text-white/40 hover:border-white'}`}
          >
            MUTE
          </button>
          <button className="px-3 py-1 text-[8px] font-black border border-white/20 text-white/40 hover:border-amber-500 hover:text-amber-500 transition-colors">SOLO</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: active ? `${muted ? 0 : vol}%` : 0 }}
            className={`h-full ${color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`} 
          />
          {active && !muted && (
             <motion.div 
               animate={{ x: [0, 200, 0] }}
               transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
               className="absolute top-0 left-0 w-1/4 h-full bg-white/20 blur-sm"
             />
          )}
        </div>
        <span className="text-[10px] font-mono font-bold text-white/40 w-8">{vol}%</span>
      </div>
    </div>
  );
};

const LayerBar = ({ label, progress }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-black uppercase text-white/30">
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full h-1 bg-white/5">
      <div className="h-full bg-fuchsia-600" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          setXp(docSnap.data().xp || 0);
        } else {
          setDoc(userRef, { xp: 0, email: user.email, name: user.displayName });
        }
      });
    }
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Space_Grotesk'] selection:bg-fuchsia-600 selection:text-white">
      {/* Sidebar Fija con Estilo Antigravity */}
      <nav className="fixed left-0 top-0 h-full w-24 border-r-2 border-white/10 flex flex-col items-center py-10 gap-12 bg-black/90 backdrop-blur-3xl z-50">
        <div onClick={() => navigate('/')} className="w-14 h-14 bg-fuchsia-600 flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)] cursor-pointer hover:scale-110 hover:rotate-90 transition-all duration-500">
          <Zap className="text-black fill-black w-8 h-8" />
        </div>
        
        <div className="flex flex-col gap-10">
          <NavIcon active={location.pathname === '/'} icon={<LayoutDashboard className="w-6 h-6" />} to="/" label="INICIO" />
          <NavIcon active={location.pathname === '/studio'} icon={<Video className="w-6 h-6" />} to="/studio" label="VIDEO" />
          <NavIcon active={location.pathname === '/community'} icon={<Trophy className="w-6 h-6" />} to="/community" label="RANKING" />
          <NavIcon active={location.pathname === '/ghostwriter'} icon={<PenTool className="w-6 h-6" />} to="/ghostwriter" label="LETRA" />
          <NavIcon active={location.pathname === '/producer'} icon={<Terminal className="w-6 h-6" />} to="/producer" label="PRO" />
        </div>

        <div className="mt-auto flex flex-col gap-8 pb-4 items-center">
          <div className="flex flex-col items-center gap-1 group">
             <div className="text-[8px] text-fuchsia-500 font-bold animate-pulse mb-2 whitespace-nowrap">CTRL ROOM: ON</div>
             <Trophy className="w-6 h-6 text-fuchsia-500 group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black tracking-tighter">{xp} XP</span>
          </div>
          
          {user ? (
            <div className="relative group">
              <img 
                src={user.photoURL || ''} 
                className="w-11 h-11 rounded-none border-2 border-fuchsia-600 cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-105 transition-transform"
                alt="User"
              />
              <button onClick={handleLogout} className="absolute left-full ml-4 bg-red-600 px-3 py-1 text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-l-2 border-white/20">SALIR</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex flex-col items-center gap-1 text-white/20 hover:text-fuchsia-500 transition-colors uppercase font-black text-[8px] group">
              <UserIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              LOGIN
            </button>
          )}
          <Settings className="w-6 h-6 text-white/20 hover:text-white cursor-pointer transition-colors hover:rotate-90 transition-all duration-700" />
        </div>
      </nav>

      {/* Área de Contenido con Padding para Sidebar */}
      <main className="ml-24 p-12 lg:p-20 flex-1 w-full max-w-[1800px] mx-auto overflow-x-hidden">
        {children}
      </main>

      {/* Footer Estético */}
      <footer className="ml-24 border-t border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">C.8.L. MUSIC AI // OMNI-PROTOCOLO V4.0</span>
          <a href="https://www.c8lmusicai.com" target="_blank" rel="noopener noreferrer" className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest hover:underline">WWW.C8LMUSICAI.COM</a>
        </div>
        <div className="flex gap-8 text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
           <span>ESTADO: <span className="text-green-500">ÓPTIMO</span></span>
           <span>LATENCIA: 12MS</span>
           <span>ENGINE: GEMINI 2.0 FLASH</span>
        </div>
      </footer>
    </div>
  );
};

const NavIcon = ({ active, icon, to, label }: any) => (
  <Link 
    to={to}
    className={`group relative w-12 h-12 flex flex-col items-center justify-center transition-all ${active ? 'text-fuchsia-500' : 'text-white/20 hover:text-white'}`}
  >
    {icon}
    <span className={`text-[6px] font-black mt-1 transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{label}</span>
    {active && <div className="absolute right-[-26px] top-0 h-full w-1.5 bg-fuchsia-600 shadow-[0_0_20px_#d946ef]" />}
  </Link>
);

// --- APP PRINCIPAL CON ROUTING ---

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/ghostwriter" element={<GhostwriterPage />} />
          <Route path="/producer" element={<ProducerPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
