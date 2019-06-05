"use strict";

const nameURL = "https://api.codetunnel.net/random-nick",
	adviceURL = "https://api.adviceslip.com/advice";

var nameHolder = $('.js-name'), avatarHolder = $('.js-avatar'), adviceHolder = $('.js-advice');
var nameButton = $('.js-generate-name'), avatarButton = $('.js-generate-avatar'), adviceButton = $('.js-generate-advice');

var state={
	name: "My noob bread",
	avatar: "https://robohash.org/loremipsum",
	advice: "It is easy to sit up and take notice, what's difficult is getting up and taking action."
};

var newName = (state, renderCallback) =>{
	$.ajax({
		type: "POST",
		url: nameURL,
		dataType: "json",
		data: JSON.stringify({theme: "default", sizeLimit: 21}),
		success: result => {state.name = result.nickname;renderCallback(state);}
	});
};

var newAvatar = (state, renderCallback) =>{
	state.avatar = `https://robohash.org/${state.avatar}`;
	renderCallback(state);
};

var newAdvice = (state, renderCallback) =>{
	$.ajax({
		type: "GET",
		url: adviceURL,
		dataType: "json",
		success: result => {state.advice = result.slip.advice;renderCallback(state);}
	});
};

var newCharacter = state =>{
	newAvatar(state, renderCharacter);
	newName(state, renderCharacter);
	newAdvice(state, renderCharacter);
};

var renderCharacter = state =>{ 
	nameHolder.text(state.name);
	avatarHolder.attr('src', state.avatar);
	adviceHolder.text(state.advice);
};

var setupHandlers = ()=>{
	nameButton.click(e => {
		newName(state, renderCharacter);
	});

	avatarButton.click(e => {
		newAvatar(state, renderCharacter);
	});

	adviceButton.click(e => {
		newAdvice(state, renderCharacter);
	});
};

$(function(){
	setupHandlers();
	newCharacter(state);
	//renderCharacter(state);
});