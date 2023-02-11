import { oncloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice";

describe('Pruebas en uiSlice', () => { 

    test('Debe regresar el estado por defecto', () => { 
        
        expect( uiSlice.getInitialState() )
            .toEqual( {"isDateModalOpen": false} )

    });

    describe('Debe de cambiar el isDateModal correctamente', () => { 
        let state = uiSlice.getInitialState();

        state = uiSlice.reducer( state, onOpenDateModal );
        expect(state.isDateModalOpen).toBeTruthy();
        
        state = uiSlice.reducer( state, oncloseDateModal );
        expect(state.isDateModalOpen).toBeFalsy();
    });

    

});