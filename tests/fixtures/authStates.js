

export const initialState = {
    status: 'checking', //authenticated, not-authenticated
    user: {},
    errorMessage: null,
}


export const authenticatedState = {
    status: 'authenticated', //authenticated, not-authenticated
    user: {
        uid: 'abc',
        name: 'Fernando',
    },
    errorMessage: null,
}

export const notAuthenticatedState = {
    status: 'not-authenticated', //authenticated, not-authenticated
    user: {},
    errorMessage: null,
}
