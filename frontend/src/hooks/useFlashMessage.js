import bus from '../utils/bus'

export default function useFlashMessage() {

    function setFlashMessage(msg, type) {

        // event emit 'flash'
        bus.emit('flash', {
            message: msg,
            type: type,
        })
    }

    return {setFlashMessage}

}