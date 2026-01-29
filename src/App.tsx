import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Define TypeScript interfaces
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';
type Theme = 'light' | 'dark';

// Styled Components
const Container = styled.div<{ theme: Theme }>`
  min-height: 100vh;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 39%, 85%)' : 'hsl(235, 19%, 35%)'};
  transition: all 0.3s ease;
  padding: 3rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: ${props => props.theme === 'dark' 
      ? 'linear-gradient(135deg, hsl(235, 24%, 19%), hsl(235, 21%, 11%))' 
      : 'linear-gradient(135deg, hsl(192, 100%, 67%, 0.1), hsl(280, 87%, 65%, 0.1))'};
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 540px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  letter-spacing: 0.8rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    letter-spacing: 0.5rem;
  }
`;

const ThemeToggle = styled.button<{ theme: Theme }>`
  background: black;
  border: none;
  font-size: 1.8rem;
  color: white;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const InputContainer = styled.div<{ theme: Theme }>`
  background-color:black;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const CheckCircle = styled.div<{ completed: boolean; theme: Theme }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme === 'dark' ? 'hsl(237, 14%, 26%)' : 'hsl(233, 11%, 84%)'};
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    border-color:black;
`;

const TodoInput = styled.input<{ theme: Theme }>`
  flex-grow: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 39%, 85%)' : 'hsl(235, 19%, 35%)'};
  font-size: 1.1rem;
  outline: none;
  padding: 0.5rem 0;
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? 'hsl(233, 14%, 35%)' : 'hsl(233, 11%, 84%)'};
  }
`;

const TodoListContainer = styled.div<{ theme: Theme }>`
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  margin-bottom: 1.5rem;
`;

const TodoItem = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'hsl(237, 14%, 26%)' : 'hsl(233, 11%, 84%)'};
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(0, 0, 0, 0.02)'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TodoText = styled.span<{ completed: boolean; theme: Theme }>`
  flex-grow: 1;
  word-break: break-word;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => {
    if (props.completed) {
      return props.theme === 'dark' ? 'hsl(233, 14%, 35%)' : 'hsl(233, 11%, 84%)';
    }
    return props.theme === 'dark' ? 'hsl(234, 39%, 85%)' : 'hsl(235, 19%, 35%)';
  }};
`;

const DeleteButton = styled.button<{ theme: Theme }>`
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)'};
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, color 0.2s;
  
  ${TodoItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: hsl(0, 100%, 65%);
  }
`;

const TodoStats = styled.div<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background-color: black;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)'};
  font-size: 0.9rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  
  @media (max-width: 576px) {
    position: relative;
    padding-bottom: 4rem;
  }
`;

const ItemsLeft = styled.span`
  font-weight: 600;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100%;
    justify-content: center;
    background-color: inherit;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FilterButton = styled.button<{ active: boolean; theme: Theme }>`
  background: none;
  border: none;
  color: ${props => props.active 
    ? 'hsl(220, 98%, 61%)' 
    : props.theme === 'dark' ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)'};
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: color 0.3s;
  
  &:hover {
    color: ${props => props.theme === 'dark' ? 'hsl(236, 33%, 92%)' : 'hsl(235, 19%, 35%)'};
  }
`;

const ClearButton = styled.button<{ theme: Theme }>`
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)'};
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: hsl(0, 100%, 65%);
  }
`;

const Instructions = styled.div<{ theme: Theme }>`
background-color: black;
  margin-top: 3rem;
  text-align: center;
  color: ${props => props.theme === 'dark' ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)'};
  font-size: 0.9rem;
  ;
  
  @media (max-width: 576px) {
    margin-top: 5rem;
  }
`;

const DragInfo = styled.p`
  margin-top: 1rem;
  color: ${props => props.theme === 'dark' ? 'hsl(233, 14%, 35%)' : 'hsl(233, 11%, 84%)'};
  font-size: 0.8rem;
`;

// Check icon component
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
    <path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/>
  </svg>
);

// Main App Component
const TodoApp: React.FC = () => {
  // State management
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Complete online JavaScript course", completed: true },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App challenge", completed: false }
  ]);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [theme, setTheme] = useState<Theme>('light');
  const [newTodoText, setNewTodoText] = useState<string>('');

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('react-todo-todos');
    const savedTheme = localStorage.getItem('react-todo-theme') as Theme;
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('react-todo-todos', JSON.stringify(todos));
  }, [todos]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('react-todo-theme', theme);
  }, [theme]);

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Calculate active todos count
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  // Event handlers
  const handleAddTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false
      };
      
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      setNewTodoText('');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Check if all todos are completed
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <Container theme={theme}>
      <AppContainer>
        <Header>
          <Title>TODO</Title>
          <ThemeToggle theme={theme} onClick={handleToggleTheme}>
            {theme === 'light' ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </ThemeToggle>
        </Header>

        <InputContainer theme={theme}>
          <CheckCircle 
            completed={allCompleted} 
            theme={theme}
            onClick={handleToggleAll}
          >
            {allCompleted && <CheckIcon />}
          </CheckCircle>
          <TodoInput
            theme={theme}
            type="text"
            placeholder="Create a new todo..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={handleAddTodo}
          />
        </InputContainer>

        <TodoListContainer theme={theme}>
          {filteredTodos.length === 0 ? (
            <TodoItem theme={theme}>
              <CheckCircle completed={false} theme={theme} />
              <TodoText completed={false} theme={theme}>
                No todos to display
              </TodoText>
              <DeleteButton theme={theme} style={{ opacity: 0, visibility: 'hidden' }}>
                <i className="fas fa-times"></i>
              </DeleteButton>
            </TodoItem>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                theme={theme}
                onClick={() => handleToggleTodo(todo.id)}
              >
                <CheckCircle completed={todo.completed} theme={theme}>
                  {todo.completed && <CheckIcon />}
                </CheckCircle>
                <TodoText completed={todo.completed} theme={theme}>
                  {todo.text}
                </TodoText>
                <DeleteButton 
                  theme={theme}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                >
                  <i className="fas fa-times"></i>
                </DeleteButton>
              </TodoItem>
            ))
          )}
        </TodoListContainer>

        <TodoStats theme={theme}>
          <ItemsLeft>
            {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
          </ItemsLeft>
          
          <Filters>
            <FilterButton
              active={filter === 'all'}
              theme={theme}
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === 'active'}
              theme={theme}
              onClick={() => setFilter('active')}
            >
              Active
            </FilterButton>
            <FilterButton
              active={filter === 'completed'}
              theme={theme}
              onClick={() => setFilter('completed')}
            >
              Completed
            </FilterButton>
          </Filters>
          
          <ClearButton theme={theme} onClick={handleClearCompleted}>
            Clear Completed
          </ClearButton>
        </TodoStats>

       <Instructions>
  <p>Click on a todo to mark it as complete</p>
  <p>Hover over a todo to see the delete button</p>
  <DragInfo theme={theme}>
    Drag and drop to reorder todos (coming soon)
  </DragInfo>
</Instructions>

      </AppContainer>
    </Container>
  );
};

export default TodoApp;