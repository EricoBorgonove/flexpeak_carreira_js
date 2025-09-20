import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem
} from "@mui/material";
import { api } from "../lib/api";

export default function UserEdit() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo_usuario: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // carregar dados do usuário logado
  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/users/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        nome: data.nome,
        email: data.email,
        senha: "",
        tipo_usuario: data.tipo_usuario
      });
    } catch (e) {
      console.error(e);
      setMsg("Erro ao carregar dados do usuário");
    }
  };

  useEffect(() => {
    if (usuario?.id) {
      fetchUser();
    }
  }, []);

  // salvar alterações
  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put(`/users/${usuario.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg("Usuário atualizado com sucesso!");
      localStorage.setItem("usuario", JSON.stringify({ ...usuario, ...form }));
    } catch (e) {
      console.error(e);
      setMsg("Erro ao atualizar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <Typography variant="h5" gutterBottom align="center">
          Alterar Usuário
        </Typography>

        {msg && <Alert severity="info">{msg}</Alert>}

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Senha"
                type="password"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                fullWidth
                helperText="Preencha apenas se deseja alterar a senha"
              />
              <TextField
                label="Tipo de Usuário"
                select
                value={form.tipo_usuario}
                onChange={(e) =>
                  setForm({ ...form, tipo_usuario: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="locador">Locador</MenuItem>
                <MenuItem value="locatario">Locatário</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
