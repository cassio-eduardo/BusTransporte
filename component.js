// <stdin>
import React, { useState, useEffect, useMemo, createContext, useContext } from "https://esm.sh/react@18.2.0";
import { MapPin, Moon, Sun, Clock, Navigation, Settings, QrCode, Heart, Download, Upload, AlertTriangle, Phone, CheckCircle, XCircle } from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var ThemeContext = createContext({ darkMode: false, toggleTheme: () => {
} });
var FavoritesContext = createContext({
  favorites: [],
  toggleFavorite: (id) => {
  },
  isFavorite: (id) => false
});
var useLocalStorage = (key, initialValue) => {
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
var NotificationSystem = ({ notifications, removeNotification }) => {
  if (!notifications.length) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed top-4 right-4 z-50 space-y-2" }, notifications.map((notification) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: notification.id,
      className: `p-4 rounded-lg shadow-lg max-w-md flex items-start gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : notification.type === "error" ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"}`
    },
    notification.type === "success" && /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5 mt-0.5" }),
    notification.type === "error" && /* @__PURE__ */ React.createElement(XCircle, { className: "w-5 h-5 mt-0.5" }),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, notification.title), notification.message && /* @__PURE__ */ React.createElement("p", { className: "text-sm opacity-90" }, notification.message)),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => removeNotification(notification.id),
        className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      },
      "\xD7"
    )
  )));
};
var Header = ({ currentTime, activeTab, setActiveTab }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return /* @__PURE__ */ React.createElement("div", { className: "sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" }, "BusEstudante+"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Ilha Solteira \u2022 ", currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: toggleTheme,
      className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    },
    darkMode ? /* @__PURE__ */ React.createElement(Sun, { className: "w-5 h-5" }) : /* @__PURE__ */ React.createElement(Moon, { className: "w-5 h-5" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setActiveTab(activeTab === "admin" ? "home" : "admin"),
      className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    },
    /* @__PURE__ */ React.createElement(Settings, { className: "w-5 h-5" })
  ))));
};
var RouteCard = ({ route, calculateNextBus }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-bold" }, route.id), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold" }, route.nome)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => toggleFavorite(route.id),
      className: "p-1 hover:scale-110 transition-transform"
    },
    /* @__PURE__ */ React.createElement(Heart, { className: `w-5 h-5 ${isFavorite(route.id) ? "fill-red-500 text-red-500" : "text-gray-400"}` })
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400" }, /* @__PURE__ */ React.createElement(Navigation, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, route.origem, " \u2192 ", route.destino)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-4 h-4" }), route.tempoBase, "-", route.tempoPico, " min"), /* @__PURE__ */ React.createElement("span", null, "\u{1F4CF} ", route.distancia), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs ${route.status === "Frequente" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : route.status === "Ativo" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}` }, route.status))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium mb-1" }, "Pr\xF3ximos hor\xE1rios:"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 text-sm flex-wrap" }, route.proximos.slice(0, 3).map((horario, idx) => /* @__PURE__ */ React.createElement("span", { key: idx, className: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded" }, horario))), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1" }, "Pr\xF3ximo em: ", calculateNextBus(route.proximos))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => window.open(route.url, "_blank"),
      className: "w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    },
    /* @__PURE__ */ React.createElement(MapPin, { className: "w-4 h-4" }),
    "Ver Rota no Google Maps"
  )));
};
var EmergencyButtons = () => /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 right-4 flex flex-col gap-2" }, /* @__PURE__ */ React.createElement(
  "button",
  {
    onClick: () => window.open("https://wa.me/190?text=Emerg\xEAncia%20-%20Preciso%20de%20ajuda%20da%20Pol\xEDcia", "_blank"),
    className: "bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 flex items-center justify-center transition-colors",
    title: "Pol\xEDcia via WhatsApp"
  },
  /* @__PURE__ */ React.createElement(Phone, { className: "w-5 h-5" })
), /* @__PURE__ */ React.createElement(
  "button",
  {
    onClick: () => window.open("https://wa.me/193?text=Emerg\xEAncia%20-%20Preciso%20de%20ajuda%20dos%20Bombeiros", "_blank"),
    className: "bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 flex items-center justify-center transition-colors",
    title: "Bombeiros via WhatsApp"
  },
  "\u{1F692}"
));
var AdminPanel = ({ routes, pontos, exportData }) => /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "\u{1F4CD} Pontos Oficiais"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, pontos.map((ponto, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, ponto))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "\u23F1\uFE0F Tempos de Rota"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, routes.slice(0, 3).map((route) => /* @__PURE__ */ React.createElement("div", { key: route.id, className: "p-3 bg-gray-100 dark:bg-gray-700 rounded" }, /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, route.nome), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Base: ", route.tempoBase, "min | Pico: ", route.tempoPico, "min"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "\u{1F4BE} Dados Locais"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("button", { onClick: exportData, className: "w-full flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700" }, /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4" }), "Exportar Configura\xE7\xE3o"), /* @__PURE__ */ React.createElement("button", { className: "w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" }, /* @__PURE__ */ React.createElement(Upload, { className: "w-4 h-4" }), "Importar Dados"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "\u{1F527} Status"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Rotas ativas:"), /* @__PURE__ */ React.createElement("span", { className: "font-medium text-green-600" }, routes.length)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Pontos cadastrados:"), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, pontos.length)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "PWA Status:"), /* @__PURE__ */ React.createElement("span", { className: "font-medium text-green-600" }, "Ativo"))))));
var AppProviders = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage("busestudante-theme", false);
  const [favorites, setFavorites] = useLocalStorage("busestudante-favorites", []);
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleFavorite = (routeId) => {
    setFavorites(
      (prev) => prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  };
  const isFavorite = (routeId) => favorites.includes(routeId);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  return /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: { darkMode, toggleTheme } }, /* @__PURE__ */ React.createElement(FavoritesContext.Provider, { value: { favorites, toggleFavorite, isFavorite } }, children));
};
var routesData = [
  {
    id: "TL01",
    nome: "Tr\xEAs Lagoas Express",
    origem: "Terminal Central - Ilha Solteira",
    destino: "Rodovi\xE1ria - Tr\xEAs Lagoas (MS)",
    tempoBase: 35,
    tempoPico: 45,
    distancia: "42 km",
    status: "Ativo",
    proximos: ["07:30", "12:15", "17:45"],
    url: "https://www.google.com/maps/dir/Ilha+Solteira,+SP/Tr%C3%AAs+Lagoas,+MS/@-20.3857,-50.6827,10z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x9498e2e5b8f5f5f5:0x1234567890123456!2m2!1d-51.3447!2d-20.4297!1m5!1m1!1s0x948c7f8b5d5d5d5d:0x9876543210987654!2m2!1d-51.6789!2d-20.7539!3e0"
  },
  {
    id: "SF02",
    nome: "Santa F\xE9 Universit\xE1rio",
    origem: "Campus UNESP - Ilha Solteira",
    destino: "Centro - Santa F\xE9 do Sul (SP)",
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
    origem: "Terminal Rodovi\xE1rio - Ilha Solteira",
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
function BusEstudanteApp() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentTime, setCurrentTime] = useState(/* @__PURE__ */ new Date());
  const [pontoOrigem, setPontoOrigem] = useState("");
  const [pontoDestino, setPontoDestino] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [pontos] = useLocalStorage("busestudante-pontos", [
    "Terminal Central - Ilha Solteira",
    "Campus UNESP - Ilha Solteira",
    "Hospital Municipal",
    "Centro Comercial",
    "Terminal Rodovi\xE1rio",
    "Pra\xE7a da Matriz",
    "Zona Norte Residencial"
  ]);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(timer);
  }, []);
  const addNotification = (type, title, message = "") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeNotification(id), 5e3);
  };
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const calcularRota = () => {
    if (!pontoOrigem || !pontoDestino) {
      addNotification("error", "Campos obrigat\xF3rios", "Por favor, selecione origem e destino!");
      return;
    }
    const rota = routesData.find(
      (route) => (route.origem.includes(pontoOrigem) || pontoOrigem.includes("Terminal Central")) && (route.destino.includes(pontoDestino) || pontoDestino === "Tr\xEAs Lagoas (MS)" && route.nome.includes("Tr\xEAs Lagoas") || pontoDestino === "Santa F\xE9 do Sul (SP)" && route.nome.includes("Santa F\xE9") || pontoDestino === "Andradina (SP)" && route.nome.includes("Andradina"))
    );
    if (rota) {
      const isPico = currentTime.getHours() >= 7 && currentTime.getHours() <= 9 || currentTime.getHours() >= 17 && currentTime.getHours() <= 19;
      const tempo = isPico ? rota.tempoPico : rota.tempoBase;
      addNotification(
        "success",
        `\u{1F68C} ${rota.nome}`,
        `\u23F1\uFE0F Tempo: ${tempo} min | \u{1F4CF} ${rota.distancia}`
      );
      setSelectedRoute(rota);
    } else {
      addNotification("error", "Rota n\xE3o encontrada", "Verifique se existe conex\xE3o direta entre os pontos selecionados.");
    }
  };
  const calculateNextBus = (proximos) => {
    const now = /* @__PURE__ */ new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const horario of proximos) {
      const [hours, minutes] = horario.split(":").map(Number);
      const horarioMinutes = hours * 60 + minutes;
      if (horarioMinutes > currentMinutes) {
        const diff = horarioMinutes - currentMinutes;
        return diff < 60 ? `${diff} min` : `${Math.floor(diff / 60)}h${diff % 60}min`;
      }
    }
    return "Pr\xF3ximo: amanh\xE3";
  };
  const exportData = () => {
    const data = { routes: routesData, pontos };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "busestudante-ilha-solteira.json";
    a.click();
    URL.revokeObjectURL(url);
    addNotification("success", "Dados exportados", "Arquivo JSON baixado com sucesso!");
  };
  const filteredRoutes = useMemo(
    () => routesData.filter(
      (route) => route.nome.toLowerCase().includes(search.toLowerCase()) || route.origem.toLowerCase().includes(search.toLowerCase()) || route.destino.toLowerCase().includes(search.toLowerCase()) || route.id.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );
  if (activeTab === "admin") {
    return /* @__PURE__ */ React.createElement(AppProviders, null, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4" }, /* @__PURE__ */ React.createElement(Header, { currentTime, activeTab, setActiveTab }), /* @__PURE__ */ React.createElement("div", { className: "mt-6" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold mb-6" }, "\u2699\uFE0F Admin - Ilha Solteira"), /* @__PURE__ */ React.createElement(AdminPanel, { routes: routesData, pontos, exportData })), /* @__PURE__ */ React.createElement(NotificationSystem, { notifications, removeNotification })));
  }
  return /* @__PURE__ */ React.createElement(AppProviders, null, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen" }, /* @__PURE__ */ React.createElement(Header, { currentTime, activeTab, setActiveTab }), /* @__PURE__ */ React.createElement("div", { className: "p-4 max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Navigation, { className: "w-5 h-5" }), "\u{1F5FA}\uFE0F Planejar Rota Regional"), /* @__PURE__ */ React.createElement("div", { className: "grid gap-3" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: pontoOrigem,
      onChange: (e) => setPontoOrigem(e.target.value),
      className: "p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o ponto de partida..."),
    pontos.map((ponto, idx) => /* @__PURE__ */ React.createElement("option", { key: idx, value: ponto }, ponto))
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: pontoDestino,
      onChange: (e) => setPontoDestino(e.target.value),
      className: "p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o destino..."),
    /* @__PURE__ */ React.createElement("option", { value: "Tr\xEAs Lagoas (MS)" }, "Tr\xEAs Lagoas (MS)"),
    /* @__PURE__ */ React.createElement("option", { value: "Santa F\xE9 do Sul (SP)" }, "Santa F\xE9 do Sul (SP)"),
    /* @__PURE__ */ React.createElement("option", { value: "Andradina (SP)" }, "Andradina (SP)"),
    /* @__PURE__ */ React.createElement("option", { value: "UNESP Campus" }, "UNESP Campus"),
    /* @__PURE__ */ React.createElement("option", { value: "Hospital Municipal" }, "Hospital Municipal"),
    /* @__PURE__ */ React.createElement("option", { value: "Zona Norte Residencial" }, "Zona Norte Residencial")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: calcularRota,
      className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
    },
    "Calcular Rota e Tempo"
  ))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u{1F50D} Buscar rota, destino ou linha...",
      value: search,
      onChange: (e) => setSearch(e.target.value),
      className: "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4" }, filteredRoutes.map((route) => /* @__PURE__ */ React.createElement(RouteCard, { key: route.id, route, calculateNextBus }))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-3" }, "\u{1F3AB} Carteira Digital"), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-100 dark:bg-gray-700 w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3" }, /* @__PURE__ */ React.createElement(QrCode, { className: "w-16 h-16 text-gray-400" })), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Escaneie para validar passagem"))), /* @__PURE__ */ React.createElement(EmergencyButtons, null), /* @__PURE__ */ React.createElement(NotificationSystem, { notifications, removeNotification }), /* @__PURE__ */ React.createElement("footer", { className: "mt-12 p-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700" }, /* @__PURE__ */ React.createElement("p", null, "\xA9 2025 BusEstudante+ \u2022 Transporte Inteligente para Estudantes"), /* @__PURE__ */ React.createElement("p", { className: "mt-1" }, "Ilha Solteira (SP) \u2022 Vers\xE3o 2.0 \u2022 C\xE1ssio Oliveira"))));
}
export {
  BusEstudanteApp as default
};
