

var Hosp = {
  init:function () {
       this.buttons = [];
       this.createBtns();
      LMEPG.BM.init('container', this.buttons, '', true);
  },
    moveNav:function (key,btn) {
        if (key === 'up'){
            G('container').scrollTop -= 40;
        }
        if (key === 'down'){
            G('container').scrollTop += 40;
        }

    },
  createBtns:function () {
    this.buttons.push( {
        id: 'container',
        name: '',
        type: 'img',
        // nextFocusLeft: '',
        // nextFocusRight: 'doc-1',
        // nextFocusUp: 'dep-5',
        // nextFocusDown: 'dep-',
        // backgroundImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep6.png',
        // focusImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep6_f.png',
        // selectImage: ROOT + '/Public/img/hd/Hospital/NingXiaQvHospital/DoctorIntroduce/dep6_s.png',
        // click: this.clickNav,
        // focusChange: this.depOnFocus,
        beforeMoveChange: this.moveNav
    });
  }
};

function onBack(){
    LMEPG.Intent.back();
}