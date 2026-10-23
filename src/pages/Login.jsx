import { useState } from "react";
import FormCreateUser from "../components/FormCreateUser";

function Login({ onLoginSucess }) {
	const [carregando, setCarregando] = useState(false);
	const [resposta, setResposta] = useState("");
	const [modoLogin, setModoLogin] = useState(null);

	async function createUser(dadosDoFormulario) {
		setCarregando(true);
		setResposta("");

		if (modoLogin) {
			localStorage.setItem("todo_user", JSON.stringify(dadosDoFormulario));
			onLoginSucess(dadosDoFormulario);
			setCarregando(false);
			return;
		}

		try {
			const requisicao = await fetch(
				"https://todolistwithjava.onrender.com/users/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dadosDoFormulario),
				},
			);

			const dados = await requisicao.json();
			setResposta(JSON.stringify(dados));

			if (requisicao.ok) {
				localStorage.setItem("todo_user", JSON.stringify(dadosDoFormulario));

				onLoginSucess(dadosDoFormulario);
			}
		} catch (erro) {
			setResposta(`Erro na comunicação da API ${erro.message}`);
		} finally {
			setCarregando(false);
		}
	}

	return (
		<div>
      <h2>{modoLogin ? "Entrar" : "Criar Conta" }</h2>
			<FormCreateUser aoEnviar={createUser} carregando={carregando} />

      <button type="button" onClick={() => setModoLogin(!modoLogin)}>
        {modoLogin ? "Não tem conta ? Cadastre-se" : "Já tem conta? Entrar"}
      </button>

			<pre>{resposta}</pre>
		</div>
	);
}
export default Login;
