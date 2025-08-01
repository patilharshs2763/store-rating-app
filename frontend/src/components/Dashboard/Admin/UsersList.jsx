import { ArrowDownUp, Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rolesLables } from '../../Common/Common';
import { Eye, EyeOff } from 'lucide-react';
import * as yup from 'yup';
import { createUser, getUsers } from '../../../APIs';
import { toast } from 'react-toastify';
import Pagination from 'react-bootstrap/Pagination';
import { Spinner } from 'react-bootstrap';

const rolesOptions = [
    { id: 1, role: rolesLables.systemAdmin, value: rolesLables.systemAdmin },
    { id: 2, role: rolesLables.storeOwner, value: rolesLables.storeOwner },
    { id: 3, role: rolesLables.normalUser, value: rolesLables.normalUser },
];

const UsersList = () => {

    const storeSchema = yup.object().shape({
        name: yup.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters').required('Store Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(8, 'Min 8 characters').max(16, 'Max 16 characters')
            .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
            .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
            .required('Password is required'),
        address: yup.string().max(400, 'Max 400 characters').required('Address is required'),
        role: yup.string().required('Role is required '),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(storeSchema),
    });
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userData, setUserData] = useState({ data: [], loading: true });
    const [showPassword, setShowPassword] = useState(false);
    const [sortDir, setSortDir] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true);
    };
    useEffect(() => {
        fetch_users();
    }, [searchTerm, sortField, sortDir, currentPage])
    async function fetch_users() {
        const payload = {
            entriesPerPage: 10,
            currentPage: currentPage,
            ...(searchTerm && { searchTerm }),
            ...(sortField && sortDir && { [sortField]: sortDir })
        }

        setUserData({ ...userData, data: [], loading: true })
        try {
            const response = await getUsers(payload);
            console.log('response: ', response);
            const totalPage = Math.ceil(response?.data?.total / 10);
            setTotal(totalPage);
            setUserData({ data: response?.data?.data, loading: false })
            console.log('data:response?.data?.data: ', response?.data?.data);

        } catch (error) {
            console.log('error: ', error);
            setUserData({ data: [], loading: false })
            setTotal(0);
        }
    }
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const response = await createUser(data);
            console.log('response: ', response?.data);
            toast.success(response?.data?.message || "User added successfully", {
                autoClose: 2000,
                position: 'top-right'
            })
            fetch_users();
            setShow(false);
            reset();
            setIsSaving(false);
        } catch (error) {
            console.log('error: ', error);
            toast.error(error?.response?.data?.error || "Failed to add user", {
                autoClose: 2000,
                position: 'top-right'
            })
            setIsSaving(false);
        }
    };
    const handleSort = (field) => {
        const direction =
            sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC';

        setSortField(field);
        setSortDir(direction);
    };

    return (
        <div className='container mt-2'>
            <h4>List of Users</h4>
            <div className='d-flex flex-column flex-md-row  justify-content-between mb-3'>
                <button type="button" className="btn btn-primary"
                    onClick={() => handleShow()}
                >
                    Add New User
                </button>
                <input
                    type="text"
                    className='form-control '
                    placeholder='Search'
                    style={{ maxWidth: '400px' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

            </div>
            <div className='table-responsive'>
                <table className="table  table-bordered">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">Sr.No</th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("name")}>
                                    Name <ArrowDownUp size={18} />
                                </div>
                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("email")}>
                                    Email <ArrowDownUp size={18} />
                                </div>
                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("address")}>
                                    Address <ArrowDownUp size={18} />
                                </div>
                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("role")}>
                                    Role <ArrowDownUp size={18} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData?.loading ? (
                            <tr>
                                <td colSpan="6" className="text-center"><Spinner /></td>
                            </tr>
                        ) :
                            userData?.data?.length === 0 ?
                                <tr>
                                    <td colSpan="6" className="text-center">No Users Found</td>
                                </tr> :
                                userData?.data?.map((user, ind) =>
                                    <tr key={ind}>
                                        <th scope="row" className='text-center'>{(currentPage - 1) * 10 + ind + 1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />

                    {Array.from({ length: total }, (_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        disabled={currentPage === total}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, total))}
                    />
                </Pagination>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container d-flex justify-content-center align-items-center" >
                        <div className="d-flex card p-0 card-border w-100 flex-column" style={{ maxWidth: '500px' }}>
                            <div className=' p-4'>
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="mb-1">
                                        <label className="form-label">Name</label><span className='text-danger'>*</span>
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
                                    <div className="mb-1">
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
                                        <div className="invalid-feedback">
                                            {errors.password?.message}
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                        <label className="form-label">Address</label><span className='text-danger'>*</span>
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
                                        <label className="form-label">Select Role</label><span className='text-danger'>*</span>
                                        <select
                                            {...register('role')}
                                            className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Select Role</option>
                                            {rolesOptions.map((role) => (
                                                <option key={role.id} value={role.value}>
                                                    {role.role}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.role?.message}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column justify-content-center'>
                                        <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
                                            Save
                                            {isSaving && <Spinner size='sm' className='mx-2' />}
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default UsersList