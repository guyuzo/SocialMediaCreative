import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { appRoutes } from '@/routes'
import { CriativoEditorPage } from '@/features/criativos/CriativoEditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="/criativos/:id" element={<CriativoEditorPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
