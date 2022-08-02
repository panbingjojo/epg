/** 按返回键 */
function onBack() {
    LMEPG.Intent.back();
}

var Action = {
    focusChange: function (btn, hasFocus) {
        var button = G(btn.id);
        if (hasFocus) {
            switch (btn.id) {
                case 'focus-1-1':
                    button.style.display = 'block';
                    break;
                case 'focus-1-5':
                    break;
                case 'focus-1-2':
                case 'focus-1-3':
                case 'focus-1-4':
                    button.className = 'scoller3';
                    break;
            }
        } else {
            switch (btn.id) {
                case 'focus-1-1':
                    button.style.display = 'none';
                    break;
                case 'focus-1-5':
                    break;
                case 'focus-1-2':
                case 'focus-1-3':
                case 'focus-1-4':
                    button.className = 'scoller2';
                    break;
            }
        }
    },

    beforeMoveChange: function (dir, current) {
        if (dir === 'up' || dir === 'down') {
            onKeyUpDown(current.id, dir);
            return false;
        } else if (dir === 'left' && current.id === 'focus-1-2') {
            // 编辑模式，拒绝移动焦点到头像，防止改变当前编辑的成员
            if (initMemberID > 0) {
                LMEPG.ButtonManager.requestFocus(current.id);
                return false;
            }
        }
    },

    onClick: function (btn) {
        if (btn.id == 'focus-1-5') {
            addMember();
        }
    }
};

/** 操作类型：上增/下减 */
var OP_ACTION = {
    ASC: 'ascend',      // 向上增加
    DESC: 'descend'     // 向下减小
};

var eleArrowUp = G('top_page');
var eleArrowDown = G('bottom_page');
var eleMemberAgeMin = G('pre_age');
var eleMemberAge = G('focus-1-2');
var eleMemberAgeMax = G('next_age');
var eleMemberHeight = G('focus-1-3');
var eleMemberHeightMin = G('pre_heigt');
var eleMemberHeightMax = G('next_heigt');
var eleMemberWeight = G('focus-1-4');
var eleMemberWeightMin = G('pre_weight');
var eleMemberWeightMax = G('next_weight');
var eleMemberHeader = G('head_img');
var eleMemberName = G('member_name');
var eleTitle = G('title');


var memberArray = [];
var memberArrayIndex = undefined;//数组索引

// 当前页面所有按钮
var buttons = [
    {
        id: 'focus-1-1',
        name: '头像',
        type: 'img',
        focusable: true,
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-2',
        nextFocusDown: '',
        beforeMoveChange: Action.beforeMoveChange,
        focusChange: Action.focusChange
    },
    {
        id: 'focus-1-2',
        name: '年龄',
        type: 'div',
        focusable: true,
        nextFocusLeft: 'focus-1-1',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-3',
        nextFocusDown: '',
        beforeMoveChange: Action.beforeMoveChange,
        focusChange: Action.focusChange
    },
    {
        id: 'focus-1-3',
        name: '身高',
        type: 'div',
        focusable: true,
        nextFocusLeft: 'focus-1-2',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-4',
        nextFocusDown: '',
        beforeMoveChange: Action.beforeMoveChange,
        focusChange: Action.focusChange
    },
    {
        id: 'focus-1-4',
        name: '体重',
        type: 'div',
        focusable: true,
        nextFocusLeft: 'focus-1-3',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-5',
        nextFocusDown: '',
        beforeMoveChange: Action.beforeMoveChange,
        focusChange: Action.focusChange
    },
    {
        id: 'focus-1-5',
        name: '确定',
        type: 'div',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_big_out.png',
        focusImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_big_in.png',
        nextFocusLeft: 'focus-1-4',
        nextFocusUp: '',
        nextFocusRight: '',
        nextFocusDown: '',
        beforeMoveChange: '',
        moveChange: '',
        focusChange: '',
        click: Action.onClick
    }
];


function initMemberUI() {
    try {
        eleTitle.innerHTML = parseInt(initMemberID) > 0 ? '编辑家庭成员信息' : '添加家庭成员信息';
        memberArray = JSON.parse(initMember);
        if (memberArray.length > 0) {
            var firstMember = memberArray[0];
            setMemberDefault(firstMember);
            memberArrayIndex = 0;
            if (initMemberID > 0) {
                LMEPG.ButtonManager.init('focus-1-2', buttons, '', true);
                eleArrowUp.style.display = 'none';
                eleArrowDown.style.display = 'none';
            } else {
                LMEPG.ButtonManager.init('focus-1-1', buttons, '', true);
                eleArrowUp.style.display = memberArray.length <= 1 ? 'none' : 'block';
                eleArrowDown.style.display = memberArray.length <= 1 ? 'none' : 'block';
            }
        } else {
            LMEPG.UI.showToast('没有可以添加的家庭成员了！');
        }
    } catch (e) {
    }
}

//特殊的焦点上操作
function onKeyUpDown(id, direction) {
    switch (id) {
        case 'focus-1-1':
            setPhoto(direction === 'up' ? OP_ACTION.DESC : direction === 'down' ? OP_ACTION.ASC : '');
            break;
        case 'focus-1-2':
            setAge(direction === 'up' ? OP_ACTION.DESC : direction === 'down' ? OP_ACTION.ASC : '');
            break;
        case 'focus-1-3':
            setHeight(direction === 'up' ? OP_ACTION.DESC : direction === 'down' ? OP_ACTION.ASC : '');
            break;
        case 'focus-1-4':
            setWeight(direction === 'up' ? OP_ACTION.DESC : direction === 'down' ? OP_ACTION.ASC : '');
            break;
    }
}

/**
 * 设置家庭成员信息
 * @param memberItemObj {"member_id": 2,"member_name": "妈妈","member_age": 90,"member_gender": 1,"member_height": 168,"member_weight": 50,"member_image_id": 2}
 */
function setMemberDefault(memberItemObj) {
    if (!memberItemObj instanceof Object) {
        LMEPG.UI.showToast('请重新进入添加');
    }
    var headSrc = g_appRootPath + '/Public/img/hd/Doctor/V1/famliy_role' + memberItemObj['member_image_id'] + '.png';

    var age = parseInt(memberItemObj['member_age']);
    var minAge = age - 1;
    var maxAge = age + 1;

    var height = parseInt(memberItemObj['member_height']);
    var minHeight = height - 1;
    var maxHeight = height + 1;
    var weight = parseInt(memberItemObj['member_weight']);
    var minWeight = weight - 1;
    var maxWeight = weight + 1;

    eleMemberAgeMin.innerHTML = minAge;
    eleMemberAge.innerHTML = age;
    eleMemberAgeMax.innerHTML = maxAge;

    eleMemberHeight.innerHTML = height;
    eleMemberHeightMin.innerHTML = minHeight;
    eleMemberHeightMax.innerHTML = maxHeight;

    eleMemberWeight.innerHTML = weight;
    eleMemberWeightMin.innerHTML = minWeight;
    eleMemberWeightMax.innerHTML = maxWeight;
    eleMemberName.innerHTML = memberItemObj['member_name'];
    eleMemberHeader.src = headSrc;
}

function addMember() {
    LMEPG.UI.showWaitingDialog('');
    var age = eleMemberAge.innerHTML;
    var weight = eleMemberWeight.innerHTML;
    var height = eleMemberHeight.innerHTML;
    var memberItemObj = memberArray[memberArrayIndex];

    var postData = {
        'member_id': initMemberID,
        'member_name': memberItemObj.member_name,
        'member_age': age,
        'member_gender': memberItemObj.member_gender,
        'member_height': height,
        'member_weight': weight,
        'member_image_id': memberItemObj.member_image_id
    };

    LMEPG.ajax.postAPI('Family/addMember', postData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result == 0) {
                    onBack();
                } else {
                    LMEPG.UI.showToast('添加失败:' + data.result);
                }
            } else {
                LMEPG.UI.showToast('添加失败');
            }
        } catch (e) {
            LMEPG.UI.showToast('添加异常');
        }
    }, function () {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast('添加异常');
    });
}

//头像设置
function setPhoto(type) {
    if (type !== OP_ACTION.ASC && type !== OP_ACTION.DESC) {
        return;
    }

    // 编辑模式，拒绝移动焦点到头像，防止改变当前编辑的成员
    if (initMemberID > 0) {
        return;
    }

    if (type === OP_ACTION.ASC) {
        if (memberArrayIndex != undefined) {
            if (memberArrayIndex < memberArray.length - 1) {
                memberArrayIndex++;
            } else {
                memberArrayIndex = 0;
            }
        }
    } else {
        if (memberArrayIndex > 0) {
            memberArrayIndex--;
        } else {
            memberArrayIndex = memberArray.length - 1;
        }
    }
    setMemberDefault(memberArray[memberArrayIndex]);
}

//年纪设置
function setAge(type) {
    if (type !== OP_ACTION.ASC && type !== OP_ACTION.DESC) {
        return;
    }

    var currentAge = eleMemberAge.innerHTML;
    var preAge;
    var nextAge;

    if (type === OP_ACTION.ASC) {
        currentAge++;
        if (currentAge == 101) {
            currentAge = 1;
        }
        preAge = currentAge - 1;
        nextAge = currentAge + 1;
    } else {
        currentAge--;
        if (currentAge == 0) {
            currentAge = 100;
        }
        preAge = currentAge - 1;
        nextAge = currentAge + 1;
    }
    eleMemberAgeMin.innerHTML = preAge;
    eleMemberAgeMax.innerHTML = nextAge;
    eleMemberAge.innerHTML = currentAge;
}

//身高设置
function setHeight(type) {
    if (type !== OP_ACTION.ASC && type !== OP_ACTION.DESC) {
        return;
    }

    var currentHeight = eleMemberHeight.innerHTML;
    var preHeight;
    var nextHeight;
    if (type === OP_ACTION.ASC) {
        currentHeight++;
        if (currentHeight == 251) {
            currentHeight = 30;
        }
        preHeight = currentHeight - 1;
        nextHeight = currentHeight + 1;
    } else {
        currentHeight--;
        if (currentHeight == 29) {
            currentHeight = 250;
        }
        preHeight = currentHeight - 1;
        nextHeight = currentHeight + 1;
    }
    eleMemberHeightMin.innerHTML = preHeight;
    eleMemberHeightMax.innerHTML = nextHeight;
    eleMemberHeight.innerHTML = currentHeight;
}

//体重设置
function setWeight(type) {
    if (type !== OP_ACTION.ASC && type !== OP_ACTION.DESC) {
        return;
    }

    var currentWeight = eleMemberWeight.innerHTML;
    var preWeight;
    var nextWeight;
    if (type === OP_ACTION.ASC) {
        currentWeight++;
        if (currentWeight == 501) {
            currentWeight = 1;
        }
        preWeight = currentWeight - 1;
        nextWeight = currentWeight + 1;
    } else {
        currentWeight--;
        if (currentWeight == 0) {
            currentWeight = 500;
        }
        preWeight = currentWeight - 1;
        nextWeight = currentWeight + 1;
    }
    eleMemberWeightMin.innerHTML = preWeight;
    eleMemberWeightMax.innerHTML = nextWeight;
    eleMemberWeight.innerHTML = currentWeight;
}

