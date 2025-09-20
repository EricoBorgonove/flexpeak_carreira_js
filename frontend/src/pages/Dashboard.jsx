import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid, CircularProgress, Alert } from "@mui/material";
import { api } from "../lib/api";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // pega usuário logado do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = "";

        if (usuario.tipo_usuario === "locador") {
          endpoint = "/imoveis/meus";
        } else if (usuario.tipo_usuario === "locatario") {
          endpoint = "/locacoes/minhas";
        }

        const { data } = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDados(data);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
        setErr("Erro ao carregar dados do servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usuario.tipo_usuario, token]);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  return (
    <div className="page-container">
      <div className="page-card">
        <Typography variant="h5" gutterBottom align="center">
          {usuario.tipo_usuario === "locador" ? "Meus Imóveis" : "Minhas Locações"}
        </Typography>

        {err && <Alert severity="error">{err}</Alert>}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {dados.length === 0 && (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              Nenhum registro encontrado.
            </Typography>
          )}

          {usuario.tipo_usuario === "locador" &&
            dados.map((imovel) => (
              <Grid item xs={12} md={6} key={imovel.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{imovel.titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {imovel.endereco}
                    </Typography>
                    <Typography variant="body1">R$ {imovel.preco_noite}/noite</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

          {usuario.tipo_usuario === "locatario" &&
            dados.map((locacao) => (
              <Grid item xs={12} md={6} key={locacao.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{locacao.imovel?.titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {locacao.imovel?.endereco}
                    </Typography>
                    <Typography variant="body1">R$ {locacao.imovel?.preco_noite}/noite</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {locacao.status || "ativa"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
}
