const socket = new WebSocket("ws://localhost:9090");

const popupWindow = document.querySelector('#popupWindow'); // popup окно

const loginForm = document.querySelector('#loginForm'); // форма авторизации
const loginFormName = document.querySelector('#loginFormName'); // поле для ввода ФИО
const loginFormNik = document.querySelector('#loginFormNik'); // поле для ввода ника

const loadPhoto = document.querySelector('#loadPhoto'); // окно загрузки фото

const myName = document.querySelector('#myName'); // имя пользователя залогиневшегося
const userPhoto = document.querySelector('#userPhoto'); // фото пользователя залогиневшегося
const usersCount = document.querySelector('#usersCount'); // количество пользователей в приложении
const usersList = document.querySelector('#usersList'); // список пользователей в приложении

console.log(socket);

socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    console.log(message);
    if (message.type === 'enter') {
        let photo = '/src/photo/no-photo.png';
        if (!myName.getAttribute('data-nik')) {
            myName.innerHTML = message.users[message.data.nik];
            myName.setAttribute('data-nik', message.data.nik);
            if (message.data.photo) {
                photo = message.data.photo;
            }
            userPhoto.setAttribute('src', photo);
            document.cookie = `userEnter = ${event.data}`;  
        }
        updateListUser(message.users);
        popupWindow.classList.remove('chat-popup_show');
        loginForm.classList.remove('chat-popup_show'); 
    }
    if (message.type === 'close') {
        updateListUser(message.users);
    }
    if (message.type === 'error') {
        for (let i in message.valid) {
            const FieldName = document.querySelector(`#${i}`);
            if (message.valid[i] !== 1) {
                FieldName.setAttribute('placeholder', message.valid[i]); 
                FieldName.classList.add('error');   
                FieldName.value = '';
            } else {
                FieldName.setAttribute('placeholder', ''); 
                FieldName.classList.remove('error');   
            }
        }
    }
    if (message.type === 'restoreEnter') {
        let photo = '/src/photo/no-photo.png';
        if (!myName.getAttribute('data-nik')) {
            myName.innerHTML = message.users[message.data.nik];
            myName.setAttribute('data-nik', message.data.nik);
            if (message.data.photo) {
                photo = message.data.photo;
            }
            userPhoto.setAttribute('src', photo);
            document.cookie = `userEnter = ${event.data}`;  
        }
        updateListUser(message.users);
        popupWindow.classList.remove('chat-popup_show');
        loginForm.classList.remove('chat-popup_show'); 
    }
});

socket.addEventListener('open', function(event) {
    //console.log(getCookie('userEnter'));
    const userCoockie = getCookie('userEnter');
    if (userCoockie) {
        //restore
        let asd = JSON.parse(userCoockie);
        let message = {
            type: 'restoreEnter',
            data: asd.data
        };
        console.log(message);
        socket.send(JSON.stringify(message));
    }
});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

socket.addEventListener('open', function() {
    popupWindow.classList.add('chat-popup_show');
    loginForm.classList.add('chat-popup_show');
});

document.addEventListener('click', function(e) {
    let idElem = e.target.getAttribute('id');
    

    if (idElem === 'enterChat') {
        sendEnter(loginFormName, loginFormNik); 
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
        if (myName.getAttribute('data-nik') !== nik) {
            let userNew = document.createElement(`li`);
            userNew.setAttribute('id', nik);
            userNew.setAttribute('class', 'participants__item');
            userNew.innerHTML = `${list[nik]}`;
            usersList.appendChild(userNew);
            countUsers++;
        }
    }  
    usersCount.innerHTML = countUsers;     
}

function sendEnter(...fields) {
    let message = {
        type: 'enter',
        data: {},
        valid: {}
    };
    
    for (let i of fields) {
        let nameAttr = i.getAttribute('data-name');
        message.data[nameAttr] = i.value;
        message.valid[i.getAttribute('id')] = nameAttr;
    }
    socket.send(JSON.stringify(message));
}
