import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Layout from './components/Layout.jsx'

import Login from './page/Login.jsx'

import AdminDashboard from './page/admin/AdminDashboard.jsx'
import Sucursales from './page/admin/Sucursales.jsx'
import Gestores from './page/admin/Gestores.jsx'

import GestorDashboard from './page/gestor/GestorDashboard.jsx'
import Clientes from './page/gestor/Clientes.jsx'
import Mascotas from './page/gestor/Mascotas.jsx'

import VeterinarioDashboard from './page/veterinario/VeterinarioDashboard.jsx'
import Citas from './page/veterinario/Citas.jsx'

import ClienteDashboard from './page/cliente/ClientDashboard.jsx'
import MisMascotas from './page/cliente/MisMascotas.jsx';
import AgendarCita from './page/cliente/AgendarCita.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas Admin */}
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="sucursales" element={<Sucursales />} />
            <Route path="gestores" element={<Gestores />} />
          </Route>

          {/* Rutas Gestor */}
          <Route path="/gestor" element={
            <PrivateRoute roles={['gestor']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<GestorDashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="mascotas" element={<Mascotas />} />
          </Route>

          {/* Rutas Veterinario */}
          <Route path="/veterinario" element={
            <PrivateRoute roles={['veterinario']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<VeterinarioDashboard />} />
            <Route path="citas" element={<Citas />} />
          </Route>

          {/* Rutas Cliente */}
          <Route path="/cliente" element={
            <PrivateRoute roles={['cliente']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<ClienteDashboard />} />
            <Route path="citas" element={<AgendarCita />} />
            <Route path="mascotas" element={<MisMascotas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}