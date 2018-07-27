import controller from './modules/controller.js';

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


