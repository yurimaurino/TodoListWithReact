import { useState } from "react";
import "./HomePageModules.css";

function HomePage({ usuario, setUsuarioLogado }) {
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

  async function handleCriarTarefa(e) {
    e.preventDefault();

    if (!title.trim()) {
      setStatusTarefa("Digite o título da tarefa!");
      return;
    }

    if (!description.trim()) {
      setStatusTarefa("Digite a descrição da tarefa!");
      return;
    }

    if (!startAt || !endAt || !priority) {
      setStatusTarefa("Preencha todos os campos!");
      return;
    }

    const inicio = new Date(startAt);
    const termino = new Date(endAt);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(termino.getTime())
    ) {
      setStatusTarefa("Informe datas válidas!");
      return;
    }

    if (inicio <= new Date()) {
      setStatusTarefa("A data de início deve ser futura!");
      return;
    }

    if (termino <= new Date()) {
      setStatusTarefa("A data de término deve ser futura!");
      return;
    }

    if (inicio >= termino) {
      setStatusTarefa(
        "A data de início deve ser anterior à data de término!"
      );
      return;
    }

    if (!usuario?.username || !usuario?.password) {
      setStatusTarefa("Sessão inválida. Faça login novamente.");
      return;
    }

    setCarregando(true);
    setStatusTarefa("");

    try {
      const tokenInvisivel = btoa(
        `${usuario.username}:${usuario.password}`
      );

      const requisicao = await fetch(
        "https://todolistwithjava.onrender.com/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${tokenInvisivel}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            startAt:
              startAt.length === 16 ? `${startAt}:00` : startAt,
            endAt:
              endAt.length === 16 ? `${endAt}:00` : endAt,
            priority: priority,
          }),
        }
      );

      if (requisicao.ok) {
        setStatusTarefa("Tarefa criada com sucesso!");

        setTitle("");
        setDescription("");
        setStartAt("");
        setEndAt("");
        setPriority("");
      } else {
        const erroDados = await requisicao.text();

        setStatusTarefa(
          `Erro ao criar tarefa (${requisicao.status}): ${
            erroDados || "Verifique os dados enviados."
          }`
        );
      }
    } catch (erro) {
      setStatusTarefa(
        `Erro na comunicação com a API: ${erro.message}`
      );
    } finally {
      setCarregando(false);
    }
  }

  const mensagemErro =
    statusTarefa.startsWith("Erro") ||
    statusTarefa.includes("deve") ||
    statusTarefa.includes("Preencha") ||
    statusTarefa.includes("Digite") ||
    statusTarefa.includes("Sessão") ||
    statusTarefa.includes("Informe");

  return (
    <div className="home-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </a>

        <div className="user-area">
          <div className="user-avatar">
            {(usuario?.name || usuario?.username || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="user-info">
            <span className="user-greeting">Bem-vindo(a)</span>
            <strong>
              {usuario?.name || usuario?.username || "Usuário"}
            </strong>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={deslogar}
          >
            <span>↪</span> Sair
          </button>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <span className="section-label">SEU ESPAÇO DE PRODUTIVIDADE</span>
          <h1>Organize suas tarefas<span>.</span></h1>
          <p>
            Planeje seu dia, defina prioridades e mantenha tudo
            sob controle.
          </p>
        </section>

        <section className="task-card">
          <div className="card-header">
            <div className="card-icon">＋</div>

            <div>
              <h2>Nova tarefa</h2>
              <p>Preencha os detalhes para criar uma tarefa.</p>
            </div>
          </div>

          <div className="card-divider"></div>

          <form onSubmit={handleCriarTarefa} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Título da tarefa</label>
              <input
                id="title"
                type="text"
                placeholder="Ex.: Estudar React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                placeholder="Descreva o que precisa ser feito..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                disabled={carregando}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startAt">Data de início</label>
                <input
                  id="startAt"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endAt">Data de término</label>
                <input
                  id="endAt"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
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

              {priority && (
                <span className={`priority-preview priority-${priority.toLowerCase()}`}>
                  <span className="priority-dot"></span>
                  Prioridade {priority === "Media" ? "média" : priority.toLowerCase()}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span className="loading-spinner"></span>
                  Salvando tarefa...
                </>
              ) : (
                <>
                  <span>＋</span>
                  Criar tarefa
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>

            {statusTarefa && (
              <div
                role="status"
                className={`status-message ${
                  mensagemErro ? "status-error" : "status-success"
                }`}
              >
                <span>{mensagemErro ? "!" : "✓"}</span>
                <p>{statusTarefa}</p>
              </div>
            )}
          </form>
        </section>

        <footer className="home-footer">
          <span>TaskFlow</span>
          <span>Pequenos passos, grandes resultados.</span>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;