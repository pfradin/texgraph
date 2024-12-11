// SVGAnimation.js
// Patrick FRADIN 2024/12/08
// utilisé par le document index.html des animations

        var imin = info["nbMin"]; // index minimal des images (1 ou 0)
        var imax = info["nbMax"]; // index maximal des images
        var ext = info["ext"]; // extension des images
        var tempo = info["delai"]; // delai en millisecondes
        var index = 1; // index de l'image courante, on commence à la première
        var indexLoad = 1; // index de l'image en cours de chargement
        var images = []; // stockage des images
        var bgImg = document.getElementById("bg");
        var image = document.getElementById("img"); // container de l'image courante
        var titre = document.getElementById("anim_titre"); // container de l'image courante
        var bout_boucle = document.getElementById("Bt_loop");
        var bout_palin = document.getElementById("Bt_palin");
        var bout_play = document.getElementById("Bt_play");
        var ready = false; // chargement des images terminé ou non
        var playing = false; // animation en cours ou non
        var boucle = false; //animation en boucle ou non
        var palindrome = false; // mode palindrome ou non
        var pas = 1; // par défaut on avance d'une image par frame
        var first = new Image(); // pour la première image
        var pad = 3; //nombre de colonnes pour l'affichage des numéros d'images
        var chem = "img/"; // accès images
        var prefix = "image"; // préfixe des images
                
        function padNombre(n, l) { // affichage du nombre n sur l colonnes
            var str = n.toString();
            while (str.length < l) { str = '0' + str; }
            return str;
        } 
        
        function setOnLoad() { // au chargement de chaque image
            if (indexLoad == imax) {
                ready = true;
            }
            else {indexLoad++;}
        }
        
        function afficher(i) { // gère le défilement des images
            var stop = false;
            if(i>imax) {
                if (!playing) {i = 1;} //on a fait next
                else {if (palindrome) {i = imax-1; pas = -1;} // marche arrière
                     else {if (boucle) { i = 1 } // pour boucler
                           else {stop = true;}
                          }
                     }  
                } //gestion des bornes
            else if (i<1) {
                if (!playing) {i = imax;} //on a fait prev
                else { i = 1;
                       pas = 1; // on était en marche arrière
                       stop = !boucle
                     }  
                }
            if (!stop) {
                index = i; // index courant
                image.src = images[index].src;} //mise à jour de l'image
            else {
                playing = false; // on arrête l'animation
                bout_play.classList.remove("enfoncer"); // on relâche le bouton play

            }
            if(playing) { // si on est en animation
                setTimeout(function(){afficher(i+pas)}, tempo); // on passe à l'image suivante après temporisation
            }
        }  
        
        function avancer() {
            if(!playing)
                afficher(index+1);
        }
        
        function reculer() {
            if(!playing) 
                afficher(index-1);
        }
        
        function toLast() {
            if(!playing) 
                afficher(imax);
        }
        
        function toFirst() {
            if(!playing) 
                afficher(1);
        }

        function boucler() {
            boucle = !boucle;
            if(boucle) {
                bout_boucle.classList.add("enfoncer"); // bouton loop enfoncé
                }
            else { 
                bout_boucle.classList.remove("enfoncer"); // bouton loop relâché
                }
        }
        
        function palin() {
            palindrome = !palindrome;
            if(palindrome) {
                bout_palin.classList.add("enfoncer"); // bouton palin enfoncé
                }
            else { 
                bout_palin.classList.remove("enfoncer"); // bouton palin relâché
                pas = 1
                }
        }        
        
        function accelerer() {
            if(tempo>30) 
                tempo /= 1.414;
        }
        
        function ralentir() {
            if(tempo<2000)
                tempo *= 1.414;
        }        
        
        function demarrer() {
            if(ready && !playing) {
                if(index==imax)
                    index = imin;
                playing = true;
                bout_play.classList.add("enfoncer"); // bouton play enfoncé
                afficher(index)
            }
            else if (ready && playing) arreter();
        }

        function arreter() {
            if(playing) {
                playing = false;
                bout_play.classList.remove("enfoncer"); // bouton play relâché
                afficher(index)
            }
        }
        
        if(imin == 0) { //on a une image000.*, c'est le fond
            var fond = new Image; 
            fond.onload = function () {
                bgImg.src = fond.src;
                }
            fond.src = chem + prefix + "000." + ext;
            imin = 1 
            }
        else {
            bgImg.style.display = "none";  // on cache l'image de fond
            image.style.backgroundColor = "white";  // par défaut le fond est blanc dans texgraph
            }
        titre.innerHTML = info["titre"]; // mise à jour du titre
        first.onload = function(){
            document.getElementById("anim").style.width = first.width+"px"; //on adapte la largeur du container
            document.getElementById("frames").style.width = (first.width)+1+"px"; //on adapte la hauteur de frame
            document.getElementById("frames").style.height = (first.height)+1+"px"; //on adapte la hauteur de frame            
            image.src = first.src; // affichage de la première image
            document.getElementById("anim_message").style.display = "none"; // on cache la div du message
            }
        first.src = chem + prefix + padNombre(1,pad) + '.' + ext; // première image
        for(var i = 1; i <= imax; i++) { // chargement des images
            images[i]        = new Image();
            images[i].onload = setOnLoad();
            images[i].src    = chem+prefix + padNombre(i,pad) + '.' + ext;
        }
