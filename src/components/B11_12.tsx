import React, { Component } from 'react';
import './B11_12.css';

interface Task {
  id: number;
  name: string;
  isCompleted: boolean;
}

interface State {
  tasks: Task[];
  taskName: string;
  error: string;
  isEditOpen: boolean;
  isConfirmOpen: boolean;
  taskToEdit: Task | null;
  taskToDelete: number | null;
}

export default class TodoListApp extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
      error: '',
      isEditOpen: false,
      isConfirmOpen: false,
      taskToEdit: null,
      taskToDelete: null,
    };
  }

  componentDidMount() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.setState({ tasks: JSON.parse(storedTasks) });
    }
  }

  addTask = () => {
    const { tasks, taskName } = this.state;
    if (!taskName) {
      this.setState({ error: 'Tên công việc không được để trống' });
    } else if (tasks.some(task => task.name === taskName)) {
      this.setState({ error: 'Tên công việc không được trùng lặp' });
    } else {
      const newTask = { id: Date.now(), name: taskName, isCompleted: false };
      const updatedTasks = [...tasks, newTask];
      this.setState({ tasks: updatedTasks, taskName: '', error: '' }, () => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      });
    }
  };

  deleteTask = (taskId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
      const { tasks } = this.state;
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      this.setState({ tasks: updatedTasks, isConfirmOpen: false, taskToDelete: null }, () => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      });
    }
  };

  toggleTaskCompletion = (taskId: number) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    this.setState({ tasks: updatedTasks }, () => {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    });
  };

  openEdit = (task: Task) => {
    this.setState({ isEditOpen: true, taskToEdit: task, taskName: task.name });
  };

  closeEdit = () => {
    this.setState({ isEditOpen: false, taskToEdit: null, taskName: '' });
  };

  confirmEdit = () => {
    const { tasks, taskToEdit, taskName } = this.state;
    if (taskToEdit && taskName && !tasks.some(task => task.name === taskName && task.id !== taskToEdit.id)) {
      const updatedTasks = tasks.map(task => (task.id === taskToEdit.id ? { ...task, name: taskName } : task));
      this.setState({ tasks: updatedTasks, isEditOpen: false, taskToEdit: null, taskName: '' }, () => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      });
    } else {
      this.setState({ error: 'Tên công việc không được để trống hoặc trùng lặp' });
    }
  };
  
  openConfirm = (taskId: number) => {
    this.setState({ isConfirmOpen: true, taskToDelete: taskId });
  };

  closeConfirm = () => {
    this.setState({ isConfirmOpen: false, taskToDelete: null });
  };

  confirmDelete = () => {
    const { tasks, taskToDelete } = this.state;
    if (taskToDelete !== null) {
      const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
      this.setState({ tasks: updatedTasks, isConfirmOpen: false, taskToDelete: null }, () => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      });
    }
  };

  render() {
    const { tasks, taskName, error, isEditOpen } = this.state;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const totalTasks = tasks.length;
    let completionText;
  
    if (completedTasks === totalTasks && totalTasks) {
      completionText = "Hoàn thành công việc";
    } else {
      completionText = `Công việc đã hoàn thành: ${completedTasks}/${totalTasks}`;
    }
  
    return (
      <div className="container">
        <h1>Danh sách công việc</h1>
        <input
          type="text"
          value={taskName}
          onChange={(e) => this.setState({ taskName: e.target.value, error: '' })}
          placeholder="Nhập tên công việc"
        />
        <button onClick={this.addTask}>Thêm</button>
        {error && <p className="error">{error}</p>}
        <ul>
          {tasks.map(task => (
            <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => this.toggleTaskCompletion(task.id)}
              />
              {task.name}
              <button onClick={() => this.openEdit(task)}>Sửa</button>
              <button onClick={() => this.openConfirm(task.id)}>Xóa</button>
            </li>
          ))}
        </ul>
        <p>{completionText}</p>
        {isEditOpen && (
          <div className="overlay">
            <div className="dialog">
              <h2>Cập nhật công việc</h2>
              <p>Tên công việc</p>
              <input
                type="text"
                value={taskName}
                onChange={(e) => this.setState({ taskName: e.target.value })}
              />
              <button onClick={this.confirmEdit}>Cập nhật</button>
              <button onClick={this.closeEdit}>Hủy</button>
            </div>
          </div>
        )}
        {this.state.isConfirmOpen && (
          <div className="overlay">
            <div className="dialog">
              <p>Bạn có chắc chắn muốn xóa công việc này không?</p>
              <button onClick={() => this.confirmDelete()}>Đồng ý</button>
              <button onClick={() => this.closeConfirm()}>Hủy</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
