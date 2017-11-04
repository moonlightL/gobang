## 一、背景
近一个月没写 Javascript 代码，有点生疏。正好浏览网页时弹出五子棋的游戏广告，于是想通过编写这个小游戏练练手。

## 二、简单介绍

### 2.1 效果展示

![image](http://ow97db1io.bkt.clouddn.com/gobang-00.gif)

### 2.2 实现思路

1) 棋盘：通过图片（chessboard.png）和 table 标签单元格渲染出棋盘。

2) 棋子：通过图片（black_flag.png、white_flag.png等）渲染出黑白棋子。落子前，鼠标出会出现一个可以随鼠标移动的棋子。我们创建一个浮动的 div，动态设置其 top 和 left 。

3) 落子：给容器（class="container"）添加 click 事件，给其添加对应的 classname。即被点击的单元格设置棋子背景图片。此外，需要判断落子点是否存在棋子。

4) 输赢：使用二维数组保存棋盘（棋子）状态，通过横向、纵向、左上到右下和右上到左下四个方向进行判断是否有 5 个以上连续同颜色（样式）的棋子。

### 2.3 涉及技术
DOM操作、面向对象、事件操作和间隔函数 setInterval

### 2.4 项目结构

![image](http://ow97db1io.bkt.clouddn.com/gobang-00.jpg)

## 三、实现步骤

### 3.1 绘制棋盘
style.css 内容：

```css
html,body {
    padding: 0;
    margin: 0;
}

.container {
    position: relative;
    width: 540px;
    height: 540px;
    margin: 10px auto;
    padding-top: 7px;
    padding-left: 7px;
    background: url("../images/chessboard.png") no-repeat;
    cursor: pointer;
}

.none {
    position: absolute;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    /*border: 1px solid #fff;*/
}

.black_flag {
    position: absolute;
    width: 36px;
    height: 36px;
    background: url("../images/black_flag.png") no-repeat;
}

.black_flag_cur {
    position: absolute;
    background: url("../images/black_flag_cur.png") no-repeat;
    /*设置点击无效*/
    pointer-events: none;
}

.white_flag {
    position: absolute;
    width: 36px;
    height: 36px;
    background: url("../images/white_flag.png") no-repeat;
}

.white_flag_cur {
    position: absolute;
    background: url("../images/white_flag_cur.png") no-repeat;
    /*设置点击无效*/
    pointer-events: none;
}


```

chessboard.js 代码：

```javascript
var Chessboard = function() {
    // 保存棋盘棋子状态
    this.flagArr = [];
    this.size = 36;
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

}
```

game.js 代码：

```javascript
var Game = function() {

}

Game.prototype.start = function() {
    var chessboard = new Chessboard();
    chessboard.init();
}
```

最终效果如下：

![image](http://ow97db1io.bkt.clouddn.com/gobang-02-1.jpg)


为了方便查看 div 与棋盘图片中格子之间的对应关系，笔者将 div 边框设置成白色。

从图中我们可以看到，div 大小正好对应棋盘的落子点。我们将 div 背景设置成棋子图片就实现了落子操作。


### 3.2 绘制棋子

chessboard.js 代码：

```javascript
var Chessboard = function() {
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
}

// 落子事件监听器
Chessboard.prototype.addListener = function() {
    var that = this;

    // 设置落子前的鼠标样式
    var mouse = document.createElement("div");
    mouse.id = "mouse";
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

```

结果如下图：

![image](http://ow97db1io.bkt.clouddn.com/gobang-02-1.gif)

### 3.3 落子

在 chessboard.js 的监听器方法中添加落子的点击事件：

```javascript
var Chessboard = function() {
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
    this.resultMap[true] = "黑子胜利";
    this.resultMap[false] = "白子胜利";
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
}

// 落子事件监听器
Chessboard.prototype.addListener = function(container) {
    var that = this;

    // 设置落子前的鼠标样式
    var mouse = document.createElement("div");
    mouse.id = "mouse";
    mouse.style.width = mouse.style.height = 36 + "px";
    document.body.appendChild(mouse);
    document.body.onmousemove = function(event) {
        mouse.className = that.flagCurMap[that.currentFlag];
        var x = event.clientX - 16;
        var y = event.clientY - 16;
        mouse.style.top = y + "px";
        mouse.style.left = x + "px";
    }

    // 落子监听
    container.onclick = function(event) {
        // 判断落子点是否存在棋子
        if (event.target.className != "none") {
            alert("此处不能落子!");
            return;
        }

        // 落子，设置棋子图片
        event.target.className = that.flagMap[that.currentFlag];

        // 换棋手
        that.currentFlag = !that.currentFlag;
    }
}

```

运行结果如下：

![image](http://ow97db1io.bkt.clouddn.com/gobang-03.gif)

### 3.4 判断输赢

在 chessboard.js 的落子监听实践代码中，判断是否五连子：

```javascript
// 落子事件监听器
Chessboard.prototype.addListener = function(container) {
    var that = this;

    // 设置落子前的鼠标样式
    var mouse = document.createElement("div");
    mouse.id = "mouse";
    mouse.style.width = mouse.style.height = 36 + "px";
    document.body.appendChild(mouse);
    document.body.onmousemove = function(event) {
        mouse.className = that.flagCurMap[that.currentFlag];
        var x = event.clientX - 16;
        var y = event.clientY - 16;
        mouse.style.top = y + "px";
        mouse.style.left = x + "px";
    }

    // 落子监听
    container.onclick = function(event) {
        // 判断落子点是否存在棋子
        if (event.target.className != "none") {
            alert("此处不能落子!");
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
            alert(that.resultMap[that.currentFlag]);
            return;
        }

        // 换棋手
        that.currentFlag = !that.currentFlag;
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
    var b = 14 - y -x;
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
```

演示结果:

![image](http://ow97db1io.bkt.clouddn.com/gobang.gif)

剩余的一些文本提示，倒计时就不在此处介绍。具体代码可以在下边提供的链接中下载。

## 四、源码下载

* [源码下载](https://github.com/moonlightL/gobang)
