"use strict";

const nameURL = "https://api.codetunnel.net/random-nick",
	adviceURL = "https://api.adviceslip.com/advice";

var nameHolder = $('.js-name'), avatarHolder = $('.js-avatar'), adviceHolder = $('.js-advice');
var nameButton = $('.js-generate-name'), avatarButton = $('.js-generate-avatar'), adviceButton = $('.js-generate-advice');
var allButton = $('.js-generate-all');

var state={
	name: "My noob bread",
	avatar: "https://robohash.org/loremipsum",
	advice: "It is easy to sit up and take notice, what's difficult is getting up and taking action."
};

var nameAjax = (state, renderCallback) => $.ajax({
		type: "POST",
		url: nameURL,
		dataType: "json",
		data: JSON.stringify({theme: "default", sizeLimit: 21}),
		success: result => {state.name = result.nickname;renderCallback(state);}
	});

var newName = (state, renderCallback) =>{
	nameAjax(state, renderCallback);
};

var newAvatar = (state, renderCallback) =>{
	state.avatar = `https://robohash.org/${state.avatar}`;
	renderCallback(state);
};

var adviceAjax = (state, renderCallback) => $.ajax({
		type: "GET",
		url: adviceURL,
		dataType: "json",
		success: result => {state.advice = result.slip.advice;renderCallback(state);}
	});
var newAdvice = (state, renderCallback) =>{
	adviceAjax(state, renderCallback);
};

var newCharacter = (state, callBack) =>{
	var nothing = (s)=>{};
	newAvatar(state, nothing);
	$.when(nameAjax(state, nothing), adviceAjax(state, nothing)).done((state1, state2) => {callBack(state);});
};

var renderCharacter = state =>{ 
	avatarHolder.attr('src', state.avatar);
	nameHolder.text(state.name);	
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
	
	allButton.click(e => {
		newCharacter(state, renderCharacter);
	})
};

$(function(){
	setupHandlers();
	newCharacter(state, renderCharacter);
});