import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/admin', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setMessage(response.data.message))
    .catch(() => {
      alert('Access Denied');
      navigate('/dashboard');
    });
  }, [navigate]);

  return <h2>{message || "Loading..."}</h2>;
};

export default AdminDashboard;
