        var imin = info["nbMin"]; // index minimal des images
        var imax = info["nbMax"]; // index maximal des images
        var ext = info["ext"]; // extension des images
        var tempo = info["delai"]; // delai en millisecondes
        var index = imin; // index de l'image courante, on commence à la première
        var indexLoad = imin; // index de l'image en cours de chargement
        var images = []; // stockage des images
        var image = document.getElementById("img"); // container de l'image courante
        var titre = document.getElementById("anim_titre"); // container de l'image courante
        var bout_boucle = document.getElementById("Bboucle");
        var bout_play = document.getElementById("play");
        var ready = false; // chargement des images terminé ou non
        var playing = false; // animation en cours ou non
        var boucle = false; //animation en boucle ou non
        var first = new Image(); // pour la première image
        var pad = 3; //nombre de colonnes pour l'affichage des numéros d'images
        var prefix = "img/image"; // préfixe des images
                
        function padNombre(n, l) { // affichage du nombre n sur l colonnes
            var str = n.toString();
            while (str.length < l) { str = '0' + str; }
            return str;
        } 
        
        function setOnLoad() { // au chargement de chaque image
            if (indexLoad == imax) {ready = true;}
            else {indexLoad++;}
        }
        
        function afficher(i) { // gère le défilement des images
            if(i>imax) {i = imin;} //gestion des bornes
            else if (i<imin) {i = imax;}
            index = i; // index courant
            image.src = images[index].src; //mise à jour de l'image
            if(i==imax && playing && !boucle) {// si on est à la fin, en animation et pas en boucle
                playing = false; // on arrête l'animation
                bout_play.classList.remove("enfoncer"); // on relâche le bouton play
            }
            if(playing) { // si on est en animation
                setTimeout(function(){afficher(i+1)}, tempo); // on passe à l'image suivante après temporisation
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
                afficher(imin);
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
         
        titre.innerHTML = info["titre"]; // mise à jour du titre
        first.onload = function(){
            document.getElementById("anim").style.width = first.width+"px"; //on adapte la largeur du container
            image.src = first.src; // affichage de la première image
            }
        first.src = prefix + padNombre(imin,pad) + '.' + ext; // première image
        for(var i = imin; i <= imax; i++) { // chargement des images
            images[i]        = new Image();
            images[i].onload = setOnLoad();
            images[i].src    = prefix + padNombre(i,pad) + '.' + ext;
        }
        document.getElementById("anim_message").style.display = "none"; // on cache la div du message
