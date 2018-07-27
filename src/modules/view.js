    const popupWindow = document.querySelector('#popupWindow'); // popup окно

    const messageContainer = document.querySelector('#messageContainer'); // контейнер сообщений
    const messageList = document.querySelector('#messageList'); // список сообщений

    const usersCount = document.querySelector('#usersCount'); // количество пользователей в приложении
    const usersList = document.querySelector('#usersList'); // список пользователей в приложении

    const typing = document.querySelector('#typingMessage'); // пользователь печатает

export default {
    
    
    statePopup(idElement, action) { // изменение состояния всплывающего окна
        const formPopup = document.querySelector(`#${idElement}`);
        switch(action) {
            case 'add': 
                popupWindow.classList.add('chat-popup_show');
                formPopup.classList.add('chat-popup_show'); 
                break;
            case 'remove':  
                popupWindow.classList.remove('chat-popup_show');
                formPopup.classList.remove('chat-popup_show'); 
                break;
            default:
                break;
        }  
    },

    stateField(idElement, action, message) {  // изменение состояния inputa
        const field = document.querySelector(`#${idElement}`);
        switch(action) {
            case 'error': 
                field.setAttribute('placeholder', message); 
                field.classList.add('error');   
                field.value = '';
                break;
            case 'success':  
                field.setAttribute('placeholder', ''); 
                field.classList.remove('error'); 
                break;
            default:
                break;
        }
         
    },

    render(templateName, data) { // шаблон формы
        const template = document.getElementById(templateName).textContent;
        const render = Handlebars.compile(template);
        const html = data ? render(data) : render();

        return html;
    },

    renderUsersOnline(usersOnline) { // отрисовка пользователей онлайн
        usersList.innerHTML = '';
        usersList.innerHTML = this.render('tmp-users', {items : usersOnline});
        usersCount.innerHTML = usersOnline.length; 
    },

    renderMessage(message) { // отрисовка пользователей онлайн
        
        const tmpMessage = this.render('tmp-message', message);
        messageList.innerHTML += tmpMessage;
        messageContainer.scrollTop = messageContainer.scrollHeight;
    },

    renderTyping(timer, message) { // отрисовка пользователей онлайн
        
        typing.classList.add('typing-visible');
        typing.textContent = `${message} печатает...`;

        clearTimeout(timer);
        return setTimeout(() => typing.classList.remove('typing-visible'), 1000);
    },

    attr(idElement, name, value) { // чтение и запись атрибута
        const element = document.querySelector(`#${idElement}`);
        
        if (value !== undefined) {
            element.setAttribute(name, value);
        } else {
            return element.getAttribute(name);
        }
    },

    valueField(idElement, valueElement) { // чтение значения inputa
        let element = document.querySelector(`#${idElement}`);
        if (valueElement !== undefined) {
            element.value = valueElement;
        } else {
            return element.value;
        }
    },

    valueElement(idElement, valueElement) { // запись в элемент
        let element = document.querySelector(`#${idElement}`);

        if (valueElement !== undefined) {
            element.innerHTML = valueElement;
        } else {
            return element.innerHTML;
        }
        
    }
};