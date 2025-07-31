import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '../../APIs';
import { toast } from 'react-toastify';



export default function Signup() {
    const navigate = useNavigate();
    const signupSchema = yup.object().shape({
        name: yup.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters').required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        address: yup.string().max(400, 'Max 400 characters').required('Address is required'),
        password: yup.string().min(8, 'Min 8 characters')
            .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
            .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
            .required('Password is required'),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard')
        }
    }, [])

    const onSubmit = async (data) => {
        console.log('Login data:', data);
        try {
            const response = await signup(data);
            console.log('response: ', response);
            toast.success(response?.data?.message || "Signup Successfully", {
                autoClose: 2000,
                position: 'top-right'
            })
            navigate('/login');
        } catch (error) {
            console.log('error: ', error);
            toast.error(error?.response?.data?.message || "Failed to signup", {
                autoClose: 2000,
                position: 'top-right'
            })

        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="d-flex card p-0 card-border w-100 flex-column" style={{ maxWidth: '500px' }}>
                <div className=' p-0'>
                    <h2 className='text-center'>Signup</h2>
                </div>
                <div className=' p-4'>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-1">
                            <label className="form-label">Name</label>
                            <input
                                type="name"
                                {...register('name')}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}

                            />
                            <div className="invalid-feedback">
                                {errors.name?.message}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}

                            />
                            <div className="invalid-feedback">
                                {errors.email?.message}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Address</label>
                            <input
                                type="address"
                                {...register('address')}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}

                            />
                            <div className="invalid-feedback">
                                {errors.address?.message}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                />
                                <span
                                    className="input-group-text bg-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                            <div className="invalid-feedback">
                                {errors.password?.message}
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center'>
                            <button type="submit" className="btn btn-primary w-100">Signup</button>
                            <p className="text-center mb-4 font-size-medium second-primary-color ">
                                <span className='font-size-small fst-italic'>OR</span><br />
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
