const formularioAdicao = document.querySelector("#formulario-adicao");
const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const formularioFiltragem = document.querySelector("#formulario-filtragem");
const categoria = document.querySelector("#categoria");
const listaTarefas = document.querySelector("#lista-tarefas");
const mensagemSemTarefas = document.querySelector("#mensagem-sem-tarefas");
const templateItemLista = document.querySelector("#template-item-lista");
const areaModal = document.querySelector("#area-modal");
const secaoModal = document.querySelector("#secao-modal");
const mensagemModal = document.querySelector("#mensagem-modal");
const botaoFecharModal = document.querySelector("#botao-fechar-modal");

const exibirTarefas = () => {
  const tarefas = document.querySelectorAll("li");

  tarefas.forEach((tarefa) => {
    if (tarefa.classList.contains("inativo"))
      tarefa.classList.remove("inativo");
  });

  categoria.value = "";
};

const alternarTarefaSalva = (tituloTarefa, estaConcluida) => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas"));

  if (tarefasSalvas) {
    const indiceTarefa = tarefasSalvas.findIndex(
      ({ titulo }) => titulo.toLowerCase() === tituloTarefa.toLowerCase()
    );

    if (indiceTarefa !== -1) {
      tarefasSalvas[indiceTarefa].concluida = estaConcluida;

      localStorage.setItem("tarefas", JSON.stringify(tarefasSalvas));

      exibirTarefas();
    }
  }
};

const alternarTarefa = (botaoAlternarEstado) => {
  const itemLista = botaoAlternarEstado.closest("li");
  const tituloTarefa = itemLista.querySelector("h3");

  itemLista.classList.toggle("concluida");

  alternarTarefaSalva(
    tituloTarefa.innerText,
    itemLista.classList.contains("concluida")
  );
};

const alternarLista = (aparecer) => {
  if (aparecer) {
    listaTarefas.classList.add("ativo");
    mensagemSemTarefas.classList.add("inativo");
  } else {
    listaTarefas.classList.remove("ativo");
    mensagemSemTarefas.classList.remove("inativo");
  }
};

const alternarModal = (mensagem) => {
  [areaModal, secaoModal].forEach((elemento) =>
    elemento.classList.toggle("ativo")
  );

  if (mensagem) mensagemModal.innerText = mensagem;
};

const excluirTarefaSalva = (tituloTarefa) => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas"));

  if (tarefasSalvas) {
    const novasTarefas = tarefasSalvas.filter(
      ({ titulo }) => titulo.toLowerCase() !== tituloTarefa.toLowerCase()
    );

    if (novasTarefas.length > 0) {
      localStorage.setItem("tarefas", JSON.stringify(novasTarefas));
    } else {
      localStorage.removeItem("tarefas");

      alternarLista(false);
    }

    alternarModal("Tarefa excluída com sucesso!");

    exibirTarefas();
  }
};

const excluirTarefa = (botaoExcluir) => {
  const itemLista = botaoExcluir.closest("li");
  const tituloTarefa = itemLista.querySelector("h3");

  itemLista.remove();

  excluirTarefaSalva(tituloTarefa.innerText);
};

const adicionarTarefa = ({ titulo, descricao, concluida }) => {
  const cloneTemplate = templateItemLista.content.cloneNode(true);
  const itemLista = cloneTemplate.querySelector("li");
  const tituloTarefa = itemLista.querySelector("h3");
  const descricaoTarefa = itemLista.querySelector("p");

  if (concluida) itemLista.classList.add("concluida");

  tituloTarefa.innerText = titulo;
  descricaoTarefa.innerText = descricao;

  listaTarefas.appendChild(itemLista);

  if (!listaTarefas.classList.contains("ativo")) alternarLista(true);
};

const validarCampo = (valorCampo, comprimento) =>
  valorCampo && valorCampo.length <= comprimento;

const limparCampo = (campo) => {
  campo.value = "";

  if (window.screen.width < 1024) campo.blur();
  else campo.focus();
};

document.addEventListener("click", (event) => {
  const elementoAlvo = event.target;

  if (elementoAlvo.classList.contains("botao-alternar-estado"))
    alternarTarefa(elementoAlvo);

  if (elementoAlvo.classList.contains("botao-excluir"))
    excluirTarefa(elementoAlvo);

  if (elementoAlvo === areaModal) alternarModal(null);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && areaModal.classList.contains("ativo"))
    alternarModal(null);
});

document.addEventListener("DOMContentLoaded", () => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas"));

  if (tarefasSalvas) {
    tarefasSalvas.forEach((tarefaSalva) => {
      adicionarTarefa(tarefaSalva);
    });
  }
});

formularioAdicao.addEventListener("submit", (event) => {
  event.preventDefault();

  const valorTitulo = titulo.value.trim();
  const valorDescricao = descricao.value.trim();
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) ?? [];
  const tarefaAtual = {
    titulo: valorTitulo,
    descricao: valorDescricao,
    concluida: false,
  };

  if (!titulo.checkValidity() || !validarCampo(valorTitulo, 30)) {
    alternarModal(
      "Erro: O título da tarefa é obrigatório e deve conter até 30 caracteres!"
    );

    limparCampo(titulo);

    return;
  }

  if (!descricao.checkValidity() || !validarCampo(valorDescricao, 50)) {
    alternarModal(
      "Erro: A descrição da tarefa é obrigatória e deve conter até 50 caracteres!"
    );

    limparCampo(descricao);

    return;
  }

  if (
    tarefasSalvas.find(
      ({ titulo }) => titulo.toLowerCase() === valorTitulo.toLowerCase()
    )
  ) {
    alternarModal("Erro: Tarefa já adicionada!");

    limparCampo(descricao);
    limparCampo(titulo);

    return;
  }

  tarefasSalvas.push(tarefaAtual);

  localStorage.setItem("tarefas", JSON.stringify(tarefasSalvas));

  adicionarTarefa(tarefaAtual);

  limparCampo(descricao);
  limparCampo(titulo);

  alternarModal("Tarefa adicionada com sucesso!");

  exibirTarefas();
});

formularioFiltragem.addEventListener("submit", (event) => {
  event.preventDefault();

  const valorCategoria = categoria.value.trim();
  const tarefas = document.querySelectorAll("li");

  if (!categoria.checkValidity()) {
    alternarModal("Erro: Selecione uma opção!");

    categoria.value = "";

    return;
  }

  if (tarefas.length > 0) {
    let temTarefas = false;

    tarefas.forEach((tarefa) => {
      switch (valorCategoria) {
        case "1":
          if (tarefa.classList.contains("inativo"))
            tarefa.classList.remove("inativo");

          temTarefas = true;

          break;
        case "2":
          if (tarefa.classList.contains("concluida")) {
            tarefa.classList.add("inativo");
          } else {
            tarefa.classList.remove("inativo");

            temTarefas = true;
          }

          break;
        case "3":
          if (!tarefa.classList.contains("concluida")) {
            tarefa.classList.add("inativo");
          } else {
            tarefa.classList.remove("inativo");

            temTarefas = true;
          }
      }
    });

    if (!temTarefas) {
      alternarModal("Erro: Não existem tarefas nesta categoria!");

      exibirTarefas();
    }
  } else {
    alternarModal("Erro: Nenhuma tarefa foi adicionada ainda!");

    categoria.value = "";
  }
});

botaoFecharModal.addEventListener("click", () => alternarModal(null));
