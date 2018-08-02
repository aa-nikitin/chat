import controller from './modules/controller.js';
import './styles/app.scss';


//import awesome from './fonts/fontawesome-webfont.woff';


const textMessage = document.querySelector('#textMessage');


controller.onMessage();
controller.onOpen();




document.addEventListener('click', function(e) {
    let idElem = e.target.getAttribute('id');

    if (idElem === 'enterChat') {
        controller.sendEnter('enter', 'loginFormName', 'loginFormNik'); 
    } else if (idElem === 'sendMessage') {
        controller.sendEnter('message', 'textMessage'); 
    } else if (idElem === 'chatExit') {
        controller.quitChat('userEnter');
    } else if (idElem === 'userPhoto') {
        controller.loadPhoto();
    } else if (idElem === 'loadPhotoCancel') {
        controller.loadPhotoCancel();
    }
});

textMessage.addEventListener('input', function(e) {
    controller.sendEnter('typing', 'textMessage');
});






const loadPhotoUser = document.querySelector('#loadPhotoUser');
const loadPhotoOnServer = document.querySelector('#loadPhotoOnServer');
const fileReader = new FileReader();

loadPhotoUser.addEventListener('dragover', (e) => {
    e.preventDefault();
    
});

loadPhotoUser.addEventListener('drop', (e) => {
    e.preventDefault();
    
    let file = e.dataTransfer.files[0];
    fileReader.readAsDataURL(file);
    console.log(file);
});

let sad;

fileReader.addEventListener('load', (e) => {
    loadPhotoUser.innerHTML = '';
    let imgUser = document.createElement('img'); 
    sad = fileReader.result; 
    imgUser.src = sad; 
    loadPhotoUser.appendChild(imgUser);   
});

loadPhotoOnServer.addEventListener('click', function(e) {
    controller.loadPhotoOnServer(sad);  
});


