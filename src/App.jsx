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

  // Навигация
  const NAV = [
    { id: 'home', icon: '📈', label: 'Главная' },
    { id: 'tariffs', icon: '⭐', label: 'Тарифы' },
    { id: 'course', icon: '📚', label: 'Курс' },
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
                ...(screen === item.id || (item.id === 'home' && screen === 'module') ? styles.navItemActive : {}),
                color: screen === item.id ? '#10b981' : '#6b7280',
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
