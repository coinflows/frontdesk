
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, Eye, MapPin, Edit, RefreshCw, Bed, Home, Building2, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getProperties } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/formatters';
import ColorSchemeModal from '@/components/ui/ColorSchemeModal';

const Properties = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const fetchProperties = async () => {
    if (!user?.token) {
      toast({
        title: "Erro",
        description: "Token de API não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getProperties(user.token);
      if (result.success && result.data) {
        setProperties(result.data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar propriedades",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar propriedades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user?.token]);

  const filteredProperties = properties.filter(
    property => {
      const matchesSearch = 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        filterType === 'all' || 
        property.type === filterType;
      
      return matchesSearch && matchesType;
    }
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Home size={18} />;
      case 'house':
        return <Building2 size={18} />;
      case 'hotel':
        return <Building2 size={18} />;
      case 'hostel':
        return <Bed size={18} />;
      default:
        return <Home size={18} />;
    }
  };

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 font-sora">Propriedades</h1>
            <button 
              className="text-gray-500 hover:text-[var(--frontdesk-600)]"
              onClick={() => setColorModalOpen(true)}
              title="Personalizar cores"
            >
              <Palette size={20} />
            </button>
          </div>
          <button
            className="btn-primary mt-4 flex items-center gap-2 sm:mt-0"
            onClick={fetchProperties}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Carregando...' : 'Atualizar Dados'}</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-control rounded-[15px] pl-10 w-full"
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input-control rounded-[15px] sm:w-48"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">Todos os tipos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="cabin">Chalé</option>
          </select>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map(property => (
            <div key={property.propId} className="overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative">
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : 'https://placehold.co/400x300?text=Imagem+Indisponível'}
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  <div className="flex items-center gap-1">
                    {getTypeIcon(property.type)}
                    <span>
                      {property.type === 'apartment' ? 'Apartamento' : 
                       property.type === 'house' ? 'Casa' : 
                       property.type === 'hotel' ? 'Hotel' : 
                       property.type === 'hostel' ? 'Hostel' : 
                       property.type === 'cabin' ? 'Chalé' : property.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="truncate text-lg font-medium text-gray-900 font-sora">{property.name}</h3>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-sm">
                  {property.rooms && (
                    <div>
                      <span className="font-medium">{property.rooms}</span>{' '}
                      <span className="text-gray-500">quartos</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">{property.maxGuests}</span>{' '}
                    <span className="text-gray-500">hóspedes</span>
                  </div>
                  {property.pricePerNight && (
                    <div>
                      <span className="font-medium text-gray-900">{formatCurrency(property.pricePerNight)}</span>
                      <span className="text-gray-500">/noite</span>
                    </div>
                  )}
                </div>
                
                {property.propertyGroup && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Grupo</p>
                    <p className="text-sm font-medium">{property.propertyGroup}</p>
                  </div>
                )}
                
                {property.beds && property.beds.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs text-gray-500">Camas disponíveis</p>
                    <div className="flex flex-wrap gap-1">
                      {property.beds.map((bed: string, index: number) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                          {bed}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-between">
                  <Link 
                    to={`/admin/properties/${property.propId}/edit`}
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </Link>
                  
                  <a
                    href={`/properties/${property.propId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-frontdesk-600 hover:bg-frontdesk-50"
                  >
                    <Eye size={16} />
                    <span>Ver página</span>
                  </a>
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
      
      {/* Color scheme modal */}
      <ColorSchemeModal isOpen={colorModalOpen} onClose={() => setColorModalOpen(false)} />
    </DashboardLayout>
  );
};

export default Properties;
