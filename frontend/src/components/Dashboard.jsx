import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from './Loader';
import TaskForm from './TaskForm';

function Dashboard({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks${statusFilter ? `?status=${statusFilter}` : ''}`);
      setTasks(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleTaskSaved = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // ✅ update auth state in App
    toast.info('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Filters & Add */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
  {/* Filter Buttons */}
  <div className="flex flex-wrap gap-2">
    {['', 'Pending', 'In Progress', 'Completed'].map((status) => (
      <button
        key={status || 'all'}
        onClick={() => setStatusFilter(status)}
        className={`px-4 py-2 rounded-md text-sm sm:text-base ${
          statusFilter === status
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
        } transition`}
      >
        {status || 'All'}
      </button>
    ))}
  </div>

  {/* Add Task Button */}
  <button
    onClick={() => {
      setEditingTask(null);
      setShowForm(true);
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto text-sm sm:text-base"
  >
    Add Task
  </button>
</div>


        {/* Task Form */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onCancel={() => setShowForm(false)}
            onTaskSaved={handleTaskSaved}
          />
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                <p className="text-gray-400 mt-1">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Status: <span className="font-medium">{task.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
