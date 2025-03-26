
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowLeft, Save, Trash, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getPropertyById } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [property, setProperty] = useState<any>({
    name: '',
    type: 'apartment',
    address: '',
    city: '',
    maxGuests: 2,
    pricePerNight: 0,
    rooms: 1,
    beds: [],
    propertyGroup: '',
    images: []
  });

  useEffect(() => {
    const loadProperty = async () => {
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
        const result = await getPropertyById(user.token, id);
        if (result.success && result.data) {
          setProperty(result.data);
        } else {
          toast({
            title: "Erro",
            description: "Falha ao carregar detalhes da propriedade",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading property:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados da propriedade",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id, user?.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const handleAddBed = () => {
    setProperty(prev => ({
      ...prev,
      beds: [...(prev.beds || []), '']
    }));
  };

  const handleRemoveBed = (index: number) => {
    setProperty(prev => ({
      ...prev,
      beds: prev.beds.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleBedChange = (index: number, value: string) => {
    setProperty(prev => {
      const newBeds = [...prev.beds];
      newBeds[index] = value;
      return {
        ...prev,
        beds: newBeds
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: "Propriedade atualizada com sucesso",
      });
      setIsSaving(false);
      navigate(`/admin/properties/${id}`);
    }, 1500);
  };

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

  return (
    <DashboardLayout adminOnly>
      {/* Back button */}
      <div className="mb-8">
        <Link 
          to={`/admin/properties/${id}`} 
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Voltar para detalhes da propriedade</span>
        </Link>
      </div>
      
      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 font-sora">Editar Propriedade</h1>
          <p className="text-gray-500 mt-1">Atualize os detalhes da propriedade</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Propriedade
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={property.name}
                  onChange={handleInputChange}
                  className="input-control w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Propriedade
                </label>
                <select
                  id="type"
                  name="type"
                  value={property.type}
                  onChange={handleInputChange}
                  className="input-control w-full"
                  required
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="cabin">Chalé</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={property.address}
                  onChange={handleInputChange}
                  className="input-control w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={property.city}
                  onChange={handleInputChange}
                  className="input-control w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidade (hóspedes)
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    name="maxGuests"
                    value={property.maxGuests}
                    onChange={handleNumberChange}
                    min="1"
                    className="input-control w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Quartos
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    value={property.rooms}
                    onChange={handleNumberChange}
                    min="1"
                    className="input-control w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço por Noite (R$)
                </label>
                <input
                  type="number"
                  id="pricePerNight"
                  name="pricePerNight"
                  value={property.pricePerNight}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  className="input-control w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="propertyGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo/Empreendimento
                </label>
                <input
                  type="text"
                  id="propertyGroup"
                  name="propertyGroup"
                  value={property.propertyGroup || ''}
                  onChange={handleInputChange}
                  className="input-control w-full"
                  placeholder="Opcional, para hotéis e hostels"
                />
              </div>
            </div>
          </div>
          
          {/* Beds for hostels */}
          {(property.type === 'hostel' || property.beds?.length > 0) && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium font-sora">Camas</h3>
                <button
                  type="button"
                  onClick={handleAddBed}
                  className="flex items-center text-sm text-frontdesk-600 hover:text-frontdesk-700"
                >
                  <Plus size={16} className="mr-1" />
                  <span>Adicionar Cama</span>
                </button>
              </div>
              
              {property.beds && property.beds.map((bed: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={bed}
                    onChange={(e) => handleBedChange(index, e.target.value)}
                    className="input-control flex-1"
                    placeholder="Ex: Beliche Superior"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBed(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <Link
              to={`/admin/properties/${id}`}
              className="btn-secondary"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PropertyEdit;
