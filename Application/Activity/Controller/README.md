# 通用活动（Activity）控制器说明与使用： 
---
### 一、活动控制器：
> 通用活动控制器名 - ActivityCommonController.class.php

### 二、活动控制器结构预览：
```
ActivityCommonController
|
|----方法（methods）
|       |-----------guideUI             （活动首页）
|       |-----------indexUI             （活动游戏页）
|       |-----------winListUI           （活动中奖页）
|       |-----------dialogUI            （活动弹窗页）
|       |-----------exchangePrizeUI     （奖品兑换页）
|       |---------------------------------------------------------------------------------------------------------------
|       |-----------__construct：                构造函数，初始化一些全局数据
|       |-----------initParams：                 构造函数中调用，初始化默认参数
|       |-----------initCommonRender：           初始化通用渲染（父类BaseController统一实现）
|       |-----------parseUrlParam：              解析Session、Get等传递参数
|       |-----------initCommonActivityRender：   渲染通用活动页面数据
|       |-----------getActivityMode：            获取 [当前应用内活动] 在 [当前地区] 的目录模式。例如：V1, V2, V3, V3...
|       |-----------setPrivateParams_guideUI/indexUI/winListUI/dialogUI/exchangePrizeUI：对特殊活动而言，设置不同的私有数据
|-------+---------------------------------------------------------------------------------------------------------------
|----全局属性（fields）
|       |- protected $userId                           // 用户id
|       |- protected $isVip;                           // 获取是否退订 $epgVip==0为未退订
|       |- protected $inner = 1;                       // inner = 1,表示应用内跳转，inner = 0,表示应用外进来
|       |- protected $context = "";                    // 弹框内容（rule--> 活动规则）
|       |- protected $prizeName = "";                  // 奖品名称
|       |- protected $prizeIdx = 0;                    // 奖品id
|       |- protected $bg = "";                         // 背景来源，dialog使用
|       |- protected $contentId = CONTENT_ID;          // 订购VIP产品content_id
|       |- protected $leftTimes = 0;                   // 剩余次数
|       |- protected $demoTimes = 0;                   // 试玩次数
|       |- protected $score = 0;                       // 用户活动积分
|       |- protected $isOrderBack = 0;                 // 是否为订购返回（1--是订购返回， 0--不是订购返回）
|       |- protected $backEPGUrl = "";                 // 返回地址（联合活动：返回大厅首页，应用活动：返回首页）
|       |- protected $isJointActivity = false;         // 当前活动是否为联合活动，使用规范使命判断：ActivityManager::isJointActivity()
|       |- protected $activityName = "";               // 活动标识名称（例如：ActivityMidAutumn20180815）
|       |- protected $activityPageFolder = "";         // 活动页面所属目录（例如：/Application/Activity/View/ActivityMidAutumn）
|       |- protected $currentActivityMode = "";        // 同一活动，不同地区对应不同目录模式（例如：union, V1,ect）
|       |- protected $goHtmlPrefix = "";               // 同一活动，不同地区对应的统一的跳转前缀（例如：/ActivityMidAutumn/union/, /ActivityMidAutumn/V1/, etc.）
|-----------------------------------------------------------------------------------------------------------------------

4个活动UI页面方法结构类似，前3行代码均如下，例如：
public function guideUI()
{
    // 初始化参数渲染
    $this->initCommonRender();
    $this->parseUrlParam();
    $this->initCommonActivityRender();
    
    //
    // TODO 根据不同页面跳转，assign不同参数到页面...
}

```

### 二、约定规范遵守：
> 1. 目前活动基本分为首页（guideUI）、游戏面（indexUI）、中奖面（winListUI）、奖品兑换页（exchangePrizeUI）和弹窗页（dialogUI）5个常用入口页面。
> 2. 同一活动（例如：JointActivityMidAutumn20180815，ActivityMidAutumn20180815）对应同一html/js/css页面根目录，  
如：Activity/View/ActivityMidAutumn/union，Activity/View/ActivityMidAutumn/V1……
> 3. 二级目录union，V1，V2等表示含义：  
    union：表示联合活动的二级目录。   
    V1/V2/V3/...：V1/V2/V3分别表示同一活动，对应不同地区（carrier_id）所在的二级目录，其定义在：getActivityMode()
> 4. 活动的4个入口页面guideUI/indexUI/winListUI/dialogUI分别对应的html/css文件名命名约定为：Activity/View/{活动根目录}/{活动二级目录}/xxx.html  
    例如：
    a' 联合活动：
            Activity/View/ActivityMidAutumn/union/guide.html
            Activity/View/ActivityMidAutumn/union/index.html
            Activity/View/ActivityMidAutumn/union/dialogue.html
            Activity/View/ActivityMidAutumn/union/winners.html
            Activity/View/ActivityMidAutumn/union/exchange.html
    b' 应用内活动：
            Activity/View/ActivityMidAutumn/V1/guide.html
            Activity/View/ActivityMidAutumn/V1/index.html
            Activity/View/ActivityMidAutumn/V1/dialogue.html
            Activity/View/ActivityMidAutumn/V1/winners.html   
            Activity/View/ActivityMidAutumn/V1/exchange.html
    【特别注意是：5个页面命名必须为：guide.html、index.html、dialogue.html、winners.html、exchange.html！！！】
> 

### 三、使用说明：
1. 当活动规则、试玩次数、设置/读取手机号、抽奖、参与记录等交互都是基本一致的活动，基本可以复用ActivityCommonController.class.php。
2. 先在Application/Config/Router/Conf{carrier_id}.php中注册，例如：
```php
/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("ALL_VIEW_PAGES", "return array(
    ...
    'activityV2' => '/Activity/ActivityV2/index',                                   // 活动主页入口
    'activity-common-guide'         => '/Activity/ActivityCommon/guide',            // 通用活动 - 引导页
    'activity-common-dialog'        => '/Activity/ActivityCommon/dialog',           // 通用活动 - 弹框页
    'activity-common-home'          => '/Activity/ActivityCommon/index',            // 通用活动 - 活动主页
    'activity-common-winList'       => '/Activity/ActivityCommon/winList',          // 通用活动 - 中奖页面
    'activity-common-winList'       => '/Activity/ActivityCommon/winList',          // 通用活动 - 中奖页面
    'activity-common-exchange'      => '/Activity/ActivityCommon/exchangePrize',    // 通用活动 - 奖品兑换页
    'activity-common-thirdPartySP'  => '/Home/Debug/jointActivityOtherSP',          // 通用活动 - 第三方sp页面
    ...
)");
```
3. 在 Application/Home/Model/Activity/ActivityConstant.class.php中getActivityFolders()方法中添加活动配置：
```php
/**
 * <p>配置各个活动的页面存放目录。</p>
 * <p><b><span style="color:#FF00FF">作用：主要用于判断某一活动是否在本地已注册开发。</span></b></p>
 * <pre>
 * 使用“活动唯一标识”与“页面所在目录”一一对应注册。
 *      配置格式，如：['活动SubId' => '目录']
 * </pre>
 *
 * <p><span style="color:#FF00FF">注意：每当开发一个活动，即需要在此方法返回数组中添加对应的配置！以便在进入应用后检测到
 * 有配置活动或者点击某一推荐位活动，进入活动相关控制器时，会用到之判断是否有匹配的活动注册。有的话，表示已开发该活动。
 * 否则，会进入错误提示重定向页面！
 * </span></p>
 *
 * @return array 返回数组, e.g ['活动SubId' => '目录']
 */
public static function getAllActivityFolders()
{
    return array(
        // 应用内活动声明区域：
        'ActivityMidAutumn20180815' => 'ActivityMidAutumn',                     // “月饼欢乐送” -> 页面目录
        ...

        // 联合活动声明区域：
        'JointActivityMidAutumn20180815' => 'ActivityMidAutumn',                // “月饼欢乐送” -> 页面目录
        ...
    );
}
```
3. 页面跳转js代码调用例如：
```javascript
var objCurrent = LMEPG.Intent.createIntent("activity-common-guide");//activity-common-guide/Dialog/Home/winList/thirdPartySP
objCurrent.setParam("userId", "{$userId}");
objCurrent.setParam("inner", "{$inner}");

var objDialog = LMEPG.Intent.createIntent("activity-common-dialog");//activity-common-guide/Dialog/Home/winList/thirdPartySP
objDialog.setParam("userId", "{$userId}");
objDialog.setParam("inner", "{$inner}");
objDialog.setParam("leftTimes", "{$leftTimes}");
objDialog.setParam("context", text);

LMEPG.Intent.jump(objDialog, objCurrent);
```

### 四、扩展说明：
若某一活动规则超出一般通用活动的规则及复杂度，可能需要另写Controller以单独处理，但通用的基本数据还是可以复用ActivityCommonController.class.php中已实现的。

实现步骤：
1. 新建ActivityXXXController extends ActivityCommonController。
2. 覆写构造函数：
```php
public function __construct()
{
    parent::__construct();
    //
    // TODO 如需特殊处理，自定义初始化当前活动所需数据。
}
```
3. 按需覆写-构造函数中初始化默认参数方法：initParams
```php
protected function initParams()
{
    parent::initParams();
    //
    // TODO 如需特殊处理，请自定义...
}
```
4. 按需覆写-解析session、get参数方法：parseUrlParam
```php
protected function parseUrlParam()
{
    parent::parseUrlParam();
    //
    // TODO 如需特殊处理，请自定义...
}
```
5. 按需覆写-初始化通用渲染活动参数方法：initCommonActivityRender
```php
protected function initCommonActivityRender()
{
    parent::initCommonActivityRender();
    //
    // TODO 如需特殊处理，请自定义...
}
```
6. 按需覆写-config页面配置：config
```php
//
// 如下是ActivityCommonController.class.php中的默认实现，按照约定的命名实现：guide.html/index.html/winners.html/dialogue.html
//
/**
 * 页面配置，在子类中实现页面配置，返回页面配置的数组
 * @return array 返回页面配置数组
 */
public function config()
{
    return array(
        "indexUI" => $this->goHtmlPrefix . "index",
        "guideUI" => $this->goHtmlPrefix . "guide",
        "dialogUI" => $this->goHtmlPrefix . "dialogue",
        "winListUI" => $this->goHtmlPrefix . "winners",
        "exchangePrizeUI" => $this->goHtmlPrefix . "exchange",
    );
}

覆写：
public function config()
{
    // TODO 如需特殊处理，请自定义...
}
```

### 五、附加说明：
活动的其它实时交互数据接口，诸如：获取/提交手机号、获取试玩剩余次数、抽奖、上传参与记录等。

请详见：
- **Application/Api/APIController/ActivityAPIController.class.php**

js交互代码示例：
```javascript
LMEPG.ajax.postAPI('Activity/canAnswer', null,
    function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            var result = data.result;
            if (result == 0) {
                leftTimes = data.leftTimes;
                demoTimes = data.demoTimes;
                spMap = data.spMap;
            } else {
                leftTimes = 0;
            }
            // TODO
        } catch (e) {
            LMEPG.UI.showToast("判断用户是否可以试玩，解析异常！");
            LMEPG.Log.error(e.toString());
            LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
        }
    },
    function (rsp) {
        LMEPG.UI.showToast("判断用户是否可以试玩失败");
        LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
    }
);
```

---

—— 宋辉 2018-9-3