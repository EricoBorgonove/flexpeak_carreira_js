import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, Typography } from "@mui/material";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserEdit from "./pages/UserEdit";
import ImoveisList from "./pages/ImoveisList";
import LocacoesList from "./pages/LocacoesList";
import SignUp from "./pages/SignUp";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const nav = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const usuario = token ? JSON.parse(localStorage.getItem("usuario")) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    nav("/login");
  };

  const showAppBar =
    token && location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="main-container">
      {showAppBar && (
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
           
            <Box display="flex" alignItems="center">
              <img
                src="src/assets/images/logo-removebg-preview.png"
                alt="Logo"
                style={{ height: 40, marginRight: 16 }}
              />
              <Typography variant="h6" component="div">
                FlexBnB
              </Typography>
            </Box>

            {/* 🔹 Navegação */}
            <Box>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/imoveis">
                Todos os Imóveis
              </Button>
              {usuario?.tipo_usuario === "locador" && (
                <Button color="inherit" component={Link} to="/meus-imoveis">
                  Meus Imóveis
                </Button>
              )}
              {usuario?.tipo_usuario === "locatario" && (
                <Button color="inherit" component={Link} to="/locacoes">
                  Minhas Locações
                </Button>
              )}
              <Button color="inherit" component={Link} to="/perfil">
                Alterar Usuário
              </Button>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </Box>

            {/* 🔹 Usuário logado */}
            {usuario && (
              <Box textAlign="right" ml={2}>
                <Typography variant="subtitle1">{usuario.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {usuario.tipo_usuario === "locador" ? "Locador" : "Locatário"}
                </Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}

      <Container className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/imoveis"
            element={
              <PrivateRoute>
                <ImoveisList />
              </PrivateRoute>
            }
          />
          <Route
            path="/meus-imoveis"
            element={
              <PrivateRoute>
                <ImoveisList meus />
              </PrivateRoute>
            }
          />
          <Route
            path="/locacoes"
            element={
              <PrivateRoute>
                <LocacoesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <UserEdit />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Container>
    </div>
  );
}
