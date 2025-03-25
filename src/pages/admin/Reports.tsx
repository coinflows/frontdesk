
import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  // Mock data for the reports
  const revenueData = [
    { name: 'Jan', value: 12500 },
    { name: 'Fev', value: 14800 },
    { name: 'Mar', value: 18200 },
    { name: 'Abr', value: 16900 },
    { name: 'Mai', value: 21500 },
    { name: 'Jun', value: 25600 },
    { name: 'Jul', value: 29800 },
    { name: 'Ago', value: 28400 },
    { name: 'Set', value: 24600 },
    { name: 'Out', value: 20500 },
    { name: 'Nov', value: 26800 },
    { name: 'Dez', value: 32500 },
  ];

  const occupancyData = [
    { name: 'Jan', value: 65 },
    { name: 'Fev', value: 70 },
    { name: 'Mar', value: 75 },
    { name: 'Abr', value: 72 },
    { name: 'Mai', value: 80 },
    { name: 'Jun', value: 85 },
    { name: 'Jul', value: 92 },
    { name: 'Ago', value: 90 },
    { name: 'Set', value: 83 },
    { name: 'Out', value: 78 },
    { name: 'Nov', value: 85 },
    { name: 'Dez', value: 95 },
  ];

  const bookingSourceData = [
    { name: 'Airbnb', value: 45 },
    { name: 'Booking.com', value: 35 },
    { name: 'Expedia', value: 12 },
    { name: 'Direto', value: 8 },
  ];

  const COLORS = ['#FF5A5F', '#003580', '#FFCC00', '#00A699'];

  const propertyPerformanceData = [
    { name: 'Apartamento Luxo Centro', revenue: 14500, bookings: 12, occupancy: 85 },
    { name: 'Casa de Praia Premium', revenue: 18200, bookings: 8, occupancy: 75 },
    { name: 'Studio Moderno', revenue: 8500, bookings: 15, occupancy: 92 },
    { name: 'Chalé na Montanha', revenue: 12600, bookings: 10, occupancy: 68 },
  ];

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                className="appearance-none border-0 bg-transparent text-sm text-gray-700 focus:outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="month">Último mês</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último ano</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            <button className="btn-secondary flex items-center gap-2">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          <button
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
              selectedReport === 'revenue'
                ? 'bg-frontdesk-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedReport('revenue')}
          >
            Receita
          </button>
          <button
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
              selectedReport === 'occupancy'
                ? 'bg-frontdesk-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedReport('occupancy')}
          >
            Taxa de Ocupação
          </button>
          <button
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
              selectedReport === 'sources'
                ? 'bg-frontdesk-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedReport('sources')}
          >
            Canais de Reserva
          </button>
          <button
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
              selectedReport === 'properties'
                ? 'bg-frontdesk-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedReport('properties')}
          >
            Desempenho por Propriedade
          </button>
        </div>

        {/* Report Content */}
        <div className="card-dashboard">
          {selectedReport === 'revenue' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Relatório de Receita</h2>
              <p className="mt-1 text-sm text-gray-500">
                Visualização da receita total ao longo do tempo
              </p>
              
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={300}
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="Receita" 
                      stroke="#0ea5e9" 
                      fill="#0ea5e9" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">Receita Total</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {formatCurrency(revenueData.reduce((acc, curr) => acc + curr.value, 0))}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">Média Mensal</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatCurrency(
                      revenueData.reduce((acc, curr) => acc + curr.value, 0) / revenueData.length
                    )}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm font-medium text-purple-800">Crescimento Anual</p>
                  <p className="mt-1 text-2xl font-bold text-purple-900">+24.5%</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'occupancy' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Taxa de Ocupação</h2>
              <p className="mt-1 text-sm text-gray-500">
                Percentual de ocupação de todas as propriedades
              </p>
              
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={occupancyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="value" name="Ocupação" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">Média de Ocupação</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {Math.round(
                      occupancyData.reduce((acc, curr) => acc + curr.value, 0) / occupancyData.length
                    )}%
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">Melhor Mês</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    Dez (95%)
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800">Pior Mês</p>
                  <p className="mt-1 text-2xl font-bold text-amber-900">
                    Jan (65%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'sources' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Canais de Reserva</h2>
              <p className="mt-1 text-sm text-gray-500">
                Distribuição das reservas por origem
              </p>
              
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={bookingSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Análise de Canais</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-[#FF5A5F]"></div>
                      <span className="ml-2 text-sm">Airbnb</span>
                    </div>
                    <span className="text-sm font-medium">45% (Maior volume)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-[#003580]"></div>
                      <span className="ml-2 text-sm">Booking.com</span>
                    </div>
                    <span className="text-sm font-medium">35% (Maior ticket médio)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-[#FFCC00]"></div>
                      <span className="ml-2 text-sm">Expedia</span>
                    </div>
                    <span className="text-sm font-medium">12% (Em crescimento)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-[#00A699]"></div>
                      <span className="ml-2 text-sm">Direto</span>
                    </div>
                    <span className="text-sm font-medium">8% (Comissão zero)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'properties' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Desempenho por Propriedade</h2>
              <p className="mt-1 text-sm text-gray-500">
                Comparativo de receita, reservas e ocupação
              </p>
              
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={propertyPerformanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Receita (R$)" fill="#0ea5e9" />
                    <Bar yAxisId="right" dataKey="occupancy" name="Ocupação (%)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Propriedade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Receita
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Reservas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ocupação
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Desempenho
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {propertyPerformanceData.map((property) => (
                      <tr key={property.name}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {property.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatCurrency(property.revenue)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {property.bookings}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {property.occupancy}%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-frontdesk-600 h-2.5 rounded-full" 
                                style={{ width: `${(property.revenue / 20000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const AreaChart = LineChart;
const Area = Line;

export default Reports;
