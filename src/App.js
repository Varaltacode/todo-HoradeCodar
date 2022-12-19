import { useState, useEffect } from "react";
import "./App.css";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  // load todos
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetch(`${API}/todos`)
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => console.log(err));

      setLoading(false);
      setTodoList(res);
    }
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const todo = {
      id: parseInt(Math.random() * 100),
      title,
      time,
      done: false,
    };
    await fetch(`${API}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodoList((prevState) => [...prevState, todo]);
    setTitle("");
    setTime("");
  }

  async function handleEdit(todo) {
    todo.done = !todo.done;
    const data = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTodoList((prevState) =>
      prevState.map((todo) => (todo.id === data.id ? (todo = data) : todo))
    );
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  async function handleDelete(id) {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
    });
    setTodoList((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado"
              onChange={(event) => setTime(event.target.value)}
              value={time}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todoList.length === 0 && <p>Não há tarefas</p>}
        {todoList.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
