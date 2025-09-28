import React, { useEffect, useState } from 'react';
import { db } from '../../db';
import api from '../../axios';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { USER_ADD_PATH } from '../../router';


const UserList = () => {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        if (!navigator.onLine) {
            // offline: read from IndexedDB
            const local = await db.users.toArray();
            setUsers(local);
        } else {
            const { data } = await api.get('/superadmin/users');
            const users = data.data.data;
            setUsers(users);
            await db.users.clear();
            await db.users.bulkAdd(users.map(u => ({ ...u, isSynced: true })));
            
        }
    };

    useEffect(() => { loadUsers(); }, []);

  return (
    <div>
        <h1>Users</h1>
        <ChakraLink as={ReactRouterLink} to={USER_ADD_PATH}>
        Add User
        </ChakraLink>
        <ul>
            {users?.map(u => (
            <li key={u.id}>{u.name} – {u.email}</li>
            ))}
        </ul>
    </div>
  )
}

export default UserList