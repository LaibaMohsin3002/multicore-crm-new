import { useState } from "react";
import { useCRM } from "./CRMContext";
import { Building2, Lock, Mail, User, ArrowLeft } from "lucide-react";

export function LoginScreen() {
  const { login, register } = useCRM();
  const [mode, setMode] = useState<"login" | "register-customer">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError("");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Login failed. Please try again.";
      setError(errorMsg.includes("Login failed:") ? errorMsg.replace("Login failed: ", "") : errorMsg);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const success = await register({
        fullName: name,
        email,
        password,
        phone: phone || "N/A",
      });
      if (success) {
        // Auto-login after registration
        await login(email, password);
        setError("");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Registration failed. Please try again.";
      setError(errorMsg.includes("Registration failed:") ? errorMsg.replace("Registration failed: ", "") : errorMsg);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password");
    const success = await login(userEmail, "password");
    if (!success) {
      setError("Quick login failed");
    } else {
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2>MultiCore CRM</h2>
            <p className="text-gray-600 mt-2">
              {mode === "login"
                ? "Sign in to your account"
                : "Create your customer account"}
            </p>
          </div>

          {mode === "login" ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-3">New customer?</p>
                <button
                  onClick={() => setMode("register-customer")}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Create a customer account
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-3">Quick Demo Login:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => quickLogin("admin@platform.com")}
                    className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <span className="block">Super Admin</span>
                    <span className="text-gray-600">Platform Management</span>
                  </button>
                  <button
                    onClick={() => quickLogin("john@acme.com")}
                    className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="block">Business Owner - Acme Corp</span>
                    <span className="text-gray-600">Full business access</span>
                  </button>
                  <button
                    onClick={() => quickLogin("sarah@acme.com")}
                    className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <span className="block">Sales Manager - Acme</span>
                    <span className="text-gray-600">Sales team management</span>
                  </button>
                  <button
                    onClick={() => quickLogin("mike@acme.com")}
                    className="w-full text-left px-4 py-2 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors"
                  >
                    <span className="block">Sales Agent - Acme</span>
                    <span className="text-gray-600">
                      Lead & customer management
                    </span>
                  </button>
                  <button
                    onClick={() => quickLogin("lisa@acme.com")}
                    className="w-full text-left px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <span className="block">Support Manager - Acme</span>
                    <span className="text-gray-600">
                      Support team management
                    </span>
                  </button>
                  <button
                    onClick={() => quickLogin("emma@acme.com")}
                    className="w-full text-left px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <span className="block">Support Agent - Acme</span>
                    <span className="text-gray-600">Ticket management</span>
                  </button>
                  <button
                    onClick={() => quickLogin("david@acme.com")}
                    className="w-full text-left px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <span className="block">Finance - Acme</span>
                    <span className="text-gray-600">Billing & reports</span>
                  </button>
                  <button
                    onClick={() => quickLogin("rachel@acme.com")}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="block">Viewer - Acme</span>
                    <span className="text-gray-600">Read-only access</span>
                  </button>
                  <button
                    onClick={() => quickLogin("customer@example.com")}
                    className="w-full text-left px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                  >
                    <span className="block">Customer Portal</span>
                    <span className="text-gray-600">
                      Customer-facing access
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode("login")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+1234567890"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Note:</strong> Only customers can self-register.
                  Business owners and staff members are registered by
                  administrators.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
