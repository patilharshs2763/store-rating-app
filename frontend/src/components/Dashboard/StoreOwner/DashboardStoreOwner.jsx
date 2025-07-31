import { ArrowDownUp, Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../../APIs';
import { Spinner } from 'react-bootstrap';

const DashboardStoreOwner = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState({ data: [], loading: true });
    const [storeDetails, setStoreDetails] = useState({ name: '', address: '', avgRating: 'NA', loading: true });
    const [sortDir, setSortDir] = useState(null);
    const [sortField, setSortField] = useState(null);
    useEffect(() => {
        fetch_users();
    }, [searchTerm, sortField, sortDir])
    async function fetch_users() {
        const payload = {
            entriesPerPage: 10,
            currentPage: 1,
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
            setStoreDetails({ data: 'N/A', loading: false });
            setData({ data: [], loading: false })

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
            <div className='store-owner-details border mb-2 p-2'>
                {storeDetails.loading ?
                    <Spinner /> :
                    <>
                        <div><strong>Store Name:</strong> {storeDetails.name} </div>
                        {console.log('storeDetails: ', storeDetails)}
                        <div><strong>Address:</strong> {storeDetails.address}  </div>
                        <div><strong>Avarage Rating:</strong> {Math.round(storeDetails.avgRating)}  </div>
                    </>
                }
            </div>
            <div className='d-flex flex-column flex-md-row  justify-content-between'>
                <h4>List of Users</h4>
                <input
                    type="text"
                    className='form-control mb-3'
                    placeholder='Search User...'
                    style={{ maxWidth: '400px' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='table-responsive'>
                <table className="table  table-bordered">
                    <thead>
                        <tr>
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
                        {data?.data?.length === 0 ?
                            <tr>
                                <td colSpan={10} className='text-center'>No data found</td>
                            </tr> :
                            data?.loading ?
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                :
                                data?.data?.map((item, ind) =>
                                    <tr key={ind}>
                                        <td >{ind + 1}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.address}</td>
                                        <td>
                                            <p className=''>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        color={i <= Math.round(item?.rating) ? '#ffd700' : '#ddd'}
                                                        fill={i <= Math.round(item?.rating) ? '#ffd700' : '#ddd'}
                                                    />
                                                ))}

                                            </p>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashboardStoreOwner