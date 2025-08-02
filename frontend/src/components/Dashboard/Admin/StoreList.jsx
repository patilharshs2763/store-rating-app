import { ArrowDownUp, Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Pagination from 'react-bootstrap/Pagination';

import * as yup from 'yup';
import { createStore, getStores, getUsers } from '../../../APIs';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
// import storeImage1 from '../../../images/store.png'

const StoreList = () => {

    const storeSchema = yup.object().shape({
        name: yup.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters').required('Store Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        address: yup.string().max(400, 'Max 400 characters').required('Address is required'),
        user_id: yup.string().required('Store Owner is required '),
    })
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(storeSchema),
    });
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeData, setStoreData] = useState({ data: [], loading: true });
    const [userData, setUserData] = useState({ data: [], loading: true });
    const [sortDir, setSortDir] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const handleClose = () => {
        reset()
        setShow(false)
    };
    const handleShow = () => {
        setShow(true);
        // setSelectedStore(store);
    };
    useEffect(() => {
        // fetch_stores();
        fetch_users();
    }, [])
    useEffect(() => {
        fetch_stores();
    }, [searchTerm, sortField, sortDir, currentPage])
    async function fetch_stores() {
        const payload = {
            enteriesPerPage: 10,
            currentPage: currentPage,
            ...(searchTerm && { searchTerm }),
            ...(sortField && sortDir && { [sortField]: sortDir })
        }
        try {
            const response = await getStores(payload);
            console.log('response: ', response);
            const required_data = response?.data?.data.map(store => {
                const ratings = store.rating_details;
                const totalRatings = ratings.length;
                const overallRating = totalRatings > 0
                    ? Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings)
                    : 0;


                return {
                    name: store.name,
                    email: store.email,
                    address: store.address,
                    overallRating: overallRating
                };
            });
            console.log("required_data", required_data);
            const totalPages = Math.ceil(response?.data?.totalStores / 10);
            setTotal(totalPages);
            setStoreData({ data: required_data, loading: false })
        } catch (error) {
            console.log('error: ', error);

        }
    }
    async function fetch_users() {
        setUserData({ ...userData, data: [], loading: true })
        try {
            const response = await getUsers();
            const required_data = response?.data?.data?.filter(item => item.role === 'Store Owner')
            console.log('required_data: ', required_data);
            console.log('response: ', response);
            setUserData({ data: required_data, loading: false })
            console.log('data:response?.data?.data: ', response?.data?.data);

        } catch (error) {
            console.log('error: ', error);
            setUserData({ data: [], loading: false })

        }
    }
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const response = await createStore(data);
            console.log('response: ', response?.data);
            toast.success("Store added successfully", {
                autoClose: 2000,
                position: 'top-right'
            })
            fetch_stores();
            setShow(close);
            reset();
            setIsSaving(false);
        } catch (error) {
            console.log('error: ', error?.response?.data?.message);
            toast.error(error?.response?.data?.message || "Failed to add store", {
                autoClose: 2000,
                position: 'top-right'
            })
            // setShow(close);
            setIsSaving(false);
            // reset();
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
            <h4>List of Stores</h4>
            <div className='d-flex flex-column flex-md-row  justify-content-between mb-3'>
                <button type="button" className="btn edit_button"
                    onClick={() => handleShow()}
                >
                    Add New Store
                </button>
                <input
                    type="text"
                    className='form-control '
                    placeholder='Search Stores or address'
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
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                    Store Name <ArrowDownUp size={18} />
                                </div>
                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort('address')}>
                                    Address <ArrowDownUp size={18} />
                                </div>
                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort('rating')}>
                                    Overall Rating <ArrowDownUp size={18} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {storeData?.loading ? (
                            <tr>
                                <td colSpan="6" className="text-center"><Spinner /></td>
                            </tr>
                        ) :
                            storeData?.data?.length === 0 ?
                                <tr>
                                    <td colSpan="6" className="text-center fw-bold text-danger">No Stores Found</td>
                                </tr> :
                                storeData.data.map((store, ind) =>
                                    <tr key={ind}>
                                        <th scope="row" className='text-center'>{(currentPage - 1) * 10 + ind + 1}</th>
                                        <td>{store.name}</td>
                                        <td>{store.address}</td>
                                        <td className='text-center'>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    color={i <= Math.round(store?.overallRating) ? '#ffd700' : '#ddd'}
                                                    fill={i <= Math.round(store?.overallRating) ? '#ffd700' : '#ddd'}
                                                />
                                            ))}

                                        </td>

                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.Prev
                        disabled={currentPage === 1 || storeData?.data?.length === 0}
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
                        disabled={currentPage === total || storeData?.data?.length === 0}
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
                    <Modal.Title>Add Store</Modal.Title>
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
                                            type="name"
                                            {...register('email')}
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}

                                        />
                                        <div className="invalid-feedback">
                                            {errors.email?.message}
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
                                        <label className="form-label">Select Owner</label><span className='text-danger'>*</span>
                                        <Controller
                                            name="user_id"
                                            control={control}
                                            rules={{ required: 'Store owner is required' }}
                                            render={({ field }) => (
                                                <Typeahead
                                                    id="store-owner-select"
                                                    {...field}
                                                    onChange={(selected) => {
                                                        if (selected.length > 0) {
                                                            console.log('Selected store owner:', selected[0]);
                                                            field.onChange(selected[0].user_id)
                                                        } else {
                                                            field.onChange(null);
                                                            console.log('No store owner selected');
                                                        }
                                                    }
                                                    }
                                                    options={userData?.data}
                                                    placeholder="Choose a store owner..."
                                                    // selected={field.value ? [field.value] : []}
                                                    selected={
                                                        field.value
                                                            ? userData?.data?.filter(option => option.user_id === field.value)
                                                            : []
                                                    }
                                                    labelKey="name"
                                                    isInvalid={!!errors.user_id}
                                                />
                                            )}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.user_id?.message}
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

export default StoreList