import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "../../src/store";

import { renderHook, act, waitFor } from "@testing-library/react";

import { useAuthStore } from "../../src/hooks/useAuthStore";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";

describe('pruebas en useAuthStore', () => { 

    beforeEach(() => {
        localStorage.clear();
    });

    const getMockStore = (initialState) => {
        return configureStore({
            reducer: {
                auth: authSlice.reducer,
            },
            preloadedState: {
                auth: { ...initialState }
            },
        });
    };

    test('Debe de regresar los valores por defecto de authstore',
    () => {
        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );

        expect(result.current).toEqual({
            ...initialState,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });
    });

    test('StartLogin debe realizar el login correctamente', async () => {

        const mockStore = getMockStore({...notAuthenticatedState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );

        await act(async () => {
            await result.current.startLogin(testUserCredentials);
        })

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: null,
            status: 'authenticated',
            user:  { name: 'Fernando', uid: '63d84d4421c0b3dfceec1557' }
        });

        expect(localStorage.getItem('token'))
            .toEqual(expect.any(String));

        expect(localStorage.getItem('token-init-date'))
            .toEqual(expect.any(String));
    });


    test('Startlogin debe de fallar la autenticacion', async () => { 

        const mockStore = getMockStore({...notAuthenticatedState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );

        await act(async () => {
            await result.current.startLogin(
                {email: 'algo@gmail.com', password: '123124312'},    
            );
        });

        const {errorMessage, status, user} = result.current;


        expect(localStorage.getItem('token')).toBe(null);
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Credenciales incorrectas",
            status: "not-authenticated",
            user: {},
        });

        waitFor(() => expect(result.current.errorMessage).toBe(null));
    });

    test('startRegister debe crear un nuevo usuario', async () => {

        const newUser = {
            email: 'algo@google.com', 
            password: '123456789',
            name: 'Test User 2',
        }

        const mockStore = getMockStore({...notAuthenticatedState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                name: "test user",
                uid: "abc123",
                token: "algun-token",
            }
        })
            
        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: null,
            status: 'authenticated',
            user: { name: 'test user', uid: 'abc123' }
        });

        spy.mockRestore();
    });

    test('StartRegister debe fallar la creacion', async () => {
        const mockStore = getMockStore({...notAuthenticatedState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );
            
        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual( {
            errorMessage: "Un usuario existe con ese correo",
            status: "not-authenticated",
            user: {},
        });
    });

    test('checkAuthToken debe fallar si no hay un token', async () => {
        const mockStore = getMockStore({...initialState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );
            
        await act(async () => {
            await result.current.checkAuthToken();
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {},
        });
    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...initialState});

        const { result } = renderHook(
            () => useAuthStore(),
            {
                wrapper: ({children}) => 
                    <Provider store={mockStore}>{ children }</Provider>
            },
        );
            
        await act(async () => {
            await result.current.checkAuthToken();
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: null,
            status: 'authenticated',
            user: { name: "Fernando", uid: '63d84d4421c0b3dfceec1557' },
        });

    });

});