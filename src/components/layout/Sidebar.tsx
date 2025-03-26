
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

interface SidebarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  toggleTokenModal: () => void;
  toggleColorSchemeModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  toggleCollapse, 
  toggleTokenModal,
  toggleColorSchemeModal
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
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

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-full bg-white shadow-md transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-4 border-b">
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
              <span className="text-xl font-bold text-gray-800 font-sora">Frontdesk</span>
            </div>
          )}
        </div>

        {/* Toggle collapse button */}
        <div className="absolute -right-3 top-20">
          <button
            onClick={toggleCollapse}
            className="rounded-full bg-white p-1 shadow-md hover:bg-gray-100 focus:outline-none"
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
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* API Connection Status */}
        <div className="border-t p-4">
          <button
            onClick={toggleTokenModal}
            className={`sidebar-link ${collapsed ? 'justify-center' : ''} ${isConnected ? 'text-green-500' : 'text-red-500'}`}
            title={isConnected ? 'Conectado - Clique para gerenciar' : 'Desconectado - Clique para conectar'}
          >
            {isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
            {!collapsed && <span>{isConnected ? 'API Conectada' : 'API Desconectada'}</span>}
          </button>
        </div>

        {/* Logout Section */}
        <div className="border-t p-4">
          <button
            onClick={logout}
            className={`sidebar-link ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
