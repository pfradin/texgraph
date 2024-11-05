// Code javascript adapté des exemples produits par JM Sarlat et M. Chupin sur le site Syracuse
// exemple : https://melusine.eu.org/syracuse/G/svganimation/ellipsographe/animation.html
function SVGPlayerButtons(a) {
  Controle.call(this,a);
  SVGPlayerButtons.prototype.connect = Controle.prototype.connect;
  this.playBtn = true;
  this.stopBtn = true;
  this.speedupBtn = true;
  this.slowdownBtn = true;
  this.startBtn = true;
  this.endBtn = true;
  this.nextBtn = true;
  this.previousBtn = true;

  this.playBtnName      = '<img src="../player-1.svg" class="boutonSVG"/>';
  this.stopBtnName      = '<img src="../player-2.svg" class="boutonSVG"/>';
  this.startBtnName     = '<img src="../player-6.svg" class="boutonSVG"/>';
  this.endBtnName       = '<img src="../player-5.svg" class="boutonSVG"/>';
  this.nextBtnName      = '<img src="../player-3.svg" class="boutonSVG"/>';
  this.previousBtnName  = '<img src="../player-4.svg" class="boutonSVG"/>';
  this.speedupBtnName   = '<img src="../player-8.svg" class="boutonSVG"/>';
  this.slowdownBtnName  = '<img src="../player-7.svg" class="boutonSVG"/>';
}

SVGPlayerButtons.prototype = {
  style: function(sty){
    if(sty == "full"){
      this.playBtn = true;
      this.stopBtn = true;
      this.speedupBtn = true;
      this.slowdownBtn = true;
      this.startBtn = true;
      this.endBtn = true;
      this.nextBtn = true;
      this.previousBtn = true;
    }
  },
  names: function(lang){
    if(lang == "en"){
      this.playBtnName = "Play";
      this.stopBtnName = "Stop";
      this.startBtnName = "First";
      this.endBtnName = "Last";
      this.nextBtnName = "Next";
      this.previousBtnName = "Previous";
      this.speedupBtnName = "+";
      this.slowdownBtnName = "-";
    }
  }
}

// Surcharge de la méthode [Initialisation]
SVGPlayerButtons.prototype.Initialisation = function() {
  var a = this.a;
  var self = this.me;
  a.image.style.display = 'inline';
  a.message.parentNode.removeChild(a.message);
  if(this.playBtn == true){
    var play = document.createElement('button');
    play.className = "SVGplay playBtn"; // ajout de classe
    play.innerHTML = this.playBtnName; // texte
    play.onclick = function(){if (!a.action){ a.action = true; a.rotate(self.a)}};
    a.boutons.appendChild(play);
  }
  if(this.stopBtn == true){
    var stop = document.createElement('button');
    stop.className = "SVGplay stopBtn";
    stop.innerHTML = this.stopBtnName;
    stop.onclick = function(){a.action = false; };
    a.boutons.appendChild(stop);
  }
  if(this.slowdownBtn == true){
    var moins = document.createElement('button');
    moins.className = "SVGplay slowdownBtn";
    moins.innerHTML = this.slowdownBtnName;
    moins.onclick = function(){a.delai = a.delai > 2000 ? 2000 : a.delai * 1.414};
    a.boutons.appendChild(moins);
  }
  if(this.speedupBtn == true){
    var plus = document.createElement('button');
    plus.className = "SVGplay speedupBtn";
    plus.innerHTML = this.speedupBtnName;
    plus.onclick = function(){a.delai = a.delai < 30 ? 30 : a.delai / 1.414};
    a.boutons.appendChild(plus);
  }  
  if(this.startBtn == true){
    var debut = document.createElement('button');
    debut.className = "SVGplay startBtn";
    debut.innerHTML = this.startBtnName;
    debut.onclick = function(){a.action = false; a.first(self.a)};
    a.boutons.appendChild(debut);
  }
  if(this.endBtn == true){
    var fin = document.createElement('button');
    fin.className = "SVGplay endBtn";
    fin.innerHTML = this.endBtnName;
    fin.onclick = function(){a.action = false; a.last(self.a)};
    a.boutons.appendChild(fin);
  }
  if(this.previousBtn == true){
    var precedent = document.createElement('button');
    precedent.className = "SVGplay previousBtn";
    precedent.innerHTML = this.previousBtnName;
    precedent.onclick = function(){a.action = false; a.previous(self.a)};
    a.boutons.appendChild(precedent);
  }
  if(this.nextBtn == true){
    var suivant = document.createElement('button');
    suivant.className = "SVGplay nextBtn";
    suivant.innerHTML = this.nextBtnName;
    suivant.onclick = function(){a.action = false; a.next(self.a)};
    a.boutons.appendChild(suivant);
  }
}
