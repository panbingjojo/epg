(function (w, doc, arg, root) {

	var KEY_BACK = 0x0008; // 返回
	var KEY_BACK_640 = 0x0280; // 返回按键（值为640）
	var KEY_ENTER = 0x000D; // 确定
	var KEY_UP = 0x0026; // 上
	var KEY_DOWN = 0x0028; // 下
	var KEY_DOWN_83 = 0x0053; // 下
	var KEY_0 = 0x0030; // 0 todo reload test

	var focus = 'game-start'; // 焦点保存
	var isRunning = false; // 标记游戏中
	var isJumping = false; // 标记起跳了
	var modal = false; // 标记弹框
	var guyElement = $('guy');
	var tips = {};
	var Hurdle = {};
	var buttons = {};
	var focusAction = {};
	var addEventHandler;

	function $(id) {
		return doc.getElementById(id);
	}

	/**
     * 提示信息对象
     */
	tips = {
		createTip: function (msg, ret) {
			var tipEl = $('tip');

			if (!tipEl) {
				tipEl = tipEl ? tipEl : doc.createElement('div');
				tipEl.id = 'tip';
				tipEl.className = arg.resolution + '-tip';
				$('container').appendChild(tipEl);
			}

			tipEl.innerHTML = msg;
			setTimeout(() => {
				focusAction.back(ret);
			}, 2000);
		},

		show: function (msg, ret) {
			this.createTip(msg, ret);
		}
	};

	/*
     *游戏跨栏对象
     */
	Hurdle = {
		/**
         * 开始跨栏（X方向移动）
         * 初始化参数
         */
		startMoveX: function () {
			var St = 5; // 移动常数St
			var xBg = 0; // 背景移动距离
			var xRoad = 0; // 跑道移动距离
			var xLoop = 0; // 记录距离循环
			var nImg = 0; // 图片索引值
			var count = 0; // 跨栏个数
			var xStop = arg.resolution === 'hd' ? [-350, -630] : [-190, -310]; // 结束游戏距离
			var roadElement = $('game-wrapper');
			var containerElement = $('container');
			var hurdleElement = $('hurdle-count');
			var moveX = {
				/*偏移*/
				offsetX: function () {
					var num = 2 * St;

					xBg -= St;
					xRoad -= num;
					xLoop -= num;
					moveX.counter();
					moveX.animateBg();
					moveX.animateGuy();
				},

				/*计数器*/
				counter: function () {
					var index = count === 0 ? 0 : 1;

					if (xLoop <= xStop[index] - 10) {
						xLoop = 0;
						count += 1;
					}
					hurdleElement.innerText = '跨栏个数：' + count + '/10';
				},

				/*背景、跑道动画开始*/
				animateBg: function () {
					roadElement.style['background-position'] = xRoad + 'px'; // 跑道做移动
					containerElement.style['background-position'] = xBg + 'px'; // 背景做移动
				},

				/*人物动画开始*/
				animateGuy: function () {
					if (!isJumping) {
						nImg === 4 ? nImg = 1 : nImg += 1;
						guyElement.src = g_appRootPath+ '/Public/img/hd/Activity/UnionActivityHurdle/img/' + arg.resolution + '/s' + nImg + '.png'; // 人物动起来
					}
				},

				/*更新状态*/
				updateX: function () {
					moveX.isStopGame();
					moveX.offsetX();
				},

				// 游戏是否结束
				isStopGame: function () {
					// console.log('xLoop==>' + xLoop);
					var index = count === 0 ? 0 : 1;
					var isMaxCount = count === 10;
					var msg;
					var ret;

					// 超过栏杆间距距离还没有起跳；或者达到最大跨栏个数10个
					if (!isJumping && xLoop <= xStop[index] || isMaxCount) {
						msg = isMaxCount ? '恭喜你成功跨过所有栏杆~,即将返回。' : '很遗憾跨栏失败了~，即将返回。';
						ret = isMaxCount ? 0 : 9;

						clearInterval(moveX.timer);
						isRunning = false;
						tips.show(msg, ret);
					}
				}
			};

			isRunning = true;
			$('btn-rule').style.visibility = 'hidden';
			$('game-start').style.visibility = 'hidden';
			clearInterval(moveX.timer);
			moveX.timer = setInterval(moveX.updateX, 60);
		},

		/**
         * 人物起跳动作Y方向移动
         */
		startMoveY: function () {
			// 滞空时间
			var stayTime = arg.resolution === 'hd' ? 800 : 500;
			var moveY = {
				// 起跳
				jump: function () {
					isJumping = true;
					moveY.update();
				},

				// 更新人物状态
				update: function () {
					var resolution = arg.resolution;

					guyElement.className = resolution + '-guy ' + resolution + '-guyJumpHeight';
					// 人物跳起来
					guyElement.src = g_appRootPath+ '/Public/img/hd/Activity/UnionActivityHurdle/img/' + resolution + '/jump.png';
					moveY.hover();
				},

				// 滞空
				hover: function () {
					setTimeout(() => {
						// 还原状态
						guyElement.className = arg.resolution + '-guy';
						isJumping = false;
					}, stayTime);
				}
			};

			moveY.jump();
		}
	};

	/**
     * 焦点行为对象
     */
	focusAction = {
		// 起跳
		jump: function () {
			var guyClassName = guyElement.className;
			var guyDefaultClassName = arg.resolution + '-guy';

			if (isJumping && guyClassName === guyDefaultClassName) return;
			Hurdle.startMoveY();
		},

		// 移动
		move: function (key, btn) {
			if (!btn['nextFocus' + key]) return;
			if (key === 'Up' && btn.id === 'game-start') {
				focus = btn.nextFocusUp;
			}
			if (key === 'Down' && btn.id === 'btn-rule') {
				focus = btn.nextFocusDown;
			}
			focusAction.active(btn, buttons[focus]);
		},

		// 点击
		click: function (btn) {

			if (btn.id === 'btn-rule') {
				modal = true;
				focus = '';
				$('modal-rule').style.display = 'block';
			}

			if (btn.id === 'game-start') {
				if (isRunning) return;
				Hurdle.startMoveX();
				focus = 'guy';
			}
		},

		// 得到焦点
		active: function (prevBtn, currBtn) {

			var prevFocusEl = $(prevBtn.id);
			var currFocusEl = $(currBtn.id);

			if (prevFocusEl) prevFocusEl.src = prevBtn.bgImg;
			if (currFocusEl) {
				currFocusEl.src = currBtn.FocusBgImg;
			} else {
				alert('按钮不存在！');
			}
		},

		// 返回
		back: function (ret) {
			switch (true) {
			case modal:
				$('modal-rule').style.display = 'none';
				focus = 'btn-rule';
				modal = false;
				break;
				// 游戏中不做什么
			case isRunning:
				return false;
			default:
				location.href = arg.backUrl + '&playResult=' + ret;
				break;
			}
		}
	};

	/**
     * 按钮对象
     */
	buttons = {
		guy: {
			id: 'guy',
			move: focusAction.jump
		},
		'game-start': {
			id: 'game-start',
			nextFocusUp: 'btn-rule',
			bgImg: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/UnionActivityHurdle/img/' + arg.resolution + '/btn_start.png',
			FocusBgImg: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/UnionActivityHurdle/img/' + arg.resolution + '/btn_start_f.png',
			onFocus: focusAction.active,
			click: focusAction.click,
			move: focusAction.move
		},
		'btn-rule': {
			id: 'btn-rule',
			nextFocusDown: 'game-start',
			bgImg: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/UnionActivityHurdle/img/' + arg.resolution + '/btn_rule.png',
			FocusBgImg: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/UnionActivityHurdle/img/' + arg.resolution + '/btn_rule_f.png',
			onFocus: focusAction.active,
			click: focusAction.click,
			move: focusAction.move
		}
	};

	/**
     * 事件监听
     */
	addEventHandler = function (ev) {
		var code = ev.keyCode || ev.which || ev.charCode;
		var currBtn = buttons[focus];

		if (!focus && code !== KEY_BACK) return;

		ev.stopPropagation();
		ev.preventDefault();

		switch (code) {
		case KEY_0:
			location.reload();
			break;
		case KEY_BACK:
		case KEY_BACK_640:
			focusAction.back(9);
			break;
		case KEY_ENTER:
			buttons[focus].click(buttons[focus]);
			break;
		case KEY_UP:
			currBtn.move('Up', buttons[focus]);
			break;
		case KEY_DOWN:
		case KEY_DOWN_83:
			currBtn.move('Down', buttons[focus]);
			break;
		default:break;
		}
	};

	focusAction.active('', buttons[focus]);
	doc.onkeydown = addEventHandler;

// eslint-disable-next-line no-undef
}(window, document, renderParam, ROOT));
