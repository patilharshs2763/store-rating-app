import { ArrowDownUp, Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../../APIs';
import { Spinner } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';

const DashboardStoreOwner = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState({ data: [], loading: true });
    const [storeDetails, setStoreDetails] = useState({ name: '', address: '', avgRating: 'NA', loading: true });
    const [sortDir, setSortDir] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
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
        try {
            const response = await getUsers(payload);
            console.log('response?.data?.data: ', response?.data?.data);
            const required_data = response?.data?.data?.map((item) => ({
                name: item?.name,
                address: item?.address,
                rating: item?.ratings_details?.[0]?.rating
            }));
            const totalPages = Math.ceil(response?.data?.total / 10)
            setTotal(totalPages);

            const store = response?.data?.store_details;
            const avgRating = store?.rating_details?.length > 0
                ? store.rating_details.reduce((acc, r) => acc + r.rating, 0) / store.rating_details.length
                : 0;
            setStoreDetails({
                name: store?.name,
                address: store?.address,
                avgRating,
                loading: false
            });
            setData({ data: required_data, loading: false })
        } catch (error) {
            console.log('error: ', error);
            setStoreDetails({
                name: '',
                address: '',
                avgRating: '0',
                loading: false
            });
            setData({ data: [], loading: false })
            setTotal(0);
        }
    }
    const handleSort = (field) => {
        const direction =
            sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC';

        setSortField(field);
        setSortDir(direction);
    };
    return (
        <div className='container mt-2'>
            <div className='store-owner-details border mb-2 p-2 store_details_card'>
                {storeDetails.loading ? (
                    <div className='d-flex justify-content-center'>
                        <Spinner />
                    </div>

                ) : storeDetails?.name ? (
                    <>
                        <div><strong>Store Name:</strong> {storeDetails.name}</div>
                        <div><strong>Address:</strong> {storeDetails.address}</div>
                        <div><strong>Average Rating:</strong> {Math.round(storeDetails.avgRating)}</div>
                    </>
                ) : (
                    <p>Store Not Found</p>
                )}
            </div>

            <div className='d-flex flex-column flex-md-row  justify-content-between'>
                <h4>List of Users</h4>
                <input
                    type="text"
                    className='form-control mb-3'
                    placeholder='Search name or address'
                    style={{ maxWidth: '400px' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='table-responsive '>
                <table className="table table-bordered ">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">Sr.No</th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("name")}>
                                    Name <ArrowDownUp size={18} />
                                </div>                            </th>
                            <th scope="col">
                                <div style={{ cursor: 'pointer' }} onClick={() => handleSort("address")}>
                                    Address <ArrowDownUp size={18} />
                                </div>                            </th>
                            <th scope="col"> Rating </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.loading ?
                            <tr className='text-center'>
                                <td colSpan={10}>
                                    <Spinner />
                                </td>
                            </tr>

                            :
                            data?.data?.length === 0 ?
                                <tr>
                                    <td colSpan={10} className='text-center fw-bold text-danger'>No data found</td>
                                </tr>
                                :
                                data?.data?.map((item, ind) =>
                                    <tr key={ind}>
                                        <td className='text-center' >{(currentPage - 1) * 10 + ind + 1}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.address}</td>
                                        <td className='text-center'>

                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    color={i <= Math.round(item?.rating) ? '#ffd700' : '#ddd'}
                                                    fill={i <= Math.round(item?.rating) ? '#ffd700' : '#ddd'}
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
                        disabled={currentPage === 1 || data?.data?.length === 0}
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
                        disabled={currentPage === total || data?.data?.length === 0}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, total))}
                    />
                </Pagination>
            </div>
        </div>
    )
}

export default DashboardStoreOwner