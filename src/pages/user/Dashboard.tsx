import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, DollarSign, Users, Clock, Building2, RefreshCw } from 'lucide-react';
import { formatCurrency, getCurrentMonthName } from '../../utils/formatters';
import Modal from '../../components/ui/Modal';
import WelcomeModal from '../../components/ui/WelcomeModal';
import { useAuth } from '@/hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [propertyForm, setPropertyForm] = useState({
    name: 'Apartamento Luxo Centro',
    propId: '1001',
    roomId: 'R101',
    token: '',
    whatsapp: '(11) 99999-9999',
    description: 'Apartamento de luxo localizado no centro da cidade, próximo a restaurantes e atrações turísticas.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if this is first login
    if (user?.isNewUser) {
      setShowWelcomeModal(true);
    }
    
    // Check if property setup is needed
    const isPropertySetup = localStorage.getItem('frontdesk_property_setup');
    
    if (!isPropertySetup && !user?.isNewUser) {
      setShowPropertyModal(true);
    }
  }, [user]);

  const handlePropertySetup = () => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to validate the token and setup the property
    setTimeout(() => {
      localStorage.setItem('frontdesk_property_setup', 'true');
      setIsSubmitting(false);
      setShowPropertyModal(false);
    }, 1500);
  };

  const handlePropertyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const dashboardData = {
    nextCheckin: {
      guest: 'João Silva',
      date: '10/12/2023',
      nights: 5,
      guests: 2
    },
    nextCheckout: {
      guest: 'Maria Santos',
      date: '15/12/2023',
      nights: 3,
      guests: 4
    },
    revenue: {
      month: 4250,
      lastMonth: 3800,
      year: 48500
    },
    occupancy: {
      month: 78,
      lastMonth: 72,
      year: 75
    },
    currentGuests: 2,
    pendingInquiries: 3,
    lastSync: '15/12/2023 14:32',
    channels: [
      { name: 'Airbnb', connected: true, lastSync: '15/12/2023 14:30' },
      { name: 'Booking.com', connected: true, lastSync: '15/12/2023 14:31' },
      { name: 'Expedia', connected: false, lastSync: '-' }
    ]
  };

  const currentMonth = getCurrentMonthName();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bem-vindo de volta! Aqui está o resumo da sua propriedade.
            </p>
          </div>
          <button className="btn-primary mt-4 flex items-center gap-2 sm:mt-0">
            <RefreshCw size={16} />
            <span>Atualizar dados</span>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Próximo Check-in</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{dashboardData.nextCheckin.date}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {dashboardData.nextCheckin.guest} · {dashboardData.nextCheckin.guests} hóspedes
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Calendar size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Receita em {currentMonth}</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(dashboardData.revenue.month)}
                </h3>
                <p className="mt-1 text-sm text-green-600">
                  +{Math.round((dashboardData.revenue.month / dashboardData.revenue.lastMonth - 1) * 100)}% vs. mês anterior
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <DollarSign size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ocupação</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{dashboardData.occupancy.month}%</h3>
                <p className="mt-1 text-sm text-green-600">
                  +{dashboardData.occupancy.month - dashboardData.occupancy.lastMonth}% vs. mês anterior
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="card-dashboard">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Última Sincronização</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{dashboardData.lastSync}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {dashboardData.channels.filter(c => c.connected).length} canais conectados
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Current Bookings */}
          <div className="card-dashboard lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Resumo de Reservas</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Check-in Hoje</p>
                    <p className="text-xs text-gray-500">
                      {dashboardData.currentGuests > 0 ? `${dashboardData.currentGuests} hóspedes aguardados` : 'Nenhum check-in hoje'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Check-out Hoje</p>
                    <p className="text-xs text-gray-500">
                      {dashboardData.nextCheckout ? 'Checkout às 12h00' : 'Nenhum check-out hoje'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hóspedes Atuais</p>
                    <p className="text-xs text-gray-500">
                      {dashboardData.currentGuests > 0 ? `${dashboardData.currentGuests} hóspedes na propriedade` : 'Sem hóspedes no momento'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Solicitações Pendentes</p>
                    <p className="text-xs text-gray-500">
                      {dashboardData.pendingInquiries > 0 ? `${dashboardData.pendingInquiries} solicitações para revisar` : 'Nenhuma solicitação pendente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700">Próximas Reservas</h4>
              <div className="mt-2 space-y-3">
                {[
                  { guest: 'João Silva', dates: '10-15 Dez, 2023', guests: 2, source: 'Airbnb' },
                  { guest: 'Maria Santos', dates: '20-27 Dez, 2023', guests: 4, source: 'Booking.com' },
                  { guest: 'Pedro Ferreira', dates: '02-08 Jan, 2024', guests: 1, source: 'Direto' },
                ].map((booking, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        {booking.guest.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.guest}</p>
                        <p className="text-xs text-gray-500">
                          {booking.dates} · {booking.guests} hóspedes · {booking.source}
                        </p>
                      </div>
                    </div>
                    <button className="rounded-md px-3 py-1 text-sm text-frontdesk-600 hover:bg-frontdesk-50">
                      Ver detalhes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="card-dashboard">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sua Propriedade</h3>
              <button
                className="rounded-md px-2 py-1 text-xs text-frontdesk-600 hover:bg-frontdesk-50"
                onClick={() => setShowPropertyModal(true)}
              >
                Editar
              </button>
            </div>
            
            <div className="mt-4">
              <img
                src="https://placehold.co/600x400?text=Apartamento+Luxo"
                alt="Propriedade"
                className="h-40 w-full rounded-lg object-cover"
              />
              
              <h4 className="mt-3 text-lg font-medium text-gray-900">
                {propertyForm.name}
              </h4>
              
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>ID: {propertyForm.propId}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {propertyForm.description}
                </p>
              </div>
              
              <hr className="my-4 border-gray-200" />
              
              <h4 className="text-md font-medium text-gray-700">Canais Conectados</h4>
              <div className="mt-2 space-y-2">
                {dashboardData.channels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${channel.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{channel.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {channel.connected ? `Sync: ${channel.lastSync}` : 'Desconectado'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button className="w-full rounded-md bg-frontdesk-50 py-2 text-sm font-medium text-frontdesk-600 hover:bg-frontdesk-100">
                  Gerenciar Canais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal for New Users */}
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      {/* Property Setup Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        title="Configuração da Propriedade"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Propriedade</label>
            <input
              type="text"
              name="name"
              className="mt-1 input-control w-full"
              value={propertyForm.name}
              onChange={handlePropertyFormChange}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID da Propriedade</label>
              <input
                type="text"
                name="propId"
                className="mt-1 input-control w-full"
                value={propertyForm.propId}
                onChange={handlePropertyFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID do Quarto</label>
              <input
                type="text"
                name="roomId"
                className="mt-1 input-control w-full"
                value={propertyForm.roomId}
                onChange={handlePropertyFormChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Token de Acesso</label>
            <textarea
              name="token"
              rows={3}
              className="mt-1 input-control w-full"
              placeholder="Cole seu token de API do Beds24 aqui..."
              value={propertyForm.token}
              onChange={handlePropertyFormChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              className="mt-1 input-control w-full"
              value={propertyForm.whatsapp}
              onChange={handlePropertyFormChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição da Propriedade</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 input-control w-full"
              value={propertyForm.description}
              onChange={handlePropertyFormChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagens</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <button
                type="button"
                className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Carregar imagem
              </button>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button
              className="btn-secondary"
              onClick={() => setShowPropertyModal(false)}
            >
              Cancelar
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handlePropertySetup}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Propriedade</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UserDashboard;

