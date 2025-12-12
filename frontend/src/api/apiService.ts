import axios, { AxiosInstance } from "axios";

export interface MeResponse {
  id: number;
  email: string;
  fullName?: string;
  role?: string;
}

export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadDTO {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  score?: number;
  value?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TicketDTO {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const baseURL = (import.meta.env.VITE_API_URL as string) || "";

const client: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Add response interceptor to handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async login(email: string, password: string): Promise<{ token: string }> {
    const res = await client.post<{ token: string }>("/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  async me(): Promise<MeResponse> {
    const res = await client.get<MeResponse>("/api/auth/me");
    return res.data;
  },

  async registerCustomer(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const res = await client.post("/api/auth/register/customer", payload);
    return res.data;
  },

  async getCustomers(): Promise<CustomerDTO[]> {
    const res = await client.get<CustomerDTO[]>("/api/customers");
    return res.data;
  },

  async getLeads(): Promise<LeadDTO[]> {
    const res = await client.get<LeadDTO[]>("/api/leads");
    return res.data;
  },

  async getTickets(): Promise<TicketDTO[]> {
    const res = await client.get<TicketDTO[]>("/api/tickets");
    return res.data;
  },
  async postLead(payload: Partial<LeadDTO>) {
    const res = await client.post("/api/leads", payload);
    return res.data;
  },
  async putLead(id: number, payload: Partial<LeadDTO>) {
    const res = await client.put(`/api/leads/${id}`, payload);
    return res.data;
  },
  async deleteLead(id: number) {
    const res = await client.delete(`/api/leads/${id}`);
    return res.data;
  },
  async postTicket(payload: Partial<TicketDTO>) {
    const res = await client.post(`/api/tickets`, payload);
    return res.data;
  },
  async putTicket(id: number, payload: Partial<TicketDTO>) {
    const res = await client.put(`/api/tickets/${id}`, payload);
    return res.data;
  },
  async deleteTicket(id: number) {
    const res = await client.delete(`/api/tickets/${id}`);
    return res.data;
  },
};
