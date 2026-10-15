import { useState } from "react"

function Login(){

  const [carregando, setCarregando] = useState(false)
  const [resposta, setResposta] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  async function createUser(event) {
    event.preventDefault()
    setCarregando(true)

    try{
      const requisicao = await fetch('https://todolistwithjava.onrender.com/users/', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({username, password})
      });

      const dados = await requisicao.json()
      setResposta(JSON.stringify(dados))
    }catch(erro){
      setResposta(`Erro na comunicação da API ${erro.message}`)
    }finally{
      setCarregando(false)
    }
  }

  return(
    <div>
      <form onSubmit={createUser}>
        <input 
          type="text" 
          name="inputName" 
          id="inputName" 
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input 
          type="password"
          name="inputPassword" 
          id="inputPassword" 
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={carregando}>{carregando ? "Aguarde" : "Enviar"}</button>

        <pre>{resposta}</pre>
        
      </form>
    </div>
  )

}
export default Login