(function() {
    // Store main references
    const inputField = document.getElementById('todo-input-field');
    const inputSubmit = document.getElementById('todo-input-submit');
    const plus = document.getElementById('todo-input-icon');
    const list = document.getElementById('todo-list');
    const completedList = document.getElementById('todo-list-complete');
    const summary = document.getElementById('todo-summary');
    const summaryToggle = document.getElementById('todo-summary-toggle');

    // Define Variables
    let listItems = {
        incomplete: {},
        complete: {}
    };

    /**
     * Initialize sortable and call reorder function on end
     */
    Sortable.create(list, {
        animation: 150,
        onEnd: function() {
            setListIDs();
        }
    });

    /**
     * Adds to do item to the list
     * @private
     */
    const addTodo = (val, created, itemID, completedOn = false) => {
        // Create the todo item
        let todo = document.createElement('li');
        todo.setAttribute('class', 'todo-item');
        todo.dataset.createdOn = created;
        todo.dataset.completedOn = completedOn;
        todo.innerHTML = `
            <div class="todo-item-wrap">
                <div class="todo-item-complete"><span><i class="fa fa-check" aria-hidden="true"></i></span></div>
                <div class="todo-item-content">${val}</div>
                <div class="todo-item-content-edit"><input type="text" class="todo-item-edit-field"></div>
                <div class="todo-item-edit-options">
                    <div class="todo-item-edit-confirm"><span><i class="fa fa-check" aria-hidden="true"></i></span></div>
                    <div class="todo-item-edit-cancel"><span><i class="fa fa-times" aria-hidden="true"></i></span></div>
                </div>
                <div class="todo-item-options">
                    <div class="todo-item-edit"><span><i class="fa fa-pencil" aria-hidden="true"></i></span></div>
                    <div class="todo-item-delete"><span><i class="fa fa-trash-o" aria-hidden="true"></i></span></div>
                </div>
            </div>
            <div class="todo-item-completed"><span>Completed!</span></div>
            <div class="todo-item-deleted"><span>Deleted!</span></div>
        `;

        // Create necessary event listeners
        completeListener(todo.getElementsByClassName('todo-item-complete')[0]);
        editListener(todo.getElementsByClassName('todo-item-edit')[0]);
        editFieldListener(todo.getElementsByClassName('todo-item-edit-field')[0]);
        editConfirmListener(todo.getElementsByClassName('todo-item-edit-confirm')[0]);
        editCancelListener(todo.getElementsByClassName('todo-item-edit-cancel')[0]);
        deleteListener(todo.getElementsByClassName('todo-item-delete')[0]);

        // Clear the form
        clearForm();

        if (!completedOn) {
            list.append(todo);
            todo.setAttribute('id', `todo-${itemID}`);
            // Add to list items
            listItems.incomplete[itemID] = {
                'todo': val,
                'created': created,
                'completed': completedOn
            };
        } else {
            completedList.append(todo);
            todo.classList.add('completed');
            todo.setAttribute('id', `todocomplete-${itemID}`);
            // Add to list items
            listItems.complete[itemID] = {
                'todo': val,
                'created': created,
                'completed': completedOn
            };
        }

        // Save list
        saveList();
    };

    /**
     * Adds event listener for compete task button
     * @private
     * @param {object} btn - Complete button
     */
    const completeListener = btn => {
        let item = btn.parentNode.parentNode;
        let wrap = btn.parentNode;
        let completed = item.getElementsByClassName('todo-item-completed')[0];
        let isCompleted = (item.dataset.completedOn !== 'false');
        btn.addEventListener('click', () => {
            if (isCompleted) {
                item.remove();
                addTodo(item.getElementsByClassName('todo-item-content')[0].innerHTML, item.dataset.createdOn, item.id.split('-')[1]);
                setListIDs();
            } else {
                completed.height = item.height;
                completed.classList.add('active');
                wrap.classList.add('slide');
                setTimeout(() => {
                    item.remove();
                    addTodo(item.getElementsByClassName('todo-item-content')[0].innerHTML, item.dataset.createdOn, item.id.split('-')[1], moment().format('YYYY-MM-DD'));
                    setListIDs();
                }, 750);
            }
        });
    };

    /**
     * Adds event listener for edit to-do input field
     * @private
     * @param {object} field - Edit to do title field
     */
    const editFieldListener = field => {
        let wrap = field.parentNode.parentNode;
        field.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                if (field.value === '') return;
                wrap.getElementsByClassName('todo-item-content')[0].innerHTML = field.value;
                wrap.getElementsByClassName('todo-item-content')[0].classList.remove('inactive');
                wrap.getElementsByClassName('todo-item-content-edit')[0].classList.remove('active');
                wrap.classList.remove('active');

                // Reset IDs and save
                setListIDs();
            }
        });
    };

    /**
     * Adds event listener for edit task button
     * @private
     * @param {object} btn - Edit button
     */
    const editListener = btn => {
        let wrap = btn.parentNode.parentNode;
        btn.addEventListener('click', () => {
            wrap.getElementsByClassName('todo-item-content')[0].classList.add('inactive');
            wrap.getElementsByClassName('todo-item-edit-field')[0].value = wrap.getElementsByClassName('todo-item-content')[0].innerHTML;
            wrap.getElementsByClassName('todo-item-content-edit')[0].classList.add('active');
            wrap.getElementsByClassName('todo-item-edit-field')[0].select();
            wrap.classList.add('active');
        });
    };

    /**
     * Adds event listener for edit task button
     * @private
     * @param {object} btn - Edit Confirm button
     */
    const editConfirmListener = btn => {
        let wrap = btn.parentNode.parentNode;
        let field = wrap.getElementsByClassName('todo-item-edit-field')[0];
        btn.addEventListener('click', () => {
            if (field.value === '') return;
            wrap.getElementsByClassName('todo-item-content')[0].innerHTML = field.value;
            wrap.getElementsByClassName('todo-item-content')[0].classList.remove('inactive');
            wrap.getElementsByClassName('todo-item-content-edit')[0].classList.remove('active');
            wrap.classList.remove('active');

            // Reset IDs and save
            setListIDs();
        });
    };

    /**
     * Adds event listener for edit task button
     * @private
     * @param {object} btn - Edit Cancel button
     */
    const editCancelListener = btn => {
        let wrap = btn.parentNode.parentNode;
        btn.addEventListener('click', () => {
            wrap.getElementsByClassName('todo-item-content')[0].classList.remove('inactive');
            wrap.getElementsByClassName('todo-item-content-edit')[0].classList.remove('active');
            wrap.getElementsByClassName('todo-item-edit')[0].getElementsByTagName('span')[0].classList.remove('active');
            wrap.classList.remove('active');
        });
    };

    /**
     * Adds event listener for delete task button
     * @private
     * @param {object} btn - Delete button
     */
    const deleteListener = btn => {
        let item = btn.parentNode.parentNode.parentNode;
        let wrap = btn.parentNode.parentNode;
        btn.addEventListener('click', () => {
            item.getElementsByClassName('todo-item-deleted')[0].height = item.clientHeight;
            item.getElementsByClassName('todo-item-deleted')[0].classList.add('active');
            wrap.classList.add('slide');
            setTimeout(() => {
                item.remove();
                setListIDs();
            }, 750);
        });
    };

    /**
     * Clears the form
     * @private
     */
    const clearForm = () => {
        inputField.value = '';
    };

    /**
     * Saves the current list to-dos
     * @private
     */
    const setListIDs = () => {
        // Store all list items
        let incompleteTodos = list.getElementsByClassName('todo-item');
        let completeTodos = completedList.getElementsByClassName('todo-item');

        // Empty todo list object
        listItems = {
            incomplete: {},
            complete: {}
        };

        // Loop over any incomplete todos
        if (incompleteTodos.length > 0) {
            for (let i = 0; i < incompleteTodos.length; i++) {
                // Update ID
                incompleteTodos[i].id = `todo-${i+1}`;

                // Add information to listItems object
                listItems.incomplete[i+1] = {
                    'todo': incompleteTodos[i].getElementsByClassName('todo-item-content')[0].innerHTML,
                    'created': incompleteTodos[i].dataset.createdOn,
                    'completed': incompleteTodos[i].dataset.completedOn
                };
            }
        }

        // Loop over any complete todos
        if (completeTodos.length > 0) {
            for (let i = 0; i < completeTodos.length; i++) {
                // Update ID
                completeTodos[i].id = `todocomplete-${i+1}`;

                // Add information to listItems object
                listItems.complete[i+1] = {
                    'todo': completeTodos[i].getElementsByClassName('todo-item-content')[0].innerHTML,
                    'created': completeTodos[i].dataset.createdOn,
                    'completed': completeTodos[i].dataset.completedOn
                };
            }
        }

        // Save list
        saveList();
    };

    /**
     * Saves the current list to-dos
     * @private
     */
    const saveList = () => {
        // Clear list storage and set new list
        chrome.storage.sync.remove('list', function() {
            chrome.storage.sync.set({
                'list': listItems
            }, function() {
                console.log('List updated.');
            });
        });
    };

    /**
     * Loads the current list to-dos
     * @private
     */
    const loadList = () => {
        chrome.storage.sync.get('list', function(data) {
            // Loop through incomplete
            for (let item in data.list.incomplete) {
                // skip loop if the property is from prototype
                if (!data.list.incomplete.hasOwnProperty(item)) continue;

                // Get current item
                let currentItem = data.list.incomplete[item];

                // Create the item
                addTodo(currentItem.todo, currentItem.created, item);
            }

            // Loop through complete
            for (let item in data.list.complete) {
                // skip loop if the property is from prototype
                if (!data.list.complete.hasOwnProperty(item)) continue;

                // Get current item
                let currentItem = data.list.complete[item];

                // Create the item
                addTodo(currentItem.todo, currentItem.created, item, currentItem.completed);
            }
        });
    };

    /**
     * Initializes the to-do functionality
     * @private
     */
    const init = () => {
        // Load list
        loadList();

        // Add event listener for enter submit on form
        inputField.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                // If empty, return
                if (inputField.value === '') return;
                addTodo(inputField.value, moment().format('YYYY-MM-DD'), document.getElementsByClassName('todo-item').length+1);
            }
        });

        // Add event listener for click submit on form
        inputSubmit.addEventListener('click', () => {
            // If empty, return
            if (inputField.value === '') return;
            addTodo(inputField.value, moment().format('YYYY-MM-DD'), document.getElementsByClassName('todo-item').length+1);
        });

        // Add event listener for toggling summary
        summaryToggle.addEventListener('click', () => {
            if (summary.classList.contains('active')) {
                summary.classList.remove('active');
            } else {
                summary.classList.add('active');
            }
        });

        // Add event listener to plus button to trigger field select
        plus.addEventListener('click', () => {
            inputField.select();
        });
    };

    // Wait for DOM content to have loaded
    document.addEventListener('DOMContentLoaded', init);
}());
