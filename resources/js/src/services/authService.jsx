import api from "../axios";
import Swal from 'sweetalert2';
import { LOGIN } from "../router";

export const loginUser = async (email, password) => {
  const response = await api.post(`/login`, {
    email,
    password,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(`/forgot-password`, {
    email
  });
  return response.data;
};

export const resettPassword = async (email, password, token) => {
  const response = await api.post(`/reset-password`, {
    email, password, token
  });
  return response.data;
};

export const logoutUser = async (navigate) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('role');
        navigate(LOGIN);
      }
    });
};