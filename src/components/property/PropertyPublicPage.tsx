
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, MessageSquare, UserIcon, Bed, Share, Heart, Phone, Mail, Wifi, Coffee, Tv, Lock, ShowerHead, Car } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { formatCurrency } from '@/utils/formatters';
import { getPropertyById } from '@/services/api';

// Sample amenities (would be fetched from API in real app)
const AMENITIES = [
  { name: 'Wi-Fi', icon: <Wifi size={18} /> },
  { name: 'Café da Manhã', icon: <Coffee size={18} /> },
  { name: 'TV', icon: <Tv size={18} /> },
  { name: 'Fechadura Eletrônica', icon: <Lock size={18} /> },
  { name: 'Chuveiro Quente', icon: <ShowerHead size={18} /> },
  { name: 'Estacionamento', icon: <Car size={18} /> }
];

const PropertyPublicPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        // In a real app, we'd use a public API endpoint here
        // For now, using the same getPropertyById but in production
        // this would be a different endpoint without auth
        const result = await getPropertyById('demo-token', id);
        
        if (result.success && result.data) {
          setProperty(result.data);
        } else {
          toast({
            title: "Erro",
            description: "Propriedade não encontrada",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar detalhes da propriedade",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-frontdesk-600 border-t-transparent"></div>
          <span className="ml-3 text-lg text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Propriedade não encontrada</h2>
            <a href="/" className="text-frontdesk-600 hover:underline">
              Voltar para página inicial
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get the right icon for property type
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

  // If no images in property, use a placeholder
  const images = (property.images && property.images.length > 0) 
    ? property.images 
    : ['https://placehold.co/800x600?text=Imagem+Indisponível'];

  // Create a WhatsApp link with property info
  const createWhatsAppLink = () => {
    const phone = "5511999999999"; // Replace with actual phone
    const message = encodeURIComponent(
      `Olá! Estou interessado em reservar a propriedade "${property.name}". Gostaria de mais informações.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b shadow-sm bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img 
              src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64" 
              alt="Frontdesk" 
              className="h-8 mr-2"
            />
            <span className="text-xl font-bold text-gray-800 font-sora">Frontdesk</span>
          </a>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
              <Share size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Property Details */}
        <div className="container mx-auto px-4 py-6">
          {/* Back button and title */}
          <div className="mb-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 font-sora mb-2">{property.name}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>
          
          {/* Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 h-96 overflow-hidden rounded-[10px]">
                <img 
                  src={images[activeImage] || images[0]} 
                  alt={property.name} 
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4">
                {images.slice(0, 4).map((image: string, index: number) => (
                  <div key={index} 
                    className={`h-44 overflow-hidden rounded-[10px] cursor-pointer transition-all ${activeImage === index ? 'ring-2 ring-frontdesk-500' : 'hover:opacity-90'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.name} - ${index + 1}`} 
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Thumbnail navigation for mobile */}
            <div className="flex space-x-2 mt-2 md:hidden">
              {images.map((_: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full ${activeImage === index ? 'bg-frontdesk-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Property Info + Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2">
              {/* Type and basic info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 font-sora">
                      {getPropertyTypeText(property.type)}
                    </h2>
                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                      <div className="flex items-center text-gray-600">
                        <UserIcon size={16} className="mr-2" />
                        <span>Até {property.maxGuests} hóspedes</span>
                      </div>
                      {property.rooms && (
                        <div className="flex items-center text-gray-600">
                          <Bed size={16} className="mr-2" />
                          <span>{property.rooms} quartos</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 lg:mt-0 text-gray-700">
                    <span className="font-bold text-xl">{formatCurrency(property.pricePerNight || 0)}</span>
                    <span className="text-sm text-gray-500"> / noite</span>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 font-sora">Descrição</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line">
                  {property.description || 
                    `Experimente a comodidade e o conforto deste incrível ${getPropertyTypeText(property.type).toLowerCase()} 
                    localizado em ${property.city}. Perfeito para viajantes que buscam uma estadia confortável.
                    
                    O espaço é projetado para oferecer uma experiência agradável e conveniente, com todas as comodidades necessárias para sua estadia.
                    
                    O local é bem localizado, próximo a restaurantes, comércio e transporte público, tornando fácil explorar a cidade.`
                  }
                </p>
              </div>
              
              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 font-sora">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(showAllAmenities ? AMENITIES : AMENITIES.slice(0, 6)).map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <div className="flex-shrink-0 mr-3 text-frontdesk-600">
                        {amenity.icon}
                      </div>
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
                {AMENITIES.length > 6 && (
                  <button 
                    className="mt-4 text-frontdesk-600 hover:underline"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                  >
                    {showAllAmenities ? 'Mostrar menos' : 'Mostrar todas as comodidades'}
                  </button>
                )}
              </div>
              
              {/* Beds section */}
              {property.beds && property.beds.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 font-sora">Acomodações</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {property.beds.map((bed: string, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-[10px] p-3 flex flex-col items-center">
                        <Bed size={24} className="text-frontdesk-600 mb-2" />
                        <span className="text-center text-sm">{bed}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-white rounded-[10px] shadow-md border p-6">
                <h3 className="text-lg font-semibold mb-4 font-sora">Reservar</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">{formatCurrency(property.pricePerNight || 0)} / noite</span>
                  </div>
                  
                  <div className="border rounded-[10px] overflow-hidden mb-4">
                    <div className="flex border-b">
                      <div className="w-1/2 p-3 border-r">
                        <label className="block text-xs text-gray-500 mb-1">CHECK-IN</label>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span>Selecionar data</span>
                        </div>
                      </div>
                      <div className="w-1/2 p-3">
                        <label className="block text-xs text-gray-500 mb-1">CHECK-OUT</label>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span>Selecionar data</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <label className="block text-xs text-gray-500 mb-1">HÓSPEDES</label>
                      <div className="flex items-center">
                        <UserIcon size={16} className="mr-2 text-gray-400" />
                        <span>1 hóspede</span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={createWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-frontdesk-600 text-white font-medium rounded-[10px] py-3 px-4 flex items-center justify-center hover:bg-frontdesk-700 transition-colors"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Reservar pelo WhatsApp
                  </a>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Informações para contato</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Phone size={16} className="mr-3 text-frontdesk-600" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-3 text-frontdesk-600" />
                      <span>contato@frontdesk.com.br</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64" 
                alt="Frontdesk Logo" 
                className="h-8 mr-2"
              />
              <span className="text-lg font-bold text-gray-800">Frontdesk</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Frontdesk. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyPublicPage;
