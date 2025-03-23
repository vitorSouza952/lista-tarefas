$(document).ready(function() {
    function alternarMsgErro(msg) {
        if (msg) {
            $("#msg-erro").text(msg);
            $("#msg-erro").addClass("ativo");
        } else {
            $("#msg-erro").removeClass("ativo");
            $("#msg-erro").text("");
        }
    }

    function criarBotao(texto, classes) {
        const botao = $("<button>", {
            text: texto,
            class: classes
        });

        return botao;
    }

    function adicionarTarefa(valTextoTarefa) {
        const itemTarefa = $("<li>", {
            class: "item-tarefa"
        });

        const textoTarefa = $("<p>", {
            text: valTextoTarefa,
            class: "texto-tarefa"
        });

        const areaAcoesTarefa = $("<div>", {
            class: "area-acoes-tarefa"
        });

        const botaoAlternarEstado = criarBotao("Concluir", "botao botao-alternar-estado");
        const botaoDeletar = criarBotao("Deletar", "botao botao-deletar");

        itemTarefa.append([textoTarefa, areaAcoesTarefa]);
        areaAcoesTarefa.append([botaoAlternarEstado, botaoDeletar]);
        $("#lista-tarefas").append(itemTarefa);

        if (!$("#conteudo-principal").hasClass("ativo")) $("#conteudo-principal").addClass("ativo");
    }

    function limparCampo() {
        $("#texto-tarefa").val("");
        if (window.innerWidth >= 992) $("#texto-tarefa").trigger("focus");
        else $("#texto-tarefa").trigger("blur");
    }

    function alternarEstadoTarefa(botaoAlternarEstado) {
        const itemTarefa = botaoAlternarEstado.closest(".item-tarefa");

        itemTarefa.toggleClass("concluida");

        botaoAlternarEstado.text(itemTarefa.hasClass("concluida") ? "Tornar Pendente" : "Concluir");
    }

    function deletarTarefa(botaoDeletar) {
        botaoDeletar.closest(".item-tarefa").remove();
        
        if ($("#lista-tarefas").children().length === 0) $("#conteudo-principal").removeClass("ativo");
    }

    $("#form").on("submit", function(e) {
        e.preventDefault();

        const valTextoTarefa = $("#texto-tarefa").val();

        if (!valTextoTarefa) {
            alternarMsgErro("Erro: Digite uma tarefa!");
        } else {
            adicionarTarefa(valTextoTarefa);
            alternarMsgErro(null);
        }

        limparCampo();
    });

    $("#lista-tarefas").on("click", function(e) {
        const elAlvo = $(e.target);

        if (elAlvo.hasClass("botao-alternar-estado")) alternarEstadoTarefa(elAlvo);
        if (elAlvo.hasClass("botao-deletar")) deletarTarefa(elAlvo);
    });
});