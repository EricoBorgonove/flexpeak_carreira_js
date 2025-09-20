import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(""); // locador | locatario
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", {
        nome,
        cpf,
        email,
        senha,
        tipo_usuario: tipoUsuario, // precisa bater com o ENUM do backend
      });
      setOk("Usuário criado com sucesso!");
      setErr("");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setOk("");
      setErr(e?.response?.data?.message || "Erro ao criar usuário");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <Typography variant="h5" gutterBottom align="center">
          Criar Conta
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Preencha os dados para se registrar
        </Typography>

        <Stack component="form" onSubmit={onSubmit} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            required
          />

          {/* Seleção do tipo de usuário */}
          <TextField
            select
            label="Tipo de Usuário"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="locador">Locador</MenuItem>
            <MenuItem value="locatario">Locatário</MenuItem>
          </TextField>

          {err && <Typography color="error">{err}</Typography>}
          {ok && <Typography color="primary">{ok}</Typography>}

          <Button type="submit" variant="contained" fullWidth>
            Registrar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => nav("/login")}
          >
            Voltar para Login
          </Button>
        </Stack>
      </div>
    </div>
  );
}
