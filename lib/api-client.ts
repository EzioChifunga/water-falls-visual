const API_BASE_URL = 'https://testes-water-falls.fqtff2.easypanel.host';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Endereços
export const enderecosAPI = {
  list: () => apiCall('/enderecos/'),
  create: (data: any) => apiCall('/enderecos/', 'POST', data),
  get: (id: string) => apiCall(`/enderecos/${id}`),
  update: (id: string, data: any) => apiCall(`/enderecos/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/enderecos/${id}`, 'DELETE'),
};

// Lojas
export const lojasAPI = {
  list: () => apiCall('/lojas/'),
  create: (data: any) => apiCall('/lojas/', 'POST', data),
  get: (id: string) => apiCall(`/lojas/${id}`),
  update: (id: string, data: any) => apiCall(`/lojas/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/lojas/${id}`, 'DELETE'),
};

// Categorias
export const categoriasAPI = {
  list: () => apiCall('/categorias/'),
  create: (data: any) => apiCall('/categorias/', 'POST', data),
  get: (id: string) => apiCall(`/categorias/${id}`),
  update: (id: string, data: any) => apiCall(`/categorias/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/categorias/${id}`, 'DELETE'),
};

// Veículos
export const veiculosAPI = {
  list: () => apiCall('/veiculos/'),
  create: (data: any) => apiCall('/veiculos/', 'POST', data),
  get: (id: string) => apiCall(`/veiculos/${id}`),
  update: (id: string, data: any) => apiCall(`/veiculos/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/veiculos/${id}`, 'DELETE'),
  updateStatus: (id: string, status: string) =>
    apiCall(`/veiculos/${id}/status`, 'PATCH', { status }),
};

// Clientes
export const clientesAPI = {
  list: () => apiCall('/clientes/'),
  create: (data: any) => apiCall('/clientes/', 'POST', data),
  get: (id: string) => apiCall(`/clientes/${id}`),
  update: (id: string, data: any) => apiCall(`/clientes/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/clientes/${id}`, 'DELETE'),
};

// Reservas
export const reservasAPI = {
  list: () => apiCall('/reservas/'),
  create: (data: any) => apiCall('/reservas/', 'POST', data),
  get: (id: string) => apiCall(`/reservas/${id}`),
  update: (id: string, data: any) => apiCall(`/reservas/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/reservas/${id}`, 'DELETE'),
  confirm: (id: string) => apiCall(`/reservas/${id}/confirmar`, 'PATCH', {}),
  cancel: (id: string) => apiCall(`/reservas/${id}/cancelar`, 'PATCH', {}),
};

// Pagamentos
export const pagamentosAPI = {
  list: () => apiCall('/pagamentos/'),
  create: (data: any) => apiCall('/pagamentos/', 'POST', data),
  get: (id: string) => apiCall(`/pagamentos/${id}`),
  update: (id: string, data: any) => apiCall(`/pagamentos/${id}`, 'PUT', data),
  delete: (id: string) => apiCall(`/pagamentos/${id}`, 'DELETE'),
  filterByStatus: (status: string) => apiCall(`/pagamentos/?status=${status}`),
};

// Histórico de Status
export const historicoStatusAPI = {
  list: () => apiCall('/historico-status-veiculo/'),
  create: (data: any) => apiCall('/historico-status-veiculo/', 'POST', data),
  get: (id: string) => apiCall(`/historico-status-veiculo/${id}`),
  getByVeiculo: (veiculoId: string) =>
    apiCall(`/historico-status-veiculo/veiculo/${veiculoId}`),
};

// Estoque de Veículos
export const estoqueAPI = {
  // A lista geral não existe no controller, mas mantive caso você crie futuramente
  listByLoja: (lojaId: string) => apiCall(`/estoque/loja/${lojaId}`),
  listByVeiculo: (veiculoId: string) => apiCall(`/estoque/veiculo/${veiculoId}`),

  create: (data: any) => apiCall('/estoque/', 'POST', data),

  get: (id: string) => apiCall(`/estoque/${id}`),

  update: (id: string, data: any) => apiCall(`/estoque/${id}`, 'PUT', data),

  delete: (id: string) => apiCall(`/estoque/${id}`, 'DELETE'),

  transfer: (data: any) => apiCall('/estoque/transfer', 'POST', data),
};
