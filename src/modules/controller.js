import model from './model.js';
import view from './view.js';

const socket = new WebSocket("ws://localhost:9090");
var thisName;

function onMessage() { // отслеживаем пришедшие с сервера ответы
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        console.log(message);

        switch(message.type) {
            case 'enter': 
                authorization(message);
                break;
            case 'close':  
                updateListUser(message.users);
                break;
            case 'restoreEnter':  
                authorization(message);
                break;
            case 'error':  
                fieldsValidation(message.valid)
                break;
            case 'message':  
                console.log('message');
                break;
            default:
                break;
        } 
    });
}

function onOpen() { // выполнение операций при загрузке сокета
    socket.addEventListener('open', () => {
        const userCoockie = model.getCookie('userEnter');

        if (userCoockie) {
            let message = JSON.parse(userCoockie);
            message.type = 'restoreEnter';
            socket.send(JSON.stringify(message));
        } else {
            view.statePopup('loginForm', 'add');
        }
        
    });
}

function updateListUser(list) { // обновление списка пользователей онлайн
    let itemUsers = [];

    for (let nik in list) {
        if (thisName !== nik) {
            itemUsers.push({
                idUser : nik, 
                nameUser : list[nik]    
            });
        }
    }  
    view.renderUsersOnline(itemUsers);    
}

function sendEnter(...fields) { // отправка запроса(сообщения)
    let message = {
        type: 'enter',
        data: {},
        valid: {}
    };
    
    for (let i of fields) {
        let nameAttr = view.attr(i, 'data-name');

        message.data[nameAttr] = view.getValueField(i);
        message.valid[view.attr(i, 'id')] = nameAttr;
    }
    socket.send(JSON.stringify(message));
}

function authorization(message) { // авторизация
    let photo = '/src/photo/no-photo.png';
    if (!thisName) {
        thisName = message.data.nik;
        view.setValueElement('myName', message.users[message.data.nik])
        view.attr('myName', 'data-nik', message.data.nik);
        if (message.data.photo) {
            photo = message.data.photo;
        }
        view.attr('userPhoto', 'src', photo);
        document.cookie = `userEnter = ${JSON.stringify(message)}`;  
    }
    updateListUser(message.users);
    view.statePopup('loginForm', 'remove');
}

function fieldsValidation(listFields) { // проверка полей на валидность
    for (let i in listFields) {
        if (listFields[i] !== 1) {
            view.stateField(i, 'error', listFields[i]);
        } else {
            view.stateField(i, 'success');  
        }
    }
}

export default {
    sendEnter : sendEnter,
    onMessage : onMessage,
    onOpen : onOpen
}