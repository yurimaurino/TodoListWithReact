import { useState } from "react"

function ButtonCreateUser({aoEnviar, carregando}){

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event){
    event.preventDefault()

    aoEnviar({name, username, password})
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="inputName"
          id="inputName" 
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="text" 
          name="inputUsername" 
          id="inputUsername" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" disabled={carregando}>{carregando ? "Carregando" : "Enviar"}</button>        
      </form>
    </div>
  )
  
}

export default ButtonCreateUser