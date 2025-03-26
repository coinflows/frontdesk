import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Building, BookOpen, RefreshCw, Palette } from 'lucide-react';
import { getCurrentMonthName, getCurrentYear } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getProperties, getBookings, getUsers } from '../../services/api';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeBookings: 0,
    lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    bookingsThisMonth: 0,
    totalRevenue: 'R$ 0,00',
    occupancyRate: '0%',
    popularChannels: [
      { name: 'Airbnb', percentage: 0 },
      { name: 'Booking.com', percentage: 0 },
      { name: 'Expedia', percentage: 0 },
      { name: 'Direto', percentage: 0 },
    ],
    recentActivity: []
  });

  const colorSchemes = [
    { name: 'Azul (Padrão)', primary: '#3B82F6', secondary: '#60A5FA' },
    { name: 'Roxo', primary: '#7E69AB', secondary: '#9b87f5' },
    { name: 'Verde', primary: '#10B981', secondary: '#34D399' },
    { name: 'Vermelho', primary: '#EF4444', secondary: '#F87171' },
    { name: 'Laranja', primary: '#F59E0B', secondary: '#FBBF24' },
    { name: 'Rosa', primary: '#EC4899', secondary: '#F472B6' },
  ];

  const fetchDashboardData = async () => {
    if (!user?.token) {
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível carregar os dados. Token não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const propertiesResult = await getProperties(user.token);
      
      const bookingsResult = await getBookings(user.token);
      
      const usersResult = await getUsers(user.token);

      if (propertiesResult.success && bookingsResult.success && usersResult.success) {
        const properties = propertiesResult.data;
        const bookings = bookingsResult.data;
        const users = usersResult.data;

        console.log("API Response - Properties:", properties);
        console.log("API Response - Bookings:", bookings);

        const channelCounts: Record<string, number> = {};
        let totalBookings = bookings.length;

        bookings.forEach((booking: any) => {
          const channel = booking.channelName || 'Direto';
          channelCounts[channel] = (channelCounts[channel] || 0) + 1;
        });

        const channelDistribution = Object.keys(channelCounts).map(channel => ({
          name: channel,
          percentage: Math.round((channelCounts[channel] / totalBookings) * 100) || 0
        }));

        const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const bookingsThisMonth = bookings.filter((booking: any) => {
          const bookingDate = new Date(booking.dateFrom);
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        }).length;

        setDashboardData({
          totalUsers: users.length,
          totalProperties: properties.length,
          activeBookings: bookings.filter((b: any) => b.status === 'confirmed').length,
          lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          bookingsThisMonth,
          totalRevenue: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
          occupancyRate: '78%',
          popularChannels: channelDistribution.slice(0, 4),
          recentActivity: [
            { id: 1, content: 'Nova reserva criada para Apartamento Luxo Centro', date: '15 min atrás', type: 'booking' },
            { id: 2, content: 'Usuário Ana Costa editou preços em Casa de Praia Premium', date: '2 horas atrás', type: 'price' },
            { id: 3, content: 'Novo usuário cadastrado: Marcelo Souza', date: '5 horas atrás', type: 'user' },
            { id: 4, content: 'Sincronização com Airbnb concluída para todas as propriedades', date: '1 dia atrás', type: 'sync' },
          ]
        });

        toast({
          title: "Dados atualizados",
          description: "Os dados do painel foram atualizados com sucesso.",
          variant: "default",
        });
      } else {
        toast({
          title: "Erro ao carregar dados",
          description: propertiesResult.error || bookingsResult.error || "Não foi possível carregar todos os dados necessários.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro no servidor",
        description: "Ocorreu um erro ao tentar carregar os dados do painel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.apiConnected && user?.token) {
      fetchDashboardData();
    }
  }, [user?.apiConnected, user?.token]);

  const handleRefreshData = () => {
    fetchDashboardData();
  };

  const currentMonth = getCurrentMonthName();
  const currentYear = getCurrentYear();

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">Painel Administrativo</h1>
          <div className="flex items-center gap-3">
            <button 
              className="btn-secondary flex items-center gap-2"
              onClick={() => setShowColorModal(true)}
              title="Esquema de cores"
            >
              <Palette size={16} />
              <span className="hidden sm:inline">Cores</span>
            </button>
            
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={handleRefreshData}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Atualizando..." : "Atualizar dados"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Usuários</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{dashboardData.totalUsers}</h3>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 text-blue-600 dark:text-blue-300">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Propriedades</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{dashboardData.totalProperties}</h3>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 text-green-600 dark:text-green-300">
                <Building size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reservas Ativas</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{dashboardData.activeBookings}</h3>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 text-purple-600 dark:text-purple-300">
                <BookOpen size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Sincronização</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{dashboardData.lastSync}</h3>
              </div>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 text-amber-600 dark:text-amber-300">
                <RefreshCw size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card-dashboard lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visão Geral</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reservas em {currentMonth}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.bookingsThisMonth}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div className="h-2 rounded-full bg-frontdesk-500 dark:bg-frontdesk-400" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Faturamento {currentMonth}/{currentYear}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.totalRevenue}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div className="h-2 rounded-full bg-green-500 dark:bg-green-400" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Ocupação</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.occupancyRate}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div className="h-2 rounded-full bg-amber-500 dark:bg-amber-400" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Próximos Checkouts</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">8</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div className="h-2 rounded-full bg-purple-500 dark:bg-purple-400" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-dashboard">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Distribuição de Canais</h3>
            <div className="mt-4 space-y-3">
              {dashboardData.popularChannels.map((channel) => (
                <div key={channel.name} className="flex items-center">
                  <div className="w-24 text-sm text-gray-700 dark:text-gray-300">{channel.name}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className={`h-2 rounded-full ${
                          channel.name === 'Airbnb' ? 'bg-red-500 dark:bg-red-400' :
                          channel.name === 'Booking.com' ? 'bg-blue-500 dark:bg-blue-400' :
                          channel.name === 'Expedia' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-green-500 dark:bg-green-400'
                        }`}
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-2 w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    {channel.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-dashboard">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Atividade Recente</h3>
          <div className="mt-4 flow-root">
            <ul className="-mb-8">
              {dashboardData.recentActivity.map((item) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          item.type === 'booking' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                          item.type === 'price' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                          item.type === 'user' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          {item.type === 'booking' && <BookOpen size={16} />}
                          {item.type === 'price' && <RefreshCw size={16} />}
                          {item.type === 'user' && <Users size={16} />}
                          {item.type === 'sync' && <RefreshCw size={16} />}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.content}</p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showColorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white font-sora">Configurações de Aparência</h3>
              <button
                onClick={() => setShowColorModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-800 dark:text-white">Modo de Exibição</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                  </span>
                  <button
                    onClick={() => {
                      const newTheme = theme === 'dark' ? 'light' : 'dark';
                      document.documentElement.classList.toggle('dark');
                      localStorage.setItem('frontdesk_theme', newTheme);
                    }}
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
                      document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange', 'theme-pink');
                      document.documentElement.classList.add(`theme-${scheme.name.toLowerCase().split(' ')[0]}`);
                      setShowColorModal(false);
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
