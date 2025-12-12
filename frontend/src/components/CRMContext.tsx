import { createContext, useContext, useState, useEffect } from "react";
import {
  apiFetch,
  login as apiLogin,
  me,
  registerCustomer as apiRegisterCustomer,
} from "@/api/client";

export type UserRole =
  | "super_admin"
  | "owner"
  | "sales_manager"
  | "sales_agent"
  | "support_manager"
  | "support_agent"
  | "finance"
  | "viewer"
  | "customer";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  tenantId?: string;
  title: string;
  description: string;
  status: LeadStatus;
  score: number;
  value: number;
  source?: string;
  assignedTo?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  tenantId?: string;
  customerId?: string;
  title: string;
  description: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface CRMContextType {
  currentUser: User | null;
  currentView: string;
  users: User[];
  customers: Customer[];
  leads: Lead[];
  tickets: Ticket[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<boolean>;
  logout: () => void;
  switchView: (view: string) => void;
  refreshCustomers: () => Promise<void>;
  refreshLeads: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  addLead: (lead: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addTicket: (ticket: Partial<Ticket>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

const CRMContext = createContext(undefined as unknown as CRMContextType);

export function CRMProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState(null as User | null);
  const [currentView, setCurrentView] = useState("company-dashboard" as string);
  const [users, setUsers] = useState([] as User[]);
  const [customers, setCustomers] = useState([] as Customer[]);
  const [leads, setLeads] = useState([] as Lead[]);
  const [tickets, setTickets] = useState([] as Ticket[]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await apiLogin(email, password);
      const u: any = await me();
      const roleStr = String(u.role ?? "VIEWER").toLowerCase();
      // Map backend roles to frontend roles
      const roleMap: Record<string, UserRole> = {
        "super_admin": "super_admin",
        "business_admin": "owner",
        "sales_manager": "sales_manager",
        "sales_agent": "sales_agent",
        "support_manager": "support_manager",
        "support_agent": "support_agent",
        "finance": "finance",
        "viewer": "viewer",
        "customer": "customer"
      };
      
      const user: User = {
        id: String(u.id ?? "me"),
        name: String(u.fullName ?? u.name ?? email),
        email: String(u.email ?? email),
        role: roleMap[roleStr] || "viewer",
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      
      // Set initial view based on role - route to role-specific dashboard
      if (user.role === "super_admin") {
        setCurrentView("super-admin-dashboard");
      } else if (user.role === "owner") {
        setCurrentView("owner-dashboard");
      } else if (user.role === "sales_manager") {
        setCurrentView("sales-manager-dashboard");
      } else if (user.role === "sales_agent") {
        setCurrentView("sales-agent-dashboard");
      } else if (user.role === "support_manager") {
        setCurrentView("support-manager-dashboard");
      } else if (user.role === "support_agent") {
        setCurrentView("support-agent-dashboard");
      } else if (user.role === "finance") {
        setCurrentView("finance-dashboard");
      } else if (user.role === "viewer") {
        setCurrentView("viewer-dashboard");
      } else {
        setCurrentView("company-dashboard");
      }
      // Only refresh business-level data if user is not Super Admin
      if (user.role !== "super_admin") {
        await Promise.all([refreshCustomers(), refreshLeads(), refreshTickets()]);
      }
      return true;
    } catch (e: any) {
      console.error("Login failed", e);
      throw e; // Re-throw to let LoginScreen handle the error message
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<boolean> => {
    try {
      await apiRegisterCustomer(payload);
      return true;
    } catch (e: any) {
      console.error("Register failed", e);
      throw e; // Re-throw to let LoginScreen handle the error message
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUsers([]);
    setCustomers([]);
    setLeads([]);
    setTickets([]);
    setCurrentView("company-dashboard");
    localStorage.removeItem("token");
  };

  const switchView = (view: string) => setCurrentView(view);

  const refreshCustomers = async () => {
    if (!currentUser) return;
    // Super Admin doesn't have access to business-level endpoints
    if (currentUser.role === 'super_admin') return;
    try {
      const data = await apiFetch<Customer[]>(`/api/customers`, { auth: true });
      setCustomers(data);
    } catch (e) {
      console.warn("Failed to refresh customers", e);
    }
  };

  const refreshLeads = async () => {
    if (!currentUser) return;
    // Super Admin doesn't have access to business-level endpoints
    if (currentUser.role === 'super_admin') return;
    try {
      const data = await apiFetch<Lead[]>(`/api/leads`, { auth: true });
      setLeads(data);
    } catch (e) {
      console.warn("Failed to refresh leads", e);
    }
  };

  const refreshTickets = async () => {
    if (!currentUser) return;
    // Super Admin doesn't have access to business-level endpoints
    if (currentUser.role === 'super_admin') return;
    try {
      const data = await apiFetch<Ticket[]>(`/api/tickets`, { auth: true });
      setTickets(data);
    } catch (e) {
      console.warn("Failed to refresh tickets", e);
    }
  };

  const addLead = async (lead: Partial<Lead>) => {
    await apiFetch(`/api/leads`, {
      method: "POST",
      body: JSON.stringify(lead),
      auth: true,
    });
    await refreshLeads();
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    await apiFetch(`/api/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
      auth: true,
    });
    await refreshLeads();
  };

  const deleteLead = async (id: string) => {
    await apiFetch(`/api/leads/${id}`, { method: "DELETE", auth: true });
    await refreshLeads();
  };

  const addTicket = async (ticket: Partial<Ticket>) => {
    await apiFetch(`/api/tickets`, {
      method: "POST",
      body: JSON.stringify(ticket),
      auth: true,
    });
    await refreshTickets();
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    await apiFetch(`/api/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
      auth: true,
    });
    await refreshTickets();
  };

  const deleteTicket = async (id: string) => {
    await apiFetch(`/api/tickets/${id}`, { method: "DELETE", auth: true });
    await refreshTickets();
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'super_admin') {
      refreshCustomers();
      refreshLeads();
      refreshTickets();
    }
  }, [currentUser]);

  const value: CRMContextType = {
    currentUser,
    currentView,
    users,
    customers,
    leads,
    tickets,
    login,
    register,
    logout,
    switchView,
    refreshCustomers,
    refreshLeads,
    refreshTickets,
    addLead,
    updateLead,
    deleteLead,
    addTicket,
    updateTicket,
    deleteTicket,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error("useCRM must be used within CRMProvider");
  }
  return context;
}
