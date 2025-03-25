
import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, Eye, MapPin } from 'lucide-react';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, this would come from an API
  const properties = [
    {
      id: '1001',
      name: 'Apartamento Luxo Centro',
      address: 'Av Paulista, 1000',
      city: 'São Paulo',
      type: 'Apartamento',
      rooms: 2,
      capacity: 4,
      channels: ['Airbnb', 'Booking.com'],
      owner: 'Carlos Oliveira',
      image: 'https://placehold.co/80x60?text=Apto1',
    },
    {
      id: '1002',
      name: 'Casa de Praia Premium',
      address: 'Rua da Praia, 123',
      city: 'Florianópolis',
      type: 'Casa',
      rooms: 3,
      capacity: 6,
      channels: ['Airbnb', 'Booking.com', 'Expedia'],
      owner: 'Ana Costa',
      image: 'https://placehold.co/80x60?text=Casa',
    },
    {
      id: '1003',
      name: 'Studio Moderno',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      type: 'Studio',
      rooms: 1,
      capacity: 2,
      channels: ['Airbnb'],
      owner: 'Ana Costa',
      image: 'https://placehold.co/80x60?text=Studio',
    },
    {
      id: '1004',
      name: 'Chalé na Montanha',
      address: 'Estrada da Serra, 45',
      city: 'Campos do Jordão',
      type: 'Chalé',
      rooms: 2,
      capacity: 5,
      channels: ['Airbnb', 'Booking.com'],
      owner: 'Pedro Santos',
      image: 'https://placehold.co/80x60?text=Chale',
    },
  ];

  const filteredProperties = properties.filter(
    property =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Propriedades</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-control pl-10 w-full"
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="input-control sm:w-48">
            <option value="all">Todos os tipos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="studio">Studio</option>
            <option value="cabin">Chalé</option>
          </select>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map(property => (
            <div key={property.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-40 w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  {property.type}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="truncate text-lg font-medium text-gray-900">{property.name}</h3>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">{property.rooms}</span>{' '}
                    <span className="text-gray-500">quartos</span>
                  </div>
                  <div>
                    <span className="font-medium">{property.capacity}</span>{' '}
                    <span className="text-gray-500">hóspedes</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-500">Proprietário</p>
                  <p className="text-sm font-medium">{property.owner}</p>
                </div>
                
                <div className="mt-3">
                  <p className="mb-1 text-xs text-gray-500">Canais conectados</p>
                  <div className="flex gap-1">
                    {property.channels.map(channel => (
                      <span key={channel} className="badge badge-blue text-xs">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-frontdesk-600 hover:bg-frontdesk-50">
                    <Eye size={16} />
                    <span>Ver detalhes</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full py-10 text-center">
              <p className="text-gray-500">Nenhuma propriedade encontrada</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Properties;
