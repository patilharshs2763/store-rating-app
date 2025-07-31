export const getUserRole = () => {
    try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload?.role;
    } catch (error) {
        console.log('error: ', error);
        return null;
    }
}
export const rolesLables = {
    systemAdmin: 'System Administrator',
    storeOwner: 'Store Owner',
    normalUser: 'Normal User',
}
