const formAdicionar = document.querySelector("#form-adicionar");
const conteudoPrincipal = document.querySelector("#conteudo-principal");
const fundoModalEditar = document.querySelector("#fundo-modal-editar");
const modalEditar = document.querySelector("#modal-editar");
const formEditar = document.querySelector("#form-editar");
const campoNovaTarefa = document.querySelector("#campo-nova-tarefa");
const botaoCancelarEdicao = document.querySelector("#botao-cancelar-edicao");
const fundoModalMsg = document.querySelector("#fundo-modal-msg");
const modalMsg = document.querySelector("#modal-msg");
const botaoFecharModalMsg = document.querySelector("#botao-fechar-modal-msg");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let indiceTarefaEditar;

async function esperarTarefas() {
  if (tarefas.length === 0) {
    await resgatarTarefas();
  }

  carregarTarefas();
}

async function resgatarTarefas() {
  try {
    const resposta = await fetch("json/tarefas-iniciais.json");

    if (!resposta.ok) {
      throw new Error("Erro: Não foi possível resgatar as tarefas iniciais.");
    }

    const dados = await resposta.json();

    tarefas = dados;
    salvarTarefas();
  } catch (erro) {
    alternarModalMsg(erro);
  }
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function alternarModalMsg(msg) {
  const txtModalMsg = document.querySelector("#txt-modal-msg");

  alternarModal(fundoModalMsg, modalMsg);

  if (msg !== "") {
    txtModalMsg.textContent = msg;
  } else {
    setTimeout(function () {
      txtModalMsg.textContent = msg;
    }, 300);
  }
}

function alternarModal(fundoModal, modal) {
  [fundoModal, modal].forEach(function (elemento) {
    elemento.classList.toggle("esconder");
  });
}

function carregarTarefas() {
  const listaTarefas = document.querySelector("#lista-tarefas");
  const template = document.querySelector("#template");

  listaTarefas.replaceChildren();

  tarefas.forEach(function (elemento, indice) {
    const cloneTemplate = template.content.cloneNode(true);
    const itemTarefa = cloneTemplate.querySelector(".item-tarefa");
    const txtTarefa = itemTarefa.querySelector(".txt-tarefa");

    const botaoAlternarEstado = itemTarefa.querySelector(
      ".botao-alternar-estado"
    );

    const botaoEditar = itemTarefa.querySelector(".botao-editar");
    const botaoDeletar = itemTarefa.querySelector(".botao-deletar");

    if (elemento.concluida) {
      itemTarefa.classList.add("concluida");

      botaoAlternarEstado.innerHTML =
        "Tornar Pendente <i class='bi bi-x-square'></i>";
    }

    txtTarefa.textContent = elemento.txt;

    botaoAlternarEstado.addEventListener("click", function () {
      alternarEstadoTarefa(indice);
    });

    botaoEditar.addEventListener("click", function () {
      prepararEdicaoTarefa(indice);
    });

    botaoDeletar.addEventListener("click", function () {
      deletarTarefa(indice);
    });

    listaTarefas.appendChild(itemTarefa);

    if (conteudoPrincipal.classList.contains("esconder")) {
      alternarConteudoPrincipal(true);
    }
  });
}

function alternarEstadoTarefa(indice) {
  tarefas[indice].concluida = !tarefas[indice].concluida;
  salvarTarefas();
  carregarTarefas();
}

function prepararEdicaoTarefa(indice) {
  campoNovaTarefa.value = tarefas[indice].txt;
  indiceTarefaEditar = indice;
  alternarModal(fundoModalEditar, modalEditar);
}

function deletarTarefa(indice) {
  tarefas.splice(indice, 1);

  if (tarefas.length === 0) {
    alternarConteudoPrincipal(false);
    removerTodasTarefas();
  } else {
    salvarTarefas();
    carregarTarefas();
  }

  alternarModalMsg("Tarefa deletada com sucesso!");
}

function alternarConteudoPrincipal(exibir) {
  if (exibir) {
    conteudoPrincipal.classList.remove("esconder");
  } else {
    conteudoPrincipal.classList.add("esconder");
  }
}

function removerTodasTarefas() {
  localStorage.removeItem("tarefas");
}

function adicionarTarefa(tarefa) {
  if (existeTarefa(tarefa)) {
    alternarModalMsg("Erro: Tarefa já existente. Por favor, tente novamente.");
  } else {
    tarefas.push({ txt: tarefa, concluida: false });
    salvarTarefas();
    carregarTarefas();
    alternarModalMsg("Tarefa adicionada com sucesso!");
  }
}

function existeTarefa(tarefa) {
  const existeTarefa = tarefas.some(function (elemento) {
    return elemento.txt.toLowerCase() === tarefa.toLowerCase();
  });

  return existeTarefa;
}

function limparCampoTarefa(campoTarefa) {
  campoTarefa.value = "";

  if (window.innerWidth >= 992) {
    campoTarefa.focus();
  } else {
    campoTarefa.blur();
  }
}

function editarTarefa(novaTarefa) {
  if (existeTarefa(novaTarefa)) {
    alternarModalMsg("Erro: Tarefa já existente. Por favor, tente novamente.");
  } else {
    tarefas[indiceTarefaEditar].txt = novaTarefa;

    if (tarefas[indiceTarefaEditar].concluida) {
      alternarEstadoTarefa(indiceTarefaEditar);
    }

    salvarTarefas();
    carregarTarefas();
    alternarModalMsg("Tarefa editada com sucesso!");
  }
}

function limparCampoNovaTarefa() {
  setTimeout(function () {
    campoNovaTarefa.value = "";
  }, 300);
}

window.addEventListener("load", function () {
  esperarTarefas();
});

formAdicionar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const campoTarefa = document.querySelector("#campo-tarefa");
  const tarefa = campoTarefa.value.trim();

  if (tarefa === "" || tarefa.length > 30) {
    alternarModalMsg(
      "Erro: A tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    adicionarTarefa(tarefa);
  }

  limparCampoTarefa(campoTarefa);
});

formEditar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const novaTarefa = campoNovaTarefa.value.trim();

  if (novaTarefa === "" || novaTarefa.length > 30) {
    alternarModalMsg(
      "Erro: A nova tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    editarTarefa(novaTarefa);
  }

  limparCampoNovaTarefa();
  alternarModal(fundoModalEditar, modalEditar);
});

[fundoModalEditar, botaoCancelarEdicao].forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    limparCampoNovaTarefa();
    alternarModal(fundoModalEditar, modalEditar);
    alternarModalMsg("Edição de tarefa cancelada!");
  });
});

[fundoModalMsg, botaoFecharModalMsg].forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    alternarModalMsg("");
  });
});
