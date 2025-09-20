import { useState } from "react";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, senha });

      // salva token e usuário no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // redireciona para dashboard
      nav("/dashboard");
    } catch (e) {
      console.error("Erro login:", e);
      setErr(e?.response?.data?.message || "Erro no login");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <img src="/src/assets/images/logo-removebg-preview.png" alt="Logo" style={{ width: "120px" }} />
        </Box>

        <Typography variant="h5" gutterBottom align="center">
          Bem-vindo
        </Typography>
        <Typography variant="body2" gutterBottom align="center" color="text.secondary">
          Entre com suas credenciais
        </Typography>

        <Stack component="form" onSubmit={onSubmit} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e)=>setSenha(e.target.value)}
            fullWidth
            required
          />

          {err && <Typography color="error">{err}</Typography>}

          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => nav("/signup")}
          >
            Criar novo usuário
          </Button>
        </Stack>
      </div>
    </div>
  );
}
