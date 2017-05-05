(function() {

    // Store references
    const inputField = document.getElementById('todo-input-field');
    const inputSubmit = document.getElementById('todo-input-submit');
    const list = document.getElementById('todo-list');

    /**
     * Initialize sortable and call reorder function on end
     */
    let sortable = Sortable.create(list, {
        animation: 150
    });

    // TO DO - all to edit them

    const addTodo = () => {
        if (inputField.value === '') return;
        let val = inputField.value;
        let todo = document.createElement('li');
        todo.setAttribute('class', 'todo-item');
        todo.innerHTML = `<div class="todo-item-done"><span><i class="fa fa-check" aria-hidden="true"></i></span></div><div class="todo-item-content">${val}</div><div class="todo-item-edit"><span><i class="fa fa-pencil" aria-hidden="true"></i></span></div><div class="todo-item-delete"><span><i class="fa fa-times" aria-hidden="true"></i></span></div>`;
        list.append(todo);
        completeListener(todo.getElementsByClassName('todo-item-done')[0]);
        deleteListener(todo.getElementsByClassName('todo-item-delete')[0]);
        clearForm();
    };

    const deleteListener = btn => {
        btn.addEventListener('click', () => {
            btn.parentNode.classList.add('completed');
            setTimeout(() => {
                btn.parentNode.remove();
            }, 500);
        });
    };

    const completeListener = btn => {
        btn.addEventListener('click', () => {
            btn.parentNode.classList.add('deleted');
            setTimeout(() => {
                btn.parentNode.remove();
            }, 500);
        });
    };

    const clearForm = () => {
        inputField.value = '';
    };

    const init = () => {
        // Add event listeners
        inputField.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                addTodo();
            }
        });

        inputSubmit.addEventListener('click', addTodo);
    };

    // Wait for DOM content to have loaded
    document.addEventListener('DOMContentLoaded', init);

}());
