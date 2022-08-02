<?php

/**
 * HTTP 请求管理类
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/11/30
 * Time: 18:50
 */

namespace Home\Model\Common;

use Home\Model\Entry\MasterManager;


class HttpManager
{
    const TIMEOUT_CONF = 30;//30秒超时
    //CWS接口定义
    const PACK_ID_AUTH_USER = '17069';                                  // 新用户校验
    const PACK_ID_REG = '17001';                                        // 新用户注册
    const PACK_ID_ACTIVETE = '17005';                                   // 用户激活
    const PACK_ID_LOGIN = '17009';                                      // 登录接口
    const PACK_ID_CHANNEL = '11001';                                    // 获取视频列表
    const PACK_ID_ALBUM_DETAIL = '11004';                               // 获取专题信息
    const PACK_ID_HOME = '11003';
    const PACK_ID_GET_ALBUM_ID_BY_ALIAS = '11016';                      // 通过专题别名获取专题id
    const PACK_ID_GATHER_ALBUM_ACCESS = '11024';                        // 采集专辑访问量
    const PACK_ID_ALBUM = '11017';                                      // 通过专题别名获取专题信息
    const PACK_ID_TEMPLATEID = '11029';                                  // 通过专图文id取专题信息
    const PACK_ID_TEMPLATECODE = '11033';                                // 通过专图文唯一编码取专题信息
    const PACK_ID_CLASSIFY = '11006';                                    // 视频分类信息
    const PACK_ID_RECOMMEND = '11008';                                   // 推荐视频
    const PACK_ID_HOTSEARCHTEXT = '11011';                               // 热搜词汇
    const PACK_ID_REPORT_BEGIN_PLAY_VEDIO = '11012';                     // 上报视频播放记录：开始播放
    const PACK_ID_SEARCHVIDEO = '11013';                                 // 搜索视频
    const PACK_ID_REPORT_END_PLAY_VIDEO = '11014';                       // 上报视频播放记录：结束播放
    const PACK_ID_HOTSEARCHVIDEO = '11015';                              // 获取热搜视频列表
    const PACK_ID_VERIFY_USER_CODE = "17013";                            //用户校验码过期校验
    const PACK_ID_IS_TESTUSER = '17014';                                 // 判断用户是否是测试用户
    const PACK_ID_IS_VIP = '17015';                                      // 校验用户是否是vip用户
    const PACK_ID_VIPTYPE = '17029';                                     // 获取订购项
    const PACK_ID_GETORDER = '17031';                                    // 创建订单
    const PACK_ID_HEART = '17035';
    const PACK_ID_BIND_USER_ACCOUNT = "17036";                          // 绑定手机号码或宽带账号
    const PACK_ID_QUERY_BIND_USER_ACCOUNT = "17037";                    //
    const PACK_ID_GET_VIP_INFO = "17039";                                // 获取vip信息
    const PACK_ID_ORDER_SUCCESS_ADD_TEL = "17045";                        //购买vip套餐第三方支付成功后，添加联系电话
    const PACK_ID_QUERY_VIP_INFO = '17046';                              // 查询vip信息扩展
    const PACK_ID_QUERY_BLACKLIST_VERIFY = '17047';                      // 校验黑名单
    const PACK_ID_QUERY_STORE_DATA = '17049';                              // 获取客户端存储的数据
    const PACK_ID_SAVE_STORE_DATA = '17048';                              // 保存客户端存储的数据
    const PACK_ID_DELETE_STORE = '17050';                                 // 删除客户端存储的数据
    const PACK_ID_QUERY_GUY_NUM = '17070';                                  // 查询用户购买数量
    const PACK_ID_ADD_GUY_NUM = '17071';                                  // 添加购买数量
    const PACK_ID_QUERY_PAY_URL = '17072';                                  // 查询用户URL
    const PACK_ID_ADD_PAY_URL = '17073';                                  // 添加用户URL
    const PACK_ID_APPOINTMENT_INTERFACE = '17074';                        // 预约挂号接口
    const PACK_ID_ADD_AUTH_RES = '17075';                                 // 添加鉴权结果
    const PACK_ID_EXT_ACTIVITY_VERIF = '17078';                           // 外部活动校验黑名单接口
    const PACK_ID_EXT_VIP_VERIF = '17079';                                // 外部接口校验VIP接口
    const PACK_ID_GET_INQUIRY_QR_CODE = '17076';                          // 甘肃移动获取问诊二维码url连接
    const PACK_ID_USERBUYVIP_REQUEST_GET_ORDER = '17044';                // 向服务器获取订单(订购次数判断折扣，第三方支付下单)
    const PACK_ID_GET_UHD_ORDER_URL = '17080';                           // UHD创建订购，获得订购地址
    const PACK_ID_GET_BOX_INTER_DATA = '17085';                           // 盒子相关数据

    const PACK_ID_GET_MAC_LOGIN_INFO = '23001';                          // 获得MAC登录数据信息
    const PACK_ID_SET_MAC_LOGIN_INFO = '23002';                          // 设置MAC登录数据信息
    const PACK_ID_MODIFY_MAC_LOGIN_INFO = '23003';                       // 修改MAC登录数据信息
    const PACK_ID_GET_MAC_JUMP_INFO = '23004';                           // 获得MAC跳转数据信息
    const PACK_ID_SET_MAC_JUMP_INFO = '23005';                           // 设置MAC跳转数据信息
    const PACK_ID_GET_EXPER_GRADE_INFO = '23006';                        // 获得用户经验等级信息
    const PACK_ID_GET_EXPER_GRADE_DATA = '23007';                        // 获得用户经验排行数据
    const PACK_ID_MODIFY_HAND_NAME_INFO = '23008';                       // 修改头像昵称数据信息
    const PACK_ID_GAME_SCORE_REPORT = '23009';                           // 游戏分数数据信息上报
    const PACK_ID_GAME_INSTALL_REPORT = '23010';                         // 游戏安装数据信息上报
    const PACK_ID_GET_GAME_INSTALL_INFO = '23011';                       // 获得安装游戏信息数据
    const PACK_ID_GAME_HAND_IMG_UPLOAD = '23012';                        // 游戏头像上传数据接口
    const PACK_ID_GAME_SIGN_IN = '23013';                                // 游戏签到
    const PACK_ID_GET_GAME_CODE_DETAILS = '23014';                       // 获取游戏配置详情数据
    const PACK_ID_GET_GAME_HAND_DATA = '23015';                          // 获取游戏头像全部数据
    const PACK_ID_GAME_DIAMOND_CONVERT_HAND = '23016';                   // 游戏钻石兑换头像
    const PACK_ID_GAME_VERSION_UPGRADE = '23017';                        // 游戏版本升级
    const PACK_ID_GET_GAME_HAND_QRCODE = '23018';                        // 获取游戏头像二维码
    const PACK_ID_GET_ALL_GAME_INFO = '23019';                           // 获取游戏所有信息
    const PACK_ID_GAME_CARD_ADD = '23020';                               // 游戏乐卡赠送
    const PACK_ID_GET_GAME_CARD = '23021';                               // 获得游戏乐卡
    const PACK_ID_GAME_QR_CODE_REV = '23022';                            // 二维码状态调整

    const PACK_ID_IS_PAY = '21003';
    const PACK_ID_UN_REG_VIP = '21008';                                      // 到局方鉴权后，以局方身份为准，注销我方VIP
    const PACK_ID_LASTORDER = '21009';
    const PACK_ID_REG_VIP = '21011';                                      //  客户端与局方校验后注册vip（有效期为24个小时）

    const PACK_ID_SYS_CFG = '80002';                                     // 获取系统配置信息：包括首页、分类页、退出挽留的视频
    const PACK_ID_NAVIGATE = '80003';                                    // 拉取客户端导航栏位置
    const PACK_ID_REPORT_ACCESS_MODULE = '80004';                        // 上报模块访问记录
    const PACK_ID_PAYPAGE_SHOW_RULE = '80007';                          // 【DEL】 拉取订购页配置（----> 此接口 弃用，改用80015接口）
    const PACK_ID_QUERY_APK_PLUGIN_VERSION = '80008';                   // 查询apk插件的版本号
    const PACK_ID_QUERY_PLUGIN_VERSION_INFO = '17084';                  // 查询apk插件的版本信息

    const PACK_ID_TEST_ENTRY_SET = '80010';                             // 拉取测试入口配置
    const PACK_ID_EPG_THEME_PICTURE = '80011';                          // 请求epg主题背景图片
    const PACK_ID_NAVIGATE_MODLE = '80012';                          // 请求epg二级导航栏信息
    const PACK_ID_MARQUEE_INFO = '80013';                         //拉取跑马灯配置
    const PACK_ID_ENTRY_RECOMMEND_SET = '80014';                         //拉取启动推荐配置
    const PACK_ID_ENTRY_PAYPAGE_RULE = '80015';                         // 拉取系统订购页规则配置
    const PACK_ID_SHOW_PAY_LOCK = '80016';                               // 获取显示童锁配置
    const PACK_ID_SHOW_PAY_METHOD = '80018';                               // 获取系统促订加时配置
    const PACK_ID_PROVINCE_CITY_AREA = '80019';                               // 获取全国省、市、区
    const PACK_ID_CHINAUNICOM_AREA_URL = '80021';                               // 获取全国省、市、区
    const PACK_ID_CUSTOMIZE_MODULE = '80022';                               // 获取定制模块配置数据
    const PACK_ID_HOLD_PAGE = '80024';                               // 获取退出挽留配置信息
    const PACK_ID_LOG_CONTENT = '80028';                               // 日志内容记录（中国联通上报数据使用）

    const PACK_ID_COLLECT_LIST = "11010";                                //获取收藏列表
    const PACK_ID_COLLECT_STORE = "11009";                               //取消，添加收藏
    const PACK_ID_PLAY_END_VIDEO_RECOMMEND = "11008";                     // 播放结束随机推荐视频
    const PACK_ID_CITY_LIST = '13021';                          // 拉取宁夏便民药店区域一二级列表
    const PACK_ID_SHOP_LIST = '13022';                          // 拉取宁夏便民药店列表

    const PACK_ID_VERIFY_VIP = "17015";//会员用户校验包
    const PACK_ID_VIDEO_PLAY_RANK = "11022"; // 获取视频点播排行榜
    const PACK_ID_ALL_ALBUM = "11023"; // 获取专辑列表
    const PACK_ID_TEMPLATE_ALBUM = '11026';                        // 获取辑模板


    const PACK_ID_HISTORY_PLAY_LIST = "11021"; // 获取历史播放记录
    const PACK_ID_DELETE_HISTORY_PLAY = "11025"; // 删除历史播放记录

    const PACK_ID_GRAPHIC_COLUMN_LIST = "11027"; // 获取图文栏目列表
    const PACK_ID_GRAPHIC_LIST = "11028"; // 获取图文列表

    const PACK_ID_GET_VIDEO_LIST_BY_PLAY_URL = "11031"; // 根据视频播放地址获取视频信息
    const PACK_ID_GET_VIDEO_LIST_BY_UNION_CODE = "11032"; // 根据视频union_code获取视频信息
    const PACK_ID_GET_USER_GROUP_TYPE = "17067"; // 优惠券活动，有4个分组用户


    // 活动相关
    const PACK_ID_ACTIVITY_OPEN = "30003";//查询活动是否开启
    const PACK_ID_ACTIVITY_ROB_GIFT = "30005";//抢礼包活动
    const PACK_ID_ACTIVITY_QUERY_AWARD_INFO = "30007";//查询用户未完善奖品信息
    const PACK_ID_ACTIVITY_PERFECT_USER_INFO = "30011";//用户完善奖品信息
    const PACK_ID_ACTIVITY_GET = "30016";//拉取活动
    const PACK_ID_ACTIVITY_PRIZE_CONFIGURATION = "30017";//奖品配置
    const PACK_ID_ACTIVITY_PRIZE_URL = "30018";//活动抽奖包
    const PACK_ID_ACTIVITY_INQUIRE_PRIZE_RECORD = "30019";//查看中奖纪录
    const PACK_ID_ACTIVITY_REQUEST = "30020";//活动请求接口，用于拉取活动剩余次数
    const PACK_ID_ACTIVITY_SUBMIT_TEL_URL = "30021";//设置中奖电话号码
    const PACK_ID_ACTIVITY_WIN_PRIZE = "30022";//活动中中奖用户信息查询
    const PACK_ID_ACTIVITY_ADD_ACCEPT_PRIZE_ADDRESS = "30023";//记录领奖地点
    const PACK_ID_ACTITITY_GET_ID = "30024"; // 根据活动标识获取活动id
    const PACK_ID_ACTITITY_DATA_EX = "30043"; // 根据活动id存取扩展数据
    const PACK_ID_ACTIVITY_REGISTER_VIP = "17030";//设置中奖电话号码
    const PACK_ID_ACTIVITY_UPLOAD_ANSWER_RESULT = "30025";//上报答题结果
    const PACK_ID_ACTIVITY_CAN_ANSWER = "30026";//判断用户是否可以答题
    const PACK_ID_ACTIVITY_GET_RECENT_ORDER_LIST = "30027";//获取最近订购列表
    const PACK_ID_ACTIVITY_GET_SURPLUS = "30028";//获取抽奖剩余次数
    const PACK_ID_ACTIVITY_GET_GOODS_LIST = "30029"; // 拉取活动兑换物品列表（包含物品及兑换所需消耗的列表）
    const PACK_ID_ACTIVITY_EXCHANGE_PRIZE = "30030"; // 兑换物品
    const PACK_ID_ACTIVITY_EXCHANGE_PRIZE_RECORD_LIST = "30031"; // 我的兑换列表和活动所有的兑换记录
    const PACK_ID_ACTIVITY_SET_EXCHANGE_PRIZE_TEL = "30032"; // 设置兑换物品的联系方式
    const PACK_ID_ACTIVITY_ADD_USER_SCORE = "30033";        // 增加用户积分
    const PACK_ID_ACTIVITY_GET_USER_SCORE = "30034";        // 获取用户积分
    const PACK_ID_ACTIVITY_HAS_WINNING = "30035";        // 获取用户积分
    const PACK_ID_ACTIVITY_SET_VOTE = "30037";        // 设置投票
    const PACK_ID_ACTIVITY_GET_VOTE = "30038";        // 获取投票
    const PACK_ID_ACTIVITY_ADD_EXTRA_TIMES = "30039";        // 增加额外活动次数
    const PACK_ID_ACTIVITY_SUBTRACT_EXTRA_TIMES = "30040";        // 扣除额外活动次数
    const PACK_ID_ACTIVITY_GET_EXTRA_TIMES = "30041";        // 获取额外活动次数
    const PACK_ID_ACTIVITY_GET_USER_RANK = "30042";        // 获取用户数据排行（活动自定义）
    const PACK_ID_ACTIVITY_SET_SAVE_USER_INFO = "17065"; // 设置用户信息
    // 签到模块
    const PACK_ID_ACTIVITY_DATE_MARK_INFO = "17053";        // 查询用户签到信息
    const PACK_ID_ACTIVITY_USER_DATE_MARK = "17054";        // 用户签到
    const PACK_ID_ACTIVITY_ADD_USER_LOTTERY_TIMES = "30039";        // 增加用户抽奖次数
    const PACK_ID_USER_AUTHENTICATION_FOR_SHANDOGNDX = '17063';          // 山东电信通过CWS向局方鉴权接口
    const PACK_ID_ACTIVITY_GET_EVERYDAY_SCORE = "17064";        // 获取用户每日积分
    const PACK_ID_SET_USER_STATUS = "17066";        // 设置用户状态值

    // 健康检查，约定命名为：PACK_ID_HEALTH_CHECK_{XXX}
    const PACK_ID_HEALTH_CHECK_GET_BIND_MAC_ADDR = "10001";                     // 获取用户绑定设备的mac地址
    const PACK_ID_HEALTH_CHECK_BIND_DEVICE_ID = "10002";                        // 用户绑定设备
    const PACK_ID_HEALTH_CHECK_SET_PUSH_MSG = "10003";                          // 设置消息推送信息
    const PACK_ID_HEALTH_CHECK_GET_DIFF_MOMENT_CONFIG = "10004";                // 拉取时段和就餐状态配置
    const PACK_ID_HEALTH_CHECK_ARCHIVE_INSPECT_RECORD = "10008";                // 归档数据
    const PACK_ID_HEALTH_CHECK_QUERY_MEMBER_INSPECT_RECORD = "10009";           // 查询家庭成员检测记录
    const PACK_ID_HEALTH_CHECK_QUERY_NOT_ARCHIVE_RECORD = "10010";              // 查询未归档数据
    const PACK_ID_HEALTH_CHECK_DELETE_NOT_ARCHIVE_RECORD = "10011";             // 删除未归档数据
    const PACK_ID_HEALTH_CHECK_QUERY_MEMBERS_WITH_INSPECT_RECORD = "10012";     // 查询有检测记录的家庭成员
    const PACK_ID_HEALTH_CHECK_QUERY_LATEST_MEASURE_RECORD = "10013";           // 查询最新的检测数据（新疆电信EPG）
    const PACK_ID_HEALTH_CHECK_DELETE_ARCHIVE_RECORD = "10014";                 // 删除已归档数据
    const PACK_ID_HEALTH_CHECK_GET_BODY_FAT = "10115";                 // 获取已归档体脂数据
    const PACK_ID_UPLOAD_CLOUD_DATA = "10116";                         // 新疆电信 -- 上报天翼云数据
    const PACK_ID_QUERY_RECORD_COUNT = "10121";                         // 查询未归档疾病问医及检测记录条数
    const PACK_ID_QUERY_ACCESS_TOKEN = '10122';                   //获取用户授权凭证access_token
    const PACK_ID_UPDATE_READ_STATUS = '10126';                   //修改检测信息已读状态

    const PACK_ID_ADD_USER_INFO = "10016";        // 增加签约成员
    const PACK_ID_QUERY_USER_LIST = "10017";        // 查询成员列表成员
    const PACK_ID_ADD_BLOOD_PRESSURE = "10018";        // 增加血压信息
    const PACK_ID_QUERY_BLOOD_PRESSURE = "10019";        // 查询血压信息

    /////////////////////////////////// 视频问诊相关的cws接口 ////////////////////////////////
    const PACK_ID_INQUIRY_ADD_MODIFY_MEMBER = "10005"; // 增加修改家庭成员
    const PACK_ID_INQUIRY_DELETE_MEMBER = "10006"; // 删除家庭成员
    const PACK_ID_INQUIRY_QUERY_MEMBER = "10007"; // 查询家庭成员
    const PACK_ID_INQUIRY_UPLOAD_INQUIRY_PARAM = "16008"; // 上博视频问诊参数、播放器需要保存的参
    const PACK_ID_INQUIRY_GET_INQUIRY_PARAM = "16009"; // 获取视频问诊参数、播放器保存的参数
    const PACK_ID_INQUIRY_PUSH_PHONE_LIST = "19029"; // 添加用户问诊校验过的电话列表
    const PACK_ID_INQUIRY_GET_PHONE_LIST = "19030"; // 获取用户问诊校验过的电话列表

    const PACK_ID_INQUIRY_ADD_INQUIRY_RECORD = "19009"; // 添加问诊记录信息
    const PACK_ID_INQUIRY_QUERY_MEMBER_INQUIRY_RECORD = "19003"; // 查询家庭成员问诊记录信息
    const PACK_ID_INQUIRY_DELETE_MEMBER_INQUIRY_RECORD = "19005"; // 删除家庭成员问诊记录信息
    const PACK_ID_INQUIRY_RECORD = "19013"; // 获取指定家庭成员的问诊记录
    const PACK_ID_INQUIRY_QUERY_MEMBER_INFO = "19011"; // 查询家庭成员问诊记录（有哪些成员进行问诊）
    const PACK_ID_INQUIRY_QUERY_FREE_TIME = "19007"; // 获取免费问诊次数
    const PACK_ID_INQUIRY_QUERY_NO_ACHIVE_INQUIRY_RECORD = "19018"; // 查询未归档的问诊记录
    const PACK_ID_INQUIRY_SET_ACHIVE_INQUIRY_RECORD = "19019"; // 给某条问诊记录进行归档
    const PACK_ID_EXPERT_UPLOAD_PHONE = "16006"; // 大专家问诊，医生不在线时，上报电话号码
    const PACK_ID_INQUIRY_PHONE_NUMBER_VERIFY = "19022"; // 电话问诊校验
    const PACK_ID_GET_WX_INQUIRY_QRCODE = "19023"; // 获取微信二维码接口
    const PACK_ID_QUERY_WX_INQUIRY_STATUS = "19024"; // 查询微信问诊状态接口
    const PACK_ID_INQUIRY_QUERY_Times = "19026";// 查询是否问诊
    const PACK_ID_SET_CHECKED_PHONE = "19029";// 存储用户通过验证的电话
    const PACK_ID_GET_CHECKED_PHONE = "19030";// 查询用户通过验证的电话

    //预约挂号
    const PACK_ID_HOSPITAL_APPOINTMENT_AREA_LIST = 13012;//获取预约挂号地区列表
    const PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_LIST = 13007;//获取预约挂号医院列表
    const PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_LIST_STATIC = 13019;//获取预约挂号医院列表（管理后台配置）
    const PACK_ID_HOSPITAL_APPOINTMENT_DOCTOR_LIST_STATIC = 13020;//获取预约挂号医生列表（管理后台配置）
    const PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_DETIAL = 13013;//获取预约挂号医院详情
    const PACK_ID_HOSPITAL_APPOINTMENT_RECORD_LIST = 13014;//获取挂号记录列表
    const PACK_ID_HOSPITAL_APPOINTMENT_RECORD_DETAIL = 13015;//获取挂号记录详情
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_PAY_CODE = 13016;//获取支付二维码
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_PAY_RESULT = 13017;//获取支付结果
    const PACK_ID_HOSPITAL_APPOINTMENT_UN_APPOINTMENT = 13018;//获取挂号记录详情

    // cws挂号代理服务器
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_HOSPITAL = 'getHospital'; // 获取医院主页数据
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_DOCTORS = 'getDoctors';   // 获取医生列表
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_DOCTOR_DETAIL = 'getDoctorDetail';   // 获取医生详情
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_INFO = 'getAppointInfo';     // 获取就诊websocket等相关信息
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_QRCODE = 'getAppointQRCode'; // 获取就诊二维码
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_INPUT_INFO = 'getAppointInputInfo'; // 获取就诊填写页面信息
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_PATIENT_LIST = 'getPatientList'; // 获取就诊人列表
    const PACK_ID_HOSPITAL_APPOINTMENT_POST_OPERATE_PATIENT = 'postOperatePatient'; // 操作就诊人
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_AREA = 'getArea'; // 获取省市区
    const PACK_ID_HOSPITAL_APPOINTMENT_POST_APPOINT_DO_ORDER = 'postAppointDoOrder'; // 挂号下订单
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_RECORDS = 'getAppointRecords'; // 获取挂号记录
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_RECORD_DETAIL = 'getAppointRecordDetail'; // 获取挂号记录详情
    const PACK_ID_HOSPITAL_APPOINTMENT_POST_APPOINT_CANCEL_ORDER = 'postAppointCancelOrder'; // 取消订单
    const PACK_ID_HOSPITAL_APPOINTMENT_GET_GJKUID = 'getGJKUID'; // 获取贵健康userId

    const PACK_ID_INTROVIDEO_NOTIFY = "11018";//支付单条视频回调通知cws
    const PACK_ID_INTROVIDEO_ALLOW = "11019";//获取用户是否已支付单条视频
    const PACK_ID_INTROVIDEO_DETAIL = "11020";//根据视频地址查询视频信息

    //39互联网模块
    const PACK_ID_39_HOSPITAL_HOME_GET_VIDEO = "16001";
    const PACK_ID_39_HOSPITAL_HOME_GET_TOP_EXPERT_INFO = "16003";
    const PACK_ID_39_HOSPITAL_HOME_GET_CASE = "16005";

    // 皮肤管理
    const PACK_ID_GET_SKIN_LIST = "80017"; // 获取自定义皮肤列表
    const PACK_ID_EXCHANGE_SKIN = "17055"; // 兑换自定义皮肤
    const PACK_ID_USE_SKIN = "17056"; // 使用自定义皮肤


    //设备商城模块
    const PACK_ID_GOODS_INFO = 22001;//购买的商品信息
    const PACK_ID_GOODS_GET_THIRD_PARTY_PARA = 22020;//中国联通获取第三方设备商城参数
    const PACK_ID_GOODS_GET_ORDER_ID = 22003;//获取订单ID
    const PACK_ID_GOODS_RECORD_INFO = 22007;//购买的商品记录信息
    const PACK_ID_GOODS_LOGISTICS_INFO = 22013;//物流信息
    const PACK_ID_GOODS_WARN_STATE = 22011;//提醒用户发货
    const PACK_ID_GOODS_CANCEL_ORDER = 22005;//取消订单
    const PACK_ID_GOODS_PROBLEM = 22015;//问题
    const PACK_ID_GOODS_PROBLEM_POST = 22017;//问题反馈
    const PACK_ID_GOODS_DELETE_ORDER = 22019;//删除订单

    // 上报外部订购结果--新疆用
    const PACK_ID_REPORT_OUT_PAY_RESULT = "21015"; // 上报外部订购结果
    // 上报外部订购结果--江苏电信OTT用
    const PACK_ID_REPORT_OUT_PAY_RESULT_JIANGSU_DX_OTT = "21016"; // 上报外部订购结果

    //上报外部退订结果--江苏电信OTT用
    const PACK_ID_REPORT_OUT_UNSUBSCRIBE_RESULT_JIANGSU_DX_OTT = "21017"; // 上报外部退订结果

    const PACK_ID_SYS_COLUMNS_CONFIG_INFO = '80100';                            /// 拉取各模块的栏目配置信息

    // 健康知识模块，约定命名为：PACK_ID_HEALTH_KNOWLEDGE_{XXX}
    const PACK_ID_HEALTH_KNOWLEDGE_CLASSIFY_INFO = '42001';                     /// 拉取全部分类信息
    const PACK_ID_HEALTH_KNOWLEDGE_LIST_BY_CLASSIFY_ID = '42002';               /// 拉取分类下的知识列表
    const PACK_ID_HEALTH_KNOWLEDGE_DETAIL_INFO = '42003';                       /// 拉取健康知识详细信息

    // 健康自测模块，约定命名为：PACK_ID_HEALTH_TEST_{XXX}
    const PACK_ID_HEALTH_TEST_CLASSIFY_INFO = '43001';                          /// 拉取健康自测分类信息
    const PACK_ID_HEALTH_TEST_TOPIC_LIST_BY_CLASSIFY_ID = '43002';              /// 拉取分类下的项目列表
    const PACK_ID_HEALTH_TEST_THEME_LIST_BY_TOPIC_ID = '43003';                 /// 拉取项目下的题目内容
    const PACK_ID_HEALTH_TEST_RESULT_LIST = '43004';                            /// 拉取健康自测结果

    const PACK_ID_SYS_COLUMN_DETAIL_NAVIGATION = '80101';                       /// 拉取详情页（左侧）导航列表
    const PACK_ID_GET_BLOOD_CODE = '10020';                                     /// 拉取二维码
    const PACK_ID_GET_BLOOD_CODE_STATUS = '10021';                              /// 获取拉取二维码状态
    const PACK_GET_LAST_TEST_MEASURE_RECORD = '10022';                          /// 查询最新一条检测记录
    const PACK_GET_BIND_BLOOD_DEVICE = '10023';                                 /// 绑定血压设备
    const PACK_QUERY_REMEMBER_WRIST = '10025';                                  /// 手环查询及绑定成员
    const PACK_REPLACE_MEMBER_WRIST = '10026';                                  /// 手环成员更换
    const PACK_REMOVE_MEMBER_WRIST = '10027';                                   /// 手环成员删除解绑
    const PACK_SET_GOAL_STEP_WRIST = '10028';                                   /// 手环设置目标步数
    const PACK_GET_STEP_LIST_WRIST = '10029';                                   /// 手环获取步数列表
    const PACK_GET_SPORT_DETAIL = '10031';                                      /// 获取运动详情
    const PACK_GET_RECENT_DATA = '10032';                                       /// 获取最新更新
    const PACK_GET_SPORT_LIST = '10030';                                        /// 手环运动列表
    const PACK_GET_EXERCISE_TYPE_LIST = '10033';                                /// 运动类型
    const PACK_GET_HEART_RATE_LIST = '10034';                                   /// 手环获取心率列表
    const PACK_GET_HEART_RATE_DETAIL = '10035';                                 /// 手环获取心率详情
    const PACK_GET_STEP_DETAIL = '10036';                                       /// 手环获步数详情
    const PACK_GET_HEART_RATE_SPORT = '10038';                                  /// 手环获取心率运动详情
    const PACK_GET_SLEEP_LIST = '10039';                                        /// 获取睡眠数据列表
    const PACK_GET_SLEEP_DETAIL = '10040';                                      /// 获取睡眠详情
    const PACK_GET_PHONE_NUMBER = '10041';                                      /// 绑定手机号上传手机号
    const PACK_GET_IDENTIFYING_CODE = '119025';                                 /// 获取短信验证码
    ///
    const PACK_GET_BASE_DEVICE_TYPE = '10042';                                 /// 检测设备类型
    const PACK_GET_BASE_DEVICE_LIST = '10043';                                 /// 检测设备列表
    const PACK_GET_BASE_DEVICE_INTRO = '10044';                                 /// 检测设备说明

    const PACK_GET_JAVA_QR = '17082';                                         ///获得java端二维码
    const PACK_GET_JAVA_QR_STATUS = '17083';                                  ///检测二维码状态

    const PACK_GET_DEVICE_NEED_LOCK = '80029';
    //版本检测
    const PACK_ID_VERSION = "18001";                                            /// 版本检测


    //包头
    private $mPackId;            //包Id
    private $mUserId;            //用户Id
    private $mSessionId;         //会话Id
    private $mChannelId;         //渠道号
    private $mClientType;        //客户端类型
    private $mClientVersion;     //客户端版本号
    private $mCarrierId;         //地区Id
    private $mPlatFormType;      //平台类型（0标清 1高清 2安卓）
    private $mLoginId;            // 登录会话id
    private $mEntryPosition;     // 进入的推荐位


    //青海预约挂号
    const PACK_GET_QINGHAI_HOSPITAL_INFO = '60040';
    const PACK_GET_QINGHAI_DEPARTMENT_INFO = '60002';
    const PACK_GET_QINGHAI_DOCTOR_INFO = '60016';
    const PACK_GET_QINGHAI_ORDERTIME_INFO = '60017';
    const PACK_GET_QINGHAI_DEPARTMENTS_INFO = '60015';
    const PACK_GET_QINGHAI_PAYMENT_INFO = '60041';
    const PACK_GET_QINGHAI_PAYSTATUS_INFO = '60042';
    const PACK_GET_QINGHAI_ORDERSTATUS_INFO = '60043';
    const PACK_GET_QINGHAI_CANBACKLIST_INFO = '60035';
    const PACK_GET_QINGHAI_SAVEREGISTERED_INFO = '60018';
    const PACK_GET_QINGHAI_GETBACKNUM_INFO = '60024';

    //构造函数
    function __construct($packId)
    {
        $versionNum = 0;
        $clientVersion = defined('CUSTOM_CLIENT_VERSION') ? CUSTOM_CLIENT_VERSION : CLIENT_VERSION;
        $versionName = explode('.', $clientVersion);
        if (count($versionName) == 3) {
            $versionNum = intval($versionName[0]) * 10000 +
                intval($versionName[1]) * 100 + intval($versionName[2]);
        } else if (count($versionName) == 2) {
            $versionNum = intval($versionName[0]) * 100 + intval($versionName[1]);
        } else if (count($versionName) == 1) {
            $versionNum = intval($versionName[0]);
        }

        $userId = MasterManager::getUserId();
        $this->mPackId = $packId;
        $this->mUserId = $userId ? $userId : 0;
        $this->mSessionId = MasterManager::getCwsSessionId();
        $this->mChannelId = "000000";
        $this->mClientType = CLIENT_TYPE;
        $this->mClientVersion = $versionNum;
        $this->mCarrierId = CARRIER_ID;
        $this->mPlatFormType = Utils::getPlatFormType(CARRIER_ID);
        $this->mLoginId = MasterManager::getLoginId();
        $this->mEntryPosition = MasterManager::getEnterPosition();
    }

    /** 设置用户Id
     * @param $userId
     */
    public function setUserId($userId)
    {
        $this->mUserId = $userId;
    }

    /**
     * 设置sessionId
     * @param $sessionId
     */
    public function setSessionId($sessionId)
    {
        $this->mSessionId = $sessionId;
    }

    /**
     * 设置访问接口Id
     */
    public function setPackId($packId)
    {
        $this->mPackId = $packId;
    }

    /**
     * 设置登录会话id
     */
    public function setLoginId($loginId)
    {
        $this->mLoginId = $loginId;
    }

    /**
     * Post 请求数据
     * @param: $requestData 请求参数
     * @return mixed
     */
    public function requestPost($requestData)
    {
        $result = "";
        $beginTime = Utils::getMillisecond();
        $serverUrl = SERVER_URL;

        //组装Post 数据
        $postData = array('head' => json_encode($this->packageHeader()), 'json' => json_encode($requestData));

        //设置选项
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_TIMEOUT => HttpManager::TIMEOUT_CONF
        );

        //记录日志
        LogUtils::info("HttpManager[PackId->$this->mPackId] ---> [URL]: " . $serverUrl . 'head=' . json_encode($this->packageHeader()) . "&json=" . json_encode($requestData));

        //请求数据
        $http = curl_init($serverUrl);
        curl_setopt_array($http, $options);
        try {
            $result = curl_exec($http);
        } finally {
            curl_close($http);
        }

        $costTime = Utils::getMillisecond() - $beginTime;


        // 过滤掉指定数据包，不打印日志
        $packIdList = [HttpManager::PACK_ID_SYS_CFG, HttpManager::PACK_ID_HEART, HttpManager::PACK_ID_ALL_ALBUM,
            HttpManager::PACK_ID_CHANNEL,HttpManager::PACK_ID_REPORT_ACCESS_MODULE];

        if (!in_array($this->mPackId, $packIdList)) {
            //记录日志
            LogUtils::info("HttpManager[PackId->$this->mPackId] costTime[.$costTime.ms] ---> [URL-RESULT]: " . $result);
        } else {
            LogUtils::info("HttpManager[PackId->$this->mPackId] costTime[.$costTime.ms] ---> [URL-RESULT]: ok!!!" );
        }
        return $result;
    }

    /**
     * Post 请求数据（挂号代理服务器）
     * @param $requestData 请求参数
     * @return mixed
     */
    public function requestGuaHaoPost($requestData)
    {
        $result = "";
        $beginTime = Utils::getMillisecond();
        $serverUrl = SERVER_GUAHAO_CWS;

        //组装Post 数据
        $postData = array('head' => json_encode($this->packageGuaHaoHeader()), 'json' => json_encode($requestData));

        //设置选项
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_TIMEOUT => HttpManager::TIMEOUT_CONF
        );

        //记录日志
        LogUtils::info("HttpManager ---> [URL]: " . $serverUrl . 'head=' . json_encode($this->packageGuaHaoHeader()) . "&json=" . json_encode($requestData));

        //请求数据
        $http = curl_init($serverUrl);
        curl_setopt_array($http, $options);
        try {
            $result = curl_exec($http);
        } finally {
            curl_close($http);
        }

        $costTime = Utils::getMillisecond() - $beginTime;

        //记录日志
        LogUtils::info("HttpManager costTime[.$costTime.ms] ---> [URL-RESULT]: " . $result);

        return $result;
    }

    /**
     * 全局的数据请求接口，不需要封装包头，直接请求对应的url。
     * @param $type
     * @param $url
     * @param $data
     * @return mixed
     */
    public static function httpRequest($type, $url, $data)
    {
        $result = "";
        if (strtoupper($type) === "GET") {
            $header = array();
            $http = curl_init();
            curl_setopt($http, CURLOPT_URL, $url);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($http, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($http, CURLOPT_HEADER, 0);
            curl_setopt($http, CURLOPT_TIMEOUT, HttpManager::TIMEOUT_CONF);
            curl_setopt($http, CURLOPT_FOLLOWLOCATION, true);
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        } else if (strtoupper($type) === "POST") {
            //设置选项
            $options = array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER => false,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_TIMEOUT => HttpManager::TIMEOUT_CONF
            );

            //请求数据
            $http = curl_init($url);
            curl_setopt_array($http, $options);
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        }
        return $result;
    }

    /**
     * 全局的数据请求接口，需要传入http头部信息。
     * @param $type
     * @param $url
     * @param: $header 头部信息
     * @param: $data 参数
     * @param: $shouldHttps 参数
     * @return mixed
     */
    public static function httpRequestByHeader($type, $url, $header, $data, $needHttps = false)
    {
        $result = "";
        if ($header == "" || $header == null) {
            $header = array();
        }

        if (strtoupper($type) === "GET") {
            $http = curl_init();
            curl_setopt($http, CURLOPT_URL, $url);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($http, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($http, CURLOPT_HEADER, 0);
            curl_setopt($http, CURLOPT_TIMEOUT, HttpManager::TIMEOUT_CONF);
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        } else if (strtoupper($type) === "POST") {
            //设置选项
            $options = array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_TIMEOUT => HttpManager::TIMEOUT_CONF
            );

            //请求数据
            $http = curl_init($url);
            curl_setopt_array($http, $options);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_HEADER, 0);
            if($needHttps){
                // curl请求https链接，不对证书校验设置，对php版本兼容
                if (version_compare(PHP_VERSION,'7.3.0','<')) {
                    curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($http, CURLOPT_SSL_VERIFYHOST, false);
                } else {
                    curl_setopt($http, CURLOPT_PROXY_SSL_VERIFYPEER, false);
                    curl_setopt($http, CURLOPT_PROXY_SSL_VERIFYHOST, false);
                }
            }
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        }
        return $result;
    }

    /**
     * 封装访问包头
     * @return array 返回包头
     */
    public function packageHeader()
    {
        return array(
            "pack_id" => $this->mPackId,
            "user_id" => $this->mUserId,
            "session_id" => $this->mSessionId,
            "channel_id" => $this->mChannelId,
            "client_type" => $this->mClientType,
            "client_version" => $this->mClientVersion,
            "carrier_id" => $this->mCarrierId,
            "platform_type" => $this->mPlatFormType,
            "login_id" => $this->mLoginId,
            "entry_pos" => $this->mEntryPosition,
        );
    }

    /**
     * 封装访问包头（cws挂号代理服务器）
     * @return array 返回包头
     */
    private function packageGuaHaoHeader()
    {
        return array(
            "func" => $this->mPackId,
            "carrier_id" => $this->mCarrierId,
        );
    }
}