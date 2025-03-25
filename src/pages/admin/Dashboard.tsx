
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Building, BookOpen, RefreshCw } from 'lucide-react';
import { getCurrentMonthName, getCurrentYear } from '../../utils/formatters';

const AdminDashboard = () => {
  // In a real app, this data would come from API calls
  const dashboardData = {
    totalUsers: 12,
    totalProperties: 28,
    activeBookings: 47,
    lastSync: '15/12/2023 14:32',
    bookingsThisMonth: 23,
    totalRevenue: 'R$ 34.650,00',
    occupancyRate: '78%',
    popularChannels: [
      { name: 'Airbnb', percentage: 45 },
      { name: 'Booking.com', percentage: 38 },
      { name: 'Expedia', percentage: 12 },
      { name: 'Direto', percentage: 5 },
    ]
  };

  const currentMonth = getCurrentMonthName();
  const currentYear = getCurrentYear();

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <button className="btn-primary flex items-center gap-2">
            <RefreshCw size={16} />
            <span>Atualizar dados</span>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900">{dashboardData.totalUsers}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Propriedades</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900">{dashboardData.totalProperties}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Building size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reservas Ativas</p>
                <h3 className="mt-1 text-3xl font-semibold text-gray-900">{dashboardData.activeBookings}</h3>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <BookOpen size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Última Sincronização</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{dashboardData.lastSync}</h3>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <RefreshCw size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Statistics Card */}
          <div className="card-dashboard lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Visão Geral</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Reservas em {currentMonth}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.bookingsThisMonth}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-frontdesk-500" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Faturamento {currentMonth}/{currentYear}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.totalRevenue}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Taxa de Ocupação</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.occupancyRate}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Próximos Checkouts</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">8</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Channels Distribution */}
          <div className="card-dashboard">
            <h3 className="text-lg font-medium text-gray-900">Distribuição de Canais</h3>
            <div className="mt-4 space-y-3">
              {dashboardData.popularChannels.map((channel) => (
                <div key={channel.name} className="flex items-center">
                  <div className="w-24 text-sm">{channel.name}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${
                          channel.name === 'Airbnb' ? 'bg-red-500' :
                          channel.name === 'Booking.com' ? 'bg-blue-500' :
                          channel.name === 'Expedia' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-2 w-12 text-right text-sm font-medium">
                    {channel.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-dashboard">
          <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
          <div className="mt-4 flow-root">
            <ul className="-mb-8">
              {[
                { id: 1, content: 'Nova reserva criada para Apartamento Luxo Centro', date: '15 min atrás', type: 'booking' },
                { id: 2, content: 'Usuário Ana Costa editou preços em Casa de Praia Premium', date: '2 horas atrás', type: 'price' },
                { id: 3, content: 'Novo usuário cadastrado: Marcelo Souza', date: '5 horas atrás', type: 'user' },
                { id: 4, content: 'Sincronização com Airbnb concluída para todas as propriedades', date: '1 dia atrás', type: 'sync' },
              ].map((item) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          item.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                          item.type === 'price' ? 'bg-green-100 text-green-600' :
                          item.type === 'user' ? 'bg-purple-100 text-purple-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {item.type === 'booking' && <BookOpen size={16} />}
                          {item.type === 'price' && <RefreshCw size={16} />}
                          {item.type === 'user' && <Users size={16} />}
                          {item.type === 'sync' && <RefreshCw size={16} />}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-500">{item.content}</p>
                          <p className="mt-1 text-xs text-gray-400">{item.date}</p>
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
