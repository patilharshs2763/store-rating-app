import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { changePassword } from '../../APIs';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
const changePasswordSchema = yup.object().shape({
    new_password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
        .required('Password is required'),
});
const Profile = () => {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
    });

    const onSubmit = async (data) => {
        const payload = {
            email: loggedInUser?.email,
            new_password: data?.new_password
        }
        setIsUpdating(true);
        try {

            const response = await changePassword(payload);
            console.log('response: ', response);
            toast.success('Password Updated', {
                autoClose: 2000,
                position: 'top-right'
            })
            navigate('/dashboard');
            setIsUpdating(false);
        } catch (error) {
            console.log('error: ', error);
            toast.error("Failed to change password", {
                autoClose: 2000,
                position: 'top-right'
            })
            setIsUpdating(false);

        }

    };

    return (
        <div className='d-flex justify-content-center mt-2'>
            <div className="card mb-3 card_style" style={{ width: '22rem' }}>
                <div className="card-header text-center">
                    My Profile
                </div>
                <div className="card-body">

                    <h5 className="card-title">Name:{loggedInUser?.name}</h5>
                    <p className="card-text">Role:{loggedInUser?.role}</p>
                    <p className="card-text">Address:{loggedInUser?.address}</p>
                    <p className="card-text">Email:{loggedInUser?.email}</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('new_password')}
                                    className={`form-control ${errors?.new_password ? 'is-invalid' : ''}`}
                                />
                                <span
                                    className={`input-group-text bg-transparent ${errors.new_password ? "border-danger" : ""}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                                {errors?.new_password && (
                                    <div className="invalid-feedback">{errors.new_password.message}</div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn edit_button w-100" disabled={isUpdating}>
                            Update Password
                            {isUpdating && <Spinner size='sm' className='mx-2' />}
                        </button>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Profile