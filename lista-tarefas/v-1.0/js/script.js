const formulario = document.querySelector('#formulario');
const titulo = document.querySelector('#titulo');
const erroTitulo = document.querySelector('#erro-titulo');
const descricao = document.querySelector('#descricao');
const erroDescricao = document.querySelector('#erro-descricao');
const listaTarefas = document.querySelector('#lista-tarefas');
const semTarefas = document.querySelector('#sem-tarefas');
const templateItemLista = document.querySelector('#template-item-lista');

const concluirTarefa = (botaoConcluir) => {
    const itemLista = botaoConcluir.closest('li');

    itemLista.classList.toggle('concluida');

    if (itemLista.classList.contains('concluida')) botaoConcluir.innerHTML = '<i class="bi bi-x-circle"></i>'; 
    else botaoConcluir.innerHTML = '<i class="bi bi-check-circle"></i>';
};

const deletarTarefa = (botaoDeletar) => {
    botaoDeletar.closest('li').remove();

    if (listaTarefas.innerHTML === '') {
        listaTarefas.style.display = 'none';
        semTarefas.style.display = 'block';
    }
};

const adicionarTarefa = (valorTitulo, valorDescricao) => {
    const cloneTemplate = templateItemLista.content.cloneNode(true);
    const itemLista = cloneTemplate.querySelector('li');

    const tituloTarefa = itemLista.querySelector('.titulo-tarefa');
    const descricaoTarefa = itemLista.querySelector('.descricao-tarefa');

    tituloTarefa.innerText = valorTitulo;
    descricaoTarefa.innerText = valorDescricao;

    listaTarefas.appendChild(itemLista);

    if (listaTarefas.style.display !== 'flex') {
        listaTarefas.style.display = 'flex';
        semTarefas.style.display = 'none';
    }

    titulo.value = '';
    descricao.value = '';

    titulo.focus();
};

document.addEventListener('click', (event) => {
    const elementoAlvo = event.target;

    if (elementoAlvo.classList.contains('botao-concluir')) concluirTarefa(elementoAlvo);
    if (elementoAlvo.classList.contains('botao-deletar')) deletarTarefa(elementoAlvo);
});

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const valorTitulo = titulo.value;
    const valorDescricao = descricao.value;

    erroTitulo.classList.remove('ativo');
    erroDescricao.classList.remove('ativo');

    if (!valorTitulo || valorTitulo.length > 30) {
        erroTitulo.classList.add('ativo');

        return;
    }

    if (!valorDescricao || valorDescricao.length > 50) {
        erroDescricao.classList.add('ativo');

        return;
    }

    adicionarTarefa(valorTitulo, valorDescricao);
});