import React, { useState, useEffect } from 'react';
import { getUsers } from '../api'; // Adjust path based on your structure
import axios from 'axios';

const Profile = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
                if (usersData.length > 0) {
                    setName(usersData[0].name); // Pre-fill data for the first user
                    setEmail(usersData[0].email);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedData = { name, email };
        try {
            const response = await axios.put(`http://localhost:5000/api/users/1`, updatedData);
            setMessage(`User ${response.data.name} updated successfully!`);
        } catch (error) {
            setMessage('Error updating user');
        }
    };

    return (
        <div>
            <h2>Profile Page</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Update Profile</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Profile;
