/**
 * 科室医生简介
 */
var Dep = {
    departData: [],
    CURRENT_PAGE: 1,
    docData: [],
    MAX_SIZE: 7,
    index: 0,
    init: function () {
        this.pageIndex = 1;
        this.scrollCount = 0;
        this.keepNavFocusId = 'dep-1';
        this.keepDocFocusId = 'doc-1';
        this.isFistEnter = 0;
        this.buttons = [];
        Dep.ajaxData();
    },
    ajaxData: function () {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalExpertInfo", {
            "hospital_id": "",
            "hospital_name": "宁夏回族自治区人民医院互联网医院"
        }, function (rsp) {
            try {
                window.test = rsp.list;
                console.error(window.test)
                console.error(JSON.stringify(window.test))
                if (rsp.result == 0) {
                    console.log("list>>" + rsp.list)
                    Dep.createBtns();
                    var all = [];
                    for (var i in rsp.list) {
                        var item = rsp.list[i];
                        var jsonStr = {
                            "departName": i,
                            "value": item,
                        };
                        console.log("dept:" + i)
                        Dep.departData.push(jsonStr);
                        for (var j = 0; j < item.length; j++) {
                            all.push(item[j])
                        }
                    }
                    var allList = {
                        "departName": "全部",
                        "value": all,
                    }
                    Dep.departData.unshift(allList)
                    Dep.departData.shift();
                    Dep.createDep();
                    // Dep.keepNavFocusId = "dep-1";
                    LMEPG.BM.requestFocus("dep-1");
                    console.log(Dep.departData);
                } else {

                }
            } catch (e) {
                LMEPG.UI.showToast("医生数据拉取失败:" + e);
            }
        })

    },
    depOnFocus: function (btn, bol) {
        if (bol) {
            Dep.keepNavFocusId = btn.id;
            Dep.index = G(btn.id).getAttribute("data-link");
            Dep.docData = Dep.departData[Dep.index];
            Dep.renderDoctorList(Dep.docData);
            LMEPG.CssManager.removeClass(G('departName-' + btn.cIdx), 'select-color');
            LMEPG.CssManager.addClass(G('departName-' + btn.cIdx), 'defalt-color');
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start('departName-' + btn.cIdx, 7, 8, 50, "left", "scroll");
            //     if(Dep.docData.departName.length > 7)
            //         (G('departName-' + btn.cIdx).innerHTML = "<marquee>" +  Dep.docData.departName + "</marquee>");
            //     LMEPG.CssManager.removeClass(G('departName-' + btn.cIdx), 'select-color');
            //     LMEPG.CssManager.addClass(G('departName-' + btn.cIdx), 'defalt-color');
            // }else{
            //     if(Dep.docData.departName.length > 7)
            //         G('departName-' + btn.cIdx).innerHTML = Dep.docData.departName;
        }else {
            LMEPG.UI.Marquee.stop();
        }
    },
    cut: function (data, page, max) {
        return data.slice((page - 1) * max, max * page);
    },
    createDep: function () {
        LMEPG.UI.Marquee.stop();
        G("nav-wrap").innerHTML = "";
        var currentData = Dep.cut(Dep.departData, Dep.CURRENT_PAGE, Dep.MAX_SIZE);
        var strHtml = "";
        var imgIndex = 0;
        for (var i = 0; i < currentData.length; i++) {
            imgIndex = Dep.MAX_SIZE * (Dep.CURRENT_PAGE - 1) + i;
            var url = encodeURI(g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department.png');
            // strHtml += '<img id="dep-' + (i + 1) + '"  data-link="' + imgIndex + '" src="' + url + '"  >';
            strHtml += '<div class="dep-comment"><img id="dep-' + (i + 1) + '"  data-link="' + imgIndex + '" src="' + url + '"  >';

            strHtml += '<span id="departName-' + (i + 1) + '" class="departName defalt-color">' + currentData[i].departName + '</span></div>';
        }
        G("nav-wrap").innerHTML = strHtml;
        LMEPG.BM.init('dep-1', Dep.buttons, '', true);
        for (var i = 0; i < currentData.length; i++) {
            // LMEPG.BM.getButtonById("dep-" + (i + 1)).backgroundImage=encodeURI(g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/' + currentData[i].departName + '-未选中.png');
            // LMEPG.BM.getButtonById("dep-" + (i + 1)).focusImage=encodeURI(g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/' + currentData[i].departName + '-选中.png');
            // LMEPG.BM.getButtonById("dep-" + (i + 1)).selectImage=encodeURI(g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/' + currentData[i].departName + '-选中移开.png');

            LMEPG.BM.getButtonById("dep-" + (i + 1)).src =
                g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department.png';
            LMEPG.BM.getButtonById("dep-" + (i + 1)).focusImage =
                g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department_f.png';
            LMEPG.BM.getButtonById("dep-" + (i + 1)).selectImage =
                g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department_l.png';
        }
    },
    clickNav: function (btn) {
        /*var keepFocs = Dep.keepNavFocusId;
         G(keepFocs).src = LMEPG.BM._buttons[keepFocs].backgroundImage;
         Dep.keepNavFocusId = btn.id;
         Dep.renderDoctorList();
         LMEPG.BM.requestFocus(btn.id);*/
    },
    prevPge: function () {
        if (Dep.CURRENT_PAGE > 1) {
            Dep.CURRENT_PAGE--;
            //MenuList.initButton();
            Dep.createDep();
            LMEPG.BM.init("dep-3", Dep.buttons, "", true);
        }
    },
    nextPge: function () {
        if (Dep.CURRENT_PAGE < Math.ceil(Dep.departData.length / Dep.MAX_SIZE)) {
            Dep.CURRENT_PAGE++;
            //MenuList.initButton();
            Dep.createDep();
            LMEPG.BM.init("dep-1", Dep.buttons, "", true);
        }
    },
    switchPage: function (dir, current) {
        switch (dir) {
            case "down":
                if (current.id == "dep-7") {
                    Dep.nextPge();
                    // LMEPG.BM.requestFocus("list-box-3");
                    return false;
                }
                return;
            case "up":
                if (current.id == "dep-1") {
                    if (Dep.CURRENT_PAGE == 1) {
                        LMEPG.BM.requestFocus("back");
                    } else {
                        Dep.prevPge();
                        LMEPG.BM.requestFocus("dep-7");
                        return false;
                    }
                }
                return;
                break;
            case "right":
                var selectFocusBtn = LMEPG.BM._buttons[Dep.keepNavFocusId];
                LMEPG.BM.requestFocus(Dep.keepDocFocusId);
                if (G(selectFocusBtn.nextFocusRight)) {
                    G(Dep.keepNavFocusId).src = LMEPG.BM._buttons[Dep.keepNavFocusId].selectImage;
                    LMEPG.CssManager.removeClass(G('departName-' + current.cIdx), 'defalt-color');
                    LMEPG.CssManager.addClass(G('departName-' + current.cIdx), 'select-color');
                }
                return;
        }
    },

    moveScroll: function (key, btn) {
        var scrollElement = null;
        var onceStepNum = 40; // 滚动一次的距离

        if (key === 'left') {
            LMEPG.BM.requestFocus(Dep.keepNavFocusId);
            return false;
        }

        scrollElement = G('content-wrap');
        if (key === 'up') {
            if (Dep.departData[Dep.index].value.length <= 2) {
                LMEPG.BM.requestFocus('doc-1');
                return;
            }
            Dep.isMoveDocFocus(key);
            scrollElement.scrollTop -= onceStepNum;
        }

        if (key === 'down') {
            if (Dep.departData[Dep.index].value.length <= 2) {
                LMEPG.BM.requestFocus('doc-2');
                return;
            }
            Dep.isMoveDocFocus(key);
            scrollElement.scrollTop += onceStepNum;
        }
    },
    isMoveDocFocus: function (key) {
        var mveDocFocusHeightTimes = 6; // 一个焦点医生高度需要滚动的次数
        if (Dep.scrollCount === mveDocFocusHeightTimes) {
            Dep.scrollCount = 0;
            Dep.pageIndex = key === 'up' ? Math.max(1, Dep.pageIndex -= 1) : Math.min(Dep.maxDocFocus, Dep.pageIndex += 1);
            Dep.maxDocFocus === Dep.pageIndex ? H('down-arrow') : S('down-arrow');
            Dep.keepDocFocusId = 'doc-' + Dep.pageIndex;
            LMEPG.BM.requestFocus('doc-' + Dep.pageIndex);
            console.log('Dep.pageIndex===' + Dep.pageIndex);
        } else {
            Dep.scrollCount += 1;
        }
    },
    renderDoctorList: function (data) {
        var depDocData = data;
        var count = depDocData.value;
        var innerElement = G('content-wrap');
        var htm = '';
        for (var i = 0; i < count.length; i++) {
            this.createDoctorButtons(i);
            htm += '<div id="doc-' + (i + 1) + '" class="doc" style="background-image: url(' + g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep_box.png)">';
            htm += ' <div class="hospital-detail">';
            htm += '<img id="photo" class="hospital-photo" src="' + RenderParam.resourceUrl + count[i].doctor_avatar + '">';
            htm += '<div class="introduce">';
            htm += '<div id="name" class="doctor-word2">' + count[i].doctor_name + ' <span id="department">&nbsp;&nbsp;&nbsp;&nbsp;' + count[i].doctor_level + ' </span></div> ';
            // htm += '<div id="department" class="doctor-word">职称：' +count[i].doctor_level+' </div>';
            htm += '<div id="position" class="doctor-word">科室： ' + count[i].dept_name + ' </div>';
            htm += '<div class="content-detail" id = "content-detail">擅长： ' + count[i].doctor_intro + ' </div>';
            htm += '</div>';
            htm += '</div>';
            htm += '</div>';
            htm += '</div>';
        }
        S('down-arrow');
        Dep.maxDocFocus = count.length;
        if (!htm) {
            H('down-arrow');
            htm = '<span id="null-data">该科室暂未开放</span>';
        }
        if (count.length < 3) {
            H('down-arrow');
        }
        Dep.pageIndex = 1;
        Dep.keepDocFocusId = 'doc-1';
        innerElement.scrollTop = 0;
        innerElement.innerHTML = htm;
    },
    createDoctorButtons: function (num) {
        LMEPG.BM.addButtons({
            id: 'doc-' + (num + 1),
            name: '',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep_box.png',
            focusImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep_box_f.png',
            click: '',
            focusChange: '',
            beforeMoveChange: Dep.moveScroll
        });
    },
    createBtns: function () {
        this.buttons.push({
            id: 'back',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'doc-1',
            nextFocusUp: '',
            nextFocusDown: 'dep-1',
            backgroundImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/back.png',
            focusImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/back_f.png',
            click: onBack,
            focusChange: '',
        }, {
            id: '',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: '',
            focusChange: '',
            beforeMoveChange: ''
        })

        for (var i = 1; i < 8; i++) {
            this.buttons.push(
                {
                    id: 'dep-' + i,
                    name: '',
                    type: 'img',
                    nextFocusLeft: '',
                    nextFocusRight: 'doc-1',
                    nextFocusUp: 'dep-' + (i - 1),
                    nextFocusDown: 'dep-' + (i + 1),
                    backgroundImage: g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department_f.png',
                    selectImage: g_appRootPath + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/department_l.png',
                    click: this.clickNav,
                    focusChange: this.depOnFocus,
                    beforeMoveChange: this.switchPage,
                    cIdx: i
                }
            )
        }
    },
};