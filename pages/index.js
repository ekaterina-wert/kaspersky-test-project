import './index.css'; // добавьте импорт главного файла стилей

import { Card } from '../components/Card.js';
import { FormValidator } from '../components/FormValidator.js';
import { Section } from '../components/Section.js';
import { UserInfo } from '../components/UserInfo.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { PopupWithSubmit } from '../components/PopupWithSubmit.js';
import { Api } from '../components/Api.js';

const cardsContainer = document.querySelector('.places__container');
const profile = document.querySelector('.profile');
const editButton = profile.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const editAvatar = document.querySelector('.profile__edit-image');
const editPopup = document.querySelector('.popup_type_edit-form');
const userInputAvatar = document.querySelector('.popup__text_type_avatar-url');
let userId = 0;

const userInputs = {
    name: editPopup.querySelector('.popup__text_type_name'),
    about: editPopup.querySelector('.popup__text_type_job')
};

const inputSelectors = {
    formSelector: '.popup__form',
    inputSelector: '.popup__text',
    submitButtonSelector: '.popup__submit',
    inactiveButtonClass: 'popup__submit_invalid',
    inputErrorClass: 'popup__text_type_invalid',
    errorClass: 'popup__input-error_active'
};

//создание попапа с картинкой
const imagePopup = new PopupWithImage(".popup_type_show-image");

//создание попапа с формой редактирования профиля + валидация этой формы
const editProfilePopup = new PopupWithForm('.popup_type_edit-form', () => {
    handleEditFormSubmit();
});
const editProfileFormValidation = new FormValidator(inputSelectors, editProfilePopup.popup);

//создание попапа с формой добавления новой карточки + валидация этой формы
const addNewCardPopup = new PopupWithForm('.popup_type_add-card', (data) => {
    handleAddFormSubmit(data);
});
const addFormValidation = new FormValidator(inputSelectors, addNewCardPopup.popup);

//создание попапа с формой изменения аватара + валидация этой формы
const editAvatarPopup = new PopupWithForm('.popup_type_edit-image', () => {
    handleEditAvatarFormSubmit();
});
const editAvatarFormValidation = new FormValidator(inputSelectors, editAvatarPopup.popup);

//создание попапа с подтверждением
const confirmationPopup = new PopupWithSubmit('.popup_type_confirm', (evt) => {
    handleConfirmFormSubmit(evt);
});

const userInfo = new UserInfo('.profile__name', '.profile__job', '.profile__image');

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-21',
    headers: {
        authorization: '9156915b-5169-4dc0-a8af-5bc1618bd83d',
        'Content-Type': 'application/json'
    }
});

//функции создания и добавления карточек 
function createCard(data) {
    const card = new Card({
        data: data,
        handleCardClick: () => {
            imagePopup.open(card.link, card.name);
        },
        handleDeleteCard: () => {
            confirmationPopup.open();
            confirmationPopup.card = card.element;
            confirmationPopup.cardId = card.id;
        },
        handleLikeCard: () => {
            card.like.classList.toggle('place__like-button_active');
            if (card.like.classList.contains('place__like-button_active')) {

                api.likeCard(card.id)
                    .then((res) => {
                        card.likeCounterDisplay.textContent = res.likes.length;
                    })
                    .catch((err) => {
                        console.log('Ошибка при лайке', err)
                    })
            } else {
                api.unlikeCard(card.id)
                    .then((res) => {
                        card.likeCounterDisplay.textContent = res.likes.length;
                    })
                    .catch((err) => {
                        console.log('Ошибка при лайке', err)
                    })
            }
        }
    }, '#card');
    const newCard = card.generateCard(userId);

    return newCard;
}

function addNewCard(newCard) {
    cardsContainer.prepend(newCard);
}

//функция-помощник открытия попапа редактирования профиля
function handleEditFormOpen() {
    const userData = userInfo.getUserInfo();
    userInputs.name.value = userData.userName;
    userInputs.about.value = userData.userAbout;
}

//функция-помощник уведомления пользователя о процессе загрузки
function renderLoading(popup, isLoading, initialSubmitText) {
    if (isLoading) {
        popup.textContent = 'Сохранение...';
    } else {
        popup.textContent = initialSubmitText;
    }
}

//функции обработки форм (сабмит). Создание новой карточки пользователя
function handleAddFormSubmit(data) {
    const initialSubmitText = addNewCardPopup.popupSubmit.textContent;
    renderLoading(addNewCardPopup.popupSubmit, true, initialSubmitText);

    api.addNewCard(data)
        .then((res) => {
            addNewCard(createCard(res));
            addNewCardPopup.close();
        })
        .catch((err) => {
            console.log('Ошибка при создании', err)
        })
        .finally(() => {
            renderLoading(addNewCardPopup.popupSubmit, false, initialSubmitText)
        })
}

//функции обработки форм (сабмит). Редактирование профиля пользователя
function handleEditFormSubmit() {
    const initialSubmitText = editProfilePopup.popupSubmit.textContent;
    renderLoading(editProfilePopup.popupSubmit, true, initialSubmitText);

    api.editUserData(userInputs)
        .then(() => {
            userInfo.setUserInfo(userInputs.name.value, userInputs.about.value);
            editProfilePopup.close();
        })
        .catch((err) => {
            console.log('Ошибка при сохранении информации пользователя', err)
        })
        .finally(() => {
            renderLoading(editProfilePopup.popupSubmit, false, initialSubmitText)
        })
}

//функции обработки форм (сабмит). Редактирование аватара пользователя
function handleEditAvatarFormSubmit() {
    const initialSubmitText = editAvatarPopup.popupSubmit.textContent;
    renderLoading(editAvatarPopup.popupSubmit, true, initialSubmitText);

    api.editUserAvatar(userInputAvatar)
        .then(() => {
            userInfo.setUserAvatar(userInputAvatar.value);
            editAvatarPopup.close()
        })
        .catch((err) => {
            console.log('Ошибка при обновлении аватара', err)
        })
        .finally(() => {
            renderLoading(editAvatarPopup.popupSubmit, false, initialSubmitText)
        })
}

//функции обработки форм (сабмит). Подтверждение удаления карточки пользователя
function handleConfirmFormSubmit(evt) {
    evt.preventDefault();

    const id = confirmationPopup.cardId;
    api.deleteMyCard(id)
        .then(() => {
            confirmationPopup.deleteCard();
        })
        .catch(err => {
            console.log("Ошибка при удалении", err)
        });

    confirmationPopup.close();
}

//получить два объекта с данными (информация пользователя, исходные карточки)
api.getAllData()
    .then((argument) => {
        const [userData, cardsData] = argument;

        //отрисовка данных пользователя
        userInfo.setUserInfo(userData.name, userData.about);
        userInfo.setUserAvatar(userData.avatar)

        userId = userData._id;

        //отрисовка карточек
        const cardList = new Section({
            items: cardsData,
            renderer: (item) => {
                const newCard = createCard(item);
                cardList.addItem(newCard);
            },
        }, '.places__container');
        cardList.renderItems();
    })
    .catch((err) => {
        console.log('Ошибка при загрузке юзердата и массива карточек', err)
    });

//добавление слушателей попапам
addNewCardPopup.setEventListeners();
editProfilePopup.setEventListeners()
imagePopup.setEventListeners();
editAvatarPopup.setEventListeners();
confirmationPopup.setEventListeners();

// добавление слушателей кнопкам открытия попапов
addButton.addEventListener('click', () => {
    addNewCardPopup.open();
    addFormValidation.enableValidation();
    addFormValidation.resetValidation();
});

editButton.addEventListener('click', () => {
    handleEditFormOpen();
    editProfilePopup.open();
    editProfileFormValidation.enableValidation();
    editProfileFormValidation.resetValidation();
});

editAvatar.addEventListener('click', () => {
    editAvatarPopup.open();
    editAvatarFormValidation.enableValidation();
    editAvatarFormValidation.resetValidation();
});