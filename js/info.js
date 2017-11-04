var Info = function(infoContainer) {
    this.time = 10 * 60;// 10 分钟
    this.infoContainer = infoContainer;
    this.textMap= [];
    this.textMap[true] = "棋手：黑子";
    this.textMap[false] = "棋手：白子";
}

Info.prototype.changeFlag = function(flag) {
    this.infoContainer.flag.innerHTML = this.textMap[flag];
}

Info.prototype.changeTime = function(str) {
     this.infoContainer.time.innerHTML = str;
}

Info.prototype.getTime = function() {
    return this.time;
}
