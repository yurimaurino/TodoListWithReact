import { useState } from "react";
import FormCreateUser from "../components/FormCreateUser";
import "./LoginModules.css";

function Login({ onLoginSucess }) {
	const [carregando, setCarregando] = useState(false);
	const [resposta, setResposta] = useState("");
	const [modoLogin, setModoLogin] = useState(false);

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

			if (requisicao.ok) {
				localStorage.setItem("todo_user", JSON.stringify(dadosDoFormulario));

				onLoginSucess(dadosDoFormulario);
			} else {
				setResposta(dados.message || dados.error || JSON.stringify(dados));
			}
		} catch (erro) {
			setResposta(`Erro na comunicação com a API: ${erro.message}`);
		} finally {
			setCarregando(false);
		}
	}

	function alternarModo() {
		setResposta("");
		setModoLogin((modoAtual) => !modoAtual);
	}

	return (
		<main className="login-page">
			<div className="login-background-decoration decoration-one"></div>
			<div className="login-background-decoration decoration-two"></div>

			<section className="login-container">
				<a href="/" className="login-brand">
					<span className="login-brand-icon">✓</span>
					<span>TaskFlow</span>
				</a>

				<div className="login-card">
					<div className="login-heading">
						<span className="login-eyebrow">SEU ESPAÇO DE PRODUTIVIDADE</span>

						<h1>
							{modoLogin ? "Que bom ter você de volta!" : "Comece por aqui"}
						</h1>

						<p>
							{modoLogin
								? "Entre na sua conta e continue organizando suas tarefas."
								: "Crie sua conta e organize suas tarefas em um só lugar."}
						</p>
					</div>

					<div className="login-form-wrapper">
						<FormCreateUser aoEnviar={createUser} carregando={carregando} />
					</div>

					{resposta && (
						<div className="login-feedback" role="alert">
							<span className="feedback-icon">!</span>
							<p>{resposta}</p>
						</div>
					)}

					<div className="login-divider">
						<span>OU</span>
					</div>

					<div className="login-switch">
						<p>
							{modoLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
						</p>

						<button
							type="button"
							className="login-switch-button"
							onClick={alternarModo}
							disabled={carregando}
						>
							{modoLogin ? "Criar conta" : "Entrar na minha conta"}
							<span>→</span>
						</button>
					</div>
				</div>

				<footer className="login-footer">
					<span>TaskFlow</span>
					<p>Pequenos passos, grandes resultados.</p>
				</footer>
			</section>
		</main>
	);
}

export default Login;
