import controller from './modules/controller.js';

controller.onMessage();
controller.onOpen();


document.addEventListener('click', function(e) {
    let idElem = e.target.getAttribute('id');

    if (idElem === 'enterChat') {
        controller.sendEnter('loginFormName', 'loginFormNik'); 
    } else if (idElem === 'sendMessage') {
        //controller.sendEnter('loginFormName', 'loginFormNik'); 
        console.log('test');
    }
});


