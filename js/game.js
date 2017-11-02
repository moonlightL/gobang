var Game = function() {

}

Game.prototype.start = function() {
    var chessboard = new Chessboard();
    chessboard.init();
}
