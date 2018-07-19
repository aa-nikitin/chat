const socket = new WebSocket("ws://localhost:9090");

const popupWindow = document.querySelector('#popupWindow'); // popup окно

const loginForm = document.querySelector('#loginForm'); // форма авторизации
const loginFormName = document.querySelector('#loginFormName'); // поле для ввода ФИО
const loginFormNik = document.querySelector('#loginFormNik'); // поле для ввода ника

const loadPhoto = document.querySelector('#loadPhoto'); // окно загрузки фото

const myName = document.querySelector('#myName'); // имя пользователя залогиневшегося
const usersCount = document.querySelector('#usersCount'); // количество пользователей в приложении
const usersList = document.querySelector('#usersList'); // список пользователей в приложении


console.log(socket);

socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    console.log(message);
    if (message.type === 'enter') {
        if (!myName.getAttribute('data-nik')) {
            myName.innerHTML = message.data.name;
            myName.setAttribute('data-nik', message.data.nik);
        }
        updateListUser(message.users);
        popupWindow.classList.remove('chat-popup_show');
        loginForm.classList.remove('chat-popup_show');    
    }
    if (message.type === 'close') {
        updateListUser(message.users);
    }
});

socket.addEventListener('open', function() {
    popupWindow.classList.add('chat-popup_show');
    loginForm.classList.add('chat-popup_show');
});

document.addEventListener('click', function(e) {
    let idElem = e.target.getAttribute('id');

    if (idElem === 'enterChat') {
        sendEnter(
            checkFullness(loginFormName), 
            checkFullness(loginFormNik)
        ); 
    }
});

function checkFullness(element) {
    if (element.value) {
        element.classList.remove('error');
        return element.value;
    } else {
        element.classList.add('error');
    }
}

function updateListUser(list) {
    let countUsers = 0;
    usersList.innerHTML = '';
    for (let nik in list) {
        let userNew = document.createElement(`li`);
        userNew.setAttribute('id', nik);
        userNew.setAttribute('class', 'participants__item');
        userNew.innerHTML = `${list[nik]}`;
        usersList.appendChild(userNew);
        countUsers++;
    }  
    usersCount.innerHTML = countUsers;     
}

function sendEnter(name, nik) {
    var message = {
        type: 'enter',
        data: {
            name: name,
            nik: nik
        }
    };

    socket.send(JSON.stringify(message));
    
}
