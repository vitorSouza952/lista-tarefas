// Elementos DOM
const formulario = document.querySelector('#formulario');
const titulo = document.querySelector('#titulo');
const descricao = document.querySelector('#descricao');
const listaTarefas = document.querySelector('#lista-tarefas');
const semTarefas = document.querySelector('#sem-tarefas');
const templateItemLista = document.querySelector('#template-item-lista');
const areaModal = document.querySelector('#area-modal');
const msgModal = document.querySelector('#msg-modal');
const botaoFecharModal = document.querySelector('#botao-fechar-modal');

// Funções

// Função que conclui uma tarefa
const concluirTarefa = botaoConcluir => {
    const itemLista = botaoConcluir.closest('li');
    const tituloTarefa = itemLista.querySelector('.titulo-tarefa');

    itemLista.classList.toggle('concluida');

    if (itemLista.classList.contains('concluida')) botaoConcluir.innerHTML = '<i class="bi bi-x-circle"></i>'; 
    else botaoConcluir.innerHTML = '<i class="bi bi-check-circle"></i>';

    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const indiceTarefa = tarefas.findIndex(({ titulo }) => titulo.toLowerCase() === tituloTarefa.innerText.toLowerCase());

    if (indiceTarefa !== -1) {
        tarefas[indiceTarefa].concluida = itemLista.classList.contains('concluida');

        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
};

// Função que alterna a exibição da lista de acordo com a existência de tarefas
const alternarLista = acao => {
    if (acao === 'Desaparecer') {
        listaTarefas.style.display = 'none';
        semTarefas.style.display = 'block';
    } else {
        listaTarefas.style.display = 'flex';
        semTarefas.style.display = 'none';
    }
};

// Função que deleta uma tarefa
const deletarTarefa = botaoDeletar => {
    const itemLista = botaoDeletar.closest('li');
    const tituloTarefa = itemLista.querySelector('.titulo-tarefa');

    itemLista.remove();

    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const novasTarefas = tarefas.filter(({ titulo }) => titulo.toLowerCase() !== tituloTarefa.innerText.toLowerCase());

    if (novasTarefas.length > 0) {
        localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
    } else {
        localStorage.removeItem('tarefas');

        alternarLista('Desaparecer');
    }

    alternarModal('Tarefa deletada com sucesso.');
};

// Função que alterna a exibição do modal
const alternarModal = msg => {
    if (msg) {
        msgModal.innerText = msg;
        areaModal.style.display = 'flex';
    } else {
        msgModal.innerText = '';
        areaModal.style.display = 'none';
    }
};

// Função que limpa os campos de entrada e os foca/desfoca
const limparCampo = campo => {
    campo.value = '';

    if (window.screen.width < 1024) campo.blur();
    else campo.focus();
};

// Função que adiciona uma tarefa, tanto na lista quanto em localStorage
const adicionarTarefa = (valorTitulo, valorDescricao) => {
    const cloneTemplate = templateItemLista.content.cloneNode(true);
    const itemLista = cloneTemplate.querySelector('li');
    const tituloTarefa = itemLista.querySelector('.titulo-tarefa');
    const descricaoTarefa = itemLista.querySelector('.descricao-tarefa');

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) ?? [];

    if (tarefas.find(({ titulo }) => titulo.toLowerCase() === valorTitulo.toLowerCase())) {
        alternarModal('Erro: Tarefa já adicionada.');

        limparCampo(descricao);
        limparCampo(titulo);

        return;
    }

    tituloTarefa.innerText = valorTitulo;
    descricaoTarefa.innerText = valorDescricao;

    listaTarefas.appendChild(itemLista);

    if (listaTarefas.style.display !== 'flex') alternarLista('Aparecer');

    tarefas.push({ titulo: valorTitulo, descricao: valorDescricao, concluida: false });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    limparCampo(descricao);
    limparCampo(titulo);

    alternarModal('Tarefa adicionada com sucesso.');
};

// Eventos

// Evento de carregamento do documento
document.addEventListener('DOMContentLoaded', () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));

    if (tarefas) {
        tarefas.forEach(({ titulo, descricao, concluida }) => {
            const cloneItemLista = templateItemLista.content.cloneNode(true);
            const itemLista = cloneItemLista.querySelector('li');
            const tituloTarefa = itemLista.querySelector('.titulo-tarefa');
            const descricaoTarefa = itemLista.querySelector('.descricao-tarefa');

            if (concluida) {
                itemLista.classList.add('concluida');

                const botaoConcluir = itemLista.querySelector('.botao-concluir');
                
                botaoConcluir.innerHTML = '<i class="bi bi-x-circle"></i>';
            }

            tituloTarefa.innerText = titulo;
            descricaoTarefa.innerText = descricao;

            if (listaTarefas.style.display !== 'flex') alternarLista('Aparecer');

            listaTarefas.appendChild(itemLista);
        });
    }
});

// Evento de clique no documento
document.addEventListener('click', event => {
    const elementoAlvo = event.target;

    if (elementoAlvo.classList.contains('botao-concluir')) concluirTarefa(elementoAlvo);

    if (elementoAlvo.classList.contains('botao-deletar')) deletarTarefa(elementoAlvo);

    if (elementoAlvo === areaModal && areaModal.style.display === 'flex') alternarModal(null);
});

// Evento de tecla pressionada no documento
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && areaModal.style.display === 'flex') alternarModal(null);
});

// Evento de submissão do formulário de adição de tarefas
formulario.addEventListener('submit', event => {
    event.preventDefault();

    const valorTitulo = titulo.value.trim();
    const valorDescricao = descricao.value.trim();

    if (!titulo.checkValidity() || !valorTitulo || valorTitulo.length > 30) {
        alternarModal('Erro: O título da tarefa é obrigatório e deve conter até 30 caracteres.');

        limparCampo(titulo);

        return;
    }

    if (!descricao.checkValidity() || !valorDescricao || valorDescricao.length > 50) {
        alternarModal('Erro: A descrição da tarefa é obrigatória e deve conter até 50 caracteres.');

        limparCampo(descricao);
        
        return;
    }

    adicionarTarefa(valorTitulo, valorDescricao);
});

// Evento de clique do botão de fechar modal
botaoFecharModal.addEventListener('click', () => alternarModal(null));