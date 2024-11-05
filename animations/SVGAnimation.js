// Code javascript adapté des exemples produits par JM Sarlat et M. Chupin sur le site Syracuse
// exemple : https://melusine.eu.org/syracuse/G/svganimation/ellipsographe/animation.html
// === Fonctions d'appui -------------------------------------------------------
function addListener(e,b,h) {
  if (e.addEventListener)
    e.addEventListener(b,h,false);
  else if (e.attachEvent)
    e.attachEvent('on' + b, h);
}

function padNombre(n, l) {
  var str = n.toString();
  while (str.length < l) { str = '0' + str; }
  return str;
}

// -----------------------------------------------------------------------------
// === Prototype Animation -----------------------------------------------------
// -----------------------------------------------------------------------------
                        // Constructeur //
function Animation(id, prefixe) {
  this.me = this;

  // --- Propriétés à fixer à l'initialisation ---------------------------------
  this.id = id;            // id de l'animation dans le corps du document
  this.prefixe = prefixe;  // préfixe des fichiers de l'animation (hors indice)
  this.imin = info["nbMin"];         // index minimal des images
  this.imax = info["nbMax"];         // index maximal des images
  this.ext = info["ext"];          // extension des images
  
  // --- Propriétés à modifier éventuellement ----------------------------------
  this.pad = 3;            // padding éventuel des indices
  this.delai = info["delai"];         // delai entre deux images
  
  // --- Propriétés d'usage ----------------------------------------------------
  this.images = [];        // Stockage des images de l'animation
  this.titre = "";
  this.container = "";     // Le container de l'animation, identifié par son id
  this.image = "";         // Le container de l'image courante de l'animation
  this.message = "";       // Le container du message
  this.boutons = "";       // Le container des boutons 
  this.action = false;     // L'état de l'animation
  this.index = 0;          // Index courant de l'image de l'animation
  this.imgload = 0;        // Compteur d'images téléchargées
  this.ready = false;      // Animation prête ou non
}

// --------------------------- Méthodes additionnelles -------------------------
Animation.prototype.setImage = function(i) {
  this.image.setAttribute('src', this.images[i].src);
}

Animation.prototype.click = function(e) {
  var self = this.me;
  self.action = !self.action; 
  self.rotate();
}

Animation.prototype.next = function() {
 if (this.index < this.imax) {
   this.setImage(++this.index);
 } else this.first();
}

Animation.prototype.previous = function() {
  if (this.index > this.imin) {
    this.setImage(--this.index);
  } else this.last();
}

Animation.prototype.first = function() {
  this.setImage(this.index = this.imin);
}

Animation.prototype.last = function() {
  this.setImage(this.index = this.imax);
}

Animation.prototype.rotate = function() {
  var self = this.me;
  if (self.action) {
    self.next();
    window.setTimeout(self.rotate.bind(self),self.delai);
  }
}

Animation.prototype.setOnload = function() {
  this.imgload++;
  if (this.imgload == this.imax) { this.ready = true;}
}

Animation.prototype.preloader = function() {
  var self = this.me;
  for(var i = this.imin; i <= this.imax; i++) {
    this.images[i]        = new Image();
    this.images[i].src    = this.prefixe + padNombre(i,this.pad) + '.' + this.ext;
    this.images[i].onload = self.setOnload(this);
  }
}

Animation.prototype.loopOnload = function() {
  var self = this.me;
  var first = new Image();
  this.imgload    = document.all ? 1 : 0;
  this.container = document.getElementById(this.id); 
  this.image     = document.getElementById("img"); //this.container.childNodes[1];
  this.message   = document.getElementById(this.id + '_message');
  this.boutons   = document.getElementById(this.id + '_boutons');
  this.titre  = document.getElementById(this.id + '_titre');
  this.boutons.innerHTML = "";
  this.message.innerHTML = "Chargement...";
  var s = this.container;
      im = this.image;
  first.onload = function(){
      s.style.width  = first.width+"px"; //largeur de l'image
      im.src = first.src;      
  }
  first.src = "img/image001."+this.ext;
  this.titre.innerHTML = info["titre"];
  //this.image.style.display = "none";
  //this.container.style.height = this.image.height+"px";
  this.preloader();
}

// -----------------------------------------------------------------------------
// === Prototype(s) Controle ---------------------------------------------------
// -----------------------------------------------------------------------------
// Prototype générique
// Il met en place le contrôle simple de l'animation par click sur l'image, les
// autres s'obtiendront par surcharge de la méthode [Initialisation]
function Controle(a) {
  this.me = this;
  this.a = a;           // Animation contrôlée
}
Controle.prototype = {
  Initialisation: function() {
      var anim = this.a;
      anim.image.style.display = 'inline';
      anim.message.innerHTML = "Vous pouvez lancer l'animation";
      anim.boutons = "";
      addListener(anim.image, 'click', anim.click.bind(anim));
    },
  connect: function() {
      var self = this.me;
      if (this.a.ready) {
        this.Initialisation();
      } else {
        setTimeout(self.connect,100);
      }
    }
};
