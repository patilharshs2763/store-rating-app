import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { rolesLables } from '../Common/Common';
import { AuthContext } from '../Authentication/AuthContext';

const Navbar = () => {
    const { logout } = useContext(AuthContext)
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userRole = loggedInUser.role;
    const navigate = useNavigate();
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <Link to="/dashboard" className="navbar-brand ">SR</Link>
                    {/* <a className="navbar-brand" href="#">Navbar w/ text</a> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link " to='/dashboard'>Dashboard</Link>
                            </li>
                            {userRole === rolesLables.systemAdmin &&
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link " to='/users'>Users</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link " to='/stores'>Stores</Link>
                                    </li>

                                </>
                            }
                        </ul>
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="/#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    User
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <Link to="/profile" className="dropdown-item">Change Password</Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="dropdown-item" onClick={() => { localStorage.removeItem('token'); logout(); navigate('/login') }}>Logout</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div >
            </nav >
        </div >
    )
}

export default Navbar