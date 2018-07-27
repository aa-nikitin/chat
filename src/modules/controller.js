import model from './model.js';
import view from './view.js';

const socket = new WebSocket("ws://localhost:9090");
var thisName;

let typingTimer = 0;
const typing = document.querySelector('#typingMessage');

function onMessage() { // отслеживаем пришедшие с сервера ответы
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);

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
                fieldsValidation(message.valid);
                break;
            case 'message':  
                view.renderMessage(message);
                break;
            case 'typing':
                typingTimer = view.renderTyping(typingTimer, message.from);                
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

function sendEnter(typeMsg, ...fields) { // отправка запроса(сообщения)
    let message = {
        type: typeMsg,
        from : view.valueElement('myName'),
        data: {},
        valid: {}
    };
    
    for (let i of fields) {
        let nameAttr = view.attr(i, 'data-name');

        message.data[nameAttr] = view.valueField(i);
        message.valid[view.attr(i, 'id')] = nameAttr;
    }

    if (typeMsg === 'message') {
        message.from = view.attr('myName', 'data-nik');
        message.time = getTime();
        message.photo = view.attr('userPhoto', 'src');  
        if (view.valueField('textMessage')) {
            view.valueField('textMessage', '');
        }  else message.type = 'none';
    }

    socket.send(JSON.stringify(message));
}

function getTime() { // формирует время отправки
    let date = new Date();
    return `${timeFormat(date.getHours())}:${timeFormat(date.getMinutes())}`;
}

function timeFormat(number) { // в двухзначный формат
    return ((number < 10) ? '0' : '') + number;
}

function authorization(message) { // авторизация
    let photo = '/src/photo/no-photo.png';

    if (!thisName) {
        thisName = message.data.nik;
        view.valueElement('myName', message.users[message.data.nik])
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

function loadPhoto() { // проверка полей на валидность
    view.statePopup('loadPhoto', 'add');
}

function loadPhotoCancel() { // проверка полей на валидность
    view.statePopup('loadPhoto', 'remove');
}

function quitChat(coockieName) { // проверка полей на валидность
    model.delCookie(coockieName);
    location.reload();
}

export default {
    sendEnter : sendEnter,
    onMessage : onMessage,
    quitChat : quitChat,
    loadPhoto : loadPhoto,
    loadPhotoCancel : loadPhotoCancel,
    onOpen : onOpen
}