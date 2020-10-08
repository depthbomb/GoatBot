/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2020 Caprine Logic - https://caprine.net
|
|	This library is free software; you can redistribute it and/or
|	modify it under the terms of the GNU Lesser General Public
|	License as published by the Free Software Foundation; either
|	version 2.1 of the License, or (at your option) any later version.
|
|	This library is distributed in the hope that it will be useful,
|	but WITHOUT ANY WARRANTY; without even the implied warranty of
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

module.exports = client => {
	String.prototype.limit = function(maxLength = 2000) {
		const string = this;
		return string.length > maxLength ? `${string.substr(0, maxLength - 3)}...` : string;
	};

	String.prototype.parseTimeFormat = function() {
		const format          = this;
		const timeFormatRegex = /(\d+w)?(\d+d)?(\d+h)?(\d+m)?/i;
		const converter       = { m: 60, h: 60*60, d: 60*60*24, w: 60*60*24*7 };
		if (timeFormatRegex.test(format)) {
			let matches = timeFormatRegex.exec(format);
			//	Remove first item from matches (full group match, useless in this case)	
			matches.shift();
			//	Remove all undefined/blank/false values
			matches = matches.filter(Boolean);

			let duration = 0;
			const now = client.timestamp();
			for (let match of matches) {
				const dur = match.replace(/[0-9]/g, '');
				const num = parseInt(match.replace(/\D/g, ''));
				const out = num * converter[dur];
				duration = (duration + out);
			}
			return (now + duration);
		} else {
			return null;
		}
	};


	String.prototype.toProperCase = function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	};


	String.prototype.usToSp = function() {
		return this.replace(/_/g, ' ');
	};


	String.prototype.scramble = function() {
		let a = this.split(''),
		n = a.length;

		for (let i = n - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join('');
	};


	String.prototype.toProperCase = function() {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};


	Array.prototype.allValuesSame = function() {
		for(let i = 1; i < this.length; i++)
		{
			if(this[i] !== this[0])
				return false;
		}
		return true;
	};


	Array.prototype.shuffle = function() {
		let currentIndex = this.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this[currentIndex];
			this[currentIndex] = this[randomIndex];
			this[randomIndex] = temporaryValue;
		}

		return this;
	};

	Number.prototype.reduce = function(percent, fix = false) {
		let num = (this - this * percent);
		if (fix) num = num.toFixed(2);
		return num;
	};


	Number.prototype.increase = function(percent, fix = false) {
		let num = (this + this * percent);
		if (fix) num = num.toFixed(2);
		return num;
	};


	// `await client.wait(1000);` to "pause" for 1 second.
	client.wait = require('util').promisify(setTimeout);
};