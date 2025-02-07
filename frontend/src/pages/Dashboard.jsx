import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setUser({ name: 'John Doe' }); // Placeholder until we fetch from API
    }
  }, [navigate]);

  return user ? <h2>Welcome, {user.name}!</h2> : <p>Loading...</p>;
};

export default Dashboard;
