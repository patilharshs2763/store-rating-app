import client from '../interceptor'

export const loginUser = (payload) => {
    return client.post('/auth', payload);
};
export const changePassword = (payload) => {
    return client.patch('/auth', payload);
};
export const signup = (payload) => {
    return client.post('/register', payload);
};
export const dashboardStats = (payload) => {
    return client.get('/dashboard_stats', { params: payload });
};

export const getUsers = (payload) => {
    return client.get('/user', { params: payload })
}
export const createUser = (payload) => {
    return client.post('/user', payload)
}
export const getStores = (payload) => {
    return client.get('/store', { params: payload })
}
export const createStore = (payload) => {
    return client.post('/store', payload)
}
export const rateStore = (payload) => {
    return client.put('/rating', payload)
}
