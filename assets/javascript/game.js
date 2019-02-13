$("document").ready(()=>{

    var StarWarsGame = /** @class */ (function () {
        function StarWarsGame() {
            this.characters = new Array(4);
            this.characters[0] = new Character(1, 300, 3, 20, "Luke Skywalker", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2806956/lukeskywalker.JPG");
            this.characters[1] = new Character(2, 450, 5, 30, "Darth Maul", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2806956/darthmaul.JPG");
            this.characters[2] = new Character(3, 300, 10, 20, "Obi-Wan Kenobi", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2806956/obiWanKenobi.JPG");
            this.characters[3] = new Character(4, 325, 7, 40, "Darth Sidious", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2806956/darthsidious.JPG");
            this.defenders = new Array(this.characters.length);
            this.resultMessage = "";
            this.defeatedDefenders=0;
            this.nameLookup = {"1":"Luke Skywalker","2":"Darth Maul", "3":"Obi-Wan Kenobi", "4": "Darth Sidious"};
        }
        StarWarsGame.prototype.pickAttacker = function (name) {
            var attackerPicked = false;
            for (var i = 0; i < this.characters.length; i++) {
                if (this.characters[i].getName() == name) {
                    var c = this.characters[i];
                    this.selectedCharacter = new Character(c.id, c.healthPoints, c.attackPower, 0, c.getName(), c.imageUri);
                    this.selectedCharacter.removeMe(this.characters);
                    attackerPicked = true;
                }
            }
            for (var i = 0; i < this.characters.length; i++) {
                this.defenders[i] = this.characters[i];
            }
            for (var i = 0; i < this.defenders.length; i++) {
                this.defenders[i].removeMe(this.characters);
            }
        };
        StarWarsGame.prototype.pickDefender = function (name) {
            if (this.selectedCharacter != null && this.selectedCharacter.getEnemy() != null &&  this.selectedCharacter.getEnemy().healthPoints>0) {
                this.resultMessage = "cannot switch characters in midplay";
                return;
            }
            for (var i = 0; i < this.defenders.length; i++) {
                if (this.defenders[i].getName() == name) {
                    var c = this.defenders[i];
                    this.selectedCharacter.addEnemy(new Character(c.id, c.healthPoints, 0, c.counterAttackPower, c.getName(), c.imageUri));
                    this.selectedCharacter.getEnemy().removeMe(this.defenders);
                }
            }
        };
        StarWarsGame.prototype.getWinner = function () {
            return this.selectedCharacter.isDead() ? this.selectedCharacter.getEnemy().getName() : this.selectedCharacter.getEnemy().isDead() ? this.selectedCharacter.getName() : "no winner";
        };
        StarWarsGame.prototype.playerAttacks = function () {
            this.selectedCharacter.attacks();
            this.resultMessage = "You attacked "+this.selectedCharacter.getEnemy().name +" for "+ this.selectedCharacter.attackPower +" damage" + "<br> " + this.selectedCharacter.getEnemy().name +" attacked you back for " + this.selectedCharacter.getEnemy().counterAttackPower +" damage";
            this.updateGameStatus();
        };
        StarWarsGame.prototype.gameLost = function () {
            if (this.selectedCharacter == null || this.selectedCharacter.getEnemy() == null) {
                return false;
            }
            if (this.selectedCharacter.getEnemy().getName() == this.getWinner()) {
                return true;
            }
            if (this.selectedCharacter.getName() == this.getWinner()) {
                return true;
            }
            else {
                return false;
            }
        };
        StarWarsGame.prototype.canSelectDefender = function(){
            if(this.selectedCharacter.getEnemy()===null){
                return true;
            }

            if(this.selectedCharacter.getEnemy().isDead()){
                return true;
            }
            else{
                return false;
            }

        };
        StarWarsGame.prototype.updateGameStatus = function () {
            if (this.gameLost()) {
                this.resultMessage = this.getWinner() + " wins!";
            }
        };

        StarWarsGame.prototype.isGameOver = function () {
            var def= this.defenders;

            for(var i=0;i<def.length;i++){
                if(def[i].id>0){
                    return false;
                }
                else{
                    return true;
                }
            }

        };
        return StarWarsGame;
    }());
    var Character = /** @class */ (function () {
        function Character(id, hp, attack, counterAttack, name, imageUri) {
            this.id = id;
            this.name = name;
            this.healthPoints = hp;
            this.baseAttack = attack;
            this.attackPower = attack;
            this.counterAttackPower = counterAttack;
            this.imageUri = imageUri;
        }
        Character.prototype.attacks = function () {
            if (!this.isDead()) {
                this._enemy.takesDamages(this.attackPower, true);
                this.attackPower = this.attackPower + this.baseAttack;
            }
        };
        Character.prototype.counterAttack = function () {
            if (!this.isDead()) {
                this._enemy.takesDamages(this.counterAttackPower, false);
            }
        };
        Character.prototype.takesDamages = function (power, counters) {
            this.healthPoints = this.healthPoints - power;
            if (counters) {
                this.counterAttack();
            }
        };
        Character.prototype.isDead = function () {
            return this.healthPoints <= 0 ? true : false;
        };
        Character.prototype.destroyedEnemy = function () {
            return this._enemy.isDead() ? true : false;
        };
        Character.prototype.addEnemy = function (c) {
            if (this._enemy == null) {
                this._enemy = c;
                c.addEnemy(this);
                return;
            }
            if (this._enemy.isDead()) {
                this._enemy=c;
                c.addEnemy(this);

            }

        };
        Character.prototype.getName = function () {
            return this.name;
        };
        Character.prototype.getEnemy = function () {
            var c = this._enemy;
            return c == null ? null : new Character(c.id, c.healthPoints, c.attackPower, c.counterAttackPower, c.getName(), c.imageUri);
        };
        Character.prototype.removeMe = function (characters) {
            for (var i = 0; i < 100; i++) {
                if (characters[i].name == this.name) {
                    characters[i] = new Character(0, 0, 0, 0, "", "");
                    return;
                }
            }
        };
        return Character;
    }());

    var newGame = new StarWarsGame();
///
    function consCard(id,name,uri,hp){
        var cardOpen=`<div id=\"${id}\" class=\"card\">`;
        var cardBody= `<div class=\"card-body\">`;
        var cardTitle=`<h4 class=\"card-title\">${name} + HP(${hp})`;
        var cardTitleClose=`</div>`;
        var closeCardBody=`</div>`;
        var cardClose=`</div>`;

        return cardOpen + consImg(id,name,uri) + cardBody + cardTitle + cardTitleClose +closeCardBody +cardClose;
    }
    function consImg(id,name,uri){
        return `<img  class=\"${name}\"  src=\"${uri}\"/>`;
    }
    function loadCharacters(){
        newGame.characters.forEach(c=>{
            // console.log(consImg(c.id,c.name,c.imageUri));
            $("#charactersSelection").append(consCard(c.id,c.name,c.imageUri,c.healthPoints));

        });
    }
    loadCharacters();

    $("body").on("click","div.card",(event)=> {
        // console.log();
        console.log(4);
        console.log(  newGame.nameLookup[event.target.id.toString()]);

        if(newGame.selectedCharacter==null){
            var selected=$("#"+event.target.id);
            $("#attacker").append(selected);
            console.log(newGame.nameLookup[event.target.id]);
            newGame.pickAttacker(newGame.nameLookup[event.target.id]);
            var restOfSelection=$("#charactersSelection").children();
            $("#defenders").append(restOfSelection);

            return;
        }

        if(newGame.canSelectDefender()){
            if(event.target.id!=newGame.selectedCharacter.id){
                var defender = $("#"+event.target.id);
                $("#defender").append(defender);
                newGame.pickDefender(newGame.nameLookup[event.target.id]);
            }
        }

        //selected.show("fast");
        console.log(selected.html());
    } );



    $("input").click(()=>{
        console.log(newGame.selectedCharacter.getEnemy().name);
        console.log("click");
        $("#message").empty();
        newGame.playerAttacks();
        $("#message").append(newGame.resultMessage);

        if(newGame.getWinner()==="no winner"){return;}

        function reloadGame() {
            $("#defenders img").remove();
            $("#attacker img").remove();
            $("#defender img").remove();
            $("#message").empty();
            newGame = new StarWarsGame();
            loadCharacters();
        }

        if(newGame.getWinner()!=newGame.selectedCharacter.getName()){
            alert("You lost. Game restarting");

            reloadGame();
        }

        if(newGame.getWinner()==newGame.selectedCharacter.getName()){

             newGame.defeatedDefenders++;
             console.log("Defeated defenders:"+newGame.defeatedDefenders);
             if(newGame.defeatedDefenders!=3){
              alert("You won this round! Pick a new opponent to fight.");
              $("#defender").empty();
            }
            else{
                alert("You won the game. Game is restarting");
               reloadGame();
            }



        }
    });

});