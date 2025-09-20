import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from "@mui/material";
import { api } from "../lib/api";

export default function ImoveisList() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    endereco: "",
    preco_noite: "",
    descricao: ""
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  // carregar imóveis
  const fetchImoveis = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/imoveis"); // lista todos os imóveis
      setImoveis(data);
    } catch (e) {
      console.error(e);
      setErr("Erro ao carregar imóveis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  // abrir modal de criação/edição
  const handleOpen = (imovel = null) => {
    if (imovel) {
      setForm(imovel);
    } else {
      setForm({ id: null, titulo: "", endereco: "", preco_noite: "", descricao: "" });
    }
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  // salvar (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (form.id) {
        await api.put(`/imoveis/${form.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/imoveis", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleClose();
      fetchImoveis();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar imóvel");
    }
  };

  // excluir
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
    try {
      await api.delete(`/imoveis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchImoveis();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir imóvel");
    }
  };

  // alugar
  const handleAlugar = async (imovelId) => {
    try {
      await api.post(
        "/locacoes",
        {
          imovel_id: imovelId,
          data_inicio: new Date(),
          data_fim: new Date(new Date().setDate(new Date().getDate() + 7)) // exemplo: 7 dias
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Locação criada com sucesso!");
    } catch (e) {
      console.error("Erro ao criar locação:", e);
      alert("Erro ao criar locação");
    }
  };

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
    );

  return (
    <div className="page-container">
      <div className="page-card">
        <Typography variant="h5" gutterBottom align="center">
          Imóveis
        </Typography>

        {err && <Alert severity="error">{err}</Alert>}

        {usuario?.tipo_usuario === "locador" && (
          <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
            Novo Imóvel
          </Button>
        )}

        <Grid container spacing={2}>
          {imoveis.length === 0 && (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              Nenhum imóvel cadastrado.
            </Typography>
          )}
          {imoveis.map((imovel) => (
            <Grid item xs={12} md={6} key={imovel.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{imovel.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {imovel.endereco}
                  </Typography>
                  <Typography variant="body1">
                    R$ {imovel.preco_noite}/noite
                  </Typography>
                  <Typography variant="body2">{imovel.descricao}</Typography>
                </CardContent>
                <CardActions>
                  {usuario?.id === imovel.usuario_id ? (
                    <>
                      <Button size="small" onClick={() => handleOpen(imovel)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(imovel.id)}
                      >
                        Excluir
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleAlugar(imovel.id)}
                    >
                      Alugar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Modal de criar/editar */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Editar Imóvel" : "Novo Imóvel"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              fullWidth
            />
            <TextField
              label="Endereço"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              fullWidth
            />
            <TextField
              label="Preço por noite"
              type="number"
              value={form.preco_noite}
              onChange={(e) =>
                setForm({ ...form, preco_noite: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
