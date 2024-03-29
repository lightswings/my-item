var board = new Array();
var score = 0;
var hasConflicted = new Array();
//触控的start和end坐标初始值
var startx=0;
var starty=0;
var endx=0;
var endy=0;
$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    //当设备屏幕宽度大于500px时,无需自适应
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    //屏宽小于500的自适应设定
    //注意width一般为内容区宽度,不含内边距
    $("#grid-container").css("width",gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("height",gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02 * gridContainerWidth);
    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02 * cellSideLength);
}

function newgame(){
    init();
    generateOneNumber();
    generateOneNumber();
}

function init(){
    //为16个div格子的top和left属性赋值
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();
    score=0;
}

function updateBoardView(){
    //**全函数,60,76,78,81,82
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$("#number-cell-"+i+"-"+j);
            if (board[i][j] == 0) {
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
            }
            else
            {
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
    $(".number-cell").css("line-height",cellSideLength+"px");
    $(".number-cell").css("font-size",0.6 * cellSideLength+"px");
}

function generateOneNumber(){
    //**全函数,88,90-104,109,112
    if (nospace(board)) {
        return false;
    }
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var times=0;
    while(times<50){
        if (board[randx][randy] == 0) {break;}
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if (times==50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}
//**115-121
$(document).keydown(function(event){
    event.preventDefault();
    switch(event.keyCode){
        case 37: //left
        if (moveLeft()) {
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        break;
        case 38: //up
        if (moveUp()) {
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        break;
        case 39: //right
        if (moveRight()) {
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        break;
        case 40: //down
        if (moveDown()) {
            setTimeout("generateOneNumber()",210);
            setTimeout("isgameover()",300);
        }
        break;
        default:
        break;
    }
});
//移动端的响应上下左右:
//通过事件监听器获得触摸开始和结束的横纵坐标
//**153-155,157-161,163-170
document.addEventListener("touchstart",function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});
document.addEventListener("touchend",function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    var deltax=endx-startx;
    var deltay=endy-starty;
    //判断是否点击屏幕
    if (Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth) {
        return;
    }
    //1
    if (Math.abs(deltax)>=Math.abs(deltay)) {
        if (deltax>0) {
            if (moveRight()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            if (moveLeft()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if(deltay>0){
            if (moveDown()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            if (moveUp()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});
//**198
function isgameover(){
    if (nospace(board)&&nomove(board)) {
        gameover();
    }
}

function gameover(){
    alert("game over!");
}
//**208,209,211-228(214,221)
function moveLeft(){
    if (!canMoveLeft(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i,k,j,board)) {
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if (!canMoveUp(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if (!canMoveRight(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i,j,k,board)) {
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if (!canMoveDown(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j,i,k,board)) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}