import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/80 p-6">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
      <p className="text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-red-400 hover:text-red-300">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;

