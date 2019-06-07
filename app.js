"use strict";

const nameURL = "https://api.codetunnel.net/random-nick",
	adviceURL = "https://api.adviceslip.com/advice";

var nameHolder = $('.js-name'), avatarHolder = $('.js-avatar'), adviceHolder = $('.js-advice');
var nameButton = $('.js-generate-name'), avatarButton = $('.js-generate-avatar'), adviceButton = $('.js-generate-advice');
var allButton = $('.js-generate-all');
var toggleButton = $('.toggle-reloads');

var state={
	name: "My noob bread",
	avatar: "https://robohash.org/loremipsum",
	advice: "It is easy to sit up and take notice, what's difficult is getting up and taking action.",
    buttonsHidden: false
};

var nameAjax = (state, renderCallback) => $.ajax({
		type: "POST",
		url: nameURL,
		dataType: "json",
		data: JSON.stringify({theme: "default", sizeLimit: 21}),
		success: result => {state.name = result.nickname;renderCallback(state);}
	});

var getNewName = (state, renderCallback) =>{
	nameAjax(state, renderCallback);
};

var getNewAvatar = (state, renderCallback) =>{
	state.avatar = `https://robohash.org/${state.avatar + state.name}`;
	renderCallback(state);
};

var adviceAjax = (state, renderCallback) => $.ajax({
		type: "GET",
		url: adviceURL,
		dataType: "json",
		success: result => {state.advice = result.slip.advice;renderCallback(state);}
	});
var getNewAdvice = (state, renderCallback) =>{
	adviceAjax(state, renderCallback);
};

var getNewCharacter = (state, renderCallback) =>{
	var dummyCallback = (s)=>{};
	getNewAvatar(state, dummyCallback);
	$.when(nameAjax(state, dummyCallback), adviceAjax(state, dummyCallback)).done(
        (state1, state2) => {renderCallback(state);}
    );
};
var toggleButtonsHidden = state => {
    state.buttonsHidden = ! state.buttonsHidden;
}
//
var enableButtons = ()=>{
	nameButton.removeAttr('disabled');
	avatarButton.removeAttr('disabled');
	adviceButton.removeAttr('disabled');
	allButton.removeAttr('disabled');
}

var disableButtons = () => {
	nameButton.attr('disabled', 'true');
	avatarButton.attr('disabled', 'true');
	adviceButton.attr('disabled', 'true');
	allButton.attr('disabled', 'true');
}
var renderNameAdvice = state =>{
	nameHolder.text(state.name);	
	adviceHolder.text(state.advice);
}
var renderCharacter = state =>{ 
	if(avatarHolder.attr('src') !== state.avatar)
	{
		avatarHolder.attr('src', state.avatar);
		//the image on load takes care of the rest from here
	}
	else{
		renderNameAdvice(state);
		enableButtons();
	}	
};
var renderButtons = state => {
    if(state.buttonsHidden){
        nameButton.addClass('hidden');
        adviceButton.addClass('hidden');
        avatarButton.addClass('hidden');
        toggleButton.text('Show buttons');
        if($(window).width() >= 960){
            nameHolder.css('left', '0');
            avatarHolder.css('left', '0');
        }
    }
    else{
        nameButton.removeClass('hidden');
        adviceButton.removeClass('hidden');
        avatarButton.removeClass('hidden');
        toggleButton.text('Hide buttons');
        if($(window).width() >= 960){
            nameHolder.css('left', '25px');
            avatarHolder.css('left', '25px');
        }
    }
}
var setupHandlers = ()=>{
	nameButton.click(e => {
		disableButtons();
		getNewName(state, renderCharacter);
	});

	avatarButton.click(e => {
		disableButtons();
		getNewAvatar(state, renderCharacter);
	});

	adviceButton.click(e => {
		disableButtons();
		getNewAdvice(state, renderCharacter);
	});

	allButton.click(e => {
		disableButtons();
		getNewCharacter(state, renderCharacter);
	});

	avatarHolder.on('load', function(){
		renderNameAdvice(state);
		enableButtons();
	});

    toggleButton.click(e => {
        toggleButtonsHidden(state);
        renderButtons(state);
    });
};

$(function(){
	setupHandlers();
	getNewCharacter(state, renderCharacter);
});