// src/pages/Login.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import authApi from "@/services/api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((state) => state.login);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const logoutToastShownRef = useRef(false);

  // Gunakan ref untuk tracking apakah form pernah diisi
  const formTouchedRef = useRef(false);
  const previousDataRef = useRef(formData);

  useEffect(() => {
    // Simpan data sebelumnya
    previousDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    if (location.state?.logoutSuccess && !logoutToastShownRef.current) {
      logoutToastShownRef.current = true;
      toast.success("Logout berhasil!");
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    formTouchedRef.current = true;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mengetik
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(formData);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const from = location.state?.from?.pathname || "/";

      navigate(from, { replace: true, state: { loginSuccess: true } });
    } catch (err) {
      setError("Username atau password salah");
      toast.error("Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (isForgotPasswordLoading) return;

    setIsForgotPasswordLoading(true);

    try {
      const defaultEmail = "yogapoke1305@gmail.com";
      const response = await authApi.forgotPassword(defaultEmail);

      toast.success("Link reset password telah dikirim ke email Anda!", {
        duration: 5000,
      });
    } catch (err) {
      toast.error(err.message || "Gagal mengirim link reset password");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  // Check apakah form valid untuk enable/disable button
  const isFormValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
                disabled={isLoading}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              disabled={isForgotPasswordLoading}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              {isForgotPasswordLoading ? "Mengirim..." : "Lupa password?"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
