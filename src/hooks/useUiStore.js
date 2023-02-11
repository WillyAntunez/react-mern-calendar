import { useDispatch, useSelector } from "react-redux"
import { oncloseDateModal, onOpenDateModal } from "../store";

export const useUiStore = () => {

    const dispatch = useDispatch();

    const {
       isDateModalOpen 
    } = useSelector(state => state.ui)

    const openDateModal = () => {
        dispatch(onOpenDateModal())
    }

    const closeDateModal = () => {
        dispatch(oncloseDateModal())
    }

    const toggleDateModal = () => {
        (isDateModalOpen)
            ? closeDateModal()
            : openDateModal()
    }

    return {
        // Propiedades
        isDateModalOpen,

        // Métodos
        openDateModal,
        closeDateModal,
        toggleDateModal
    }

}