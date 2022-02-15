import useTodos from "../hooks/useTodos";

function TodoPage() {
  const todos = useTodos();

  return (
    <>
      <h1>
        Todo Page
      </h1>

      {todos.isLoading && <span>Loading...</span>}
      {!todos.isLoading &&
        <ul>
          {todos.data?.map(todo =>
            <li key={todo.id}>{todo.message}</li>
          )}
        </ul>
      }
    </>
  );
}

export default TodoPage;
