import { useState } from "react"
import ButtonCreateUser from "../components/ButtonCreateUser";

function Login(){

  const [carregando, setCarregando] = useState(false)
  const [resposta, setResposta] = useState('')

  async function createUser(dadosDoFormulario) {
    setCarregando(true)

    try{
      const requisicao = await fetch('https://todolistwithjava.onrender.com/users/', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(dadosDoFormulario)
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

      <ButtonCreateUser aoEnviar={createUser} carregando={carregando} />

      <pre>{resposta}</pre>
      
    </div>
  )

}
export default Login