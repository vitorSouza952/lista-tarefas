const formAdicionar = document.querySelector("#form-adicionar");
const tarefa = document.querySelector("#tarefa");
const conteudoPrincipal = document.querySelector("#conteudo-principal");
const listaTarefas = document.querySelector("#lista-tarefas");
const template = document.querySelector("#template");
const fundoModalEditar = document.querySelector("#fundo-modal-editar");
const modalEditar = document.querySelector("#modal-editar");
const formEditar = document.querySelector("#form-editar");
const novaTarefa = document.querySelector("#nova-tarefa");
const botaoCancelar = document.querySelector("#botao-cancelar");
const fundoModalMsg = document.querySelector("#fundo-modal-msg");
const modalMsg = document.querySelector("#modal-msg");
const txtModalMsg = document.querySelector("#txt-modal-msg");
const botaoFecharModalMsg = document.querySelector("#botao-fechar-modal-msg");
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let iEditar;

function carregarTarefas() {
  listaTarefas.replaceChildren();

  tarefas.forEach(function (el, i) {
    const cloneTemplate = template.content.cloneNode(true);
    const itemListaTarefas = cloneTemplate.querySelector(".item-lista-tarefas");
    const txtTarefa = itemListaTarefas.querySelector(".txt-tarefa");

    const botaoAlternarEstado = itemListaTarefas.querySelector(
      ".botao-alternar-estado"
    );

    const botaoEditar = itemListaTarefas.querySelector(".botao-editar");
    const botaoDeletar = itemListaTarefas.querySelector(".botao-deletar");

    if (el.concluida) {
      itemListaTarefas.classList.add("concluida");
      botaoAlternarEstado.textContent = "Tornar pendente";
    }

    txtTarefa.textContent = el.txt;

    botaoAlternarEstado.addEventListener("click", function () {
      alternarEstadoTarefa(i);
    });

    botaoEditar.addEventListener("click", function () {
      prepararEdicaoTarefa(i);
    });

    botaoDeletar.addEventListener("click", function () {
      deletarTarefa(i);
    });

    listaTarefas.appendChild(itemListaTarefas);

    if (conteudoPrincipal.classList.contains("escondido")) {
      alternarConteudoPrincipal(true);
    }
  });
}

function alternarEstadoTarefa(i) {
  tarefas[i].concluida = !tarefas[i].concluida;
  salvarTarefas();
  carregarTarefas();
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function prepararEdicaoTarefa(i) {
  novaTarefa.value = tarefas[i].txt;
  iEditar = i;
  alternarModal(fundoModalEditar, modalEditar);
}

function alternarModal(fundoModal, modal) {
  [fundoModal, modal].forEach(function (el) {
    el.classList.toggle("escondido");
  });
}

function deletarTarefa(i) {
  tarefas.splice(i, 1);

  if (tarefas.length === 0) {
    removerTodasTarefas();
    alternarConteudoPrincipal(false);
  } else {
    salvarTarefas();
    carregarTarefas();
  }

  alternarModalMsg("Tarefa deletada com sucesso!");
}

function removerTodasTarefas() {
  localStorage.removeItem("tarefas");
}

function alternarConteudoPrincipal(exibir) {
  if (exibir) {
    conteudoPrincipal.classList.remove("escondido");
  } else {
    conteudoPrincipal.classList.add("escondido");
  }
}

function alternarModalMsg(msg) {
  alternarModal(fundoModalMsg, modalMsg);

  if (msg !== "") {
    txtModalMsg.textContent = msg;
  } else {
    setTimeout(function () {
      txtModalMsg.textContent = msg;
    }, 300);
  }
}

function validarTarefa(valTarefa) {
  if (valTarefa === "" || valTarefa.length > 30) {
    return false;
  } else {
    return true;
  }
}

function adicionarTarefa(valTarefa) {
  if (verificarTarefaExiste(valTarefa)) {
    alternarModalMsg("Erro: Tarefa já adicionada. Por favor, tente novamente.");
  } else {
    tarefas.push({ txt: valTarefa, concluida: false });
    salvarTarefas();
    carregarTarefas();
    alternarModalMsg("Tarefa adicionada com sucesso!");
  }
}

function verificarTarefaExiste(valTarefa) {
  const existeTarefa = tarefas.some(function (el) {
    return el.txt.toLowerCase() === valTarefa.toLowerCase();
  });

  if (existeTarefa) {
    return true;
  } else {
    return false;
  }
}

function limparCampoTarefa() {
  tarefa.value = "";

  if (window.innerWidth >= 992) {
    tarefa.focus();
  } else {
    tarefa.blur();
  }
}

function cancelarEdicao() {
  alternarModal(fundoModalEditar, modalEditar);
  limparCampoNovaTarefa();
  alternarModalMsg("Edição de tarefa cancelada!");
}

function limparCampoNovaTarefa() {
  setTimeout(function () {
    novaTarefa.value = "";
  }, 300);
}

function editarTarefa(valNovaTarefa) {
  if (verificarTarefaExiste(valNovaTarefa)) {
    alternarModalMsg("Erro: Tarefa já adicionada. Por favor, tente novamente.");
  } else {
    tarefas[iEditar].txt = valNovaTarefa;
    salvarTarefas();
    carregarTarefas();
    alternarModalMsg("Tarefa editada com sucesso!");
  }

  alternarModal(fundoModalEditar, modalEditar);
}

document.addEventListener("DOMContentLoaded", function () {
  carregarTarefas();
});

formAdicionar.addEventListener("submit", function (e) {
  e.preventDefault();

  const valTarefa = tarefa.value.trim();

  if (!validarTarefa(valTarefa)) {
    alternarModalMsg(
      "Erro: A tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    adicionarTarefa(valTarefa);
  }

  limparCampoTarefa();
});

[fundoModalEditar, botaoCancelar].forEach(function (el) {
  el.addEventListener("click", function () {
    cancelarEdicao();
  });
});

formEditar.addEventListener("submit", function (e) {
  e.preventDefault();

  const valNovaTarefa = novaTarefa.value.trim();

  if (!validarTarefa(valNovaTarefa)) {
    alternarModal(fundoModalEditar, modalEditar);

    alternarModalMsg(
      "Erro: A nova tarefa é obrigatória e deve conter até 30 caracteres. Por favor, tente novamente."
    );
  } else {
    editarTarefa(valNovaTarefa);
  }

  limparCampoNovaTarefa();
});

[fundoModalMsg, botaoFecharModalMsg].forEach(function (el) {
  el.addEventListener("click", function () {
    alternarModalMsg("");
  });
});
