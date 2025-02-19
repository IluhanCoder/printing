import React, { useState } from 'react';
import authService, { defaultRegistrationCredentials, RegistrationCredentials } from './auth-service'; 
import { useNavigate } from 'react-router-dom';
import CreateUserForm from '../user/create-user-form';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationCredentials>(defaultRegistrationCredentials);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Відправка запиту на створення користувача
      await authService.register(formData);
      alert("профіль створено. Тепер вам необхідно увійти");
      navigate('/profile'); // Перенаправляємо на сторінку з користувачами
    } catch (err) {
      setError('Помилка створення користувача. Спробуйте ще раз.');
    }
  };

  return <div>
    <CreateUserForm error={error} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}/>
  </div>
};

export default RegistrationPage;