import {
    calendarSlice,
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onLogoutCalendar,
    onSetActiveEvent,
    onUpdateEvent,
} from "../../../src/store/calendar/calendarSlice";

import {
    calendarWithEventsState,
    calendarWithActiveEventsState,
    events,
    initialState,
} from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice', () => { 

    test('Debe de retornar el estado inicial', () => {
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );
    });

    test('onSetActiveEvent debe de activar el evento', () => { 
        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onSetActiveEvent(events[0]),
        );

        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent debe de agregar un nuevo evento', () => { 
        const newEvent = {
            id: '3',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'cumpleaños!!',
            notes: 'Alguna nota'
        };

        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onAddNewEvent(newEvent),
        );

        expect( state.events ).toEqual( [...events, newEvent] );
    });

    test('onUpdateNewEvent debe de actualizar el evento', () => { 
        const updatedEvent = {
            id: '1',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'cumpleaños actualizado!!',
            notes: 'Alguna nota actualizada'
        };

        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onUpdateEvent( updatedEvent ),
        );

        expect( state.events ).toContain( updatedEvent );
    });

    test('OnDeleteEvent debe de borrar el evento activo', () => {
        const state = calendarSlice.reducer(
            calendarWithActiveEventsState, 
            onDeleteEvent(),            
        );

        expect( state.events ).not.toContain( events[0] );
        expect( state.activeEvent ).toBe(null);

    });

    test('OnLoadEvents debe establecer los eventos', () => {
        const state = calendarSlice.reducer(
            initialState,
            onLoadEvents(events), 
        );

        expect( state.events ).toEqual( events );
    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        const {
            isLoadingEvents,
            events,
            activeEvent
        } = calendarSlice.reducer (
            calendarWithActiveEventsState, 
            onLogoutCalendar(),            
        );

        expect(isLoadingEvents).toBe( true );
        expect(events).toEqual([]);
        expect(activeEvent).toBe(null);
    });

});