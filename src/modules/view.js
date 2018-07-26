    const popupWindow = document.querySelector('#popupWindow'); // popup окно

    const loginForm = document.querySelector('#loginForm'); // форма авторизации
    const loginFormName = document.querySelector('#loginFormName'); // поле для ввода ФИО
    const loginFormNik = document.querySelector('#loginFormNik'); // поле для ввода ника

    const loadPhoto = document.querySelector('#loadPhoto'); // окно загрузки фото

    const myName = document.querySelector('#myName'); // имя пользователя залогиневшегося
    const userPhoto = document.querySelector('#userPhoto'); // фото пользователя залогиневшегося
    const usersCount = document.querySelector('#usersCount'); // количество пользователей в приложении
    const usersList = document.querySelector('#usersList'); // список пользователей в приложении

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

    attr(idElement, name, value) { // чтение и запись атрибута
        const element = document.querySelector(`#${idElement}`);
        
        if (value) {
            element.setAttribute(name, value);
        } else {
            return element.getAttribute(name);
        }
    },

    getValueField(idElement) { // чтение значения inputa
        let element = document.querySelector(`#${idElement}`);
        return element.value
    },

    setValueElement(idElement, valueElement) { // запись в элемент
        let element = document.querySelector(`#${idElement}`);
        element.innerHTML = valueElement;
    }
};