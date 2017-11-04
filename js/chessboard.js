var Chessboard = function(info) {
    this.info = info;
    // 保存棋盘棋子状态
    this.flagArr = [];
    this.size = 36;

    // 默认黑色为先手
    this.currentFlag = true;

    // 保存落子前的样式映射
    this.flagCurMap = [];
    // 黑子
    this.flagCurMap[true] = "black_flag_cur";
    // 白子
    this.flagCurMap[false] = "white_flag_cur";

    // 保存落子后的样式映射
    this.flagMap = [];
    // 黑子
    this.flagMap[true] = "black_flag";
    // 白子
    this.flagMap[false] = "white_flag";

    // 保存结果映射关系
    this.resultMap = [];
    this.resultMap[true] = "黑子胜利！";
    this.resultMap[false] = "白子胜利！";

    this.timeId = null;
}

// 初始化棋盘
Chessboard.prototype.init = function() {
    var container = document.getElementById("container");

    for (var i = 0; i < 15; i++) {
        var arr = [];
        for (var j = 0; j < 15; j++) {
            var div = document.createElement("div");
            div.className = "none";
            div.style.top = (i * this.size) + "px";
            div.style.left = (j * this.size) + "px";
            container.appendChild(div);
            arr.push(div);
        }
        this.flagArr.push(arr);
    }

    // 添加事件监听器
    this.addListener(container);

    // 倒计时
    this.info.changeFlag(this.currentFlag);
    var time = this.info.getTime();
    var that = this;
    this.timeId = setInterval(function() {
        if (time == 0) {
            alert("时间到，比赛结束！");
            clearInterval(that.timeId);
            return;
        }
        time --;
        that.info.changeTime("剩余时间："+time + " 秒");
    },1000);
}

// 落子事件监听器
Chessboard.prototype.addListener = function(container) {
    var that = this;

    var mouse = document.createElement("div");
    mouse.id = "mouse";

    // 鼠标进入棋盘后，设置落子前的鼠标样式
    container.onmouseenter = function() {
        mouse.style.width = mouse.style.height = 36 + "px";
        document.body.appendChild(mouse);
        document.body.onmousemove = function(event) {
            mouse.className = that.flagCurMap[that.currentFlag];
            var x = event.clientX - 16;
            var y = event.clientY - 16;
            mouse.style.top = y + "px";
            mouse.style.left = x + "px";
        }
    }

    // 鼠标离开期盼后
    container.onmouseleave = function() {
        document.body.onmousemove = null;
    }

    // 落子监听
    container.onclick = function(event) {
        // 判断落子点是否存在棋子
        if (event.target.className != "none") {
            alert("此处不能落子！");
            return;
        }

        // 落子，设置棋子图片
        event.target.className = that.flagMap[that.currentFlag];

        // 当前落子坐标
        var x = Math.floor(event.target.offsetLeft / that.size);
        var y = Math.floor(event.target.offsetTop / that.size);

        // 判断是否胜利
        if (that._checkSuccess(x, y)) {
            document.getElementById("mouse").style.display = "none";
            container.onclick = null;
            document.body.onmousemove = null;
            clearInterval(that.timeId);
            alert(that.resultMap[that.currentFlag]);
            return;
        }

        // 换棋手
        that.currentFlag = !that.currentFlag;
        // 修改信息
        that.info.changeFlag(that.currentFlag);
    }
}

// 判断棋局
Chessboard.prototype._checkSuccess = function(x, y) {
    var result = false;
    // 当前落子的样式/颜色
    var className = this.flagArr[y][x].className;

    // 横向判断
    var count = 0;
    for (var i = 0; i < 15; i++) {
        if (className == this.flagArr[y][i].className) {
            count++;
            if (count >= 5) {
                return true;
            }
        } else {
            count = 0;
        }
    }

    // 纵向判断
    for (var j = 0; j < 15; j++) {
        if (className == this.flagArr[j][x].className) {
            count++;
            if (count >= 5) {
                return true;
            }
        } else {
            count = 0;
        }
    }

    // 左上到右下判断
    var a = y - x;
    var index = 0;
    if (a > 0) {
        for (a; a < 15; a++) {
            if (className == this.flagArr[a][index++].className) {
                count++;
                if (count >= 5) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    } else {
        a = Math.abs(a);
        for (a; a < 15; a++) {
            if (className == this.flagArr[index++][a].className) {
                count++;
                if (count >= 5) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    // 右上到左下判断
    var b = 14 - y - x;
    var index2 = 14;
    if (b > 0) {
        b = 14 - b;
        index2 = 0;
        for (b; b >= 0; b--) {
            if (className == this.flagArr[index2++][b].className) {
                count++;
                if (count >= 5) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    } else {
        b = Math.abs(b);
        for (b; b < 15; b++) {
            if (className == this.flagArr[index2--][b].className) {
                count++;
                if (count >= 5) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    if (count >= 5) {
        result = true;
    }

    return result;
}
