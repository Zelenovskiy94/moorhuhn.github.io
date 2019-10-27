'use strict'

window.onload = function() {
//основные элементы	
var main = document.getElementById('main');	
var container = document.getElementById('container');
var mainMenu = document.getElementById('main-menu');
var bullet = document.getElementsByClassName('bullet');

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;


main.style.width = clientWidth * 0.95 + 'px';
main.style.height = clientHeight * 0.95 + 'px';
if(clientWidth < 900) {
	main.style.width = clientWidth + 'px';
	main.style.height = clientHeight + 'px';
}
var load = document.getElementById('load');
	load.style.display = 'none';
	main.style.display = 'block'

var mainWidth = main.offsetWidth;
var mainHeight = main.offsetHeight;
mainMenu.style.left = (mainWidth/2 - mainMenu.offsetWidth/2) + 'px'

var posContainer = (container.offsetWidth-mainWidth)/2;
container.style.left = -posContainer + 'px';
var translateContainer = 0;

//элементы управления
var start = document.getElementById('start');
var pause = document.getElementById('pause');

var pauseStatus = false; //пауза не стоит
var menuStatus = true; //меню открыто
var menuElemStatus = {
	startMenu: true,
	pauseMenu: false,
	endMenu: false
}
var play = document.getElementById('play');


//элементы меню
var continueBtn = document.getElementById('continueBtn');
var newGameBtn = document.getElementById('newGameBtn');
var btnHighscores =  document.getElementById('btnHighscores');
var tableHighscores = document.getElementById('tableHighscores');
var highscoresClose = document.getElementById('highscoresClose');
var result = document.getElementById('result');
var inputName = document.getElementById('inputName');
var acceptName = document.getElementById('acceptName');
var name = document.getElementById('name');
var userName = document.getElementById('userName');
var changeName = document.getElementById('changeName');
if(localStorage.gameName !== undefined){
	name.textContent = 'Hello, ' + JSON.parse(localStorage.gameName) + '!'
	userName.style.display = 'flex';
}
var btnControl = document.getElementById('btnControl');
var control = document.getElementById('control');
var controlClose = document.getElementById('controlClose')


var pathTree = document.getElementById('pathTree');
var pieceTree = document.getElementById('pieceTree');
var tree = document.getElementById('tree');

var scoreMain =document.getElementById('scoreMain');
var score = 0;
var timerCount = 0;
newBullets();

//Подгрузка аудио
var audioShot = new Audio('media/audio/shot.mp3')
var audioTree = new Audio('media/audio/hit-on-tree.mp3');
var audioEndBullet = new Audio('media/audio/endBullet.mp3');
var audioRecharge = new Audio('media/audio/recharge.mp3');
var audioHit = new Audio('media/audio/hit.mp3')

pathTree.onclick = function(event) {
	if(bullet.length !== 0) {
	var pieceTree = document.getElementById('pieceTree');
	var i = 1
	setInterval(function(){i-= 0.05; clickOnTree.style.opacity = i + ''}, 100)
	setTimeout(function() {container.removeChild(clickOnTree)}, 2000);

	var clickPosY = event.clientY-pieceTree.getBoundingClientRect().top;
	var clickPosX = event.clientX-pieceTree.getBoundingClientRect().left;
	
	var clickOnTree = document.createElement('div');
	container.appendChild(clickOnTree);
	clickOnTree.classList.add('foliage');
	
	bulletHole(clickPosX, clickPosY);
	audioTree.currentTime = 0;
	audioTree.play()
	}	
}

var requestID = undefined;
var setIntervalID = 0;
var setIntervalID2 = 0


var speedNewBird = 1500;
start.onclick = function(){
	
//обновить/обнулить параметры
	container.style.left = -posContainer + 'px';
	pause.style.display = 'block';
	play.style.display = 'none';
	btnControl.style.display = 'block'
	pauseStatus = false;
	menuStatus = false;
	menuElemStatus.startMenu = false;
	scoreMain.textContent = 'Score: 0';
	clearInterval(setIntervalID); 
	setIntervalID = 0;
	clearInterval(setIntervalID2); 
	setIntervalID2 = 0;
	while (bullet[0]) {
    	bullet[0].parentNode.removeChild(bullet[0])
	}
	newBullets()


	timerCount = 90; //счетчик времени 

	mainMenu.classList.add('show-hide-menu');
	mainMenu.style.transform = 'translate(0, -1000px)';
	let bird = document.getElementsByClassName('bird')
	if(bird.length !== 0) {
		for(let i = 0; i<bird.length; i++) {
			var a = bird[i]
			container.removeChild(a)
		}
	}

	setIntervalID = setInterval(newBird, speedNewBird);
	setIntervalID2 = setInterval(timerFunc, 1000);
	audioShot.currentTime = 0;
	audioShot.play()
}

changeName.addEventListener('click', function() {
	userName.style.display = 'none';
	inputName.style.display = 'block';
	})

pause.addEventListener('click', function() {
	pause.style.display = 'none';
	play.style.display = 'block';
	pauseStatus = true;
	menuStatus = true;
	menuElemStatus.startMenu = false;
	menuElemStatus.pauseMenu = true;
	menuElemStatus.endMenu = false;

	clearInterval(setIntervalID); 
	setIntervalID = 0;
	clearInterval(setIntervalID2); 
	setIntervalID2 = 0;
	cancelAnimationFrame(requestID);
	requestID = undefined;

	mainMenu.style.transform = 'translate(0, 0)';

	start.textContent =  'New Game';
	btnHighscores.style.display = 'none';

	continueBtn.style.display = 'block';
	result.style.display = 'none';
	

});

continueBtn.addEventListener('click', function() {
	let bird = document.getElementsByClassName('bird')
	if(bird.length !== 0) {
		for(let i = 0; i<bird.length; i++) {
			var a = bird[i]
			container.removeChild(a)
		}
	}
	pause.style.display = 'block';
	play.style.display = 'none';
	mainMenu.style.transform = 'translate(0, -1000px)';
	pauseStatus = false;
	menuStatus = false;
	menuElemStatus.startMenu = false;
	menuElemStatus.pauseMenu = false;
	menuElemStatus.endMenu = true;

	setIntervalID = setInterval(newBird, speedNewBird);
	setIntervalID2 = setInterval(timerFunc, 1000);
	audioShot.currentTime = 0;
	audioShot.play()
})

btnHighscores.addEventListener('click', function() {
	if(menuElemStatus.startMenu === true) {
		start.style.display = 'none';
		btnControl.style.display = 'none';
		btnHighscores.style.display = 'none';
		tableHighscores.style.display = 'flex';
		refreshRecords();
		if(localStorage.gameName !== undefined){
			userName.style.display = 'none';
		}
	}
	if(menuElemStatus.endMenu === true) {
		start.style.display = 'none';
		result.style.display = 'none';
		btnHighscores.style.display = 'none';
		inputName.style.display = 'none';
		refreshRecords();
		if(localStorage.gameName !== undefined){
			userName.style.display = 'none';
		}
		tableHighscores.style.display = 'flex';
	}
	audioShot.currentTime = 0;
	audioShot.play()
});

highscoresClose.addEventListener('click', function() {
	if(menuElemStatus.startMenu === true) {
		start.style.display = 'block';
		btnControl.style.display = 'block';
		btnHighscores.style.display = 'block';
		tableHighscores.style.display = 'none';
		if(localStorage.gameName !== undefined){
			userName.style.display = 'flex';
		}
	}
	if(menuElemStatus.endMenu === true) {
		start.style.display = 'block';
		result.style.display = 'block';
		btnHighscores.style.display = 'block';
		tableHighscores.style.display = 'none';
		if(localStorage.gameName !== undefined){
			userName.style.display = 'flex';
		}
	}
	audioShot.currentTime = 0;
	audioShot.play()
})


btnControl.addEventListener('click', function() {
	if(menuElemStatus.startMenu === true) {
		start.style.display = 'none';
		btnControl.style.display = 'none';
		btnHighscores.style.display = 'none';
		control.style.display = 'flex';
		refreshRecords();
		if(localStorage.gameName !== undefined){
			userName.style.display = 'none';
		}
	}
	if(menuElemStatus.endMenu === true) {
		start.style.display = 'none';
		result.style.display = 'none';
		btnHighscores.style.display = 'none';
		inputName.style.display = 'none';
		refreshRecords();
		if(localStorage.gameName !== undefined){
			userName.style.display = 'none';
		}
		control.style.display = 'flex';
	}

	if(menuElemStatus.pauseMenu === true) {
		start.style.display = 'none';
		continueBtn.style.display = 'none';
		btnControl.style.display = 'none';
		control.style.display = 'flex';
	}

	audioShot.currentTime = 0;
	audioShot.play()
});

controlClose.addEventListener('click', function() {
	if(menuElemStatus.startMenu === true) {
		start.style.display = 'block';
		btnControl.style.display = 'block';
		btnHighscores.style.display = 'block';
		control.style.display = 'none';
		if(localStorage.gameName !== undefined){
			userName.style.display = 'flex';
		}
	}
	if(menuElemStatus.endMenu === true) {
		start.style.display = 'block';
		result.style.display = 'block';
		btnHighscores.style.display = 'block';
		inputName.style.display = 'block';
		control.style.display = 'none';
		if(localStorage.gameName !== undefined){
			userName.style.display = 'flex';
		}
	}
	if(menuElemStatus.pauseMenu === true) {
		start.style.display = 'block';
		continueBtn.style.display = 'block';
		btnControl.style.display = 'block';
		control.style.display = 'none';
	}

	audioShot.currentTime = 0;
	audioShot.play()
})

window.onblur = function () {clearInterval(setIntervalID); setIntervalID = 0;};

var bird = document.getElementsByClassName('bird');
var aim = document.getElementById('aim');


var bullet = document.getElementsByClassName('bullet');
main.addEventListener('click', function(event) {

	if(bullet.length > 0 && !pause.contains(event.target) && !play.contains(event.target) 
		&& !pauseStatus && container.contains(event.target) && !menuStatus) {
	bullet[bullet.length-1].classList.add('leave-bullet');
	setTimeout(function () {main.removeChild(bullet[bullet.length-1])}, 200);
	audioShot.currentTime = 0;
	audioShot.play()
	if ( navigator.vibrate ) { // есть поддержка Vibration API?
        window.navigator.vibrate(100);
    }
}
	if(bullet.length == 0) {
		audioEndBullet.currentTime = 0;
		audioEndBullet.play()	
	}
});

//перезарядка даблтап
(function($){

  $.event.special.doubletap = {
    bindType: 'touchend',
    delegateType: 'touchend',

    handle: function(event) {
      var handleObj   = event.handleObj,
          targetData  = jQuery.data(event.target),
          now         = new Date().getTime(),
          delta       = targetData.lastTouch ? now - targetData.lastTouch : 0,
          delay       = delay == null ? 300 : delay;

      if (delta < delay && delta > 30) {
        targetData.lastTouch = null;
        event.type = handleObj.origType;
        ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function(property) {
          event[property] = event.originalEvent.changedTouches[0][property];
        })

        // let jQuery handle the triggering of "doubletap" event handlers
        handleObj.handler.apply(this, arguments);
      } else {
        targetData.lastTouch = now;
      }
    }
  };

})(jQuery);

$('#main').on('doubletap',function(event){
	if(bullet.length === 0) {
		audioRecharge.currentTime = 0;
		audioRecharge.play()		
		newBullets();
	}
  });

//клик правой кнопкой мыши. если кол-во патрон равно 0 - перезарядить
main.oncontextmenu = function () {
	if(bullet.length === 0) {
	audioRecharge.currentTime = 0;
	audioRecharge.play()		
	newBullets();
	}
	return false;
}

var aimH = {
	radius: 15,
	posX: 0,
	posY: 0,
	update: function () {
		aim.style.top = this.posX + 'px';
		aim.style.left = this.posY + 'px';
	}
};
main.onmousemove = function(event) {
	aimH.posX = event.clientY-main.getBoundingClientRect().top - aimH.radius;
	aimH.posY = event.clientX-main.getBoundingClientRect().left - aimH.radius;
	aimH.update()
}

function timerFunc() {
	menuElemStatus.startMenu = false;
	menuElemStatus.endMenu = true;

	timerCount -= 1;
	var numberOfMinute = 1;
	var timer = document.getElementById('timer');
	timer.textContent =numberOfMinute + ' : ' + timerCount;
	if(timerCount < 60){
		numberOfMinute = 0;
		timer.textContent = numberOfMinute + ' : ' + timerCount;
		if(timerCount < 10) {
			timer.textContent = numberOfMinute + ' : 0' + timerCount;
		}
	} else {
		timer.textContent = numberOfMinute + ' : ' + (timerCount - 60);
		if(timerCount- 60 < 10) {
			timer.textContent = numberOfMinute + ' : 0' + (timerCount - 60);
		}
	}
	if(timerCount == 0 ) {
		clearInterval(setIntervalID); 
		setIntervalID = 0;
		clearInterval(setIntervalID2); 
		setIntervalID2 = 0;
		cancelAnimationFrame(requestID);
		requestID = undefined;
		menuStatus = true;
		mainMenu.style.transform = 'translate(0, 0)';
		start.textContent =  'New Game';
		result.style.display = 'block';
		result.textContent = 'Your result:  ' +  score + ' points ';
		changeName.style.display = 'none';
		btnControl.style.display = 'none';
		if(localStorage.gameName !== undefined){
			name.textContent = JSON.parse(localStorage.gameName) + '!'
			userName.style.display = 'flex';
			sendRecords()
			refreshRecords();
		} else {
			inputName.style.display = 'flex';
		}
	}
	if(timerCount == 20) {
		setIntervalID = setInterval(newBird, 650)
	}	
}

acceptName.addEventListener('click', function(event){
	var gameName = document.getElementById('gameName')
	if(gameName.value !== '') {
		localStorage.gameName = JSON.stringify(gameName.value);
		gameName.value = '';
		inputName.style.display = 'none';
		sendRecords();
		refreshRecords();
	}
})

var containerTranslate = {
	speed: 0,
	translate: 0,
	update: function() {
		container.style.transform =  'translate(' + this.translate +'px)';
	}
}
containerTranslate.update()




function newBird () {
	requestID = undefined;
	var elem = document.createElement('img');
	elem.setAttribute('src', 'media/moorhuhn.gif');
	elem.className = 'bird';
	container.appendChild(elem);

	//с какой стороны появиться птица
	var directionBird = [-(elem.offsetWidth), container.offsetWidth];
	var randomDirection = directionBird[Math.floor(Math.random()*directionBird.length)];

	var randomPosY = randomInteger(0, 0.8 * mainHeight);
	var pointBird = 0;
	var scaleArray = [];
	var zIndex = '1';
	var spanPoint;
	if(randomPosY <= 100) {
		scaleArray = [0.3,0.4,0.5,0.6]
	} else if(randomPosY > 100 && randomPosY <= 200 ) {
		scaleArray = [0.5,0.6,0.7,0.9,1]
	} else if(randomPosY > 200 && randomPosY <= 300 ) {
		scaleArray = [0.7,0.8,0.9,1]
	} else if(randomPosY > 300 && randomPosY <= 350 ) {
		scaleArray = [0.8,0.9,1]
	} else if(randomPosY > 350 ) {
		scaleArray = [1]
	} 
	var scaleBird = scaleArray[Math.floor(Math.random()*scaleArray.length)]
	if(scaleBird > 0.6 && randomPosY > 100) {
		zIndex = '3';
	}

	if(scaleBird <= 0.5) {
		pointBird =25;
	} else if(scaleBird > 0.5 && scaleBird <= 0.7) {
		pointBird =15;
	} else if(scaleBird > 0.7 && scaleBird <= 0.9) {
		pointBird =10;
	}  else if(scaleBird > 0.9) {
		pointBird =5;
	}
var speedArr = [0.5,1,1.5,2,2.5];
var randomSpeed = speedArr[Math.floor(Math.random()*speedArr.length)];
	
	var birds = {
	scale: scaleBird,	
	speedX: randomSpeed,
	speedY: 0,
	zIndex: zIndex,
	posY: randomPosY,
	posX: randomDirection,
	posStart: randomDirection,
	rotate: '',
	points:  pointBird,
	update: function () {
		elem.style.transform = 'scale(' + this.scale + ')' + this.rotate;
		elem.style.zIndex = this.zIndex;
		elem.style.left = this.posX + 'px';
		elem.style.top = this.posY + 'px';
	}	
 };

var translatePoint = 0
function tick() { 

//перемещение сонтейнера
	containerTranslate.update()
	containerTranslate.translate += containerTranslate.speed;
			if(containerTranslate.translate >= posContainer) {
				containerTranslate.translate = posContainer;
			} else if(containerTranslate.translate <= -posContainer) {
				containerTranslate.translate = -posContainer;
			}

if(clientWidth > 850) {
	if( aimH.posY > mainWidth-30) {
		containerTranslate.speed = -3;

	} else if(aimH.posY < 10) {
		containerTranslate.speed = 3;	
	} else {
		containerTranslate.speed = 0;	
	}	
} else {
	var left = document.getElementById('toLeft');
	var right = document.getElementById('toRight');
	left.addEventListener('touchstart', function(){
		containerTranslate.speed = 3;

	})
	right.addEventListener('touchstart', function(){
		containerTranslate.speed = -3;
	})
	left.addEventListener('touchend', function(){
		containerTranslate.speed = 0;

	})
	right.addEventListener('touchend', function(){
		containerTranslate.speed = 0;
	})
}	

	//в зависимости с какой стороный появляються птицы, применить анимацию:
	if( birds.posStart < 0) {
		birds.posX += birds.speedX;
		birds.rotate = 'rotateY(180deg)'
	 
	} else {
		birds.posX -= birds.speedX;
	};
	elem.ondragstart = function() {
  		return false;
	};

	//выстрел по птицам и их падение
	birds.posY += birds.speedY


	elem.onclick = function (){
		if(bullet.length !== 0) {
		elem.setAttribute('src','media/moorhuhnFall.png');
		elem.classList.add('fall-bird');
		birds.speedY = 3;
		birds.speedX = 0;

		var pointY = birds.posY + elem.offsetHeight/2;
		var pointX = birds.posX + elem.offsetWidth/2;
		
		spanPoint = document.createElement('span');
		container.appendChild(spanPoint);
		spanPoint.classList.add('birds-point')
		spanPoint.style.top = pointY + 'px';
		spanPoint.style.left = pointX + 'px';
		spanPoint.textContent = '+' + birds.points;
		score += birds.points
		scoreMain.textContent = 'Score: ' + score;

		audioHit.currentTime = 0;
		setTimeout(function(){audioHit.play()}, 50)
		
	  }
	};
	if(spanPoint !== undefined) {
		translatePoint -= 1
		spanPoint.style.transform = 'translateY(' + translatePoint  + 'px)'
		
	}


	birds.update()
	 
       requestID = window.requestAnimationFrame(tick, elem);
   
	//если птицы выходят за пределы контейнера - удалить ее
	if(birds.posX > container.offsetWidth || birds.posX < 0 - elem.offsetWidth 
		|| birds.posY > randomPosY+140 || birds.posY > mainHeight 
		|| pauseStatus == true || timerCount == 0){
			
		container.removeChild(elem);
			
			if(spanPoint !== undefined){
		container.removeChild(spanPoint)
			}
		window.cancelAnimationFrame(requestID);
	}

 };
return tick()
};



function newBullets() {
	var pos = 30
		for(var i = 1; i <= 8; i++) {
		var bullet = document.createElement('div');
		main.appendChild(bullet);
		bullet.className = 'bullet';
		bullet.style.right = pos + 'px';
		pos += 25;
	}
};


function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

// Ajax таблоица рекордов

var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var records; // элемент массива - {name:'Иванов',mess:'Привет'};
var updatePassword;
var stringName='Zelenovskiy_tableRecords';

// показывает все сообщения из records на страницу
function showRecords() {
    var str='';
    for ( var m=0; m<records.length; m++ ) {
        var record=records[m];
        str+="<span class='clearfix'><b>"+escapeHTML(record.name)+":</b>"
            +"<i>" + escapeHTML(record.score)+"</i></span>";
    }
    document.getElementById('listHighscores').innerHTML=str;
}

//проверка на текст и преобразовывает спец символы в строку
function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

// получает сообщения с сервера и потом показывает
function refreshRecords() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : stringName },
            cache : false,
            success : readReady,
        }
    );
}

function readReady(callresult) { // сообщения получены - показывает
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        records=[];
        if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            records=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
            if ( !Array.isArray(records) )
                records=[];
        }
        showRecords();
    }
}

// получает сообщения с сервера, добавляет новое,
// показывает и сохраняет на сервере
function sendRecords() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady
        }
    );
}

// сообщения получены, добавляет, показывает, сохраняет
function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        records=[];
        if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            records=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор?
            if ( !Array.isArray(records) )
                records=[];
        }
        var playerName=JSON.parse(localStorage.gameName);
        var points = score + '';
        records.push( { name:playerName, score:points } );
        records.sort(function(a, b){
            return b.score-a.score
        })
        if ( records.length>10 )
            records=records.splice(0, records.length-1);

        showRecords();

        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                    v : JSON.stringify(records), p : updatePassword },
                cache : false
            }
        );
    }
}




}//window.onload

