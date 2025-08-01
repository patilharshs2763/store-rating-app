import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../APIs';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import { Spinner } from 'react-bootstrap';

export default function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();
    const loginSchema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
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
        resolver: yupResolver(loginSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLogging, setIsLogging] = useState(false);


    useEffect(() => {
        console.log("Validation errors:", errors);
    }, [errors]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard')
        }
    }, [])


    const onSubmit = async (data) => {
        setIsLogging(true);
        try {
            const result = await loginUser(data);
            const token = result?.data?.token;
            const decoded = jwtDecode(token)
            localStorage.setItem('token', token);
            login(decoded)
            // localStorage.setItem('loggedInUser', JSON.stringify(decoded));
            navigate('/dashboard')
            console.log('decoded: ', decoded);
            console.log('result: ', result);
            toast.success(result?.data?.message || "Login Successfully", {
                autoClose: 2000,
                position: 'top-right'
            })
            setIsLogging(false);
        } catch (error) {
            console.log('error: ', error);
            toast.error(error?.response?.data?.message || "Failed to login", {
                autoClose: 2000,
                position: 'top-right'
            })
            setIsLogging(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="d-flex card p-0 card-border w-100 flex-column card_style" style={{ maxWidth: '500px' }}>
                <div className=' p-0 mt-2'>
                    <h2 className='text-center'>Login</h2>
                </div>
                <div className=' p-4'>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-1">
                            <label className="form-label">Email</label><span className='text-danger'>*</span>
                            <input
                                type="email"
                                {...register('email')}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}

                            />
                            <div className="invalid-feedback">
                                {errors.email?.message}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label><span className='text-danger'>*</span>
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
                            <div className="invalid-feedback d-block">
                                {errors.password?.message}
                                {console.log('errors: ', errors.password?.message)}
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center'>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLogging}>
                                Login
                                {isLogging && <Spinner size='sm' className='mx-2' />}
                            </button>
                            <p className="text-center mb-4 font-size-medium second-primary-color ">
                                <span className='font-size-small fst-italic'>OR</span><br />
                                Do not have an account yet? <Link to="/signup">Create account</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
