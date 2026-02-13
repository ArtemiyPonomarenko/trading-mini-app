import React, { useState, useEffect } from 'react';

// Telegram WebApp
const tg = typeof window !== 'undefined' && window.Telegram?.WebApp ? window.Telegram.WebApp : {
  initDataUnsafe: { user: { id: 123456789, first_name: 'Демо' } },
  expand: () => {},
  ready: () => {}
};

// Данные курса
const MODULES = [
  { id: 1, title: 'Основы трейдинга', desc: 'Что такое рынок и биржи', lessons: 5 },
  { id: 2, title: 'Технический анализ', desc: 'Читаем графики', lessons: 5 },
  { id: 3, title: 'Индикаторы', desc: 'RSI, MACD, скользящие', lessons: 5 },
  { id: 4, title: 'Риск-менеджмент', desc: 'Как не слить депозит', lessons: 5 },
  { id: 5, title: 'Торговая система', desc: 'Строим стратегию', lessons: 5 },
];

const TARIFFS = [
  { id: 'basic', name: 'Базовый', price: 4990, desc: 'Самостоятельно', features: ['25 видеоуроков', 'PDF-конспекты', 'Доступ 6 мес'] },
  { id: 'standard', name: 'Стандарт', price: 9990, desc: 'С поддержкой', features: ['Всё из Базового', 'Вебинары', 'Чат 24/7'], popular: true },
  { id: 'premium', name: 'Премиум', price: 19990, desc: 'Менторство', features: ['Всё из Стандарта', 'Личный куратор', '4 созвона'] },
];

const formatPrice = (p) => p.toLocaleString('ru-RU') + ' ₽';

// Чаты
const CHATS = [
  {
    id: 'support',
    name: 'Поддержка курса',
    avatar: '🎧',
    avatarBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    type: 'support',
  },
  {
    id: 'general',
    name: 'Общий чат',
    avatar: '💬',
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    type: 'group',
  },
  {
    id: 'signals',
    name: 'Торговые сигналы',
    avatar: '📊',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    type: 'channel',
  },
  {
    id: 'module1',
    name: 'Основы трейдинга',
    avatar: '📈',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    type: 'group',
  },
  {
    id: 'module2',
    name: 'Технический анализ',
    avatar: '📉',
    avatarBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    type: 'group',
  },
];

const INITIAL_MESSAGES = {
  support: [
    { id: 1, from: 'Поддержка', text: 'Добро пожаловать! Если у вас есть вопросы по курсу — пишите сюда.', time: '10:00', date: 'Сегодня', incoming: true },
    { id: 2, from: 'you', text: 'Здравствуйте! Когда будет следующий вебинар?', time: '10:05', date: 'Сегодня', incoming: false },
    { id: 3, from: 'Поддержка', text: 'Ближайший вебинар запланирован на эту пятницу в 19:00 МСК. Тема — "Паттерны Price Action".', time: '10:07', date: 'Сегодня', incoming: true },
  ],
  general: [
    { id: 1, from: 'Алексей', text: 'Всем привет! Кто уже прошёл третий модуль?', time: '09:30', date: 'Вчера', incoming: true },
    { id: 2, from: 'Мария', text: 'Я закончила вчера. Тесты непростые, но интересные!', time: '09:35', date: 'Вчера', incoming: true },
    { id: 3, from: 'you', text: 'Я на втором модуле, скоро догоню)', time: '09:40', date: 'Вчера', incoming: false },
    { id: 4, from: 'Дмитрий', text: 'Кто разобрался с дивергенцией на MACD? Нужна помощь', time: '11:20', date: 'Сегодня', incoming: true },
    { id: 5, from: 'Мария', text: 'Дивергенция — это когда цена идёт вверх, а индикатор вниз (или наоборот). Посмотри урок 3.4, там подробно.', time: '11:25', date: 'Сегодня', incoming: true },
  ],
  signals: [
    { id: 1, from: 'Аналитик', text: 'BTC/USDT — лонг от 42500, цель 44000, стоп 41800', time: '08:00', date: 'Вчера', incoming: true },
    { id: 2, from: 'Аналитик', text: 'ETH/USDT — наблюдаем. Пробой 2250 — вход в лонг с целью 2400.', time: '08:15', date: 'Вчера', incoming: true },
    { id: 3, from: 'Аналитик', text: 'BTC — цель 44000 достигнута! Фиксируем +3.5%', time: '14:30', date: 'Сегодня', incoming: true },
    { id: 4, from: 'Аналитик', text: 'SOL/USDT — лонг от 95, цель 102, стоп 92. R/R = 1:2.3', time: '15:00', date: 'Сегодня', incoming: true },
  ],
  module1: [
    { id: 1, from: 'Куратор', text: 'Добро пожаловать в чат модуля "Основы трейдинга"! Обсуждаем уроки и задаём вопросы.', time: '09:00', date: 'Пн', incoming: true },
    { id: 2, from: 'Виктор', text: 'Подскажите, в чём разница между лимитным и рыночным ордером?', time: '12:00', date: 'Пн', incoming: true },
    { id: 3, from: 'Куратор', text: 'Рыночный ордер исполняется сразу по текущей цене. Лимитный — только когда цена дойдёт до вашего уровня. Подробно — в уроке 1.3.', time: '12:10', date: 'Пн', incoming: true },
  ],
  module2: [
    { id: 1, from: 'Куратор', text: 'Чат модуля "Технический анализ". Здесь обсуждаем графики, свечи и уровни.', time: '10:00', date: 'Вт', incoming: true },
    { id: 2, from: 'Елена', text: 'Как правильно определить уровни поддержки и сопротивления?', time: '14:00', date: 'Вт', incoming: true },
    { id: 3, from: 'Куратор', text: 'Ищите зоны, от которых цена отскакивала 2-3 раза. Используйте старший таймфрейм (H4, D1). Урок 2.2 как раз об этом.', time: '14:15', date: 'Вт', incoming: true },
  ],
};

const CHAT_STORAGE_KEY = 'trading_app_chats';

// Стили
const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: 90,
  },
  container: { padding: '20px 16px' },
  
  // Hero
  hero: {
    background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)',
    borderRadius: 24,
    padding: '28px 20px',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(16,185,129,0.2)',
    color: '#10b981',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
  },
  heroDot: {
    width: 8,
    height: 8,
    background: '#10b981',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 10,
    background: 'linear-gradient(90deg, #fff 0%, #d1d5db 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroText: {
    color: '#9ca3af',
    fontSize: 15,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  
  // Buttons
  btnPrimary: {
    width: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    padding: '16px 24px',
    borderRadius: 16,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnSecondary: {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    padding: '16px 24px',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnBack: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#6b7280',
    background: 'none',
    border: 'none',
    fontSize: 14,
    cursor: 'pointer',
    marginBottom: 20,
    padding: 0,
  },
  
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: '16px 12px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statValue: { fontSize: 22, fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  
  // Section
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#fff' },
  
  // Module Card
  moduleCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
  },
  moduleNum: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.15) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#10b981',
    fontWeight: 700,
    fontSize: 16,
  },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4 },
  moduleDesc: { color: '#6b7280', fontSize: 13 },
  moduleArrow: { color: '#4b5563', fontSize: 18 },
  
  // Tariff Card
  tariffCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    border: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
  },
  tariffPopular: {
    border: '2px solid rgba(16,185,129,0.5)',
    boxShadow: '0 0 30px rgba(16,185,129,0.1)',
  },
  tariffBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '5px 14px',
    borderRadius: 20,
    letterSpacing: 0.5,
  },
  tariffHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tariffName: { fontSize: 20, fontWeight: 700 },
  tariffDesc: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  tariffPrice: { fontSize: 24, fontWeight: 700, textAlign: 'right' },
  tariffFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    color: '#d1d5db',
    fontSize: 14,
  },
  tariffCheck: { color: '#10b981', fontSize: 16 },
  
  // Payment
  paymentBox: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  paymentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Success
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    marginBottom: 24,
    boxShadow: '0 12px 40px rgba(16,185,129,0.4)',
  },
  successTitle: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  successText: { color: '#9ca3af', textAlign: 'center', marginBottom: 28, lineHeight: 1.5 },
  
  // Locked
  lockedBox: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 32,
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  lockedIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  lockedTitle: { fontWeight: 600, marginBottom: 8 },
  lockedText: { color: '#6b7280', fontSize: 14, marginBottom: 16 },
  
  // Navbar
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(17,17,17,0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '10px 16px',
    zIndex: 100,
  },
  navInner: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: 400,
    margin: '0 auto',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 16px',
    borderRadius: 12,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: 'rgba(16,185,129,0.15)',
    color: '#10b981',
  },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, fontWeight: 500 },

  // Lesson
  lessonCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  lessonTitle: { fontSize: 14, fontWeight: 500 },
  lessonDur: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  // Progress
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
    borderRadius: 3,
    transition: 'width 0.3s',
  },

  // Chat
  chatCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  chatInfo: { flex: 1, overflow: 'hidden' },
  chatName: { fontWeight: 600, fontSize: 15, marginBottom: 2 },
  chatLastMsg: { color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  chatMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  chatTime: { color: '#6b7280', fontSize: 11 },
  chatBadge: {
    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 16px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  msgIncoming: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
    color: '#e5e7eb',
  },
  msgOutgoing: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.25))',
    borderBottomRightRadius: 4,
    color: '#fff',
  },
  msgTime: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  msgDateSep: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  msgDateLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  chatInputBar: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    background: 'rgba(17,17,17,0.95)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  chatInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '10px 16px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    border: 'none',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatSenderName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#10b981',
    marginBottom: 2,
  },
};

// CSS анимации
const globalStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; }
  button:active { transform: scale(0.98); }
`;

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [user, setUser] = useState({
    name: tg.initDataUnsafe?.user?.first_name || 'Демо',
    purchased: false,
    tariff: null,
    completed: 0,
  });

  useEffect(() => {
    tg.ready?.();
    tg.expand?.();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  // Навигация
  const NAV = [
    { id: 'home', icon: '📈', label: 'Главная' },
    { id: 'tariffs', icon: '⭐', label: 'Тарифы' },
    { id: 'course', icon: '📚', label: 'Курс' },
    { id: 'chats', icon: '💬', label: 'Чаты' },
    { id: 'profile', icon: '👤', label: 'Профиль' },
  ];

  // Экран: Главная
  const HomeScreen = () => (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.heroDot}></span>
          Старт — январь 2025
        </div>
        <h1 style={styles.heroTitle}>Трейдинг с нуля</h1>
        <p style={styles.heroText}>
          Научитесь торговать на бирже системно и без риска слить депозит
        </p>
        <button style={styles.btnPrimary} onClick={() => setScreen('tariffs')}>
          Начать обучение <span>→</span>
        </button>
      </div>

      <div style={styles.statsGrid}>
        {[
          { v: '25', l: 'уроков' },
          { v: '5', l: 'модулей' },
          { v: '12+', l: 'часов' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statValue}>{s.v}</div>
            <div style={styles.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Программа курса</h2>
      {MODULES.map((m, i) => (
        <div
          key={m.id}
          style={styles.moduleCard}
          onClick={() => { setSelectedModule(m); setScreen('module'); }}
        >
          <div style={styles.moduleNum}>{i + 1}</div>
          <div style={styles.moduleInfo}>
            <div style={styles.moduleTitle}>{m.title}</div>
            <div style={styles.moduleDesc}>{m.lessons} уроков</div>
          </div>
          <div style={styles.moduleArrow}>›</div>
        </div>
      ))}
    </div>
  );

  // Экран: Тарифы
  const TariffsScreen = () => (
    <div style={styles.container}>
      <h1 style={{ ...styles.heroTitle, textAlign: 'center', marginBottom: 8 }}>Выберите тариф</h1>
      <p style={{ ...styles.heroText, textAlign: 'center', marginBottom: 24 }}>Один курс — разные возможности</p>
      
      {TARIFFS.map(t => (
        <div
          key={t.id}
          style={{ ...styles.tariffCard, ...(t.popular ? styles.tariffPopular : {}) }}
        >
          {t.popular && <div style={styles.tariffBadge}>ПОПУЛЯРНЫЙ</div>}
          <div style={styles.tariffHeader}>
            <div>
              <div style={styles.tariffName}>{t.name}</div>
              <div style={styles.tariffDesc}>{t.desc}</div>
            </div>
            <div style={styles.tariffPrice}>{formatPrice(t.price)}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            {t.features.map((f, i) => (
              <div key={i} style={styles.tariffFeature}>
                <span style={styles.tariffCheck}>✓</span>
                {f}
              </div>
            ))}
          </div>
          <button
            style={t.popular ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => { setSelectedTariff(t); setScreen('payment'); }}
          >
            Выбрать тариф
          </button>
        </div>
      ))}
    </div>
  );

  // Экран: Оплата
  const PaymentScreen = () => (
    <div style={styles.container}>
      <button style={styles.btnBack} onClick={() => setScreen('tariffs')}>
        ← Назад к тарифам
      </button>
      
      <h1 style={{ ...styles.heroTitle, marginBottom: 20 }}>Оформление заказа</h1>
      
      <div style={styles.paymentBox}>
        <div style={styles.paymentRow}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Трейдинг с нуля</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Тариф: {selectedTariff?.name}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{formatPrice(selectedTariff?.price || 0)}</div>
        </div>
      </div>

      <button
        style={{ ...styles.btnPrimary, marginBottom: 12 }}
        onClick={() => {
          setUser(prev => ({ ...prev, purchased: true, tariff: selectedTariff?.id }));
          setScreen('success');
        }}
      >
        Оплатить {formatPrice(selectedTariff?.price || 0)}
      </button>
      
      <button
        style={styles.btnSecondary}
        onClick={() => alert('Рассрочка: напишите нам в Telegram')}
      >
        Оформить рассрочку
      </button>
      
      <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, marginTop: 16 }}>
        Нажимая "Оплатить", вы соглашаетесь с условиями оферты
      </p>
    </div>
  );

  // Экран: Успех
  const SuccessScreen = () => (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={styles.successIcon}>✓</div>
      <h1 style={styles.successTitle}>Оплата прошла!</h1>
      <p style={styles.successText}>
        Добро пожаловать на курс<br />«Трейдинг с нуля»
      </p>
      <button style={styles.btnPrimary} onClick={() => setScreen('course')}>
        Начать обучение
      </button>
    </div>
  );

  // Экран: Курс
  const CourseScreen = () => (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={styles.sectionTitle}>Мой курс</h1>
        {user.purchased && (
          <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
            {Math.round((user.completed / 25) * 100)}%
          </div>
        )}
      </div>

      {!user.purchased ? (
        <div style={styles.lockedBox}>
          <div style={styles.lockedIcon}>🔒</div>
          <div style={styles.lockedTitle}>Курс недоступен</div>
          <div style={styles.lockedText}>Оформите подписку для доступа к урокам</div>
          <button
            style={{ ...styles.btnPrimary, width: 'auto', padding: '12px 24px' }}
            onClick={() => setScreen('tariffs')}
          >
            Выбрать тариф
          </button>
        </div>
      ) : (
        MODULES.map((m, i) => (
          <div
            key={m.id}
            style={styles.moduleCard}
            onClick={() => { setSelectedModule(m); setScreen('module'); }}
          >
            <div style={styles.moduleNum}>{i + 1}</div>
            <div style={styles.moduleInfo}>
              <div style={styles.moduleTitle}>{m.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: '0%' }}></div>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>0%</span>
              </div>
            </div>
            <div style={styles.moduleArrow}>›</div>
          </div>
        ))
      )}
    </div>
  );

  // Экран: Модуль
  const ModuleScreen = () => {
    const lessons = [
      { title: 'Урок 1: Введение', dur: '12 мин' },
      { title: 'Урок 2: Основные понятия', dur: '15 мин' },
      { title: 'Урок 3: Практика', dur: '18 мин' },
      { title: 'Урок 4: Примеры', dur: '14 мин' },
      { title: 'Урок 5: Итоги', dur: '10 мин' },
    ];

    return (
      <div style={styles.container}>
        <button style={styles.btnBack} onClick={() => setScreen(user.purchased ? 'course' : 'home')}>
          ← Назад
        </button>
        
        <h1 style={{ ...styles.sectionTitle, marginBottom: 8 }}>{selectedModule?.title}</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>{selectedModule?.desc}</p>

        {lessons.map((l, i) => (
          <div
            key={i}
            style={{ ...styles.lessonCard, opacity: user.purchased ? 1 : 0.5, cursor: user.purchased ? 'pointer' : 'default' }}
            onClick={() => user.purchased && alert('Открываем: ' + l.title)}
          >
            <div style={styles.lessonIcon}>{user.purchased ? '▶' : '🔒'}</div>
            <div>
              <div style={styles.lessonTitle}>{l.title}</div>
              <div style={styles.lessonDur}>{l.dur}</div>
            </div>
          </div>
        ))}

        <div style={{ ...styles.lessonCard, marginTop: 16, borderStyle: 'dashed' }}>
          <div style={{ ...styles.lessonIcon, background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>🏆</div>
          <div>
            <div style={styles.lessonTitle}>Тест по модулю</div>
            <div style={styles.lessonDur}>10 вопросов</div>
          </div>
        </div>
      </div>
    );
  };

  // Экран: Список чатов
  const ChatListScreen = () => {
    const getLastMessage = (chatId) => {
      const msgs = chatMessages[chatId];
      return msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
    };

    const getUnread = (chatId) => {
      const msgs = chatMessages[chatId];
      if (!msgs) return 0;
      return msgs.filter(m => m.incoming && !m.read).length;
    };

    return (
      <div style={styles.container}>
        <h1 style={{ ...styles.sectionTitle, marginBottom: 16 }}>Чаты</h1>

        {!user.purchased ? (
          <div style={styles.lockedBox}>
            <div style={styles.lockedIcon}>🔒</div>
            <div style={styles.lockedTitle}>Чаты недоступны</div>
            <div style={styles.lockedText}>Оформите подписку для доступа к чатам курса</div>
            <button
              style={{ ...styles.btnPrimary, width: 'auto', padding: '12px 24px' }}
              onClick={() => setScreen('tariffs')}
            >
              Выбрать тариф
            </button>
          </div>
        ) : (
          CHATS.map(chat => {
            const last = getLastMessage(chat.id);
            const unread = getUnread(chat.id);
            return (
              <div
                key={chat.id}
                style={styles.chatCard}
                onClick={() => {
                  setSelectedChat(chat);
                  // Mark messages as read
                  setChatMessages(prev => ({
                    ...prev,
                    [chat.id]: (prev[chat.id] || []).map(m => ({ ...m, read: true })),
                  }));
                  setScreen('chat');
                }}
              >
                <div style={{ ...styles.chatAvatar, background: chat.avatarBg }}>
                  {chat.avatar}
                </div>
                <div style={styles.chatInfo}>
                  <div style={styles.chatName}>{chat.name}</div>
                  <div style={styles.chatLastMsg}>
                    {last ? (last.incoming ? `${last.from}: ${last.text}` : `Вы: ${last.text}`) : 'Нет сообщений'}
                  </div>
                </div>
                <div style={styles.chatMeta}>
                  {last && <div style={styles.chatTime}>{last.time}</div>}
                  {unread > 0 && <div style={styles.chatBadge}>{unread}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  // Экран: Чат (переписка)
  const ChatScreen = () => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = React.useRef(null);
    const messages = chatMessages[selectedChat?.id] || [];

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages.length]);

    const sendMessage = () => {
      const text = inputText.trim();
      if (!text) return;

      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const newMsg = {
        id: Date.now(),
        from: 'you',
        text,
        time: timeStr,
        date: 'Сегодня',
        incoming: false,
        read: true,
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
      }));
      setInputText('');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    // Group messages by date
    const groupedMessages = [];
    let lastDate = null;
    messages.forEach(msg => {
      if (msg.date !== lastDate) {
        groupedMessages.push({ type: 'date', date: msg.date });
        lastDate = msg.date;
      }
      groupedMessages.push({ type: 'msg', ...msg });
    });

    const isChannel = selectedChat?.type === 'channel';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ ...styles.btnBack, marginBottom: 0 }} onClick={() => setScreen('chats')}>
            ←
          </button>
          <div style={{ ...styles.chatAvatar, width: 36, height: 36, fontSize: 16, background: selectedChat?.avatarBg }}>
            {selectedChat?.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{selectedChat?.name}</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>
              {selectedChat?.type === 'support' ? 'Онлайн' : selectedChat?.type === 'channel' ? 'Канал' : 'Группа'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.chatMessages}>
          {groupedMessages.map((item, i) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${i}`} style={styles.msgDateSep}>
                  <div style={styles.msgDateLine}></div>
                  <span>{item.date}</span>
                  <div style={styles.msgDateLine}></div>
                </div>
              );
            }
            return (
              <div key={item.id} style={{ ...styles.msgBubble, ...(item.incoming ? styles.msgIncoming : styles.msgOutgoing) }}>
                {item.incoming && selectedChat?.type === 'group' && (
                  <div style={styles.chatSenderName}>{item.from}</div>
                )}
                <div>{item.text}</div>
                <div style={{ ...styles.msgTime, textAlign: item.incoming ? 'left' : 'right' }}>{item.time}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!isChannel && (
          <div style={styles.chatInputBar}>
            <input
              style={styles.chatInput}
              placeholder="Сообщение..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button style={styles.chatSendBtn} onClick={sendMessage}>
              ↑
            </button>
          </div>
        )}
      </div>
    );
  };

  // Экран: Профиль
  const ProfileScreen = () => (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 700,
        }}>
          {user.name[0]}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            {user.purchased ? `Тариф: ${TARIFFS.find(t => t.id === user.tariff)?.name}` : 'Нет подписки'}
          </div>
        </div>
      </div>

      {user.purchased ? (
        <div style={styles.paymentBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#6b7280' }}>Прогресс</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{Math.round((user.completed / 25) * 100)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>Пройдено уроков</span>
            <span>{user.completed} / 25</span>
          </div>
        </div>
      ) : (
        <div style={{ ...styles.paymentBox, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: 'rgba(16,185,129,0.3)' }}>
          <p style={{ color: '#d1d5db', fontSize: 14, marginBottom: 12 }}>У вас нет активной подписки</p>
          <button
            style={{ ...styles.btnPrimary, padding: '12px 20px' }}
            onClick={() => setScreen('tariffs')}
          >
            Выбрать тариф
          </button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {['Поддержка', 'Оферта', 'О приложении'].map((item, i) => (
          <div
            key={i}
            style={{ ...styles.moduleCard, cursor: 'pointer' }}
            onClick={() => alert(item)}
          >
            <div style={styles.moduleInfo}>
              <div style={styles.moduleTitle}>{item}</div>
            </div>
            <div style={styles.moduleArrow}>›</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Рендер экранов
  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen />;
      case 'tariffs': return <TariffsScreen />;
      case 'payment': return <PaymentScreen />;
      case 'success': return <SuccessScreen />;
      case 'course': return <CourseScreen />;
      case 'module': return <ModuleScreen />;
      case 'chats': return <ChatListScreen />;
      case 'chat': return <ChatScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>
      
      {renderScreen()}

      {/* Навбар */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          {NAV.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(screen === item.id || (item.id === 'home' && screen === 'module') || (item.id === 'chats' && screen === 'chat') ? styles.navItemActive : {}),
                color: screen === item.id || (item.id === 'chats' && screen === 'chat') ? '#10b981' : '#6b7280',
              }}
              onClick={() => setScreen(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
