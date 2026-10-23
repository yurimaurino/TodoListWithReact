import { useState } from "react";

function HomePage({ usuario, setUsuarioLogado }) {
	const [novaTarefa, setNovaTarefa] = useState("");
	const [carregando, setCarregando] = useState(false);
	const [statusTarefa, setStatusTarefa] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startAt, setStartAt] = useState("");
	const [endAt, setEndAt] = useState("");
	const [priority, setPriority] = useState("");

	function deslogar() {
		localStorage.removeItem("todo_user");
		setUsuarioLogado(null);
	}

	// FUNÇÃO PARA CADASTRAR TAREFA
	async function handleCriarTarefa(e) {
		e.preventDefault();
		// if (!title.trim()) return alert("Digite o nome da tarefa!");

		setCarregando(true);
		setStatusTarefa("");

		try {
			const tokenInvisivel = btoa(`${usuario.username}:${usuario.password}`);

			const requisicao = await fetch(
				"https://todolistwithjava.onrender.com/tasks/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Basic ${tokenInvisivel}`,
					},
					body: JSON.stringify({
						title: title,
						description: description,
						startAt: startAt,
						endAt: endAt,
						priority: priority,
					}),
				},
			);

			if (requisicao.ok) {
				setStatusTarefa("Tarefa criada com sucesso!");
				setNovaTarefa("");
			} else {
				const erroDados = await requisicao.json().catch(() => ({}));
				setStatusTarefa(`Erro ao criar: Senha incorreta ou dados inválidos.${erroDados}`);
			}
		} catch (erro) {
			setStatusTarefa(`Erro na comunicação com a API: ${erro.message}`);
		} finally {
			setCarregando(false);
		}
	}

	return (
		<div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Olá, {usuario.name || usuario.username}!</h2>
				<button
					type="button"
					onClick={deslogar}
					style={{
						backgroundColor: "#ff4d4d",
						color: "white",
						border: "none",
						padding: "8px 12px",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					Sair
				</button>
			</header>

			<main style={{ marginTop: "30px" }}>
				<h3>➕ Criar Nova Tarefa</h3>

				<form
					onSubmit={handleCriarTarefa}
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						marginTop: "10px",
					}}
				>
					<input
						type="text"
						placeholder="Título da tarefa"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						maxLength={50}
						required
						disabled={carregando}
					/>

					<textarea
						placeholder="Descrição da tarefa"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						disabled={carregando}
					/>

					<label>Data de início</label>
					<input
						type="datetime-local"
						value={startAt}
						onChange={(e) => setStartAt(e.target.value)}
						required
						disabled={carregando}
					/>

					<label>Data de término</label>
					<input
						type="datetime-local"
						value={endAt}
						onChange={(e) => setEndAt(e.target.value)}
						required
						disabled={carregando}
					/>

					<label>Prioridade</label>
					<select
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
						required
						disabled={carregando}
					>
						<option value="">Selecione a prioridade</option>
						<option value="Baixa">Baixa</option>
						<option value="Media">Média</option>
						<option value="Alta">Alta</option>
					</select>

					<button type="submit" disabled={carregando}>
						{carregando ? "Salvando..." : "Criar tarefa"}
					</button>
				</form>
			</main>
		</div>
	);
}

export default HomePage;
