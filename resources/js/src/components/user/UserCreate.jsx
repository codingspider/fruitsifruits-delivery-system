import React, { useState } from 'react';
import { db } from '../../db';
import api from '../../axios';

const UserCreate = () => {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    const saveUser = async (e) => {
        e.preventDefault();
        const payload = { name, email, role, password };

        if (!navigator.onLine) {
            // save locally and queue API call
            await db.queue.add({
                url: '/superadmin/user/store',
                method: 'POST',
                payload
            });
            alert('User saved offline. Will sync when online.');
        } else {
        await api.post('/users', payload);
            alert('User saved online.');
        }

        setName(''); setEmail('');
    };
  
  return (
    <div>
        <form onSubmit={saveUser}>
            <h1>Create User</h1>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="role" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
            <button type="submit">Save</button>
        </form>
    </div>
  )
}

export default UserCreate