
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  LogOut, 
  UserPlus, 
  History,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Flame,
  HelpCircle,
  Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { nanoid } from 'nanoid';
import { CARDS, Card } from './cards';

type AppState = 'age-gate' | 'menu' | 'lobby' | 'game';

interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  hand: Card[];
  isHost: boolean;
  isCurrentTurn: boolean;
}

interface GameLog {
  id: string;
  text: string;
  type: 'info' | 'action' | 'win';
}

interface Message {
  id: string;
  sender: string;
  text: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('age-gate');
  const [user, setUser] = useState<{ name: string; avatar: string; id: string } | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'logs' | 'scores'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameMode, setGameMode] = useState<'classic' | 'hardcore' | 'erotic' | 'horror'>('classic');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [customAvatar, setCustomAvatar] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isScreamer, setIsScreamer] = useState(false);
  const [horrorLevel, setHorrorLevel] = useState(0);

  useEffect(() => {
    const verified = localStorage.getItem('bunker-verified');
    if (verified) setAppState('menu');
  }, []);

  const notify = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 2500);
  };

  const addLog = (text: string, type: 'info' | 'action' | 'win' = 'info') => {
    setLogs(prev => [{ id: nanoid(), text, type }, ...prev]);
  };

  const handleAgeVerify = () => {
    localStorage.setItem('bunker-verified', 'true');
    setAppState('menu');
  };

  const joinLobby = (name: string, isJoining = false) => {
    if (!name) return;
    const id = nanoid();
    const defaultAvatar = 'https://img01.rl0.ru/afisha/1500x-/daily.afisha.ru/uploads/images/3/1a/31ae6f02aadd4006bbc661f2dc941c81.jpg';
    const avatar = customAvatar || defaultAvatar;
    
    setUser({ name, avatar, id });
    
    if (isJoining) {
      if (!joinCodeInput) return alert('Введите код комнаты');
      setRoomId(joinCodeInput.toUpperCase());
    } else {
      setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase());
    }

    setPlayers([{ id, name, avatar, points: 0, hand: [], isHost: !isJoining, isCurrentTurn: !isJoining }]);
    setAppState('lobby');
  };

  const togglePrivate = () => {
    setIsPrivateMode(!isPrivateMode);
    addLog(isPrivateMode ? 'Выход из уединения' : 'Режим уединения активирован', 'info');
  };

  const addBot = () => {
    const bots = ['Блондинка', 'Дилер', 'Мачо', 'Стерва'];
    const bot: Player = {
      id: nanoid(),
      name: bots[Math.floor(Math.random() * bots.length)],
      avatar: '🤖',
      points: 0,
      hand: [],
      isHost: false,
      isCurrentTurn: false
    };
    setPlayers(prev => [...prev, bot]);
  };

  const startGame = () => {
    if (players.length < 2) return alert('Нужно минимум 2 игрока');
    
    let gameDeck = [...CARDS].map(c => ({ ...c, id: nanoid() }));
    gameDeck = gameDeck.sort(() => Math.random() - 0.5);

    const updatedPlayers = players.map(p => ({
      ...p,
      hand: gameDeck.splice(0, 5),
      points: 0
    }));

    setDeck(gameDeck);
    setPlayers(updatedPlayers);
    setAppState('game');
    addLog('Игра началась!', 'info');
    notify('ВАШ ХОД!');
  };

  const drawCard = (playerId: string) => {
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, hand: [...p.hand, card] } : p));
    if (playerId === user?.id) nextTurn();
  };

  const nextTurn = () => {
    const nextIdx = (turnIndex + 1) % players.length;
    setTurnIndex(nextIdx);
    setPlayers(prev => prev.map((p, i) => ({ ...p, isCurrentTurn: i === nextIdx })));
    setSelectedCard(null);

    // AI Logic for bots
    const nextPlayer = players[nextIdx];
    if (nextPlayer.avatar === '🤖') {
      setTimeout(() => botPlay(nextPlayer.id), 1500);
    }
  };

  const botPlay = (botId: string) => {
    const bot = players.find(p => p.id === botId);
    if (!bot) return;

    // Шанс на сообщение в чат
    if (Math.random() > 0.6) {
      const jokes = [
        "Здарова, мабой! Надейся на чудо.",
        "Опять ты? Твои карты выглядят жалко.",
        "Я вижу твой страх сквозь экран.",
        "Не расстраивайся, проигрывать — это твое хобби.",
        "Ты серьезно решил походить так?",
        "Чел, ты...",
        "Ой, кажется я нашел твое фото в папке 'Слабаки'."
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      setMessages(prev => [...prev, { id: nanoid(), sender: bot.name, text: joke }]);
    }

    if (bot.hand.length === 0) {
      drawCard(botId);
      return;
    }

    const bestCard = [...bot.hand].sort((a, b) => b.power - a.power)[0];
    setTimeout(() => playCard(bestCard.id), 1000);
  };

  const triggerScreamer = () => {
    setIsScreamer(true);
    setTimeout(() => setIsScreamer(false), 800);
    setHorrorLevel(prev => prev + 1);
  };

  const playCard = (cardId: string) => {
    const p = players[turnIndex];
    const card = p.hand.find(c => c.id === cardId)!;
    
    setTableCards(prev => [...prev, card]);
    
    // Эффект хоррора
    if (card.category === 'horror' || Math.random() < 0.05) {
      if (Math.random() < 0.3) triggerScreamer();
    }

    setPlayers(prev => prev.map(player => {
      if (player.id === p.id) {
        return { 
          ...player, 
          hand: player.hand.filter(c => c.id !== cardId),
          points: player.points + card.power
        };
      }
      return player;
    }));

    addLog(`${p.name} сыграл: ${card.name}`, 'action');
    
    if (p.points + card.power >= 30) {
      confetti();
      addLog(`${p.name} ПОБЕДИЛ!`, 'win');
      notify(`ПОБЕДА: ${p.name}`);
    }
    nextTurn();
  };

  if (appState === 'age-gate') {
    return (
      <div className="screen-center">
        <div className="modal">
          <h1 className="orbitron" style={{ color: 'var(--red)', marginBottom: '20px' }}>Контент 18+</h1>
          <p>Эта игра содержит взрослый контент и темы. Вам есть 18 лет?</p>
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAgeVerify}>ДА, МНЕ 18+</button>
            <button className="btn" style={{ flex: 1, background: '#333', color: '#ccc' }} onClick={() => window.location.href = 'https://google.com'}>НЕТ</button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'menu') {
    return (
      <div className="screen-center">
        <div className="modal">
          <h1 className="orbitron" style={{ letterSpacing: '8px', color: '#fff', marginBottom: '30px' }}>BUNKER</h1>
          
          <div className="avatar-preview" style={{ backgroundImage: `url(${customAvatar || 'https://img01.rl0.ru/afisha/1500x-/daily.afisha.ru/uploads/images/3/1a/31ae6f02aadd4006bbc661f2dc941c81.jpg'})` }}>
            <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', background: '#000', border: '1px solid #333', padding: '2px 10px', fontSize: '10px' }}>PROFILE</div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="NICKNAME" 
              className="input-field" 
              id="nameInput"
              autoFocus
            />
            <input 
              type="text" 
              placeholder="AVATAR URL (OPTIONAL)" 
              className="input-field" 
              value={customAvatar}
              onChange={(e) => setCustomAvatar(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '20px' }}>
             {['classic', 'erotic', 'hardcore'].map(mode => (
               <button 
                key={mode}
                className={`btn ${gameMode === mode ? 'btn-primary' : ''}`} 
                style={{ fontSize: '9px', padding: '8px 12px' }} 
                onClick={() => setGameMode(mode as any)}
               >
                 {mode}
               </button>
             ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                const val = (document.getElementById('nameInput') as HTMLInputElement).value;
                joinLobby(val);
              }}
            >
              CREATE
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <input 
                type="text" 
                placeholder="ROOM CODE" 
                className="input-field" 
                style={{ margin: 0, padding: '10px', fontSize: '11px' }}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
              />
              <button 
                className="btn" 
                style={{ padding: '10px' }}
                onClick={() => {
                  const val = (document.getElementById('nameInput') as HTMLInputElement).value;
                  joinLobby(val, true);
                }}
              >
                JOIN
              </button>
            </div>
          </div>

          <button className="btn" style={{ background: 'none', border: 'none', color: '#444', fontSize: '10px' }} onClick={() => setShowRules(true)}>
            [ VIEW RULES ]
          </button>
        </div>

        {showRules && (
          <div className="screen-center" style={{ position: 'fixed', zIndex: 1000, background: 'rgba(0,0,0,0.95)' }}>
             <div className="modal rules-modal">
                <h2>Правила для "ботаников"</h2>
                <ul>
                  <li><strong>Цель:</strong> Набрать 30 очков или заставить всех сдаться.</li>
                  <li><strong>Ход:</strong> Можно либо сыграть карту, либо взять одну из колоды.</li>
                  <li><strong>Сила:</strong> Число на карте добавляется к вашему счету.</li>
                  <li><strong>Карты действий:</strong> У каждой карты есть уникальный эффект (кража, пропуск хода, защита).</li>
                  <li><strong>Режим 18+:</strong> Некоторые карты заставляют игроков выполнять действия в реальности (по желанию).</li>
                </ul>
                <button className="btn btn-primary" onClick={() => setShowRules(false)}>ПОНЯЛ</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  if (appState === 'lobby') {
    return (
      <div className="screen-center">
        <div className="modal" style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#666', fontSize: '10px' }}>КОД КОМНАТЫ</p>
              <h2 className="orbitron" style={{ color: 'var(--gold)' }}>{roomId}</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" style={{ background: '#2a2a2a' }} onClick={addBot}><UserPlus size={18} /></button>
              <button className="btn btn-primary" onClick={startGame}>ИГРАТЬ</button>
            </div>
          </div>
          
          <div style={{ background: '#111', borderRadius: '10px', padding: '15px' }}>
            <h3 className="orbitron" style={{ fontSize: '12px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={14} /> Игроки ({players.length})
            </h3>
            {players.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderBottom: '1px solid #222' }}>
                <span style={{ fontSize: '24px' }}>{p.avatar}</span>
                <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                {p.isHost && <span style={{ fontSize: '9px', background: 'var(--red)', padding: '2px 6px', borderRadius: '10px' }}>HOST</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const me = players.find(p => p.id === user?.id);
  const opponents = players.filter(p => p.id !== user?.id);

  return (
    <div className="game-container" style={{ background: '#000' }}>
      {isScreamer && (
        <div className="screamer">
           <img src="https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&fit=crop" style={{ width: '100vw', height: '100vh', objectFit: 'cover' }} alt="horror" />
        </div>
      )}
      
      {horrorLevel > 2 && <div className="blood-overlay"></div>}

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="notification orbitron">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {isPrivateMode && (
        <div className="private-room-overlay">
           <div className="modal">
              <Shield size={48} style={{ marginBottom: '20px', color: '#555' }} />
              <h2 className="orbitron">PRIVATE MODE</h2>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px' }}>ВЫ НАХОДИТЕСЬ В УЕДИНЕНИИ. ДРУГИЕ ИГРОКИ ВАС НЕ ВИДЯТ.</p>
              <button className="btn btn-primary" onClick={togglePrivate}>ВЫЙТИ</button>
           </div>
        </div>
      )}

      <div className="main-board">
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
          <button className="btn" style={{ padding: '8px 15px', fontSize: '10px' }} onClick={togglePrivate}>
            {isPrivateMode ? 'VISIBLE' : 'PRIVATE'}
          </button>
        </div>

        {/* Opponents */}
        <div className="opponents-zone">
          {opponents.map(opp => (
            <div key={opp.id} style={{ textAlign: 'center' }}>
              <div 
                className={`avatar ${opp.isCurrentTurn ? 'active-turn' : ''}`} 
                style={{ 
                  borderRadius: '0px', 
                  backgroundImage: `url(${opp.avatar.startsWith('http') ? opp.avatar : 'https://img01.rl0.ru/afisha/1500x-/daily.afisha.ru/uploads/images/3/1a/31ae6f02aadd4006bbc661f2dc941c81.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  fontSize: '0px'
                }}
              >
                {!opp.avatar.startsWith('http') && opp.avatar}
              </div>
              <p style={{ fontSize: '10px', marginTop: '8px', letterSpacing: '2px', opacity: 0.5 }}>{opp.name.toUpperCase()}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>{opp.points} PTS</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="table-zone">
          {tableCards.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.1 }}>
               <h1 style={{ fontSize: '120px', margin: 0 }}>BUNKER</h1>
               <p className="orbitron">Ждем первого хода...</p>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {tableCards.map((card, i) => (
                <motion.div 
                  key={card.id}
                  initial={{ y: 300, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotate: (i * 7) % 40 - 20 }}
                  className="card"
                  style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: '50%', 
                    marginLeft: '-70px', 
                    marginTop: '-100px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <img src={card.image} className="card-img" alt="" />
                  <div className="card-info">
                    <p className="card-name">{card.name}</p>
                    <p style={{ fontSize: '9px', color: '#bbb' }}>{card.description}</p>
                  </div>
                  <div className="card-power">{card.power}</div>
                  {card.category === 'erotic' && <div style={{ position: 'absolute', right: 5, top: 5, fontSize: '10px' }}>🔞</div>}
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottle / Special */}
          {tableCards.length > 0 && tableCards[tableCards.length-1].name === 'Бутылочка' && (
             <motion.div 
              animate={{ rotate: 1440 }}
              transition={{ duration: 3, ease: "circOut" }}
              style={{ position: 'absolute', fontSize: '60px', zIndex: 100 }}
             >
               🍾
             </motion.div>
          )}

          <div className="deck" onClick={() => me?.isCurrentTurn && drawCard(user!.id)} style={{ boxShadow: me?.isCurrentTurn ? '0 0 20px var(--gold)' : '' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '30px' }}>🎴</div>
              <p className="orbitron" style={{ fontSize: '12px', color: 'var(--gold)' }}>{deck.length}</p>
            </div>
          </div>
        </div>

        {/* Hand */}
        <div className="player-zone">
          <div style={{ display: 'flex', perspective: '1000px' }}>
            {me?.hand.map((card, idx) => {
              const rotate = (idx - (me.hand.length - 1) / 2) * 6;
              const translateY = Math.abs(idx - (me.hand.length - 1) / 2) * 8;
              return (
                <motion.div 
                  key={card.id} 
                  className={`card hand-card ${selectedCard === card.id ? 'selected' : ''}`}
                  style={{ rotate: `${rotate}deg`, y: translateY }}
                  whileHover={{ y: -30, zIndex: 200, scale: 1.1 }}
                  onClick={() => me.isCurrentTurn && setSelectedCard(card.id)}
                >
                  <img src={card.image} className="card-img" alt="" />
                  <div className="card-info">
                    <p className="card-name">{card.name}</p>
                    <p style={{ fontSize: '10px', color: '#ccc', lineHeight: '1.2' }}>{card.description}</p>
                  </div>
                  <div className="card-power">{card.power}</div>
                  {card.category === 'erotic' && <div style={{ position: 'absolute', right: 5, top: 5, fontSize: '10px' }}>🔥</div>}
                </motion.div>
              );
            })}
          </div>

          {selectedCard && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="btn btn-primary play-btn orbitron" 
              onClick={() => playCard(selectedCard)}
              style={{ boxShadow: '0 0 30px var(--red)' }}
            >
              СЫГРАТЬ КАРТУ
            </motion.button>
          )}
        </div>
      </div>

      {/* Sidebar with Toggle */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronRight /> : <Menu />}
        </button>

        <div className="sidebar-tabs">
          <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><MessageSquare size={16} /></button>
          <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}><History size={16} /></button>
          <button className={`tab-btn ${activeTab === 'scores' ? 'active' : ''}`} onClick={() => setActiveTab('scores')}><Trophy size={16} /></button>
        </div>

        <div className="tab-content">
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                {messages.map(m => (
                  <div key={m.id} style={{ marginBottom: '12px', background: '#222', padding: '8px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--red)', fontWeight: 'bold', fontSize: '11px', marginBottom: '3px' }}>{m.sender}</div>
                    <div style={{ fontSize: '13px', color: '#eee' }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ margin: 0, padding: '12px', background: '#111' }} 
                  placeholder="Написать всем..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setMessages(prev => [...prev, { id: nanoid(), sender: user!.name, text: e.currentTarget.value }]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}
          {activeTab === 'logs' && (
            <div style={{ fontSize: '12px' }}>
              {logs.map(log => (
                <div key={log.id} style={{ padding: '10px', borderBottom: '1px solid #222', color: log.type === 'win' ? 'var(--gold)' : log.type === 'action' ? '#fff' : '#888', display: 'flex', gap: '10px' }}>
                  {log.type === 'action' ? <Zap size={12} /> : <History size={12} />}
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'scores' && (
            <div>
              {players.sort((a,b) => b.points - a.points).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: i === 0 ? 'rgba(255,215,0,0.1)' : 'transparent', borderRadius: '10px', marginBottom: '5px', border: i === 0 ? '1px solid var(--gold)' : '1px solid #222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <span style={{ fontSize: '20px' }}>{p.avatar}</span>
                     <div>
                       <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.name}</div>
                       <div style={{ fontSize: '10px', color: '#666' }}>{p.hand.length} карт в руке</div>
                     </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '18px' }}>{p.points}</div>
                    <div style={{ fontSize: '9px', opacity: 0.5 }}>PTS</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #333', background: '#0a0a0a' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundImage: `url(${user?.avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid #333'
                  }} 
                />
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', letterSpacing: '1px' }}>{user?.name.toUpperCase()}</span>
                  <span style={{ fontSize: '9px', color: '#444' }}>LEVEL: 01</span>
                </div>
              </div>
              <button onClick={() => setAppState('menu')} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', padding: '5px' }}><LogOut size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
