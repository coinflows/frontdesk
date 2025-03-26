
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Home, 
  Users, 
  Building, 
  Calendar,
  BookOpen,
  BarChart3,
  DollarSign,
  Ban,
  Building2,
  LayersIcon,
  LogOut,
  Wifi,
  WifiOff,
  Palette
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '@/components/ui/button';

interface SidebarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  toggleTokenModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapse, toggleTokenModal }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showColorSchemeModal, setShowColorSchemeModal] = useState(false);
  const isAdmin = user?.role === 'admin';
  const isConnected = user?.apiConnected || false;

  const adminLinks: SidebarLink[] = [
    { to: '/admin', icon: <Home size={20} />, label: 'Painel' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Usuários' },
    { to: '/admin/properties', icon: <Building size={20} />, label: 'Propriedades' },
    { to: '/admin/bookings', icon: <BookOpen size={20} />, label: 'Reservas' },
    { to: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Relatórios' },
  ];

  const userLinks: SidebarLink[] = [
    { to: '/user', icon: <Home size={20} />, label: 'Painel' },
    { to: '/user/calendar', icon: <Calendar size={20} />, label: 'Calendário' },
    { to: '/user/pricing', icon: <DollarSign size={20} />, label: 'Preços' },
    { to: '/user/availability', icon: <Ban size={20} />, label: 'Bloqueios' },
    { to: '/user/property', icon: <Building2 size={20} />, label: 'Propriedade' },
    { to: '/user/reports', icon: <BarChart3 size={20} />, label: 'Relatórios' },
    { to: '/user/channels', icon: <LayersIcon size={20} />, label: 'Canais (OTA)' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  // Color scheme options
  const colorSchemes = [
    { name: 'Azul (Padrão)', primary: '#3B82F6', secondary: '#60A5FA' },
    { name: 'Roxo', primary: '#7E69AB', secondary: '#9b87f5' },
    { name: 'Verde', primary: '#10B981', secondary: '#34D399' },
    { name: 'Vermelho', primary: '#EF4444', secondary: '#F87171' },
    { name: 'Laranja', primary: '#F59E0B', secondary: '#FBBF24' },
    { name: 'Rosa', primary: '#EC4899', secondary: '#F472B6' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-full bg-white shadow-md transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-4 border-b dark:border-gray-700">
          {collapsed ? (
            <img 
              src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64" 
              alt="Frontdesk Logo" 
              className="h-10 w-10"
            />
          ) : (
            <div className="flex items-center">
              <img 
                src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64" 
                alt="Frontdesk Logo" 
                className="h-8 mr-2"
              />
              <span className="text-xl font-bold text-gray-800 dark:text-white font-sora">Frontdesk</span>
            </div>
          )}
        </div>

        {/* Toggle collapse button */}
        <div className="absolute -right-3 top-20">
          <button
            onClick={toggleCollapse}
            className="rounded-full bg-white p-1 shadow-md hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`sidebar-link ${
                    location.pathname === link.to ? 'active' : ''
                  } ${collapsed ? 'justify-center' : ''} dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* API Connection Status */}
        <div className="border-t p-4 dark:border-gray-700">
          <button
            onClick={toggleTokenModal}
            className={`sidebar-link ${collapsed ? 'justify-center' : ''} ${isConnected ? 'text-green-500' : 'text-red-500'} dark:text-gray-200 dark:hover:bg-gray-700`}
            title={isConnected ? 'Conectado - Clique para gerenciar' : 'Desconectado - Clique para conectar'}
          >
            {isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
            {!collapsed && <span>{isConnected ? 'API Conectada' : 'API Desconectada'}</span>}
          </button>
        </div>

        {/* Logout Section */}
        <div className="border-t p-4 dark:border-gray-700">
          <button
            onClick={logout}
            className={`sidebar-link ${collapsed ? 'justify-center' : ''} dark:text-gray-200 dark:hover:bg-gray-700`}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Color Scheme Modal */}
      {showColorSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white font-sora">Configurações de Aparência</h3>
              <button
                onClick={() => setShowColorSchemeModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Modo escuro/claro toggle */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-800 dark:text-white">Modo de Exibição</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
                  </button>
                </div>
              </div>
              
              <h4 className="font-medium mb-3 text-gray-800 dark:text-white">Esquema de Cores</h4>
              <div className="grid grid-cols-2 gap-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-all"
                    onClick={() => {
                      document.documentElement.style.setProperty('--primary-color', scheme.primary);
                      document.documentElement.style.setProperty('--secondary-color', scheme.secondary);
                      // Atualizar cores do frontdesk no CSS
                      document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange', 'theme-pink');
                      document.documentElement.classList.add(`theme-${scheme.name.toLowerCase().split(' ')[0]}`);
                      setShowColorSchemeModal(false);
                    }}
                  >
                    <div className="flex space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{scheme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
