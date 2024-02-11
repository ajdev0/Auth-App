import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import Welcome from "./Welcome";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import AuthProvider from "./components/context/AuthContex";
import NotFound from "./components/utils/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route
            path="welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
