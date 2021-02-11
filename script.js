const Modal = {
    open(){
        //abrir modal
        //adicionar a class active ao modal
        document
            .querySelector(".modal-overlay")
            .classList.add('active')
    },

    close(){
        //fechar Modal
        //tirar a classe active do modal
        document
            .querySelector(".modal-overlay")
            .classList.remove('active')
    }
}