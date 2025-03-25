
import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Edit, Trash, ExternalLink } from 'lucide-react';
import Modal from '../../components/ui/Modal';

const Users = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    properties: []
  });

  // In a real app, this would come from an API
  const [users, setUsers] = useState([
    { 
      id: '1', 
      name: 'Carlos Oliveira', 
      email: 'carlos@example.com', 
      phone: '(11) 99999-9999',
      properties: ['Apartamento Luxo Centro'],
      created: '10/12/2023',
      status: 'ativo'
    },
    { 
      id: '2', 
      name: 'Ana Costa', 
      email: 'ana@example.com', 
      phone: '(11) 98888-8888',
      properties: ['Casa de Praia Premium', 'Studio Moderno'],
      created: '05/12/2023',
      status: 'ativo'
    },
    { 
      id: '3', 
      name: 'Pedro Santos', 
      email: 'pedro@example.com', 
      phone: '(11) 97777-7777',
      properties: ['Chalé na Montanha'],
      created: '01/12/2023',
      status: 'ativo'
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setIsCreating(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newUserId = (users.length + 1).toString();
      const currentDate = new Date().toLocaleDateString('pt-BR');
      
      setUsers(prev => [
        ...prev,
        {
          id: newUserId,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          properties: [],
          created: currentDate,
          status: 'ativo'
        }
      ]);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        phone: '',
        properties: []
      });
      
      setIsCreating(false);
      setShowCreateModal(false);
    }, 1000);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <button 
            className="btn-primary mt-4 flex items-center gap-2 sm:mt-0"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            <span>Criar Novo Usuário</span>
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
              className="input-control pl-10 w-full"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="input-control sm:w-48">
            <option value="all">Todos status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  E-mail
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Telefone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Propriedades
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cadastro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.properties.length > 0 
                      ? <span className="badge badge-blue">{user.properties.length} propriedades</span>
                      : <span className="text-gray-400">Nenhuma</span>
                    }
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.created}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`badge ${user.status === 'ativo' ? 'badge-green' : 'badge-red'}`}>
                      {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        title="Logar como este usuário"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Novo Usuário"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              className="mt-1 input-control w-full"
              value={newUser.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              className="mt-1 input-control w-full"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="phone"
              className="mt-1 input-control w-full"
              value={newUser.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button
              className="btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleCreateUser}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                  <span>Criando...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Criar Usuário</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
