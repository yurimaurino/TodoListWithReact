import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import HomePage from './pages/HomePage'

function App() {

  const [usuarioLogado, setUsuarioLogado] = useState(null)

  useEffect(()=> {
    const usuario = localStorage.getItem("todo_user")
    if(usuario){
      setUsuarioLogado(JSON.parse(usuario))
    }
  }, [])

  const handleLoginSucess = (dadosUsuario) => {
    setUsuarioLogado(dadosUsuario
    )
  }

  if (usuarioLogado){
    return <HomePage usuario={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />
  }

  return <Login onLoginSucess={handleLoginSucess} />
}

export default App
