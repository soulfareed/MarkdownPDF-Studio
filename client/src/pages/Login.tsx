import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // This function handles the form submission for user login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login </h2>
      {error && (
        <div className="p-4 mb-4 text-red-600 bg-red-100 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="bold text-grey-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 "
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none"
            required
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-grey-600"> Don't have an account?</span>
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
