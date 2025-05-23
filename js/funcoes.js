const formAdicionarTarefa = document.querySelector("#form-adicionar-tarefa");
const campoTarefa = document.querySelector("#campo-tarefa");
const formFiltrarTarefas = document.querySelector("#form-filtrar-tarefas");
const campoCategoria = document.querySelector("#campo-categoria");
const secaoTarefas = document.querySelector("#secao-tarefas");
const listaTarefas = document.querySelector("#lista-tarefas");
const modeloItemTarefa = document.querySelector("#modelo-item-tarefa");
const fundoModalEditar = document.querySelector("#fundo-modal-editar");
const secaoEditarTarefa = document.querySelector("#secao-editar-tarefa");
const formEditarTarefa = document.querySelector("#form-editar-tarefa");
const campoNovaTarefa = document.querySelector("#campo-nova-tarefa");
const botaoCancelar = document.querySelector("#botao-cancelar");
const fundoModalMsg = document.querySelector("#fundo-modal-msg");
const secaoMsg = document.querySelector("#secao-msg");
const txtModalMsg = document.querySelector("#txt-modal-msg");
const botaoFecharModalMsg = document.querySelector("#botao-fechar-modal-msg");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let indiceEditar;

const alternarMsg = (msg) => {
  alternarModal(fundoModalMsg, secaoMsg);
  txtModalMsg.textContent = msg;
};

const alternarModal = (fundoModal, modal) =>
  [fundoModal, modal].forEach((el) => el.classList.toggle("esconder"));

const carregarTarefas = (tarefas) => {
  const scrollVertical = window.scrollY;

  listaTarefas.replaceChildren();

  tarefas.forEach((el) => {
    const cloneModeloItemTarefa = modeloItemTarefa.content.cloneNode(true);
    const itemTarefa = cloneModeloItemTarefa.querySelector(".item-tarefa");
    const txtTarefa = itemTarefa.querySelector(".txt-tarefa");

    const botaoAlternarEstado = itemTarefa.querySelector(
      ".botao-alternar-estado"
    );

    const botaoEditar = itemTarefa.querySelector(".botao-editar");
    const botaoDeletar = itemTarefa.querySelector(".botao-deletar");

    if (el.concluida) {
      const txtBotaoAlternarEstado =
        document.createTextNode("Tornar Pendente ");
      const iconeTornarPendente = document.createElement("i");

      itemTarefa.classList.add("concluida");
      iconeTornarPendente.className = "bi bi-x-square";
      botaoAlternarEstado.replaceChildren(
        txtBotaoAlternarEstado,
        iconeTornarPendente
      );
    }

    txtTarefa.textContent = el.txt;

    botaoAlternarEstado.addEventListener("click", () =>
      alternarEstadoTarefa(el)
    );

    botaoEditar.addEventListener("click", () => prepararEdicao(el));
    botaoDeletar.addEventListener("click", () => deletarTarefa(el));
    listaTarefas.appendChild(itemTarefa);

    if (secaoTarefas.classList.contains("esconder")) alternarSecaoTarefas(true);
  });

  window.scrollTo(0, scrollVertical);
};

const alternarEstadoTarefa = (tarefa) => {
  const indiceTarefa = tarefas.indexOf(tarefa);

  if (indiceTarefa !== -1) {
    tarefas[indiceTarefa].concluida = !tarefas[indiceTarefa].concluida;

    if (tarefas[indiceTarefa].concluida) {
      const tarefaAux = tarefas[indiceTarefa];

      tarefas.splice(indiceTarefa, 1);
      tarefas.push(tarefaAux);
    }

    carregarTarefas(tarefas);
    salvarTarefas();
  }
};

const salvarTarefas = () =>
  localStorage.setItem("tarefas", JSON.stringify(tarefas));

const prepararEdicao = (tarefa) => {
  const indiceTarefa = tarefas.indexOf(tarefa);

  if (indiceTarefa !== -1) {
    campoNovaTarefa.value = tarefas[indiceTarefa].txt;
    indiceEditar = indiceTarefa;
    alternarModal(fundoModalEditar, secaoEditarTarefa);
  }
};

const deletarTarefa = (tarefa) => {
  const indiceTarefa = tarefas.indexOf(tarefa);

  if (indiceTarefa !== -1) {
    tarefas.splice(indiceTarefa, 1);

    if (tarefas.length === 0) {
      alternarSecaoTarefas(false);
      removerTarefasArmazLocal();
    } else {
      salvarTarefas();
    }

    carregarTarefas(tarefas);
    alternarMsg("Tarefa deletada com sucesso!");
  }
};

const alternarSecaoTarefas = (exibir) => {
  if (exibir) secaoTarefas.classList.remove("esconder");
  else secaoTarefas.classList.add("esconder");
};

const removerTarefasArmazLocal = () => localStorage.removeItem("tarefas");

const validarTarefa = (tarefa) => tarefa !== "" && tarefa.length <= 30;

const adicionarTarefa = (tarefa) => {
  if (existeTarefa(tarefa)) {
    alternarMsg("Erro: Tarefa já existente. Por favor, tente novamente.");
  } else {
    tarefas.push({ txt: tarefa, concluida: false });
    salvarTarefas();
    alternarMsg("Tarefa adicionada com sucesso!");
  }

  carregarTarefas(tarefas);
};

const existeTarefa = (tarefa) =>
  tarefas.some((el) => el.txt.trim().toLowerCase() === tarefa.toLowerCase());

const filtrarTarefas = (estado) => {
  const tarefasFiltradas = tarefas.filter((el) => el.concluida === estado);

  if (tarefasFiltradas.length > 0) {
    carregarTarefas(tarefasFiltradas);
  } else {
    alternarMsg(
      "Erro: Não existem tarefas nesta categoria. Por favor, tente novamente."
    );
  }
};

const editarTarefa = (novaTarefa) => {
  if (existeTarefa(novaTarefa)) {
    alternarMsg("Erro: Tarefa já existente. Por favor, tente novamente.");
  } else {
    tarefas[indiceEditar].txt = novaTarefa;

    if (tarefas[indiceEditar].concluida)
      alternarEstadoTarefa(tarefas[indiceEditar]);

    salvarTarefas();
    alternarMsg("Tarefa editada com sucesso!");
  }

  carregarTarefas(tarefas);
};

const limparCampoNovaTarefa = () => (campoNovaTarefa.value = "");

document.addEventListener("DOMContentLoaded", async () => {
  if (tarefas.length === 0) {
    try {
      const resposta = await fetch("json/tarefas-iniciais.json");

      if (!resposta.ok) {
        throw new Error("Não foi possível resgatar as tarefas iniciais.");
      }

      tarefas = await resposta.json();
      salvarTarefas();
    } catch (err) {
      alternarMsg(err);
    }
  }

  carregarTarefas(tarefas);
});

formAdicionarTarefa.addEventListener("submit", (e) => {
  e.preventDefault();

  const tarefa = campoTarefa.value.trim();

  if (!validarTarefa(tarefa)) {
    alternarMsg(
      "Erro: A tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    adicionarTarefa(tarefa);
  }

  campoTarefa.value = "";
  if (window.innerWidth >= 992) campoTarefa.focus();
  else campoTarefa.blur();
});

formFiltrarTarefas.addEventListener("submit", (e) => {
  e.preventDefault();

  const categoria = campoCategoria.value.trim();

  if (tarefas.length > 0) {
    switch (categoria) {
      case "0":
        carregarTarefas(tarefas);
        break;
      case "1":
        filtrarTarefas(false);
        break;
      case "2":
        filtrarTarefas(true);
        break;
      default:
        carregarTarefas(tarefas);
        alternarMsg("Erro: Por favor, selecione uma categoria.");
    }
  } else {
    alternarMsg(
      "Erro: Não existem tarefas adicionadas. Por favor, adicione uma."
    );
  }

  campoCategoria.value = "";
});

formEditarTarefa.addEventListener("submit", (e) => {
  e.preventDefault();

  const novaTarefa = campoNovaTarefa.value.trim();

  if (!validarTarefa(novaTarefa)) {
    alternarMsg(
      "Erro: A nova tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    editarTarefa(novaTarefa);
  }

  limparCampoNovaTarefa();
  alternarModal(fundoModalEditar, secaoEditarTarefa);
});

[fundoModalEditar, botaoCancelar].forEach((el) =>
  el.addEventListener("click", () => {
    limparCampoNovaTarefa();
    alternarModal(fundoModalEditar, secaoEditarTarefa);
    alternarMsg("Edição de tarefa cancelada!");
  })
);

[fundoModalMsg, botaoFecharModalMsg].forEach((el) =>
  el.addEventListener("click", () => alternarMsg(""))
);
