var Game = function() {

}

Game.prototype.start = function() {
    var info = new Info({
        "flag": document.getElementById("flag"),
        "time": document.getElementById("time")
    });
    var chessboard = new Chessboard(info);
    chessboard.init();
}
