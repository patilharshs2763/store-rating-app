import { ArrowDownUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { dashboardStats } from '../../../APIs';


const DashboardAdmin = () => {
    const [data, setData] = useState({
        data: [], loading: true
    });

    useEffect(() => {
        async function fetch_stats() {

            try {
                const result = await dashboardStats();
                // console.log('result: ', result?.data?.totalStores);
                setData({
                    data: [
                        {
                            totalStores: result?.data?.totalStores,
                            totalUsers: result?.data?.totalUsers,
                            totalRatings: result?.data?.totalRatings,
                        }
                    ],
                    loading: false
                })
            } catch (error) {
                console.log('error: ', error);
                setData({
                    data: [
                        {
                            totalStores: 0,
                            totalUsers: 0,
                            totalRatings: 0,
                        }
                    ],
                    loading: false
                })

            }
        }
        fetch_stats();
    }, [])
    console.log('', setData);

    return (
        <div className='container mt-2'>
            DashboardAdmin
            <div className="row">
                <div className="col-sm-12 col-md-4 mb-3 mb-sm-0">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text">{data?.data[0]?.totalUsers}</p>
                            <Link to='/users' className="btn btn-primary">View Users</Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-4 mb-3 mb-sm-0">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Stores</h5>
                            <p className="card-text">{data?.data[0]?.totalStores}</p>
                            <Link to='/stores' className="btn btn-primary">View Stores</Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-4 mb-3 mb-sm-0">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Ratings</h5>
                            <p className="card-text">{data?.data[0]?.totalStores}</p>
                            {/* <a href="#" className="btn btn-primary">View Stores</a> */}
                            <Link to='/users' className="btn btn-primary">View Ratings</Link>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default DashboardAdmin