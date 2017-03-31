var todoApp = (function() {

	var references = {
		addTaskButton: document.getElementById('add-task-btn'),

		taskList: document.getElementById('task-list'),
		completedList: document.getElementById('completed-list'),
		completedListContainer: document.getElementById('completed-list-container'),
		activeList: document.getElementById('active-list'),

		totalTasks: document.getElementsByClassName('filled-in').length,
		getTask: document.getElementById('add-task-field'),
		getCheckBoxes: document.getElementsByClassName('filled-in'),

		tabTask: document.getElementById('tab-1'),
		tabComplete: document.getElementById('tab-2'),
		tabAll: document.getElementById('tab-3'),

		insertAfter: function (referenceNode, newNode) {
		    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		},

		currentTab: 'active'
	}


	var collection = {
		completed: []
	}

	var init = function() {

		var events = {
			addTaskButton: references.addTaskButton.addEventListener('click', actions.addNewTask),
			clickTabTask: references.tabTask.addEventListener('click', function() {
				references.currentTab = 'active';
				actions.switchTab();
			}),
			clickTabComplete: references.tabComplete.addEventListener('click', function() {
				references.currentTab = 'completed';
				actions.switchTab();
			}),
			clickTabAll: references.tabAll.addEventListener('click', function(){
				references.currentTab = 'all';
				actions.switchTab();
			})
		}
		
		$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrainWidth: false, // Does not change width of dropdown to that of the activator
			hover: true, // Activate on hover
			gutter: 0, // Spacing from edge
			belowOrigin: false, // Displays dropdown below the button
			alignment: 'left', // Displays dropdown with edge aligned to the left of button
			stopPropagation: false // Stops event propagation
		}
  );

	}

	var actions = {
		addNewTask: function() {
			// If task field is completed
			if (references.getTask.value) {
				// Update number of tasks
				references.totalTasks++;
				// Create list element to append to activeList
				var li = document.createElement('li');
				// Create p element
				var p = document.createElement('p');
					p.id = 'p' + references.totalTasks;
					p.className = 'tasks'
				// Create input with all attributes
				var newInput = document.createElement('input');
					// Set type
					var setType = document.createAttribute('type');
					setType.value = 'checkbox';
					newInput.setAttributeNode(setType);
					// Set class
					newInput.className = 'filled-in';
					// Set id
					newInput.id = 'box' + references.totalTasks;
// When user clicks on checkbox
					newInput.addEventListener('click', function() {
						actions.completeTask(this);
					})
				// Create label
				var newLabel = document.createElement('label');	
					// Set for attribute
					newLabel.htmlFor = 'box' + references.totalTasks;
					// Set id; may not be needed, leave for now

					var labelText = document.createTextNode(references.getTask.value);
					newLabel.appendChild(labelText);
				var icon = document.createElement('i');
					icon.className = 'task-menu material-icons right dropdown-button';					
					icon.setAttribute('data-activates','dropdown'+references.totalTasks);

					var iconType = document.createTextNode('view_list');
					icon.appendChild(iconType);
				// Attach element to HTML
				p.appendChild(newInput);
				p.appendChild(newLabel);
				p.appendChild(icon);

				p.appendChild(actions.createDropdown(this));

				li.append(p);
				li.className = 'active-task';
				references.taskList.appendChild(li);
				// Clear task field
				references.getTask.value = '';

				$('.task-menu').dropdown();
			}
		},
		// Changed to handleTask after 
		completeTask: function(e) {
			var li = e.parentNode.parentNode;
			if (li.className == 'active-task') {
				li.className = 'completed';
			} else if (li.className == 'completed') {
				li.className = 'active-task';
			}
			//this.fade(li, this.renderTask(li));
			this.renderTask(li);

			// Reference to completed task text
			let completedTask = e.parentNode.firstChild.nextSibling.innerHTML;
			
			this.handleCompleteTask(completedTask);
			var element = $('#'+e.parentNode.id)[0];
			console.log(collection.completed);
		},
		switchTab: function() {
			var taskNodeList = references.taskList.childNodes;
				var taskListArray = Array.prototype.slice.call(taskNodeList);
				taskListArray.forEach(function(val) {
				actions.renderTask(val);
			})
		},
		fade: function(element) {
		    var op = 1;  // initial opacity
		    var timer = setInterval(function () {
		        if (op <= 0.1){
		            clearInterval(timer);
		        }
		        element.style.opacity = op;
		        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		    
		        op -= op * 0.1;
		    }, 10);
		},
		unfade: function(element) {
			element.style.display = 'block';
		    var op = 0.1;  // initial opacity
		    var timer = setInterval(function () {
		        if (op >= 1){
		            clearInterval(timer);
		        }
		        element.style.opacity = op;
		        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		        op += op * 0.1;
		    }, 10);
		},
		renderTask: function(li) { // Pass in li element
			// Filters task and displays based tab
			if (references.currentTab == 'active') {
				if (li.className == 'active-task') {
					li.style.display = 'block';
					//this.unfade(li);
				}
				else if (li.className == 'completed') {
					li.style.display = 'none';
					//this.fade(li);
				}
			}
			else if (references.currentTab == 'completed') {
				if (li.className == 'active-task') {
					li.style.display = 'none';
					//this.fade(li);
				}
				else if (li.className == 'completed') {
					li.style.display = 'block';
					//li.style.opacity = 1;
					//this.unfade(li);
				}
			}
			else if (references.currentTab == 'all') {
				li.style.display = 'block';
				//li.style.opacity = 1;
				//this.unfade(li);
			}
		},

		deleteTask: function(e) { // Only from trash menu icon
			var id = this.parentNode.parentNode.id;
			$('#' + id).fadeOut();
		},
		handleCompleteTask: function(task) {
			collection.completed.push(task)
		},
		editExistingTask: function() {
			//alert('testing');
			console.log(this);
			var taskContainer = this.parentNode.parentNode;
			var label = taskContainer.firstChild.nextSibling;
			var text = taskContainer.firstChild.nextSibling.textContent;
			var input = taskContainer.firstChild.nextSibling;
			taskContainer.firstChild.nextSibling.textContent = "";
			// Insert edit field
			var editFieldExists = document.getElementsByClassName('textarea' + references.totalTasks);

			console.log(editFieldExists)
			if (editFieldExists.length  === 0) {
				references.insertAfter(label, actions.createInput(text));
			}

			var textfield = taskContainer.firstChild.nextSibling.nextSibling;
			console.log(textfield);


			textfield.addEventListener('blur', function(e) {
				// Text field occupied
				if (textfield.value) {
					label.textContent = textfield.value;
					taskContainer.removeChild(textfield);
				}
				// Text field empty
				else if (textfield.value === '') {
					label.textContent = text;
					taskContainer.removeChild(textfield);
				}
				e.preventDefault();
			});
			document.addEventListener('click', function(e) {
				//var isClickedInside = textfield.parentNode.contains(event.target);
				if (!isClickedInside) {
					if (textfield.value) {
						label.textContent = textfield.value;
						taskContainer.removeChild(textfield);
					}
					// Text field empty
					else if (textfield.value === '') {
						label.textContent = text;
						taskContainer.removeChild(textfield);
					}
					e.preventDefault();
				}				
			})
			
		},
		createInput: function(text, id) {
			var textArea = document.createElement('input');
			textArea.setAttribute('type', 'text');
			textArea.setAttribute('placeholder', text);
			textArea.setAttribute('maxlength', '20');
			textArea.id = 'textarea';
			textArea.className = 'textarea' + references.totalTasks;
			return textArea;
		},
		createDropdown: function(e) {
			var ul = document.createElement('ul');
				ul.id = 'dropdown' + references.totalTasks;
				ul.className = 'dropdown-content';
				var liEdit = document.createElement('li');
					liEdit.className = 'edit-btn list edit';
					console.log(this)
					liEdit.addEventListener('click', actions.editExistingTask);
					ul.appendChild(liEdit);
					var aEdit = document.createElement('a');
						aEdit.setAttribute('href','#');
						liEdit.appendChild(aEdit);
						var iconEdit = document.createElement('i');
						iconEdit.className = 'material-icons';
						aEdit.appendChild(iconEdit);
						var iconEditText = document.createTextNode('mode_edit');
						iconEdit.appendChild(iconEditText);
				var liDivider = document.createElement('li');
					liDivider.className = 'divider';
					ul.appendChild(liDivider);
				var liDelete = document.createElement('li');
					liDelete.className = 'delete-btn list edit';
					liDelete.addEventListener('click', actions.deleteTask);

					console.log(this);

					ul.appendChild(liDelete);
					var aDelete = document.createElement('a');
						aDelete.setAttribute('href','#');
						liDelete.appendChild(aDelete);
						var iconDelete = document.createElement('i');
							iconDelete.className = 'delete-btn material-icons';
							aDelete.appendChild(iconDelete);
							var iconDeleteText = document.createTextNode('delete');
							iconDelete.appendChild(iconDeleteText);
							console.log(references.totalTasks)
			return ul;
		}
	}

	return {
		init:init
	}

})();



$(document).ready(function() {	
	todoApp.init();
});		

// Features to implement
// Sort list when user is on tab ALL --> https://www.w3schools.com/howto/howto_js_sort_list.asp
// When user clicks ALL
// Export nodelist into array
// Sort array of li elements by class (active > completed)
// delete all elements currently existing in array
// Loop entire sorted array and append to form element



// Future features
// Today/Tomorrow/This Week/Some Day
// Implement calendar to sort to do list into separate days
// Priority coloring