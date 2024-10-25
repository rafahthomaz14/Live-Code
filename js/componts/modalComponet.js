class ModalComponet{
    constructor(){
        this.div = $('.modalComponet');
    }

    modal(mensagem = '', titulo = ''){
        $(this.div).removeClass('d-none');

        $(this.div).html(`
            <div class="modalinterno m-auto w-50 h-50">

                <h3 class="p-2 text-center h-25">${titulo}</h3>
                   
                <div class="d-flex h-50 justify-content-center align-items-center">
                    <h3 class="text-center">${mensagem}</h3>
                </div>
                    
                <div class="modal-footer h-25">
                    <button class="fecharModal btn btn-secondary">Fechar </button>
                </div>
            </div>
        `);
    }
}