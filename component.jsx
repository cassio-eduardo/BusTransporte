import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { MapPin, Moon, Sun, Clock, Navigation, Settings, QrCode, Heart, Download, Upload, AlertTriangle, Phone, CheckCircle, XCircle } from "lucide-react";

// Context para tema
const ThemeContext = createContext({ darkMode: false, toggleTheme: () => {} });

// Context para favoritos
const FavoritesContext = createContext({ 
  favorites: [], 
  toggleFavorite: (id) => {},
  isFavorite: (id) => false 
});

// Hook personalizado para localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

// Sistema de notificações (substitui alert)
const NotificationSystem = ({ notifications, removeNotification }) => {
  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-md flex items-start gap-3 transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : notification.type === 'error'
              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 mt-0.5" />}
          <div className="flex-1">
            <p className="font-medium">{notification.title}</p>
            {notification.message && <p className="text-sm opacity-90">{notification.message}</p>}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Componente Header extraído
const Header = ({ currentTime, activeTab, setActiveTab }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ConectBus
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ilha Solteira • {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "admin" ? "home" : "admin")} 
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente RouteCard extraído
const RouteCard = ({ route, calculateNextBus }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-bold">
              {route.id}
            </div>
            <h3 className="text-lg font-semibold">{route.nome}</h3>
          </div>
          <button 
            onClick={() => toggleFavorite(route.id)} 
            className="p-1 hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isFavorite(route.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Navigation className="w-4 h-4" />
            <span>{route.origem} → {route.destino}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {route.tempoBase}-{route.tempoPico} min
            </span>
            <span>📏 {route.distancia}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              route.status === 'Frequente' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              route.status === 'Ativo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {route.status}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium mb-1">Próximos horários:</div>
          <div className="flex gap-2 text-sm flex-wrap">
            {route.proximos.slice(0, 3).map((horario, idx) => (
              <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {horario}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Próximo em: {calculateNextBus(route.proximos)}
          </div>
        </div>

        <button 
          onClick={() => window.open(route.url, "_blank")} 
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Ver Rota no Google Maps
        </button>
      </div>
    </div>
  );
};

// Componente EmergencyButtons extraído
const EmergencyButtons = () => (
  <div className="fixed bottom-4 right-4 flex flex-col gap-2">
    <button 
      onClick={() => window.open("https://wa.me/190?text=Emergência%20-%20Preciso%20de%20ajuda%20da%20Polícia", "_blank")} 
      className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 flex items-center justify-center transition-colors"
      title="Polícia via WhatsApp"
    >
      <Phone className="w-5 h-5" />
    </button>
    <button 
      onClick={() => window.open("https://wa.me/193?text=Emergência%20-%20Preciso%20de%20ajuda%20dos%20Bombeiros", "_blank")} 
      className="bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 flex items-center justify-center transition-colors"
      title="Bombeiros via WhatsApp"
    >
      🚒
    </button>
  </div>
);

// Componente AdminPanel extraído
const AdminPanel = ({ routes, pontos, exportData }) => (
  <div className="max-w-4xl mx-auto">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">📍 Pontos Oficiais</h3>
        <div className="space-y-2">
          {pontos.map((ponto, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <MapPin className="w-4 h-4" />
              <span className="flex-1">{ponto}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">⏱️ Tempos de Rota</h3>
        <div className="space-y-3">
          {routes.slice(0, 3).map(route => (
            <div key={route.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{route.nome}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Base: {route.tempoBase}min | Pico: {route.tempoPico}min
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">💾 Dados Locais</h3>
        <div className="space-y-3">
          <button onClick={exportData} className="w-full flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            Exportar Configuração
          </button>
          <button className="w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            Importar Dados
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">🔧 Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Rotas ativas:</span>
            <span className="font-medium text-green-600">{routes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Pontos cadastrados:</span>
            <span className="font-medium">{pontos.length}</span>
          </div>
          <div className="flex justify-between">
            <span>PWA Status:</span>
            <span className="font-medium text-green-600">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Providers principais
const AppProviders = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage('conectbus-theme', false);
  const [favorites, setFavorites] = useLocalStorage('conectbus-favorites', []);

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const toggleFavorite = (routeId) => {
    setFavorites(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const isFavorite = (routeId) => favorites.includes(routeId);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
        {children}
      </FavoritesContext.Provider>
    </ThemeContext.Provider>
  );
};

// Dados das rotas (movido para módulo de dados)
const routesData = [
  { 
    id: "TL01", 
    nome: "Três Lagoas Express",
    origem: "Terminal Central - Ilha Solteira", 
    destino: "Rodoviária - Três Lagoas (MS)",
    tempoBase: 35, 
    tempoPico: 45, 
    distancia: "42 km",
    status: "Ativo",
    proximos: ["07:30", "12:15", "17:45"],
    url: "https://www.google.com/maps/dir/Ilha+Solteira,+SP/Tr%C3%AAs+Lagoas,+MS/@-20.3857,-50.6827,10z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c7f8b5d5d5d5d:0x9876543210987654!2m2!1d-51.6789!2d-20.7539!3e0"
  },
  { 
    id: "SF02", 
    nome: "Santa Fé Universitário",
    origem: "Campus UNESP - Ilha Solteira", 
    destino: "Centro - Santa Fé do Sul (SP)",
    tempoBase: 85, 
    tempoPico: 100, 
    distancia: "78 km",
    status: "Ativo",
    proximos: ["06:45", "14:20", "19:30"],
    url: "https://www.google.com/maps/dir/Ilha+Solteira,+SP/Santa+F%C3%A9+do+Sul,+SP/@-20.2156,-50.8234,11z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c8a2b5d5d5d5d:0x9876543210987654!2m2!1d-50.9289!2d-20.2156!3e0"
  },
  { 
    id: "AN03", 
    nome: "Andradina Regional",
    origem: "Terminal Rodoviário - Ilha Solteira", 
    destino: "Terminal Urbano - Andradina (SP)",
    tempoBase: 70, 
    tempoPico: 85, 
    distancia: "65 km",
    status: "Ativo",
    proximos: ["08:15", "13:45", "18:20"],
    url: "https://www.google.com/maps/dir/Ilha+Solteira,+SP/Andradina,+SP/@-20.8945,-51.1234,11z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c9a3b5d5d5d5d:0x9876543210987654!2m2!1d-51.3789!2d-20.8945!3e0"
  },
  { 
    id: "LC04", 
    nome: "Linha Campus",
    origem: "Centro da Cidade", 
    destino: "UNESP Campus",
    tempoBase: 15, 
    tempoPico: 20, 
    distancia: "8 km",
    status: "Frequente",
    proximos: ["07:00", "07:30", "08:00", "08:30"],
    url: "https://www.google.com/maps/dir/Centro,+Ilha+Solteira,+SP/UNESP+-+Campus+de+Ilha+Solteira,+Ilha+Solteira,+SP/@-20.4297,-51.3447,14z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c7f8b5d5d5d5d:0x9876543210987654!2m2!1d-51.3789!2d-20.4156!3e0"
  },
  { 
    id: "HM05", 
    nome: "Hospital Municipal",
    origem: "Terminal Central", 
    destino: "Hospital Municipal",
    tempoBase: 12, 
    tempoPico: 18, 
    distancia: "5 km",
    status: "Ativo",
    proximos: ["06:30", "09:15", "14:00", "16:45"],
    url: "https://www.google.com/maps/dir/Terminal+Central,+Ilha+Solteira,+SP/Hospital+Municipal+de+Ilha+Solteira,+Ilha+Solteira,+SP/@-20.4297,-51.3447,15z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c7f8b5d5d5d5d:0x9876543210987654!2m2!1d-51.3389!2d-20.4356!3e0"
  },
  { 
    id: "ZN06", 
    nome: "Zona Norte Residencial",
    origem: "Terminal Central", 
    destino: "Bairro Residencial Norte",
    tempoBase: 25, 
    tempoPico: 35, 
    distancia: "12 km",
    status: "Normal",
    proximos: ["05:45", "11:30", "15:20", "20:10"],
    url: "https://www.google.com/maps/dir/Terminal+Central,+Ilha+Solteira,+SP/Zona+Norte,+Ilha+Solteira,+SP/@-20.4197,-51.3447,14z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c7f8b5d5d5d5d:0x9876543210987654!2m2!1d-51.3247!2d-20.4097!3e0"
  }
];

export default function ConectBusApp() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pontoOrigem, setPontoOrigem] = useState("");
  const [pontoDestino, setPontoDestino] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Pontos de embarque oficiais
  const [pontos] = useLocalStorage('conectbus-pontos', [
    "Terminal Central - Ilha Solteira",
    "Campus UNESP - Ilha Solteira", 
    "Hospital Municipal",
    "Centro Comercial",
    "Terminal Rodoviário",
    "Praça da Matriz",
    "Zona Norte Residencial"
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sistema de notificações melhorado
  const addNotification = (type, title, message = "") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const calcularRota = () => {
    if (!pontoOrigem || !pontoDestino) {
      addNotification("error", "Campos obrigatórios", "Por favor, selecione origem e destino!");
      return;
    }
    
    const rota = routesData.find(route => 
      (route.origem.includes(pontoOrigem) || pontoOrigem.includes("Terminal Central")) &&
      (route.destino.includes(pontoDestino) || 
       pontoDestino === "Três Lagoas (MS)" && route.nome.includes("Três Lagoas") ||
       pontoDestino === "Santa Fé do Sul (SP)" && route.nome.includes("Santa Fé") ||
       pontoDestino === "Andradina (SP)" && route.nome.includes("Andradina"))
    );

    if (rota) {
      const isPico = currentTime.getHours() >= 7 && currentTime.getHours() <= 9 || 
                     currentTime.getHours() >= 17 && currentTime.getHours() <= 19;
      const tempo = isPico ? rota.tempoPico : rota.tempoBase;
      
      addNotification("success", 
        `🚌 ${rota.nome}`, 
        `⏱️ Tempo: ${tempo} min | 📏 ${rota.distancia}`
      );
      setSelectedRoute(rota);
    } else {
      addNotification("error", "Rota não encontrada", "Verifique se existe conexão direta entre os pontos selecionados.");
    }
  };

  const calculateNextBus = (proximos) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const horario of proximos) {
      const [hours, minutes] = horario.split(':').map(Number);
      const horarioMinutes = hours * 60 + minutes;
      
      if (horarioMinutes > currentMinutes) {
        const diff = horarioMinutes - currentMinutes;
        return diff < 60 ? `${diff} min` : `${Math.floor(diff / 60)}h${diff % 60}min`;
      }
    }
    return "Próximo: amanhã";
  };

  const exportData = () => {
    const data = { routes: routesData, pontos };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conectbus-ilha-solteira.json';
    a.click();
    URL.revokeObjectURL(url);
    addNotification("success", "Dados exportados", "Arquivo JSON baixado com sucesso!");
  };

  // Filtros com memoização para performance
  const filteredRoutes = useMemo(() => 
    routesData.filter(route =>
      route.nome.toLowerCase().includes(search.toLowerCase()) ||
      route.origem.toLowerCase().includes(search.toLowerCase()) ||
      route.destino.toLowerCase().includes(search.toLowerCase()) ||
      route.id.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  if (activeTab === "admin") {
    return (
      <AppProviders>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4">
          <Header currentTime={currentTime} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-6">⚙️ Admin - Ilha Solteira</h1>
            <AdminPanel routes={routesData} pontos={pontos} exportData={exportData} />
          </div>
          <NotificationSystem notifications={notifications} removeNotification={removeNotification} />
        </div>
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <Header currentTime={currentTime} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-4 max-w-4xl mx-auto">
          {/* Planejar Rota */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              🗺️ Planejar Rota Regional
            </h2>
            <div className="grid gap-3">
              <select 
                value={pontoOrigem}
                onChange={(e) => setPontoOrigem(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="">Selecione o ponto de partida...</option>
                {pontos.map((ponto, idx) => (
                  <option key={idx} value={ponto}>{ponto}</option>
                ))}
              </select>
              <select 
                value={pontoDestino}
                onChange={(e) => setPontoDestino(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="">Selecione o destino...</option>
                <option value="Três Lagoas (MS)">Três Lagoas (MS)</option>
                <option value="Santa Fé do Sul (SP)">Santa Fé do Sul (SP)</option>
                <option value="Andradina (SP)">Andradina (SP)</option>
                <option value="UNESP Campus">UNESP Campus</option>
                <option value="Hospital Municipal">Hospital Municipal</option>
                <option value="Zona Norte Residencial">Zona Norte Residencial</option>
              </select>
              <button 
                onClick={calcularRota}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Calcular Rota e Tempo
              </button>
            </div>
          </div>

          {/* Buscar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar rota, destino ou linha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          {/* Lista de Rotas */}
          <div className="grid gap-4">
            {filteredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} calculateNextBus={calculateNextBus} />
            ))}
          </div>

          {/* QR Code de Carteira */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-3">🎫 Carteira Digital</h3>
            <div className="bg-gray-100 dark:bg-gray-700 w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Escaneie para validar passagem</p>
          </div>
        </div>

        <EmergencyButtons />
        <NotificationSystem notifications={notifications} removeNotification={removeNotification} />

        {/* Footer */}
        <footer className="mt-12 p-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>© 2025 ConectBus • Transporte Inteligente para Estudantes</p>
          <p className="mt-1">Ilha Solteira (SP) • Versão 2.0 • Cássio Oliveira</p>
        </footer>
      </div>
    </AppProviders>
  );
}