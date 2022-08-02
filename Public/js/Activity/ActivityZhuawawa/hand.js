//活动手横向平移
function directionX() {
    try {
        animate(unitLeft,handLeft);
        timerID1 = setTimeout("directionX()", 550);
    } catch (e) {
    }

}

//活动手纵向上出去操作
function animateBack(offset,pricetop) {
    var tag = document.getElementById("tag");
    var price = document.getElementById("price");
    newBack = parseInt(hand.style.height) - offset;
    hand.style.height = newBack + 'px';
     tag.style.top = newBack + 'px';
    price.style.top = pricetop+newBack + 'px';
    price.style.display = "block";
    price.style.left = -3 + parseInt(tag.style.left) + 'px';
}


//横向平移操作
function animate(offset,Handleft) {
    newLeft = parseInt(hand.style.left) + offset;
    var tag = document.getElementById("tag");
    hand.style.left = newLeft + 'px';
    tag.style.left= Handleft+newLeft + 'px';
    if (newLeft > lastLeft) {
        hand.style.left = 0 + 'px';
        tag.style.left = -32 + 'px';
    }
}
//纵向平移操作
function downHand(offset) {
    var tag = document.getElementById("tag");
    newTop = parseInt(hand.style.height) + offset;
//        hand.style.top = newTop + 'px';
    hand.style.height = newTop + 'px';
     tag.style.top = newTop + 'px';
}
