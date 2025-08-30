import {Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import {AppBar, Toolbar, Button, Container} from "@mui/material";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import ImoveisList from "./pages/ImoveisList";
import LocacoesList from "./pages/LocacoesList";


function PrivateRoute ({children}){
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="login" replace />;
}

export default function App (){
        const nav = useNavigate();
        const logout = () =>{
            localStorage.removeItem("token");
            nav("/login");
        }
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={link} to="/dashboard">DashBoard</Button>
                    <Button color="inherit" component={link} to="/users">Usuários</Button>
                    <Button color="inherit" component={link} to="/imoveis">Imóveis</Button>
                    <Button color="inherit" component={link} to="/locacoes">Locações</Button>

                    <Button color="inherit" onClick={logout}>Sair</Button>
                </Toolbar>
            </AppBar>

                <Container sx={{ mt:3 }}>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
                        <Route path="/users" element={<PrivateRoute><UserList/></PrivateRoute>}/>
                        <Route path="/imoveis" element={<PrivateRoute><ImoveisList/></PrivateRoute>}/>
                        <Route path="/locacoes" element={<PrivateRoute><LocacoesList/></PrivateRoute>}/>
                        <Route path="*" element={<Navigate to="/dashboard" replace />}/>
                    </Routes>
                </Container>

            
        </>
    )

}
