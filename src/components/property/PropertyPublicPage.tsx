
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, User, Calendar, Bed, Phone, MessageSquare } from 'lucide-react';
import { getPropertyById, getRooms } from '@/services/api';
import { formatCurrency } from '@/utils/formatters';

const PropertyPublicPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Usar um token fixo para acesso público
        const token = 'U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=';
        
        // Carregar detalhes da propriedade
        const propertyResult = await getPropertyById(token, id);
        if (propertyResult.success && propertyResult.data) {
          setProperty(propertyResult.data);
          
          // Carregar quartos da propriedade
          const roomsResult = await getRooms(token, id);
          if (roomsResult.success && roomsResult.data) {
            setRooms(roomsResult.data);
          }
        }
      } catch (error) {
        console.error("Error loading property data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-frontdesk-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Propriedade não encontrada</h1>
        <p className="mt-2 text-gray-600">A propriedade que você está procurando não existe ou foi removida.</p>
        <a href="/" className="mt-4 rounded-[15px] bg-frontdesk-600 px-4 py-2 text-white hover:bg-frontdesk-700">
          Voltar para o início
        </a>
      </div>
    );
  }

  // Função para formatar o tipo de propriedade
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

  // Função para preparar mensagem de WhatsApp
  const getWhatsAppMessage = (roomId?: string) => {
    const baseMessage = `Olá! Tenho interesse em reservar a propriedade "${property.name}"`;
    const roomMessage = roomId ? ` - quarto/unidade "${rooms.find(r => r.roomId === roomId)?.name}"` : '';
    return encodeURIComponent(`${baseMessage}${roomMessage}. Gostaria de mais informações.`);
  };

  return (
    <div className="bg-white">
      {/* Cabeçalho com nome e tipo */}
      <header className="bg-frontdesk-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <img 
              src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64"
              alt="Frontdesk"
              className="mr-2 h-8 w-8"
            />
            <a href="/" className="text-xl font-bold">Frontdesk</a>
          </div>
        </div>
      </header>

      {/* Hero com imagem principal e título */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={property.images && property.images.length > 0 ? property.images[activeImageIndex] : "https://placehold.co/1200x600?text=Imagem+Indisponível"}
          alt={property.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="mb-2 text-sm font-medium uppercase tracking-wider">
            {getPropertyTypeText(property.type)}
          </div>
          <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center">
            <MapPin size={18} className="mr-1" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Coluna de informações */}
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sobre esta acomodação</h2>
              <p className="text-gray-700">
                {property.description || 
                  `Experimente a comodidade e o conforto deste incrível ${getPropertyTypeText(property.type).toLowerCase()} 
                  localizado em ${property.city}. Perfeito para viajantes que buscam uma estadia confortável.`
                }
              </p>
            </section>

            {/* Fotos da propriedade */}
            {property.images && property.images.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Galeria de fotos</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {property.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.name} - Imagem ${index + 1}`}
                      className="h-48 w-full cursor-pointer rounded-[15px] object-cover transition-all hover:opacity-90"
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Quartos/Unidades disponíveis */}
            {rooms.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Acomodações disponíveis</h2>
                <div className="space-y-6">
                  {rooms.map((room: any) => (
                    <div key={room.roomId} className="overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-sm transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="relative overflow-hidden">
                          <img
                            src={room.images && room.images.length > 0 ? room.images[0] : "https://placehold.co/600x400?text=Imagem+Indisponível"}
                            alt={room.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-5 md:col-span-2">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-bold">{room.name}</h3>
                            {room.number && <span className="text-sm text-gray-500">#{room.number}</span>}
                          </div>
                          
                          <p className="mt-2 text-gray-600 line-clamp-2">{room.description}</p>
                          
                          <div className="mt-4 flex flex-wrap gap-6">
                            <div className="flex items-center text-gray-700">
                              <User size={18} className="mr-1 text-frontdesk-600" />
                              <span>Até {room.maxGuests} hóspedes</span>
                            </div>
                            
                            {room.pricingType && (
                              <div className="flex items-center text-gray-700">
                                <Calendar size={18} className="mr-1 text-frontdesk-600" />
                                <span>
                                  {room.pricingType === 'room' ? 'Preço por quarto' :
                                   room.pricingType === 'bed' ? 'Preço por cama' :
                                   room.pricingType === 'guest' ? 'Preço por hóspede' : 'Preço por unidade'}
                                </span>
                              </div>
                            )}
                            
                            {room.beds && room.beds.length > 0 && (
                              <div className="flex items-center text-gray-700">
                                <Bed size={18} className="mr-1 text-frontdesk-600" />
                                <span>{room.beds.length} cama(s)</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">A partir de</p>
                              <p className="text-2xl font-bold text-frontdesk-600">{formatCurrency(room.basePrice)}</p>
                              <p className="text-sm text-gray-500">por noite</p>
                            </div>
                            
                            <a
                              href={`https://wa.me/${property.contactPhone || '5511999999999'}?text=${getWhatsAppMessage(room.roomId)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-[15px] bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center"
                            >
                              <MessageSquare size={18} className="mr-2" />
                              Reservar via WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Coluna lateral com informações rápidas e reserva */}
          <div>
            <div className="sticky top-8 rounded-[15px] border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Informações rápidas</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <MapPin size={20} className="mr-3 text-frontdesk-600 mt-1" />
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-gray-600">{property.address}, {property.city}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={20} className="mr-3 text-frontdesk-600 mt-1" />
                  <div>
                    <p className="font-medium">Capacidade</p>
                    <p className="text-gray-600">Até {property.maxGuests} hóspedes</p>
                  </div>
                </div>
                
                {property.rooms && (
                  <div className="flex items-start">
                    <Bed size={20} className="mr-3 text-frontdesk-600 mt-1" />
                    <div>
                      <p className="font-medium">Acomodações</p>
                      <p className="text-gray-600">{property.rooms} quarto(s)</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Calendar size={20} className="mr-3 text-frontdesk-600 mt-1" />
                  <div>
                    <p className="font-medium">Check-in / Check-out</p>
                    <p className="text-gray-600">12:00 / 14:00</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Preço a partir de</p>
                  <p className="text-3xl font-bold text-frontdesk-600">
                    {formatCurrency(property.pricePerNight || rooms[0]?.basePrice || 0)}
                  </p>
                  <p className="text-sm text-gray-500">por noite</p>
                </div>
                
                <a
                  href={`https://wa.me/${property.contactPhone || '5511999999999'}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-[15px] bg-green-600 px-4 py-3 text-center text-white font-medium hover:bg-green-700 flex items-center justify-center"
                >
                  <Phone size={18} className="mr-2" />
                  Entrar em contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64"
                alt="Frontdesk"
                className="mr-2 h-6 w-6"
              />
              <span className="text-gray-700 font-medium">Frontdesk</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Frontdesk. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyPublicPage;
