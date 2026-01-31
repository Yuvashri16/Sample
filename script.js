// Simple Todo app using localStorage
// Key used in localStorage
const STORAGE_KEY = 'todos:v1'

// DOM references
const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const remainingSpan = document.getElementById('remaining')
const clearBtn = document.getElementById('clear-completed')
const filters = {
  all: document.getElementById('filter-all'),
  active: document.getElementById('filter-active'),
  completed: document.getElementById('filter-completed')
}

let todos = [] // { id, text, completed, createdAt }
let filter = 'all'

function saveTodos(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function loadTodos(){
  const raw = localStorage.getItem(STORAGE_KEY)
  try{
    todos = raw ? JSON.parse(raw) : []
  }catch(e){
    todos = []
  }
}

function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function addTodo(text){
  if(!text || !text.trim()) return
  todos.unshift({
    id: uid(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  })
  saveTodos()
  render()
}

function toggleTodo(id){
  const t = todos.find(x => x.id === id)
  if(t) t.completed = !t.completed
  saveTodos()
  render()
}

function deleteTodo(id){
  todos = todos.filter(x => x.id !== id)
  saveTodos()
  render()
}

function editTodo(id, newText){
  const t = todos.find(x => x.id === id)
  if(t && newText.trim()) {
    t.text = newText.trim()
    saveTodos()
    render()
  }
}

function clearCompleted(){
  todos = todos.filter(x => !x.completed)
  saveTodos()
  render()
}

function setFilter(f){
  filter = f
  Object.values(filters).forEach(btn => btn.classList.remove('active'))
  if(filters[f]) filters[f].classList.add('active')
  render()
}

function filteredTodos(){
  if(filter === 'active') return todos.filter(t => !t.completed)
  if(filter === 'completed') return todos.filter(t => t.completed)
  return todos
}

function render(){
  // Clear
  list.innerHTML = ''

  const items = filteredTodos()

  if(items.length === 0){
    const empty = document.createElement('li')
    empty.className = 'todo-item'
    empty.textContent = 'No todos yet'
    list.appendChild(empty)
  }else{
    for(const t of items){
      const li = document.createElement('li')
      li.className = 'todo-item' + (t.completed ? ' completed' : '')
      li.dataset.id = t.id

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = !!t.completed
      checkbox.addEventListener('change', () => toggleTodo(t.id))

      const text = document.createElement('div')
      text.className = 'text'
      text.textContent = t.text
      text.title = 'Double click to edit'

      // Edit on double click
      text.addEventListener('dblclick', () => {
        const input = document.createElement('input')
        input.type = 'text'
        input.value = t.text
        input.className = 'edit-input'
        input.style.flex = '1'
        // Replace text node with input
        li.replaceChild(input, text)
        input.focus()
        input.select()

        function commit(){
          if(input.value.trim()) editTodo(t.id, input.value)
          else deleteTodo(t.id)
        }
        input.addEventListener('blur', commit)
        input.addEventListener('keydown', (e) => {
          if(e.key === 'Enter') {
            input.blur()
          } else if(e.key === 'Escape'){
            render()
          }
        })
      })

      const editBtn = document.createElement('button')
      editBtn.title = 'Edit'
      editBtn.innerHTML = '✏️'
      editBtn.addEventListener('click', () => {
        // trigger dblclick flow
        text.dispatchEvent(new MouseEvent('dblclick'))
      })

      const delBtn = document.createElement('button')
      delBtn.title = 'Delete'
      delBtn.innerHTML = '🗑️'
      delBtn.addEventListener('click', () => deleteTodo(t.id))

      li.appendChild(checkbox)
      li.appendChild(text)
      li.appendChild(editBtn)
      li.appendChild(delBtn)

      list.appendChild(li)
    }
  }

  const remaining = todos.filter(x => !x.completed).length
  remainingSpan.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`
}

// INITIALIZATION
form.addEventListener('submit', (e) => {
  e.preventDefault()
  addTodo(input.value)
  input.value = ''
  input.focus()
})

clearBtn.addEventListener('click', () => clearCompleted())

filters.all.addEventListener('click', () => setFilter('all'))
filters.active.addEventListener('click', () => setFilter('active'))
filters.completed.addEventListener('click', () => setFilter('completed'))

// load and show
loadTodos()
render()