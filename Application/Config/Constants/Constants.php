<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/11/30
 * Time: 11:19
 */

define('ACCOUNT_TYPE', 1);                                          //账号类型  - 1: 业务账号类型 0: 电话号码
define("IS_RUN_ON_PC", 0);                                          //运行环境  - 1: 在PC端浏览器上运行， 0: 在EPG浏览器上运行
define("IS_USE_CUSTOM_PLAYER", "true");                             // 是否启动自己的播放器（true--表示启动，false--表示不启动）

//客户端版号
define('CLIENT_TYPE', '2');
define('CLIENT_VERSION', '0.1.0'); // 如果各地区对版本有特殊需求，请在Config/common目录下各个地区对应的confxxxx.php里增加CUSTOM_CLIENT_VERSION，对版本进行重新定义。

// 默认值
define('DEFAULT_CARRIER_ID', 0);  // 默认区域ID
define('DEFAULT_ENTER_POSITION', -1);  // 默认局方大厅推荐位入口
define('DEFAULT_ROUTER_TYPE', -1);  // 默认直接跳转模块类型

//入口类型
define('UF_TYPE_HOME', 0);                  // 主页入口
define('UF_TYPE_ALBUM', 1);                 // 专辑入口
define('UF_TYPE_ACTIVITY', 2);              // 活动入口

// 分辨率
define('RES_1920_1080', "1920*1080"); // 1920*1080的分辨率
define('RES_1280_720', "1280*720"); // 1280*720的分辨率
define('RES_640_530', "640*530"); // 640*530的分辨率

//盒端用户类型
define('SL_TYPE_SD', 0);                    //标清用户
define('SL_TYPE_HD', 1);                    //高清用户
define('SL_TYPE_FHD', 2);                   //1080P用户
define('STB_TYPE_SD', "sd");                //标清标识字符串
define('STB_TYPE_HD', "hd");                //高清标识字符串
define('STB_TYPE_FHD', "fhd");              //1080P标识字符串

define("CLASSIFY_SPLASH", "-1");    //启动页推荐
define("CLASSIFY_DEFAULT", "0");    //首页推荐
define("CLASSIFY_TAB_1", "1");    //栏目1
define("CLASSIFY_TAB_2", "2");    //栏目2
define("CLASSIFY_TAB_3", "3");    //栏目3
define("CLASSIFY_TAB_4", "4");    //栏目4
define("CLASSIFY_TAB_5", "5");    //栏目5

define("REDIS_CACHE_ACCESS_MODULE_COUNT", 100); // 保存用户访问路径的条数

// 存在在redis里的导航及页面信息
define("REDIS_EXPIRE_TIME", 600); // 保存数据的有效时长：10*60（秒）

// redis连接校验密码
define("REDIS_AUTH_PASSWORD","JiaFTON1");

// 用户分组（针对用户从IPTV进入小程序的分组）,当前在与小程序配合使用，说明用户在小程序的分组，代表是从IPTV来的
define("USER_GROUP_ID_FOR_APPLET",10000000);

// 导航拦上的ID
define("HOMEPAGE", "11"); // 首页
define("CLASSIFY_1", "21"); // 分类1
define("CLASSIFY_2", "31"); // 分类2
define("CLASSIFY_3", "41"); // 分类3
define("CLASSIFY_4", "51"); // 分类4
define("CLASSIFY_5", "61"); // 分类5
define("CLASSIFY_8", "81"); // 分类8

// entryType类型
define("ENTRY_TYPE_CLASSIFY", "4"); // 视频分类
define("ENTRY_TYPE_VIDEO", "5"); // 视频
define("ENTRY_TYPE_ALBUM", "13"); // 视频专题
define("ENTRY_TYPE_ACTIVITY", "3"); // 活动
define("ENTRY_TYPE_OTHER_URL", "22"); // 跳转具体地址

// 健康视频分类编号 1 健康大讲堂；2 名义微访谈；3 走进医学； 4 减肥跟我学
//define("CLASSIFY_DEFAULT", "0");    //首页推荐
define("CLASSIFY_VIDEO_1", "1");    //健康大讲堂
define("CLASSIFY_VIDEO_2", "2");    //名义微访谈
define("CLASSIFY_VIDEO_3", "3");    //走进医学
define("CLASSIFY_VIDEO_4", "4");    //减肥跟我学
define("CLASSIFY_VIDEO_5", "5");    //保健
define("CLASSIFY_TAB_8", "8");    //栏目8, 甘肃移动新增健康检测功能

// 系统模块各模块类型定义（SYS_M_TYPE：系统模块类型简称） - CWS
define("SYS_M_TYPE_DRUG_INQUIRY", 0);       // 药品查询
define("SYS_M_TYPE_DISEASE_CHECK", 1);      // 疾病自查
define("SYS_M_TYPE_SYMPTOMS_CHECK", 2);     // 症状自查
define("SYS_M_TYPE_HEALTH_TEST", 3);        // 健康自测
define("SYS_M_TYPE_HEALTH_KNOWLEDGE", 4);   // 健康知识管理

// 进入测试入口页面的密码
define("PASSWORD", "3983"); // 公司座机号的后4位

// 路由配置文件，将存在在Runtime/Data/routerConfigxxxxx.php
define('ROUTER_CONFIG', "routerConfig" .CARRIER_ID);

// 视频分页的第一页
define('FIRST_PAGE', 1);

// 数组第一个元素的下标
define('FIRST_ELEMENT_INDEX', 0);
// 数组第二个元素的下标
define('SECOND_ELEMENT_INDEX', 1);

return array();


