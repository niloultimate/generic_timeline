function limparMain() {
    var divMain = document.getElementById('main');
    divMain.innerHTML = ''; // Atribui uma string vazia ao conteúdo da div
}

function menuConfigurar() {
    limparMain();

    // Cria o estilo para o modal em si
    var modalConfiguracaoStyle = `
        display: table;
        clear: both;
        background-color: #fff;
        width: 100%;
        height: 100%;
        padding: 0px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
        text-align: center;
        position: relative;
    `;

    // Cria o conteúdo do modal
    var modalConfiguracao = document.createElement("div");
    modalConfiguracao.style.cssText = modalConfiguracaoStyle;

    // Conteúdo do modal
    // Cria o elemento div para o menu lateral
    var menuLateral = document.createElement("div");
    menuLateral.id = "menuLateral";
    menuLateral.className = "menu-lateral";

    // Estilo para o menu lateral
    menuLateral.style.float = "left";
    menuLateral.style.width = "20%";
    menuLateral.style.height = "100%";
    menuLateral.style.backgroundColor = "#333";
    menuLateral.style.color = "#fff";
    menuLateral.style.padding = "20px";

    // Itens do menu
    var itensMenu = [
        { "0": { "name": "Timeline", "icon": "fa-solid fa-sitemap" } },
        { "1": { "name": "Edição de eventos", "icon": "fa-solid fa-bolt" } },
        { "-1": { "name": "Excluir Banco", "icon": "fa-solid fa-database" } },
    ];

    // CSS Menu
    var menuItemStyle = `
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid #ccc;
      margin: 5px;
    `;

    const menuHeader = document.createElement("h4");
    menuHeader.textContent = "Configurações";
    menuHeader.style.textAlign = "center";
    menuHeader.style.marginBottom = "20px";
    menuLateral.appendChild(menuHeader);

    for (const objeto of itensMenu) {
        for (const chave in objeto) {
            const item = objeto[chave];

            const menuItem = document.createElement("div");
            menuItem.id = chave;
            menuItem.classList.add("menuItem");
            menuItem.style.cssText = menuItemStyle;

            const icon = document.createElement("i");
            icon.className = item.icon;
            icon.style.marginRight = "10px";

            const text = document.createElement("div");
            text.textContent = item.name;

            menuItem.appendChild(icon);
            menuItem.appendChild(text);
            menuItem.onclick = carregarMenu.bind(null, chave); // Define a função de carregamento do menu

            // Adiciona o item do menu ao menu lateral
            menuLateral.appendChild(menuItem);
        }
    }

    // Cria o div de conteúdo à direita
    var conteudo = document.createElement("div");
    conteudo.id = "conteudoConfig";
    conteudo.className = "conteudo";

    // Estilo para o div de conteúdo

    conteudo.style.float = "left";
    conteudo.style.height = "100%";
    conteudo.style.width = "80%";
    conteudo.style.padding = "5px";

    modalConfiguracao.appendChild(menuLateral);
    modalConfiguracao.appendChild(conteudo);

    // Adiciona o modal à página
    document.getElementById("main").appendChild(modalConfiguracao);

    carregarMenu('0');
}

function menuGrafico() {
    limparMain();

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
        optionField.selected = true;
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
                selectField.appendChild(optionField);

                // Move para o próximo item
                cursor.continue();
            } else {
                console.log("Fim da lista de itens.");
            }
        };
        //#endregion
        divInputGroup.appendChild(selectField)

        var buttonCarregar = document.createElement("button");
        buttonCarregar.type = 'button';
        buttonCarregar.className = 'btn btn-outline-dark';
        buttonCarregar.innerText = 'Carregar';
        buttonCarregar.onclick = carregarDesenhoTimeline;
        divInputGroup.appendChild(buttonCarregar);

        divContainer.appendChild(divInputGroup);
        divRow.appendChild(divContainer);
    //#endregion
    divConfiguracao.appendChild(divRow);

    // Adiciona o modal à página
    document.getElementById("main").appendChild(divConfiguracao);
}

function menuAbout() {
    limparMain();
}

function toggleFullScreen() {
    var fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

    if (!fullscreenElement) {
        var elem = document.getElementById("main");

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function carregarMenu($id) {
    switch ($id) {
        case '-1':
            excluirBancoDeDados();
            break;
        case '0':
            carregarMenuTimeline();
            break;
        case '1':
            carregarMenuEditarEventos();
            break;
        default:
            alert('Não mapeado o menu')
            break;
    }
}

//#region [DB]
let db;
carregarBanco()

function excluirBancoDeDados() {
    if (confirm('Tem certeza de que deseja excluir o banco de dados "timelineDB"?')) {
        document.getElementById('conteudoConfig').innerHTML = '';

        indexedDB.deleteDatabase('timelineDB');

        // Após excluir, pode ser necessário reiniciar a página para criar um novo banco de dados
        location.reload();
    }
}

function carregarBanco() {
    var request = indexedDB.open('timelineDB', 3);

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // Cria a tabela "timeline_instancia" se não existir
        if (!db.objectStoreNames.contains('timeline_instancia')) {
            var objectStore1 = db.createObjectStore('timeline_instancia', { keyPath: 'id', autoIncrement: true });
            objectStore1.createIndex('nome', 'nome', { unique: false });
            objectStore1.createIndex('numero_incidente', 'numero_incidente', { unique: false });
            objectStore1.createIndex('data_criacao', 'data_criacao', { unique: false });
        }

        // Cria a tabela "eventos_timeline" se não existir
        if (!db.objectStoreNames.contains('eventos_timeline')) {
            var objectStore2 = db.createObjectStore('eventos_timeline', { keyPath: 'id', autoIncrement: true });
            objectStore2.createIndex('timeline_instancia_id', 'timeline_instancia_id', { unique: false });
            objectStore2.createIndex('titulo', 'titulo', { unique: false });
            objectStore2.createIndex('datahora', 'datahora', { unique: false });
            objectStore2.createIndex('cor', 'cor', { unique: false });
        }

        // Cria a tabela "itens_evento" se não existir
        if (!db.objectStoreNames.contains('itens_evento')) {
            var objectStore3 = db.createObjectStore('itens_evento', { keyPath: 'id', autoIncrement: true });
            objectStore3.createIndex('evento_id', 'evento_id', { unique: false });
            objectStore3.createIndex('descricao', 'descricao', { unique: false });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Banco de dados "timelineDB" aberto com sucesso.');
    };

    request.onerror = function (event) {
        console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };
}

function inserirTimeline() {
    if(document.getElementById('inputName').value == ''){
        return;
    }

    var transaction = db.transaction(['timeline_instancia'], 'readwrite');
    var objectStore = transaction.objectStore('timeline_instancia');

    var nome = document.getElementById('inputName').value;
    var numeroIncidente = document.getElementById('inputNumero_incidente').value;
    var dataCriacao = new Date(document.getElementById('inputDatatime').value);

    var novoRegistro = { nome: nome, numero_incidente: numeroIncidente, data_criacao: dataCriacao };

    var request = objectStore.add(novoRegistro);

    request.onsuccess = function () {
        console.log('Registro inserido na tabela "timeline_instancia" com sucesso. ID: ' + request.result);
    };

    request.onerror = function (event) {
        console.error('Erro ao inserir o registro na tabela "timeline_instancia":', event.target.errorCode);
    };
    
    carregarMenu('0');
}

function editTimeline($id = 0) {
    if(document.getElementById('inputName').value == '')
    {
        carregarMenu('0');
    }

    var transaction = db.transaction(['timeline_instancia'], 'readwrite');
    var objectStore = transaction.objectStore('timeline_instancia');
    var request = objectStore.openCursor();

    var nome = document.getElementById('inputName').value;
    var numeroIncidente = document.getElementById('inputNumero_incidente').value;
    var dataCriacao = new Date(document.getElementById('inputDatatime').value);

    request.onerror = function(event) {
        console.error("Erro ao abrir o cursor:", event.target.errorCode);
    };

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        
        if (cursor) {
            // Verifica se o cursor está no item que desejamos atualizar
            if (parseInt(cursor.value.id) == parseInt($id)) {
                // Atualiza os dados do item
                cursor.value.nome = nome;
                cursor.value.numero_incidente = numeroIncidente;
                cursor.value.data_criacao = dataCriacao;

                // Atualiza o item na armazenagem
                var updateRequest = cursor.update(cursor.value);

                updateRequest.onerror = function(event) {
                    console.error("Erro ao atualizar o item:", event.target.errorCode);
                };

                updateRequest.onsuccess = function(event) {
                    console.log("Item atualizado com sucesso!");
                };
            }

            // Move para o próximo item
            cursor.continue();
        } else {
            console.log("Item não encontrado no banco de dados.");
        }
    };
    
    carregarMenu('0');
}

function removeTimeline($id) {

    if (confirm("Você confirma?")) {
            
        var transaction = db.transaction(['timeline_instancia'], 'readwrite');
        var objectStore = transaction.objectStore('timeline_instancia');
        var deleteRequest = objectStore.delete($id);

        deleteRequest.onerror = function(event) {
            console.error("Erro ao excluir o item:", event.target.errorCode);
        };

        deleteRequest.onsuccess = function(event) {
            console.log("Item excluído com sucesso!");
        };
        
        carregarMenu('0');
        
    }
}


function inserirEvento() {
    var idTimeline = parseInt(document.getElementById('selectTimeline')?.value)
    var titulo = document.getElementById('inputTitulo').value;
    if(isNaN(idTimeline) || titulo == '')
    {
        return;
    }

    var transaction = db.transaction(['eventos_timeline'], 'readwrite');
    var objectStore = transaction.objectStore('eventos_timeline');

    var datahora = new Date(document.getElementById('inputDatahora').value);
    var color = document.getElementById('inputColor').value;;

    var novoRegistro = { timeline_instancia_id: idTimeline, titulo: titulo, datahora: datahora, cor: color };

    var request = objectStore.add(novoRegistro);

    request.onsuccess = function () {
        console.log('Registro inserido na tabela "timeline_instancia" com sucesso. ID: ' + request.result);
    };

    request.onerror = function (event) {
        console.error('Erro ao inserir o registro na tabela "timeline_instancia":', event.target.errorCode);
    };
    
    carregarMenu('1');
}

function removeEvento($id) {

    if (confirm("Você confirma?")) {
            
        var transaction = db.transaction(['eventos_timeline'], 'readwrite');
        var objectStore = transaction.objectStore('eventos_timeline');
        var deleteRequest = objectStore.delete($id);

        deleteRequest.onerror = function(event) {
            console.error("Erro ao excluir o item:", event.target.errorCode);
        };

        deleteRequest.onsuccess = function(event) {
            console.log("Item excluído com sucesso!");
        };
        
        carregarMenuEditarEventos();
        
    }
}
//#endregion

function carregarDesenhoTimeline() {
    var idTimeline = parseInt(document.getElementById('selectTimeline')?.value);
    var nomeTimeline = document.getElementById('selectTimeline').options[document.getElementById('selectTimeline').selectedIndex].text;
    
    if(!isNaN(idTimeline))
    {
        limparMain();
        
        var divTimeline = document.createElement("div");
        divTimeline.id = 'divTimeline';
        divTimeline.className = 'timeline-class';

        var hiTitulo = document.createElement("h1");
        hiTitulo.innerText = nomeTimeline;
        divTimeline.appendChild(hiTitulo);

        var ulLine = document.createElement("ul");

        //#region [Criar sessões da timeline]
        var transaction = db.transaction(['eventos_timeline'], 'readwrite');
        var objectStore = transaction.objectStore('eventos_timeline');
        var request = objectStore.openCursor();

        request.onerror = function(event) {
            console.error('Erro ao abrir o cursor:', event.target.errorCode);
        };

        listItens = [];

        request.onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                    
                if(idTimeline == parseInt(cursor.value.timeline_instancia_id)) {
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

                    var liEvento = document.createElement("li");
                    liEvento.setAttribute('style', '--accent-color:'+listItens[i].cor);

                    var divEventoData = document.createElement("div");
                    divEventoData.className = 'date';
                    divEventoData.innerText = new Date(listItens[i].datahora).toLocaleString().replace(',', ' -');
                    liEvento.appendChild(divEventoData);
                    
                    var divEventoTitulo = document.createElement("div");
                    divEventoTitulo.className = 'title';
                    divEventoTitulo.innerText = listItens[i].titulo;
                    liEvento.appendChild(divEventoTitulo);

                    var divEventoDescricao = document.createElement("div");
                    divEventoDescricao.id = 'divEventoDescricao_'+listItens[i].id;
                    divEventoDescricao.className = 'descr';

                    //Descrições
                    //#region [Criar itens de crição]
                    var transactionItens_evento = db.transaction(['itens_evento'], 'readwrite');
                    var objectStoreItens_evento = transactionItens_evento.objectStore('itens_evento');
                    var requestItens_evento = objectStoreItens_evento.openCursor();

                    requestItens_evento.onerror = function(event) {
                        console.error('Erro ao abrir o cursor:', event.target.errorCode);
                    };

                    listItensDescricao = [];
                    requestItens_evento.onsuccess = function(event) {
                        
                        var idEvento = parseInt(listItens[i].id);
                        var cursorItens_evento = event.target.result;

                        if (cursorItens_evento) {

                            if(idEvento == parseInt(cursorItens_evento.value.evento_id)) 
                            {
                                listItensDescricao.push({
                                    id: cursorItens_evento.value.id,
                                    evento_id: cursorItens_evento.value.evento_id,
                                    descricao: cursorItens_evento.value.descricao
                                })
                            } 
            
                            // Move para o próximo item
                            cursorItens_evento.continue();
                        } else {

                            listItensDescricao.sort(function(a, b) {
                                return a.id - b.id;
                            });

                            for (let j = 0; j < listItensDescricao.length; j++) 
                            {
                                if(idEvento == parseInt(listItensDescricao[j].evento_id)) 
                                {
                                    var paragrafo = document.createElement("p");
                                    paragrafo.innerText = '- ' + listItensDescricao[j].descricao;
                                    
                                    document.getElementById('divEventoDescricao_'+idEvento).appendChild(paragrafo)
                                }
                            }
                        }
                    };
                    
                    liEvento.appendChild(divEventoDescricao);

                    ulLine.appendChild(liEvento);
                }
            }
        };

        //#endregion
        divTimeline.appendChild(ulLine);
            
        // Adiciona o modal à página
        document.getElementById("main").appendChild(divTimeline);
    }
}

function editEvento() {
    if(document.getElementById('inputID').value != '')
    {

        var transaction = db.transaction(['eventos_timeline'], 'readwrite');
        var objectStore = transaction.objectStore('eventos_timeline');
        var request = objectStore.openCursor();

        var id = document.getElementById('inputID').value;
        var titulo = document.getElementById('inputTitulo').value;
        var datahora = new Date(document.getElementById('inputDatahora').value);
        var cor = document.getElementById('inputColor').value;

        request.onerror = function(event) {
            console.error("Erro ao abrir o cursor:", event.target.errorCode);
        };

        request.onsuccess = function(event) {
            var cursor = event.target.result;
            
            if (cursor) {
                // Verifica se o cursor está no item que desejamos atualizar
                if (parseInt(cursor.value.id) == parseInt(id)) {
                    // Atualiza os dados do item
                    cursor.value.titulo = titulo;
                    cursor.value.datahora = datahora;
                    cursor.value.cor = cor;

                    // Atualiza o item na armazenagem
                    var updateRequest = cursor.update(cursor.value);

                    updateRequest.onerror = function(event) {
                        console.error("Erro ao atualizar o item:", event.target.errorCode);
                    };

                    updateRequest.onsuccess = function(event) {
                        console.log("Item atualizado com sucesso!");
                    };
                }

                // Move para o próximo item
                cursor.continue();
            } else {
                console.log("Item não encontrado no banco de dados.");
            }
        };
        
    }
    //carregarMenuEditarEventos()
}
