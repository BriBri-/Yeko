
    /////////////////////////////////
    ////////*****//DATE//*****///////
    /////////////////////////////////
    
    var datetime = {
        day : function(){return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][(new Date).getDay()]},
        date : function() {return (new Date).getDate()+(((new Date).getDate() == 1)?'er':'')},
        mounth : function() {return ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][(new Date).getMonth()]},
        year : function() {return (new Date).getFullYear()},
        fullDate : function() {return this.day()+' '+this.date()+' '+this.mounth()+' '+this.year()},
        hour : function(){return this.prefix((new Date).getHours())},
        min : function(){return this.prefix((new Date).getMinutes())},
        fullTime : function() {return this.hour()+':'+this.min()},
        begin: function() {
            h = parseInt(this.hour()); return (5 < h && h < 20) ? 'Bonjour' : 'Bonsoir';
        },
        finish : function() {
            h = parseInt(this.hour()); return (3 < h && h < 12) ? 'Bonne journée' : ( (12 < h && h < 18) ? 'Bon après-midi' : ( (18 < h && h < 23) ? 'Bonne soirée' : 'Bonne nuit' ) );
        },
        prefix : function(n){return ("0"+n).substr(-2)}
    }

    var showDate = function(){
        $('.date').text(datetime.fullDate());
        $('.heure').text(datetime.fullTime());
        $('.hello').text(datetime.begin());
        setTimeout(showDate,1000)
    }
    showDate();
    
    
    /////////////////////////////////
    ////////*****//PIN//*****////////
    /////////////////////////////////
    
    var rightPin = '1234';
    var enteredPin = 'n';
    var pinErrorsCounter = 0;
    var introducedNumber = 0;
    
    $('.page-container').on('click','.clavier--pin td', function(){
        introducedNumber += 1;
    ////////*//////Vérifie le PIN entré//////*////////
    if(enteredPin.length < 4){
        if(enteredPin == 'n') {
            enteredPin = $(this).text();
            $('#pin' + introducedNumber).text('*');
        }
        else{
            enteredPin = enteredPin + $(this).text();
            $('#pin' + introducedNumber).text('*');
        }
    }

    if(enteredPin.length == 4){

        if(enteredPin == rightPin){
            setTimeout(function(){
                $('.page-container').load('_content/accueil.html' + " .page-container", function(){
                    $('footer').fadeIn('fast');
                    coupuresDispo();
                });
            },800)      
        }
        else{
            $('.pin').addClass('animated');
            setTimeout(function(){
                $('.pin').removeClass('animated');
            },1000);
            if(pinErrorsCounter < 2){
                pinErrorsCounter += 1;
                enteredPin = 'n';
                $('.pin span').text('_');
                introducedNumber = 0;
                $('body .errors').replaceWith('<p class="errors">Le code que vous avez introduit est incorrect. Il vous reste ' + (3 - pinErrorsCounter) + ' essais.</p>');
            }
            else{
                $('body *').remove();
                $('body').append('<p class="fatal--error">Désolé, trop de mot de passes erronés, votre carte a été avalée.</p>');
            }
        }
    }  
});

    //////////////////////////////////////
    ////////*****//HISTORIC//*****////////
    //////////////////////////////////////
    
    var historic = JSON.parse(localStorage.getItem('historic')) || [
    
    {
        date: '14/09/2015',
        nature: 'Paiement par carte de banque',
        beneficiary: 'Restaurant 2401 Namur',
        issuer: '',
        communication: '',
        category: 'horeca',
        amount: -9.50
    },
    {
        date: '18/09/2015',
        nature: 'Paiement par carte de banque',
        beneficiary: 'SAXA Namur',
        issuer: '',
        communication: '',
        category: 'bar',
        amount: - 2.70
    },
    {
        date: '18/09/2015',
        nature: 'Virement européen de',
        beneficiary: '',
        issuer: {
            name: 'Lea Bloublou',
            'title': 'Mme',
            'account_number': 'FR34384738983479243',
            'bic': 'BIC DFERUHD'
        },
        communication: 'Argent Septembre',
        category: 'transfert',
        amount: + 234.00
    },
    {
        date: '20/09/2015',
        nature: 'Paiement par carte de banque',
        beneficiary: 'SNCB',
        issuer: '',
        communication: '',
        category: 'deplacement',
        amount: - 12.10
    }
    
    ];
    
    
    var totalAmount = JSON.parse(localStorage.getItem('totalAmount')) || 345.00;
    
    var addToHistoric = function(nature, montant){
        ////////*//////Ajoute une transaction à l'historique//////*////////
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();
        var historicLength = historic.length;
        
        switch(nature){
            case "retrait" :
            historic.push({
                date: day + '/' + month + '/' + year,
                nature: 'Retrait d\'argent',
                beneficiary: '',
                issuer: {
                    name: 'Yeko banque',
                    account_number: 'BE56 4565 6778 2435',
                },
                communication: '',
                category: 'retrait',
                amount: - montant
            });
            break;

            case "depot" :
            historic.push({
                date: day + '/' + month + '/' + year,
                nature: 'Dépot d\'argent',
                beneficiary: 'BE56 4565 6778 2435',
                issuer: {},
                communication: '',
                category: 'depot',
                amount: montant
            });
            break;
        };
        localStorage.setItem('historic', JSON.stringify(historic));
    };
    
    var showHistoric = function(){
    //Affiche l'historique
    for(i = 0; i < historic.length; i++){
        switch(historic[i].nature){

            case "Paiement par carte de banque" :
            var description = historic[i].nature + '<br><span>' + historic[i].beneficiary + '</span>';
            break;
            case 'Virement européen de' :
            var description = historic[i].nature + '<br><span>' + historic[i].issuer.title + ' ' + historic[i].issuer.name + '<br>' + '<br>' + historic[i].issuer.bic + '<br>' + historic[i].communication + '</span>';
            break;
            case 'Retrait d\'argent' :
            var description = historic[i].nature + '<br><span>' + historic[i].issuer.name + '<br>' + '</span>';
            break;
            case 'Dépot d\'argent' :
            var description = historic[i].nature + '<br><span>' + historic[i].beneficiary + '</span>';
        };


        if(historic[i].amount > 0){
            var transactionAmount = '<td class="amount pos">+' + historic[i].amount + '€</td>';
        }
        if(historic[i].amount < 0){
            var transactionAmount = '<td class="amount neg"> ' + historic[i].amount + '€</td>';
        }

        $('.historic--content').append('<tr class="date--number" colspan="2"><td>'+  historic[i].date +'</td></tr><tr><td class="description"><div class="icon--category ' + historic[i].category + '"></div>' + description + '</td>' + transactionAmount + '</tr>');
    }
};


    //Affiche le solde
    if(totalAmount >= 0) {
        $('.actual--amount').append('<p class="solde">+ ' + totalAmount + ' €</p>');
    }
    else {
        $('.actual--amount').append('<p class="solde">- ' + totalAmount + '</p>');
    }
    
    
    
    /////////////////////////////////////
    ////////*****//RETRAIT//*****////////
    /////////////////////////////////////
    
    var billets = {
        'cinq' : {
            quantite: 3,
            value: 5,
            quantiteChoisie: 0
        },
        'dix' : {
            quantite: 30000,
            value: 10,
            quantiteChoisie: 0
        },
        'vingt' : {
            quantite: 30000,
            value: 20,
            quantiteChoisie: 0
        },
        'cinquante' : {
            quantite: 30000,
            value: 50,
            quantiteChoisie: 0
        },
        'cent' : {
            quantite: 30000,
            value: 100,
            quantiteChoisie: 0
        },
        'deux-cent' : {
            quantite: 0,
            value: 200,
            quantiteChoisie: 0
        },
        'cinq-cent' : {
            quantite: 30000,
            value: 500,
            quantiteChoisie: 0
        },
        total : function() {
            var self = this;
            var bills = ['cinq','dix','vingt','cinquante','cent','deux-cent','cinq-cent'];
            var total = 0;
            for (var i = bills.length - 1; i >= 0; i--) {
                var b = self[bills[i]];
                total += b.value*b.quantiteChoisie;
            };
            return total;
        },
        solde: 1650,
    }
    $('.solde-bar .title').text('Solde '+billets.solde+'€')
    $('.page-container').on('click','.billet', function(){
        var parent = $(this).parent();
        var id = parent.attr('id');
        var minus = parent.children('.compteur').children('.minus');
        var counter = parent.children('.compteur').children('.counter');
        var billet = billets[id];        billet.quantiteChoisie += ((billet.quantiteChoisie+1 <= billet.quantite) ? 1 : 0);
        counter.text(billet.quantiteChoisie);
        $('.montant_retrait .number').text(billets.total());
        if (billet.quantiteChoisie >= 1) {
            minus.fadeIn('fast');
            counter.fadeIn('fast');
        } else {
            minus.fadeOut('fast');
            counter.fadeOut('fast');
        }
    })
    $('.page-container').on('click','.compteur .minus', function(){
        var parent = $(this).parent();
        var id = parent.parent().attr('id');
        var counter = parent.children('.counter');
        var billet = billets[id];
        billet.quantiteChoisie = 0;
        counter.text(billet.quantiteChoisie);
        $(this).fadeOut('fast');
        counter.fadeOut('fast');
        $('.montant_retrait .number').text(billets.total());
    })
    
    //Affiche les billets disponibles sur la page d'accueil
    function coupuresDispo() {
        bil = ['cinq', 'dix', 'vingt', 'cinquante', 'cent', 'cinq-cent'];
           //$.each(bil, function(key){
                // if(this.quantite > 0){
                    $('.coupures--dispo').append('<li class=' + key + '></li>');
                // }
            //}); 
        
    }
    
    /*var billets = [
    
        {
            type: 'cinq',
            quantite: 3,
            value: 5,
            quantiteChoisie: 0
        },
        {
            type: 'dix',
            quantite: 30000,
            value: 10,
            quantiteChoisie: 0
        },
        {
            type: 'vingt',
            quantite: 30000,
            value: 20,
            quantiteChoisie: 0
        },
        {
            type: 'cinquante',
            quantite: 30000,
            value: 50,
            quantiteChoisie: 0
        },
        {
            type: 'cent',
            quantite: 30000,
            value: 100,
            quantiteChoisie: 0
        },
        {
            type: 'deux-cent',
            quantite: 30000,
            value: 200,
            quantiteChoisie: 0
        },
        {
            type: 'cinq-cent',
            quantite: 30000,
            value: 500,
            quantiteChoisie: 0
        }
    
        ];*/

    /*
    for(var i = 1; i < (billets.length - 1); i++){
        if(billets[i].quantite > 0){
            $('.coupures--dispo').append('<li class=' + billets[i].type + '></li>');
        }
    }
    
    
    var retraitTotal = 0;
    
   for(var i = 0; i < billets.length; i++){
        $('li#' + billets[i].type + ' .coupures').append('Coupures disponibles: ' + billets[i].quantite);
    }

    
    //Affiche la quantité de billets séléctionné par défault
    for(var i = 0; i < billets.length; i++){
        $('li#' + billets[i].type + ' .counter').append(billets[i].quantiteChoisie);
    }
    
    var refresh = function(billetsType, billetsQuantiteChoisie, billetsQuantite, retraitTotal){
        $('li#' + billetsType + ' .counter').replaceWith('<p class="counter">' + billetsQuantiteChoisie + '</p>');
        $('li#' + billetsType + ' .coupures').replaceWith('<p class="coupures">Coupures disponibles: ' + billetsQuantite + '</p>');
        $('.ask--confirm').replaceWith('<p class="ask--confirm">Souhaitez-vous bien retirez ' + retraitTotal + ',00€ ?</p>');
    };
    
    //Fonction met à jour le tableau des billets séléctionné en fonction de l'action choisie
    var choixBillets = function(coupureChoisie, action){
    
        for(var i = 0; i < billets.length; i++){
            
            if(billets[i].type == coupureChoisie){
                
                if(action == 'minus'){
                    $('.error').remove();
                    if(billets[i].quantiteChoisie > 0){
                        billets[i].quantiteChoisie -= 1;
                        billets[i].quantite += 1;
                        retraitTotal -= billets[i].value;
                        refresh(billets[i].type, billets[i].quantiteChoisie, billets[i].quantite, retraitTotal);
                    }
                }
                else if(action == 'plus'){
                    $('.error').remove();
                    if(billets[i].quantiteChoisie < 10 && billets[i].quantite > 0){
                        billets[i].quantiteChoisie += 1;
                        billets[i].quantite -= 1;
                        retraitTotal += billets[i].value;
                        refresh(billets[i].type, billets[i].quantiteChoisie, billets[i].quantite, retraitTotal);
                    }
                    else if(billets[i].quantiteChoisie == 10){
                        $('li#' + billets[i].type).append('<p class="error">Vous ne pouvez pas sélectionnez plus de 10 billets.</p>');
                    }
                    else if(billets[i].quantite == 0){
                        $('li#' + billets[i].type).append('<p class="error">Il n\'y a plus de coupures disponibles.</p>');
                    }
                }
                else if(action == "reset"){
                    $('.error').remove();
                    retraitTotal -= (billets[i].quantiteChoisie * billets[i].value);
                    billets[i].quantite += billets[i].quantiteChoisie;
                    billets[i].quantiteChoisie = 0;
                    refresh(billets[i].type, billets[i].quantiteChoisie, billets[i].quantite, retraitTotal);
                }
            }
        }
    
    };
    
    $('.compteur button').click(function(){
        var coupureChoisie = $(this).parent().parent().attr('id');
        var action = $(this).attr('class');
        choixBillets(coupureChoisie, action);
    });
    
    $('.billet').click(function(){
        var coupureChoisie = $(this).parent().attr('id');
        var action = $(this).attr('class').split(' ')[1];
        console.log(action);
        choixBillets(coupureChoisie, action);
    });
    
    $('.reset--all').click(function(){
        $('.error').remove();
        retraitTotal = 0;
        for(var i = 0; i < billets.length; i++){
            billets[i].quantite += billets[i].quantiteChoisie;
            billets[i].quantiteChoisie = 0;
            refresh(billets[i].type, billets[i].quantiteChoisie, billets[i].quantite, retraitTotal);
        }
    });
    
    $('.confirm--retrait').click(function(){
        
        totalAmount -= retraitTotal;
        addToHistoric('retrait', retraitTotal);
        localStorage.setItem('totalAmount', JSON.stringify(totalAmount));
        for (var i = 0; i < billets.length; i++){
            billets[i].quantiteChoisie = 0;
        };
        localStorage.setItem('billets', JSON.stringify(billets));
        $(location).attr('href',"ok.html");
    });
*/
    ///////////////////////////////////
    ////////*****//DEPOT//*****////////
    ///////////////////////////////////
    
    $('.depot #confirmation #oui').click(function(){
        totalAmount += 230;
        addToHistoric('depot', 230);
        localStorage.setItem('totalAmount', JSON.stringify(totalAmount));
        $(location).attr('href',"ok.html");
    });

    $('body.depot #boutons #fini').click(function(){
        $('body.depot #deposer' ).addClass( "delete" );
        $('body.depot #b50 p').replaceWith('<p>1x</p>');
        setTimeout(function(){ 
            $('body.depot #montant' ).removeClass( "hide" ).addClass( "show" );
            $('body.depot h3').replaceWith('<h3>50 €</h3>');
            $('body.depot #b50' ).removeClass( "hide" ).addClass( "show" );
        },200);
        setTimeout(function(){ 
            $('body.depot h3').replaceWith('<h3>100 €</h3>');
            $('body.depot #b50 p').replaceWith('<p>2x</p>');
        },500);

        setTimeout(function(){ 
            $('body.depot h3').replaceWith('<h3>150 €</h3>');
            $('body.depot #b50 p').replaceWith('<p>3x</p>');
        },800);

        setTimeout(function(){ 
            $('body.depot h3').replaceWith('<h3>200 €</h3>');
            $('body.depot #b50 p').replaceWith('<p>4x</p>');
        },1100);
        setTimeout(function(){ 
            $('body.depot h3').replaceWith('<h3>220 €</h3>');
            $('body.depot #b20' ).removeClass( "hide" ).addClass( "show" );
        },1400);  
        setTimeout(function(){ 
            $('body.depot h3').replaceWith('<h3>230 €</h3>');
            $('body.depot #b10' ).removeClass( "hide" ).addClass( "show" );
        },1700);
        setTimeout(function(){ 
            $('body.depot h2#confirm').removeClass( "hide" ).addClass( "show" );
            $('body.depot a#retour').replaceWith('<a id="retour" href="depot.html">Non</a>');
            $('body.depot a#fini').replaceWith('<a id="fini" href="ok.html">Oui</a>');
        },2000);
    });



    ///////////////////////////////////
    ////////***//Virement//***/////////
    ///////////////////////////////////
    
    
    $('.page-container').on('click','.touch', function(e){
        var $this = $(this); 
        var parentOffset = $this.offset(),
        cursorX      = e.pageX - parentOffset.left,
        cursorY      = e.pageY - parentOffset.top;

        $this.children(".vague").remove();
        $this.append("<div class=\"vague\"></div>");
        $this.children(".vague").css({"left" : cursorX + "px", "top" : cursorY + "px"});

        $(".vague").one("webkitAnimationEnd mozAnimationEnd oAnimationEnd\
          oanimationend animationend", function() {
            $this.children(".vague").remove();
        });
    });
    

    ///////////////////////////////////            
    ////////***//Virement//***/////////
    ///////////////////////////////////
    
    //Navigation entre les diff sections//
    var currentStep = 0;
    
    $('.hidden--section').hide();
    
    var animateSection = function(direction){
        if(direction == 'left'){
            $('.step' + (currentStep + 1)).css({
                "margin-right": "-800px",
                "float": "right"
            });
            $('.step' + (currentStep + 1)).show();
            $('.step' + (currentStep + 1)).animate({
                marginRight: '0px',
            }, 500);
            setTimeout(function(){ $('.step' + (currentStep + 1)).css('float', 'none'); }, 500);
            $('.step' + currentStep).hide();
        }
        else if(direction == 'right'){
            $('.step' + (currentStep - 1)).css({
                "margin-left": "-800px",
                "float": "none"
            });
            $('.step' + currentStep).hide();
            $('.step' + (currentStep - 1)).show();
            $('.step' + (currentStep - 1)).animate({
                marginLeft: '0px'
            }, 500);
        }
    }
    
    var stepIsDone = function(){
        if(($('.step' + currentStep + ' input').val() != '' && $('.step' + currentStep + ' input').attr("type") != 'radio') || $('.step' + currentStep + ' input').is(':checked')){
            $('.button--virement .next').css('opacity', '1');
            return true;
        }
        else if ($('.step' + currentStep + ' input').val() == '' || !$('.step' + currentStep + ' input').is(':checked')){
            return false;
        }
    }
    
    
    $('.button--virement .next').css('opacity', '0.4');


    
    $('.page-container').on('keyup','.all--steps input', function(){
        stepIsDone();
    });
    
    var virementDate = 'Maintenant';
    var virementCom = $('.input--contain #com-libre');
    
    var displayRecap = function(){
        var virementMontant = $('.step0 #montant').val() + ',00€';
        var virementBenef = $('.step1 .benef input:checked + span').text();
        $('.info--virement .recap--montant').text(virementMontant);
        $('.info--virement .recap--benef').text(virementBenef);
        $('.info--virement .recap--com').text(virementCom.val());
        $('.info--virement .recap--date').text(virementDate);
    }
    
    var nextButtonHide = false;
    
    var nextStep = function(){
        if(currentStep == 2 || currentStep == 3 || stepIsDone() == true){
            $('.bread--point#' + currentStep).removeClass('active').addClass('done');
            $('.bread--point#' + (currentStep + 1)).addClass('active');
            animateSection('left');
            currentStep += 1;

            if(currentStep > 0){
                $('.button--virement .prev').css('visibility', 'visible');
            }
            if(currentStep == 3){
                $('.button--virement .next').hide();
            }
            else if(currentStep == 4){
                $('.button--virement .next').replaceWith('<li class="confirm--virement confirmAction"><input type="submit" value="Confirmer"><span></span></li>');
                displayRecap();
            }
            
            if(currentStep != 2){
                $('.button--virement .next').css('opacity', '0.4');
            }
            stepIsDone();
        }   
    }
    
    var previousStep = function(){
        $('.bread--point#' + currentStep).removeClass('active');
        $('.bread--point#' + (currentStep - 1)).addClass('active').removeClass('done');
        animateSection('right');
        if(currentStep == 3){
            $('.button--virement .next').show();
        }
        else if(currentStep == 4){
            $('.button--virement .confirm--virement').replaceWith('<li class="next"><button><span>Suivant</span></button></li>');
        }
        currentStep -= 1;
        if(currentStep < 1){
            $('.button--virement .prev').css('visibility', 'hidden');
        }
        stepIsDone();
    }
    
    $('.page-container').on('click','.bread li', function(){
        var clickedBread = parseInt($(this).attr('id'));
        if(clickedBread == currentStep + 1){
            nextStep();
        }
        else if(clickedBread == currentStep - 1){
            previousStep();
        }
    });
    
    $('.page-container').on('click','.button--virement .prev', function(){
        if(currentStep != 0){
            previousStep();
        }
    });
    
    $('.page-container').on('click','.button--virement .next', function(){
        nextStep();
    });
    
    //Choix bénéficiaire
    var addBenef = function(){
        $('.benef').hide();
        $('.add--benef').show();
    };
    
    $('.page-container').on('click','.benef label', function(){
        $('.benef label').addClass('unchecked');
        $(this).removeClass('unchecked');
        if($(this).hasClass('add--benef--button')){
            addBenef();
        }
        stepIsDone();
    });
    
    
    //Choix communication
    var displayStructure = function(choosenStructure){
        $('.input--contain *').hide();
        switch(choosenStructure){
        
            case 'select-struct':
                $('.input--contain .struct').css('display', 'block');
                virementCom = $('.input--contain #com-struc');
                break;
                
            case 'select-struct-europ':
                $('.input--contain .struct--europ').css('display', 'block');
                virementCom = $('.input--contain #struc-euro');
                break;
                
            case 'select-libre':
                $('.input--contain .libre').css('display', 'block');
                virementCom = $('.input--contain #com-libre');
                break;
        };
    }
    
    $('.page-container').on('click','.choose-com-type li', function(){
        var choosenStructure = $(this).attr('class');
        $('.choose-com-type li').removeClass('selected-com-type');
        $(this).addClass('selected-com-type');
        displayStructure(choosenStructure);
    });
    
    //Choix date
    
    var windowHeight = $(window).height();
    
    $('.hide--page--virement').css('height', windowHeight + 'px');
    
    $('.page-container').on('click','.choose--when > span', function(){
        if ($(this).hasClass('virement--later')){
            $('#datepicker').show();
            $('.ui-datepicker').show();
            $('.hide--page--virement').show();
        }
        else if ($(this).hasClass('virement--now')){
            virementDate = 'Maintenant';
            nextStep();
        }
        $('.choose--when > span').addClass('disabled');
        $(this).removeClass('disabled');
    });
    
    $.datepicker.setDefaults({minDate: 0});
    $('#datepicker').datepicker();
    
    $('#datepicker').append('<span class"confirm--date">Confirmer</span>');
    
    $('.page-container').on('click','#datepicker > span', function(){
        var selectedDate = $( "#datepicker" ).val().toLowerCase();
        virementDate = $( "#datepicker" ).val().toLowerCase();
        $('#datepicker').hide();
        $('.ui-datepicker').hide();
        $('.hide--page--virement').hide();
        $('.virement--later').text(selectedDate);
        $('.virement--later').addClass('display--date');
        $('.button--virement .next').show();
    });


    function overlayConfirm() {
        $('.overlay').fadeIn(300, function(){
            var self = $(this);
            setTimeout(function() {
                self.fadeOut(300);
            }, 2500)
        })
    }