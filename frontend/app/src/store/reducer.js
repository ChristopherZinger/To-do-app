


const initialState = {
    headers: {
        'Content-Type': 'application/json',
    },
    apiURL: {
        url: 'http://localhost:4000'
    },
    user: {
        data: {
            email: ''
        },
        auth: {
            isAuth: false,
        }
    }
}



const reducer = (state = initialState, action) => {
    if (action.type === 'LOGIN') {
        return {
            ...state,
            user: {
                data: {
                    ...state.user.data,
                },
                auth: {
                    ...state.user.auth,
                    isAuth: true,
                }
            }
        }
    }

    if (action.type === 'LOGOUT') {
        return {
            ...state,
            user: {
                data: {
                    ...state.user.data,
                },
                auth: {
                    ...state.user.auth,
                    isAuth: false,
                }
            }
        }
    }
    return state
}


export { reducer, initialState };