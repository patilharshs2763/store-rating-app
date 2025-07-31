import React from 'react'
import DashboardAdmin from './Admin/DashboardAdmin'
import DashboardStoreOwner from './StoreOwner/DashboardStoreOwner'
import Stores from './NormalUser/Stores'
import Navbar from '../Navbar/Navbar'
import { rolesLables } from '../Common/Common'

export const MainDashboard = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userRole = loggedInUser.role;
    console.log('userRole: ', userRole);

    return (
        <div>
            {/* <Navbar /> */}
            {/* if the logged in user is normal user, show Stores component */}
            {userRole === rolesLables.normalUser &&
                <Stores />
            }
            {/* if the logged in user is store owner, show DashboardStoreOwner component */}
            {userRole === rolesLables.storeOwner &&
                <DashboardStoreOwner />
            }

            {/* if the logged in user is admin, show DashboardAdmin component */}
            {userRole === rolesLables.systemAdmin &&
                <DashboardAdmin />
            }

        </div>
    )
}
