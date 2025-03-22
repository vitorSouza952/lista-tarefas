$(document).ready(function () {
    function toggleTaskStatus(toggleTaskStatusBtn) {
        const taskItem = toggleTaskStatusBtn.closest(".task-item");

        taskItem.toggleClass("completed");

        toggleTaskStatusBtn.text(taskItem.hasClass("completed") ? "Tornar Pendente" : "Concluir");
    }

    function deleteTask(deleteTaskBtn) {
        deleteTaskBtn.closest(".task-item").remove();
        if ($("#task-list").children().length === 0) $("#main-content").removeClass("active");
    }

    function toggleErrorMsg(msg) {
        if (msg) {
            $("#error-msg").text(msg);
            $("#error-msg").addClass("active");
        } else {
            $("#error-msg").removeClass("active");
            $("#error-msg").text("");
        }
    }

    function cleanField() {
        $("#task-text").val("");
        if (window.innerWidth >= 992) $("#task-text").trigger("focus");
        else $("#task-text").trigger("blur");
    }

    function addTask(taskText) {
        $("#task-list").append(`<li class="task-item">
                                    <p class="task-text">${taskText}</p>
                                    <div class="task-actions-area">
                                        <button type="button" class="btn toggle-task-status-btn">Concluir</button>
                                        <button type="button" class="btn delete-task-btn">Deletar</button>
                                    </div>
                                </li>`);
        
        if (!$("#main-content").hasClass("active")) $("#main-content").addClass("active");
    }

    $(this).on("click", function (e) {
        const targetEl = $(e.target);

        if (targetEl.hasClass("toggle-task-status-btn")) toggleTaskStatus(targetEl);
        if (targetEl.hasClass("delete-task-btn")) deleteTask(targetEl);
    });

    $("#form").on("submit", function (e) {
        e.preventDefault();

        const taskText = $("#task-text").val().trim();

        if (!taskText || taskText.length > 30) {
            toggleErrorMsg("Erro: A tarefa é obrigatória e deve conter no máximo 30 caracteres.");

            cleanField();
        } else {
            addTask(taskText);
            toggleErrorMsg(null);
            cleanField();
        }
    });
});