import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  const { login, isLoading, error, token, user } = useAuth();
  const navigate = useNavigate();

  // If token exists, redirect user
  useEffect(() => {
    if (token) {
      const role = user?.role || "admin"; // fallback
      const pathMap = {
        admin: "/admin",
        student: "/student",
      };
      navigate(pathMap[role], { replace: true });
    }
  }, [token, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(email, password, selectedRole);
    if (success) {
      const pathMap = {
        admin: "/admin",
        student: "/student",
      };
      navigate(pathMap[selectedRole], { replace: true });
    }
  };

  //Optional: prevent UI flash
  if (token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          School Management System
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login As
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-black text-white py-2 font-medium hover:bg-gray-900 transition disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
