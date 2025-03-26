
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowLeft, MapPin, UserIcon, Bed, DollarSign, Calendar, Edit, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getPropertyById, getBookings } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.token || !id) {
        toast({
          title: "Erro",
          description: "Token de API não encontrado ou ID inválido",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        // Load property details
        const propertyResult = await getPropertyById(user.token, id);
        if (propertyResult.success && propertyResult.data) {
          setProperty(propertyResult.data);
        } else {
          toast({
            title: "Erro",
            description: "Falha ao carregar detalhes da propriedade",
            variant: "destructive",
          });
        }

        // Load property bookings
        const bookingsResult = await getBookings(user.token, id);
        if (bookingsResult.success && bookingsResult.data) {
          setBookings(bookingsResult.data);
        }
      } catch (error) {
        console.error("Error loading property details:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados da propriedade",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, user?.token]);

  if (isLoading) {
    return (
      <DashboardLayout adminOnly>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-frontdesk-600 border-t-transparent"></div>
          <span className="ml-3 text-lg text-gray-600">Carregando...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout adminOnly>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Propriedade não encontrada</h2>
          <Link to="/admin/properties" className="btn-primary">
            Voltar para propriedades
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Helper to determine property type in Portuguese
  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case 'apartment': return 'Apartamento';
      case 'house': return 'Casa';
      case 'hotel': return 'Hotel';
      case 'hostel': return 'Hostel';
      case 'cabin': return 'Chalé';
      default: return type;
    }
  };

  return (
    <DashboardLayout adminOnly>
      {/* Back button and edit */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          to="/admin/properties" 
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Voltar para propriedades</span>
        </Link>
        
        <div className="flex gap-3">
          <Link 
            to={`/admin/properties/${id}/edit`}
            className="btn-primary flex items-center"
          >
            <Edit size={16} className="mr-2" />
            <span>Editar Propriedade</span>
          </Link>
          
          <a 
            href={`/properties/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center"
          >
            <ExternalLink size={16} className="mr-2" />
            <span>Ver Página Pública</span>
          </a>
        </div>
      </div>
      
      {/* Property Details Header */}
      <div className="rounded-[15px] overflow-hidden bg-white shadow-sm mb-8">
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            src={property.images && property.images.length > 0 
              ? property.images[0] 
              : "https://placehold.co/1200x400?text=Imagem+Indisponível"
            } 
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider">
              {getPropertyTypeText(property.type)}
            </div>
            <h1 className="text-3xl font-bold mb-1 font-sora">{property.name}</h1>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 font-sora">Detalhes da Propriedade</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 font-sora">Descrição</h3>
                  <p className="text-gray-600">
                    {property.description || 
                      `Experimente a comodidade e o conforto deste incrível ${getPropertyTypeText(property.type).toLowerCase()} 
                      localizado em ${property.city}. Perfeito para viajantes que buscam uma estadia confortável.`
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 font-sora">Comodidades</h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center text-gray-600">
                      <UserIcon size={16} className="mr-2 text-frontdesk-600" />
                      <span>{property.maxGuests} hóspedes</span>
                    </div>
                    {property.rooms && (
                      <div className="flex items-center text-gray-600">
                        <Bed size={16} className="mr-2 text-frontdesk-600" />
                        <span>{property.rooms} quartos</span>
                      </div>
                    )}
                    {property.beds && property.beds.length > 0 && (
                      <div className="flex items-center text-gray-600">
                        <Bed size={16} className="mr-2 text-frontdesk-600" />
                        <span>{property.beds.length} camas</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={16} className="mr-2 text-frontdesk-600" />
                      <span>{formatCurrency(property.pricePerNight || 0)} / noite</span>
                    </div>
                  </div>
                </div>
                
                {property.beds && property.beds.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 font-sora">Camas Disponíveis</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.beds.map((bed: string, index: number) => (
                        <div key={index} className="bg-gray-100 rounded-md px-3 py-1 text-sm">
                          {bed}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 font-sora">Reservas Recentes</h2>
              
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(booking => (
                    <div 
                      key={booking.bookId}
                      className="border border-gray-200 rounded-[15px] p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{booking.firstName} {booking.lastName}</h4>
                          <p className="text-sm text-gray-500">{booking.email}</p>
                        </div>
                        <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Confirmada
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-600">
                          {booking.adults + (booking.children || 0)} hóspedes
                        </div>
                        <div className="font-medium text-frontdesk-600">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link 
                    to="/admin/bookings" 
                    className="block text-center text-frontdesk-600 hover:underline mt-2"
                  >
                    Ver todas as reservas
                  </Link>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-6 border border-dashed border-gray-300 rounded-[15px]">
                  Nenhuma reserva encontrada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;
