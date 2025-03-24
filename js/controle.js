$(document).ready(function () {
  function alternarMsgErro(msg) {
    if (!msg) {
      $("#msg-erro").removeClass("ativo");
    } else {
      $("#msg-erro").addClass("ativo");
    }

    $("#msg-erro").text(msg);
  }

  function limparCampo() {
    $("#texto-tarefa").val("");
    if (window.innerWidth >= 992) $("#texto-tarefa").trigger("focus");
    else $("#texto-tarefa").trigger("blur");
  }

  function criarBotao(classes, texto) {
    const botao = $("<button>", {
      class: classes,
      text: texto,
    });

    return botao;
  }

  function adicionarTarefa(valTextoTarefa) {
    const itemTarefa = $("<li>", {
      class: "item-tarefa",
    });

    const textoTarefa = $("<p>", {
      class: "texto-tarefa",
      text: valTextoTarefa,
    });

    const areaAcoesTarefa = $("<div>", {
      class: "area-acoes-tarefa",
    });

    const botaoAlternarEstado = criarBotao(
      "botao botao-alternar-estado",
      "Concluir"
    );

    const botaoDeletar = criarBotao("botao botao-deletar", "Deletar");

    itemTarefa.append([textoTarefa, areaAcoesTarefa]);
    areaAcoesTarefa.append([botaoAlternarEstado, botaoDeletar]);
    $("#lista-tarefas").append(itemTarefa);

    if (!$("#conteudo-principal").hasClass("ativo"))
      $("#conteudo-principal").addClass("ativo");
  }

  function alternarEstadoTarefa(botaoAlternarEstado) {
    const itemTarefa = botaoAlternarEstado.closest(".item-tarefa");

    itemTarefa.toggleClass("concluida");

    botaoAlternarEstado.text(
      itemTarefa.hasClass("concluida") ? "Tornar Pendente" : "Concluir"
    );
  }

  function deletarTarefa(botaoDeletar) {
    botaoDeletar.closest(".item-tarefa").remove();

    if ($("#lista-tarefas").children().length === 0)
      $("#conteudo-principal").removeClass("ativo");
  }

  $("#form").on("submit", function (e) {
    e.preventDefault();

    const valTextoTarefa = $("#texto-tarefa").val();

    if (!valTextoTarefa) {
      alternarMsgErro("Erro: Por favor, digite uma tarefa.");
    } else {
      alternarMsgErro("");
      adicionarTarefa(valTextoTarefa);
    }

    limparCampo();
  });

  $("#lista-tarefas").on("click", function (e) {
    const elAlvo = $(e.target);

    if (elAlvo.hasClass("botao-alternar-estado")) alternarEstadoTarefa(elAlvo);
    if (elAlvo.hasClass("botao-deletar")) deletarTarefa(elAlvo);
  });
});
