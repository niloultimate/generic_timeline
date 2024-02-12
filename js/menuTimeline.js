function carregarMenuEditarEventos() {

    var idTimeline = parseInt(document.getElementById('selectTimeline')?.value);
    document.getElementById('conteudoConfig').innerHTML = '';

    var divConfiguracao = document.createElement("div");
    divConfiguracao.className = 'container-fluid';

    var divRow = document.createElement("div");
    divRow.className = 'row';
    
    var divTitulo = document.createElement("div");
    divTitulo.className = 'alert alert-light';
    divTitulo.role = 'alert';
    divTitulo.innerText = 'Eventos da Timeline';
    divRow.appendChild(divTitulo);
    
    //#region [Field ID]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-12';
        divContainer.ariaLabel = '.form-select-lg';
        
        var divInputGroup = document.createElement("div");
        divInputGroup.className = 'input-group mb-3';

        var selectField = document.createElement("select");
        selectField.id = 'selectTimeline';
        selectField.className = 'form-select form-select-sm';
        selectField.ariaLabel = 'selectTimeline'; 
        selectField.setAttribute('aria-describedby','button-addon2');

        var optionField = document.createElement("option");
        optionField.text = 'Selecione a timeline';
        selectField.appendChild(optionField);

            
        //#region [Carregar timeline to select]
        var transaction = db.transaction(['timeline_instancia'], 'readwrite');
        var objectStore = transaction.objectStore('timeline_instancia');
        var request = objectStore.openCursor();

        request.onerror = function(event) {
            console.error('Erro ao abrir o cursor:', event.target.errorCode);
        };

        request.onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                cursor.value;

                var optionField = document.createElement("option");
                optionField.value = cursor.value.id;
                optionField.text = cursor.value.nome;
                
                if(!isNaN(idTimeline))
                {
                    if(idTimeline == parseInt(cursor.value.id)){
                        optionField.selected = true;
                    }
                }

                selectField.appendChild(optionField);

                // Move para o próximo item
                cursor.continue();
            } else {
                console.log("Fim da lista de itens.");
                carregarTabelaEventos();
            }
        };
        //#endregion
        divInputGroup.appendChild(selectField)

        var buttonCarregar = document.createElement("button");
        buttonCarregar.type = 'button';
        buttonCarregar.className = 'btn btn-outline-dark';
        buttonCarregar.innerText = 'Carregar';
        buttonCarregar.onclick = carregarMenuEditarEventos;
        divInputGroup.appendChild(buttonCarregar);

        divContainer.appendChild(divInputGroup);
        divRow.appendChild(divContainer);
    //#endregion
    divConfiguracao.appendChild(divRow);

    
    var divRow = document.createElement("div");
    divRow.id = 'divConfigTimeline';
    divRow.className = 'row';

    carregarEditorEventos(divRow);

    divConfiguracao.appendChild(divRow);

    document.getElementById('conteudoConfig').appendChild(divConfiguracao);

}

function carregarEditorEventos($item){
    
    if(!$item)
    {
        //Limpar div
        document.getElementById('divConfigTimeline').innerText = '';
    }

    var divContainer = document.createElement("div");
    divContainer.id = 'divEvento';
    divContainer.className = 'col-md-3';
    
    var divField = document.createElement("div");
    divField.className = 'mb-3';
    
    CarregarItemEvento(0, divField)

    divContainer.appendChild(divField);
    
    if($item)
    {
        $item.appendChild(divContainer);
    }else{
        document.getElementById('divConfigTimeline').appendChild(divContainer);
    }
    
    var divContainer = document.createElement("div");
    divContainer.id = 'divTabela';
    divContainer.className = 'col-md-9';
    
    //Carregar tabela de eventos

    var tableEvento = document.createElement("table");
    tableEvento.className = 'table table-striped';

    //#region [Tabela Cabeçalho]
        var theadEvento = document.createElement("thead");
        var trEvento = document.createElement("tr");

        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = 'Edit';
        trEvento.appendChild(thEvento);

        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = '#';
        trEvento.appendChild(thEvento);
        
        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = 'Titulo';
        trEvento.appendChild(thEvento);
        
        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = 'DataHora';
        trEvento.appendChild(thEvento);
        
        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = 'Cor';
        trEvento.appendChild(thEvento);

        var thEvento = document.createElement("th");
        thEvento.scope = 'col';
        thEvento.innerText = 'Descrições';
        trEvento.appendChild(thEvento);
        
        theadEvento.appendChild(trEvento);
        tableEvento.appendChild(theadEvento);
    //#endregion

    var tbodyEvento = document.createElement("tbody");
    tbodyEvento.id = 'tbodyEvento';
    tableEvento.appendChild(tbodyEvento);

    divContainer.appendChild(tableEvento);

    if($item)
    {
        $item.appendChild(divContainer);
    }else{
        document.getElementById('divConfigTimeline').appendChild(divContainer);
    }
}

function carregarTabelaEventos() {
    document.getElementById('tbodyEvento').innerText = '';

    //#region [Criar linhas da tabela eventos timeline]
    var transaction = db.transaction(['eventos_timeline'], 'readwrite');
    var objectStore = transaction.objectStore('eventos_timeline');
    var request = objectStore.openCursor();
    var idTimeline_instancia_id = parseInt(document.getElementById('selectTimeline')?.value);

    if(!isNaN(idTimeline_instancia_id))
    {
        request.onerror = function(event) {
            console.error('Erro ao abrir o cursor:', event.target.errorCode);
        };

        listItens = [];

        request.onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                if(idTimeline_instancia_id == parseInt(cursor.value.timeline_instancia_id)) {
                    listItens.push({
                        id: cursor.value.id,
                        titulo: cursor.value.titulo,
                        datahora: cursor.value.datahora,
                        cor: cursor.value.cor,
                    })
                } 

                // Move para o próximo item
                cursor.continue();
            } else {
                listItens.sort(function(a, b) {
                    return a.datahora - b.datahora;
                });
                for (let i = 0; i < listItens.length; i++) {

                    var trEvento = document.createElement("tr");

                    var tdEvento = document.createElement("td");
                    var buttonColor = document.createElement("button");
                    buttonColor.onclick = CarregarItemEvento.bind(null, listItens[i].id);
                    buttonColor.className = 'btn btn-primary';

                    var iconCor = document.createElement("i");
                    iconCor.className = 'fas fa-edit';

                    buttonColor.appendChild(iconCor);
                    tdEvento.appendChild(buttonColor);
                    trEvento.appendChild(tdEvento);

                    var tdEvento = document.createElement("td");
                    tdEvento.scope = 'row';
                    tdEvento.innerText = listItens[i].id;
                    trEvento.appendChild(tdEvento);

                    var tdEvento = document.createElement("td");
                    tdEvento.innerText = listItens[i].titulo;
                    trEvento.appendChild(tdEvento);

                    var tdEvento = document.createElement("td");
                    tdEvento.innerText = new Date(listItens[i].datahora).toLocaleString();
                    trEvento.appendChild(tdEvento);

                    var tdEvento = document.createElement("td");
                    var buttonColor = document.createElement("button");
                    buttonColor.className = 'btn';
                    buttonColor.style.color = '#fff';
                    buttonColor.style.backgroundColor = listItens[i].cor;

                    var iconCor = document.createElement("i");
                    iconCor.className = 'fa-solid fa-paint-roller';

                    buttonColor.appendChild(iconCor);
                    tdEvento.appendChild(buttonColor);
                    trEvento.appendChild(tdEvento);

                    var tdEvento = document.createElement("td");
                    var buttonDescricoes = document.createElement("button");
                    buttonDescricoes.onclick = CarregarItemDescricaoEvento.bind(null, listItens[i].id);
                    buttonDescricoes.className = 'btn';
                    buttonDescricoes.style.color = '#fff';
                    buttonDescricoes.style.backgroundColor = '#000';

                    var iconCor = document.createElement("i");
                    iconCor.className = 'fa-solid fa-file-lines';

                    buttonDescricoes.appendChild(iconCor);
                    tdEvento.appendChild(buttonDescricoes);
                    trEvento.appendChild(tdEvento);
                    
                    document.getElementById('tbodyEvento').appendChild(trEvento);
                    
                }
            }

        };
    }
    //#endregion
}

function carregarMenuTimeline($id = 0) {
    document.getElementById('conteudoConfig').innerHTML = '';
    document.getElementById('conteudoConfig');

    var divConfiguracao = document.createElement("div");
    divConfiguracao.className = 'container-fluid';

    var divRow = document.createElement("div");
    divRow.id = 'divDados';
    divRow.className = 'row';

    
    var divTitulo = document.createElement("div");
    divTitulo.className = 'alert alert-light';
    divTitulo.role = 'alert';
    divTitulo.innerText = 'Informações da Timeline';
    divRow.appendChild(divTitulo);
    
    //#region [Field ID]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-2';
        
        var divField = document.createElement("div");
        divField.className = 'input-group mb-3';

        var spanField = document.createElement("span");
        spanField.id = 'spanID';
        spanField.className = 'input-group-text';
        spanField.innerText = '#';

        var inputField = document.createElement("input");
        inputField.id = 'inputID';
        inputField.type = 'text';
        inputField.className = 'form-control';
        inputField.placeholder = '000';
        inputField.disabled = 'disabled';
        inputField.ariaLabel = 'id';
        inputField.setAttribute('aria-describedby', 'spanID');

        divField.appendChild(spanField);
        divField.appendChild(inputField);
        divContainer.appendChild(divField);
        divRow.appendChild(divContainer);
    //#endregion

    //#region [Field name]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-10';
        
        var divField = document.createElement("div");
        divField.className = 'input-group mb-3';

        var spanField = document.createElement("span");
        spanField.id = 'spanName';
        spanField.className = 'input-group-text';
        spanField.innerText = 'Nome';

        var inputField = document.createElement("input");
        inputField.id = 'inputName';
        inputField.type = 'text';
        inputField.className = 'form-control';
        inputField.placeholder = 'Nome da timeline';
        inputField.ariaLabel = 'Name';
        inputField.setAttribute('aria-describedby', 'spanNome');

        divField.appendChild(spanField);
        divField.appendChild(inputField);
        divContainer.appendChild(divField);
        divRow.appendChild(divContainer);
    //#endregion
    
    //#region [Field numero_incidente]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-3';
        
        var divField = document.createElement("div");
        divField.className = 'input-group mb-3';

        var spanField = document.createElement("span");
        spanField.id = 'spanNumero_incidente';
        spanField.className = 'input-group-text';
        spanField.innerText = 'Chamado';

        var inputField = document.createElement("input");
        inputField.id = 'inputNumero_incidente';
        inputField.type = 'text';
        inputField.className = 'form-control';
        inputField.placeholder = '#00000000';
        inputField.ariaLabel = 'Numero_incidente';
        inputField.setAttribute('aria-describedby', 'spanNumero_incidente');

        divField.appendChild(spanField);
        divField.appendChild(inputField);
        divContainer.appendChild(divField);
        divRow.appendChild(divContainer);
    //#endregion
    
    //#region [Field data_criação]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-4';
        
        var divField = document.createElement("div");
        divField.className = 'input-group mb-3';

        var spanField = document.createElement("span");
        spanField.id = 'spanDatatime';
        spanField.className = 'input-group-text';
        spanField.innerText = 'Data';

        var inputField = document.createElement("input");
        inputField.id = 'inputDatatime';
        inputField.type = 'datetime-local';
        inputField.className = 'form-control';
        inputField.ariaLabel = 'Datatime';
        inputField.value = (new Date()).toISOString().slice(0, 16);
        inputField.setAttribute('aria-describedby', 'spanDatatime');

        divField.appendChild(spanField);
        divField.appendChild(inputField);
        divContainer.appendChild(divField);
        divRow.appendChild(divContainer);
    //#endregion

    var divContainer = document.createElement("div");
    divContainer.className = 'col-md-5';
    divRow.appendChild(divContainer);
    
    //#region [Buttom Update]
        var divContainer = document.createElement("div");
        divContainer.className = 'col-md-12';
        
        var divButtom = document.createElement("input");
        divButtom.className = 'btn btn-dark';
        divButtom.type = 'submit';
        divButtom.value = 'Update';
        divButtom.onclick = inserirTimeline;

        divContainer.appendChild(divButtom);
        divRow.appendChild(divContainer);
    //#endregion

    divConfiguracao.appendChild(divRow);
    divConfiguracao.appendChild(document.createElement("br"));

    //#region [Tabela Timeline]
    var divRow = document.createElement("div");
    divRow.className = 'row';

    var tableTimeline = document.createElement("table");
    tableTimeline.className = 'table table-striped';

    //#region [Tabela Cabeçalho]
        var theadTimeline = document.createElement("thead");
        var trTimeline = document.createElement("tr");

        var tdTimeline = document.createElement("th");
        tdTimeline.scope = 'col';
        tdTimeline.innerText = '#';
        trTimeline.appendChild(tdTimeline);
        
        var tdTimeline = document.createElement("th");
        tdTimeline.scope = 'col';
        tdTimeline.innerText = 'Nome';
        trTimeline.appendChild(tdTimeline);
        
        var tdTimeline = document.createElement("th");
        tdTimeline.scope = 'col';
        tdTimeline.innerText = 'Chamado';
        trTimeline.appendChild(tdTimeline);
        
        var tdTimeline = document.createElement("th");
        tdTimeline.scope = 'col';
        tdTimeline.innerText = 'DataTime';
        trTimeline.appendChild(tdTimeline);
        
        var tdTimeline = document.createElement("th");
        tdTimeline.scope = 'col';
        tdTimeline.innerText = 'Ação';
        trTimeline.appendChild(tdTimeline);

        theadTimeline.appendChild(trTimeline);
        tableTimeline.appendChild(theadTimeline);
    //#endregion

    var tbodyTimeline = document.createElement("tbody");
    tbodyTimeline.id = 'tbodyTimeline';
    tableTimeline.appendChild(tbodyTimeline);

    divRow.appendChild(tableTimeline);
    divConfiguracao.appendChild(divRow);
    //#endregion

    document.getElementById('conteudoConfig').appendChild(divConfiguracao);

    //#region [Criar linhas da tabela timeline]
    var transaction = db.transaction(['timeline_instancia'], 'readwrite');
    var objectStore = transaction.objectStore('timeline_instancia');
    var request = objectStore.openCursor();

    request.onerror = function(event) {
        console.error('Erro ao abrir o cursor:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var trTimeline = document.createElement("tr");

            var tdTimeline = document.createElement("td");
            tdTimeline.scope = 'row';
            tdTimeline.innerText = cursor.value.id;
            trTimeline.appendChild(tdTimeline);

            var tdTimeline = document.createElement("td");
            tdTimeline.innerText = cursor.value.nome;
            trTimeline.appendChild(tdTimeline);

            var tdTimeline = document.createElement("td");
            tdTimeline.innerText = cursor.value.numero_incidente;
            trTimeline.appendChild(tdTimeline);

            var tdTimeline = document.createElement("td");
            tdTimeline.innerText = new Date(cursor.value.data_criacao).toLocaleString();;
            trTimeline.appendChild(tdTimeline);

            var tdTimeline = document.createElement("td");
            var buttonTimeline = document.createElement("button");
            buttonTimeline.className = 'btn btn-outline-primary';
            buttonTimeline.onclick = editarTimeline.bind(null, cursor.value.id);

            var iconeTimeline = document.createElement("i");
            iconeTimeline.className = 'fas fa-edit';

            buttonTimeline.appendChild(iconeTimeline);
            tdTimeline.appendChild(buttonTimeline);

            var buttonTimeline = document.createElement("button");
            buttonTimeline.className = 'btn btn-outline-danger';
            buttonTimeline.onclick = removeTimeline.bind(null, cursor.value.id);

            var iconeTimeline = document.createElement("i");
            iconeTimeline.className = 'fas fa-trash';

            buttonTimeline.appendChild(iconeTimeline);
            tdTimeline.appendChild(buttonTimeline);
            trTimeline.appendChild(tdTimeline);
            
            document.getElementById('tbodyTimeline').appendChild(trTimeline);
            // Move para o próximo item
            cursor.continue();
        } else {
            console.log("Fim da lista de itens.");
        }
    };
    //#endregion
}


function editarTimeline($id) {

    var transaction = db.transaction(['timeline_instancia'], 'readwrite');
    var objectStore = transaction.objectStore('timeline_instancia');
    var getRequest  = objectStore.get($id);

    getRequest.onerror = function(event) {
        console.error("Erro ao obter informações do item:", event.target.errorCode);
    };

    getRequest.onsuccess = function(event) {
        // Verifica se o item foi encontrado
        if (event.target.result) {
            var item = event.target.result;

            var divRow = document.getElementById('divDados');
            divRow.innerText = '';
            
            var divTitulo = document.createElement("div");
            divTitulo.className = 'alert alert-light';
            divTitulo.role = 'alert';
            divTitulo.innerText = 'Informações da Timeline';
            divRow.appendChild(divTitulo);
            
            //#region [Field ID]
                var divContainer = document.createElement("div");
                divContainer.className = 'col-md-2';
                
                var divField = document.createElement("div");
                divField.className = 'input-group mb-3';

                var spanField = document.createElement("span");
                spanField.id = 'spanID';
                spanField.className = 'input-group-text';
                spanField.innerText = '#';

                var inputField = document.createElement("input");
                inputField.id = 'inputID';
                inputField.type = 'text';
                inputField.className = 'form-control';
                inputField.placeholder = '000';
                inputField.disabled = 'disabled';
                inputField.ariaLabel = 'id';
                inputField.value = item.id;
                inputField.setAttribute('aria-describedby', 'spanID');

                divField.appendChild(spanField);
                divField.appendChild(inputField);
                divContainer.appendChild(divField);
                divRow.appendChild(divContainer);
            //#endregion

            //#region [Field name]
                var divContainer = document.createElement("div");
                divContainer.className = 'col-md-10';
                
                var divField = document.createElement("div");
                divField.className = 'input-group mb-3';

                var spanField = document.createElement("span");
                spanField.id = 'spanName';
                spanField.className = 'input-group-text';
                spanField.innerText = 'Nome';

                var inputField = document.createElement("input");
                inputField.id = 'inputName';
                inputField.type = 'text';
                inputField.className = 'form-control';
                inputField.placeholder = 'Nome da timeline';
                inputField.ariaLabel = 'Name';
                inputField.value = item.nome;
                inputField.setAttribute('aria-describedby', 'spanNome');

                divField.appendChild(spanField);
                divField.appendChild(inputField);
                divContainer.appendChild(divField);
                divRow.appendChild(divContainer);
            //#endregion
            
            //#region [Field numero_incidente]
                var divContainer = document.createElement("div");
                divContainer.className = 'col-md-3';
                
                var divField = document.createElement("div");
                divField.className = 'input-group mb-3';

                var spanField = document.createElement("span");
                spanField.id = 'spanNumero_incidente';
                spanField.className = 'input-group-text';
                spanField.innerText = 'Chamado';

                var inputField = document.createElement("input");
                inputField.id = 'inputNumero_incidente';
                inputField.type = 'text';
                inputField.className = 'form-control';
                inputField.placeholder = '#00000000';
                inputField.ariaLabel = 'Numero_incidente';
                inputField.value = item.numero_incidente;
                inputField.setAttribute('aria-describedby', 'spanNumero_incidente');

                divField.appendChild(spanField);
                divField.appendChild(inputField);
                divContainer.appendChild(divField);
                divRow.appendChild(divContainer);
            //#endregion
            
            //#region [Field data_criação]
                var divContainer = document.createElement("div");
                divContainer.className = 'col-md-4';
                
                var divField = document.createElement("div");
                divField.className = 'input-group mb-3';

                var spanField = document.createElement("span");
                spanField.id = 'spanDatatime';
                spanField.className = 'input-group-text';
                spanField.innerText = 'Data';

                var inputField = document.createElement("input");
                inputField.id = 'inputDatatime';
                inputField.type = 'datetime-local';
                inputField.className = 'form-control';
                inputField.ariaLabel = 'Datatime';
                var auxDateTime = new Date(item.data_criacao);
                inputField.value = new Date(auxDateTime.setHours(auxDateTime.getHours() - 3)).toISOString().slice(0, 16);
                inputField.setAttribute('aria-describedby', 'spanDatatime');

                divField.appendChild(spanField);
                divField.appendChild(inputField);
                divContainer.appendChild(divField);
                divRow.appendChild(divContainer);
            //#endregion

            var divContainer = document.createElement("div");
            divContainer.className = 'col-md-5';
            divRow.appendChild(divContainer);
            
            //#region [Buttom Update]
                var divContainer = document.createElement("div");
                divContainer.className = 'col-md-12';
                
                var divButtom = document.createElement("input");
                divButtom.className = 'btn btn-primary';
                divButtom.type = 'submit';
                divButtom.value = 'Update';
                divButtom.onclick = editTimeline.bind(null, item.id);

                divContainer.appendChild(divButtom);
                divRow.appendChild(divContainer);
            //#endregion
        }
    };
}
function CarregarItemEvento($id = 0, $item = undefined){

    //Limpar
    if($item == undefined || $item == null){
        $item = document.getElementById('divEvento');
        $item.innerHTML = '';
    }

    //Dados do evento
    if($id > 0){
        var dadosEvento = undefined;
        
        //#region [Carregar timeline to select]
        var transaction = db.transaction(['eventos_timeline'], 'readwrite');
        var objectStore = transaction.objectStore('eventos_timeline');
        var request = objectStore.openCursor();

        request.onerror = function(event) {
            console.error('Erro ao abrir o cursor:', event.target.errorCode);
        };

        request.onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                if(!isNaN($id))
                {
                    if($id == parseInt(cursor.value.id)){
                        $item = document.getElementById('divEvento');
                        $item.innerHTML = '';
      
                        //Hidden idTimeline
                        var inputFieldInput = document.createElement("input");
                        inputFieldInput.id = 'hidIdTimeline';
                        inputFieldInput.type = 'hidden';
                        inputFieldInput.disabled = 'disabled';
                        inputFieldInput.value = cursor.value.id;
                        $item.appendChild(inputFieldInput);

                        //ID
                        var labelFieldLabel = document.createElement("label");
                        labelFieldLabel.for = 'inputID';
                        labelFieldLabel.className = 'form-label';
                        labelFieldLabel.innerText = 'Numero de controle';
                        $item.appendChild(labelFieldLabel);
                        
                        var inputFieldInput = document.createElement("input");
                        inputFieldInput.id = 'inputID';
                        inputFieldInput.className = 'form-control';
                        inputFieldInput.type = 'text';
                        inputFieldInput.disabled = 'disabled';
                        inputFieldInput.placeholder = '###';
                        inputFieldInput.value = cursor.value.id;
                        $item.appendChild(inputFieldInput);

                        //Titulo
                        var labelFieldLabel = document.createElement("label");
                        labelFieldLabel.for = 'inputTitulo';
                        labelFieldLabel.className = 'form-label';
                        labelFieldLabel.innerText = 'Titulo';
                        $item.appendChild(labelFieldLabel);
                        
                        var inputFieldInput = document.createElement("input");
                        inputFieldInput.id = 'inputTitulo';
                        inputFieldInput.className = 'form-control';
                        inputFieldInput.type = 'text';
                        inputFieldInput.value = cursor.value.titulo;
                        $item.appendChild(inputFieldInput);

                        //Data hora
                        var labelFieldLabel = document.createElement("label");
                        labelFieldLabel.for = 'inputDatahora';
                        labelFieldLabel.className = 'form-label';
                        labelFieldLabel.innerText = 'Data Hora';
                        $item.appendChild(labelFieldLabel);
                        
                        var inputFieldInput = document.createElement("input");
                        inputFieldInput.id = 'inputDatahora';
                        inputFieldInput.className = 'form-control';
                        inputFieldInput.type = 'datetime-local';
                                
                        var auxDateTime = new Date(cursor.value.datahora);
                        inputFieldInput.value = new Date(auxDateTime.setHours(auxDateTime.getHours() - 3)).toISOString().slice(0, 16);
                        $item.appendChild(inputFieldInput);

                        //Cor
                        var labelFieldLabel = document.createElement("label");
                        labelFieldLabel.for = 'inputColor';
                        labelFieldLabel.className = 'form-label';
                        labelFieldLabel.innerText = 'Cor do titulo';
                        $item.appendChild(labelFieldLabel);
                        
                        var inputFieldInput = document.createElement("input");
                        inputFieldInput.id = 'inputColor';
                        inputFieldInput.className = 'form-control';
                        inputFieldInput.type = 'color';
                        inputFieldInput.value = cursor.value.cor;

                        $item.appendChild(inputFieldInput);

                        var newLine = document.createElement("br");
                        $item.appendChild(newLine);

                        var buttonCarregar = document.createElement("button");
                        buttonCarregar.type = 'button';
                        buttonCarregar.className = 'btn btn-outline-primary';
                        buttonCarregar.innerText = 'Update';
                        buttonCarregar.onclick = editEvento;
                        $item.appendChild(buttonCarregar);

                        var buttonExcluir = document.createElement("button");
                        buttonExcluir.type = 'button';
                        buttonExcluir.className = 'btn btn-outline-danger';
                        buttonExcluir.innerText = 'Excluir';
                        //buttonExcluir.onclick = excluirEvento;
                        $item.appendChild(buttonExcluir);
                        
                    }
                }
                
                // Move para o próximo item
                cursor.continue();
            }
        };
        //#endregion
    }else{
        //Hidden idTimeline
        var inputFieldInput = document.createElement("input");
        inputFieldInput.id = 'hidIdTimeline';
        inputFieldInput.type = 'hidden';
        inputFieldInput.disabled = 'disabled';
        inputFieldInput.value = dadosEvento == undefined ? '' : dadosEvento['id'];
        $item.appendChild(inputFieldInput);

        //ID
        var labelFieldLabel = document.createElement("label");
        labelFieldLabel.for = 'inputID';
        labelFieldLabel.className = 'form-label';
        labelFieldLabel.innerText = 'Numero de controle';
        $item.appendChild(labelFieldLabel);

        var inputFieldInput = document.createElement("input");
        inputFieldInput.id = 'inputID';
        inputFieldInput.className = 'form-control';
        inputFieldInput.type = 'text';
        inputFieldInput.disabled = 'disabled';
        inputFieldInput.placeholder = '###';
        if(dadosEvento != undefined){
            inputFieldInput.value = dadosEvento['id'];
        }
        $item.appendChild(inputFieldInput);

        //Titulo
        var labelFieldLabel = document.createElement("label");
        labelFieldLabel.for = 'inputTitulo';
        labelFieldLabel.className = 'form-label';
        labelFieldLabel.innerText = 'Titulo';
        $item.appendChild(labelFieldLabel);

        var inputFieldInput = document.createElement("input");
        inputFieldInput.id = 'inputTitulo';
        inputFieldInput.className = 'form-control';
        inputFieldInput.type = 'text';
        if(dadosEvento != undefined){
            inputFieldInput.value = dadosEvento['titulo'];
        }
        $item.appendChild(inputFieldInput);

        //Data hora
        var labelFieldLabel = document.createElement("label");
        labelFieldLabel.for = 'inputDatahora';
        labelFieldLabel.className = 'form-label';
        labelFieldLabel.innerText = 'Data Hora';
        $item.appendChild(labelFieldLabel);

        var inputFieldInput = document.createElement("input");
        inputFieldInput.id = 'inputDatahora';
        inputFieldInput.className = 'form-control';
        inputFieldInput.type = 'datetime-local';
        if(dadosEvento != undefined){
            inputFieldInput.value = new Date(dadosEvento['datahora']).toLocaleString();
        }else{
        inputFieldInput.value = (new Date()).toISOString().slice(0, 16);
        }
        $item.appendChild(inputFieldInput);

        //Cor
        var labelFieldLabel = document.createElement("label");
        labelFieldLabel.for = 'inputColor';
        labelFieldLabel.className = 'form-label';
        labelFieldLabel.innerText = 'Cor do titulo';
        $item.appendChild(labelFieldLabel);

        var inputFieldInput = document.createElement("input");
        inputFieldInput.id = 'inputColor';
        inputFieldInput.className = 'form-control';
        inputFieldInput.type = 'color';
        if(dadosEvento != undefined){
            inputFieldInput.value = dadosEvento['cor'];
        }
        $item.appendChild(inputFieldInput);

        var newLine = document.createElement("br");
        $item.appendChild(newLine);

        var buttonCarregar = document.createElement("button");
        buttonCarregar.type = 'button';
        buttonCarregar.className = 'btn btn-outline-dark';
        buttonCarregar.innerText = 'Update';
        buttonCarregar.onclick = inserirEvento;
        $item.appendChild(buttonCarregar);
    }
}

function CarregarItemDescricaoEvento(idEvento, idDescricao = 0) {
    alert(id)
}