<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 所有活动常量管理类
// +----------------------------------------------------------------------
// | 功能：定义所有用到的活动相关的常量，如：活动标识（activity_sub_id）
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/8/21 15:24:41
// +----------------------------------------------------------------------


namespace Home\Model\Activity;


use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Think\Exception;

class ActivityConstant
{

    //////////////////////////////////////////////////////////////////////////
    //                             非联合活动标识                           //
    // ---------------------------------------------------------------------//
    //  命名：SUB_ID_A_ACTIVITY_活动标识ID别名                              //
    //////////////////////////////////////////////////////////////////////////
    /** “抓娃娃”应用内活动 */
    const SUB_ID_ACTIVITY_ZHUAWAWA20171223 = "ActivityZhuawawa20171223";
    /** “答题”应用内活动 */
    const SUB_ID_ACTIVITY_ANSWER20180503 = "ActivityAnswer20180503";
    const SUB_ID_ACTIVITY_ANSWER20180710 = "ActivityAnswer20180710";
    /** “海洋”应用内活动 */
    const SUB_ID_ACTIVITY_SEA20180728 = "ActivitySea20180728";
    /** “春天”应用内活动 */
    const SUB_ID_ACTIVITY_SPRING20180317 = "ActivitySpring20180317";
    /** “抢红包”应用内活动 */
    const SUB_ID_ACTIVITY_QIANGHONGBAO20180123 = "ActivityQianghongbao20180123";
    /** “0元义诊”应用内活动 */
    const SUB_ID_ACTIVITY_CONSULTATION20190320 = "ActivityConsultation20190320";
    /** “月饼欢乐送”应用内活动 */
    const SUB_ID_ACTIVITY_MID_AUTUMN20180815 = "ActivityMidAutumn20180815";
    /** “金秋国庆”应用内活动 */
    const SUB_ID_ACTIVITY_MONEY_TREE20180917 = "ActivityMoneyTree20180917";
    /** “拥抱健康 测一测赢好礼”应用内活动 */
    const SUB_ID_ACTIVITY_HEALTH_TEST20181215 = "ActivityHealthTest20181215";
    const SUB_ID_ACTIVITY_HEALTH_TEST20190820 = "ActivityHealthTest20190820";
    /** “IPTV“快乐大挑战，健康测一测” */
    const SUB_ID_ACTIVITY_HEALTH_TEST20200717 = "ActivityHealthTest20200717";
    /* 测一测，得北京面诊*/
    const SUB_ID_ACTIVITY_HEALTH_TEST20200812 = "ActivityHealthTest20200812";
    /** “拥抱健康 测一测赢好礼”应用内活动 */
    const SUB_ID_ACTIVITY_HEALTH_EXAMINATION = "ActivityHealthExamination20181203";
    /** “双十二秒杀”青海活动 */
    const SUB_ID_ACTIVITY_FESTIVE_SPIKE20181119 = "ActivityFestiveSpike20181119";
    /** “集年货送健康”青海活动 */
    const SUB_ID_ACTIVITY_COLLECTING_GIFTS20181212 = "ActivityCollectingGifts20181212";
    /** “猜字谜”多版本活动 */
    const SUB_ID_ACTIVITY_WORDS_PUZZLE20190114 = "ActivityWordsPuzzle20190114";
    /** 碧水清波，海洋保卫战 */
    const SUB_ID_ACTIVITYSEABATTLE20190619 = "ActivitySeaBattle20190619";
    /** “宝宝健康大测评”中国联通EPG活动 */
    const SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212 = "ActivityBabyHealthTest20190228";
    /** “宝宝健康大测评”中国联通EPG活动 */
    const SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725 = "ActivityBabyHealthTest20190725";
    /** “海洋-联合活动” */
    const SUB_ID_ACTIVITY_ACTIVITY_LOSE_WEIGHT20190408 = "ActivityLoseWeight20190408";
    /** “密封-活动” */
    const SUB_ID_ACTIVITY_COLLECTING_HONEY20190408 = "ActivityCollectingHoney20190408";
    /** “消夏-活动” */
    const SUB_ID_ACTIVITY_SUMMER_REFRESH20190612 = "ActivitySummerRefresh20190612";
    /** “健康行-活动” */
    const SUB_ID_ACTIVITY_TELEGRAPHY_HEALTH20190627 = "ActivityTelegraphyHealth20190627";
    /** “捕鱼-活动” */
    const SUB_ID_ACTIVITY_HOLIDAY_FISH20190715 = "ActivityHolidayFish20190715";
    /** “画廊-活动” */
    const SUB_ID_ACTIVITY_GALAXY_GALLERY20190715 = "ActivityGalaxyGallery20190722";
    /** “月饼-活动” */
    const SUB_ID_ACTIVITY_DELIVER_MOON_CAKE20190715 = "ActivityDeliverMoonCake20190814";
    /**嗨翻国庆，健康出游*/
    const ACTIVITYNATIONALTRAVEL20190912 = "ActivityNationalTravel20190912";
    /**领取摄像头*/
    const ACTIVITYGETCAMERA20200208 = "ActivityGetCamera20200208";
    /**万圣惊魂，糖果大反击*/
    const ACTIVITYHALLOWEENSCARE20190920 = "ActivityHalloweenScare20190920";
    const ACTIVITY_SKY_20191225 = "ActivitySky20191225";
    /** “跨年来战，2020我来啦” */
    const SUB_ID_ACTIVITY_NEW_YEARS_EVE20191202 = "ActivityNewYearsEve20191202";
    /**岁岁平安，年兽退散*/
    const ACTIVITYCATCHBEAST20191202 = "ActivityCatchBeast20191202";
    /*华灯影上，元宵祈福*/
    const SUB_ID_ACTIVITY_LANTER_BLESS20191225 = "ActivityLanternBless20191225";
    /**丘比特之箭，俘获你的小心心*/
    const ACTIVITYCUPIDARROW20191225 = "ActivityCupidArrow20191225";
    /**清明寻柳，点亮健康*/
    const ACTIVITYQINGMINGWILLOWS20200225 = "ActivityQingmingWillows20200225";
    /**健康你我他，幸福千万家(贵州）*/
    const ACTIVITYDEMOLITIONEXPRESS20200312 = "ActivityDemolitionExpress20200312";

    /*“拥抱健康 测一测赢好礼”应用内活动*/
    const SUB_ID_ACTIVITY_HEALTH_TEST20180927 = "ActivityHealthTest20180927";
    /*“名医服务基层”应用内活动 */
    const SUB_ID_ACTIVITY_FAMOUS_DOCTOR20181020 = "ActivityFamousDoctor20181020";
    /*喜迎元旦，锦鲤到家-青海电信EPG**/
    const SUB_ID_ACTIVITY_FISH20181217 = "ActivityCollectFish20181217";
    const SUB_ID_ACTIVITY_FISH20190221 = "ActivityCollectFish20190221";
    /*新疆宣传活动*/
    const SUB_ID_ACTIVITYTEXT20190125 = "ActivityText20190125";
    /*火鸡逃跑大作战-应用内**/
    const SUB_ID_ACTIVITY_TURKEY201801017 = "ActivityTurkey20181017";
    /*五福临门，欢乐随行**/
    const SUB_ID_ACTIVITY_LUCKCARD20181224 = "ActivityCollectLuckCard20181224";
    /*青海拼图活动*/
    const SUB_ID_ACTIVITY_PUZZLE201801101 = "ActivityPuzzle20181101";
    /*“圣诞猜猜猜，好礼等你来” 宁夏电信活动*/
    const SUB_ID_ACTIVITY_CHRISTMAS20181211 = "ActivityChristmas20181211";
    /*迎新年，送健康，幸运转转转-黑龙江联通EPG*/
    const SUB_ID_ACTIVITY_LUCKYWHEEL20190107 = "ActivityLuckyWheel20190107";
    /*新春一乐，金猪送礼*/
    const SUB_ID_ACTIVITYDIGPRIZE20190114 = "ActivityDigPrize20190114";
    /*年夜大团圆，沸腾的火锅*/
    const SUB_ID_ACTIVITYHOTPOT20190115 = "ActivityHotPot20190115";
    /*鱼鱼跃试，云霄大飞跃*/
    const SUB_ID_ACTIVITYFISHJUMPING20190218 = "ActivityFishJumping20190218";
    /*悦动自然，健康有氧计划*/
    const SUB_ID_ACTIVITYHEALTHAEROBIC20190225 = "ActivityHealthAerobic20190225";
    /*命运的狙击，攻防大作战*/
    const SUB_ID_ACTIVITYSCISSORS20190315 = "ActivityScissors20190315";
    /*幸运转转转，健康大礼包*/
    const SUB_ID_ACTIVITY_LUCKYWHEEL20190329 = "ActivityLuckyWheel20190329";
    /*欢乐扭一扭，童趣愚人节*/
    const SUB_ID_ACTIVITYAPRILFOOLDAY20190319 = "ActivityAprilFoolDay20190320";
    /*春新萌动，欢乐出行*/
    const SUB_ID_ACTIVITYJOYTOURISM20190325 = "ActivityJoyTourism20190325";
    /*命运的狙击-活动*/
    const SUB_ID_ACTIVITYSCISSORS20190709 = "ActivityScissors20190709";
    /*熊熊分类，垃圾快跑(应用类)*/
    const ACTIVITYREFUSECLASSIFICATION20190808 = "ActivityRefuseClassification20190808";
    /*开学季，惊心上学路*/
    const ACTIVITYBACKTOSCHOOL20190819 = "ActivityBackToSchool20190819";
    /*开学季，惊心上学路V2*/
    const ACTIVITYBACKTOSCHOOL20200629 = "ActivityBackToSchool20200629";
    /*叠月饼过中秋*/
    const ACTIVITYSTACKMOONCAKE20190826 = "ActivityStackMoonCake20190826";
    /*金秋国庆，丰收之旅*/
    const ACTIVITYSHAKETHETREE20190910 = "ActivityShakeTheTree20190910";
    /*秋日大赏，卡牌连连看 /喜遇重阳，卡牌连连看2020*/
    const ACTIVITYREPEATEDLYREAD20190917 = "ActivityRepeatedlyRead20190917";
    /*感恩回馈活动*/
    const ACTIVITYTHANKSGIVING20190923 = "ActivityThanksgiving20190923";
    /*火鸡逃跑大作战*/
    const ACTIVITYTURKEY20191008 = "ActivityTurkey20191008";
    /*元气满满，健康小常识大赛*/
    const ACTIVITYHEALTHKNOWLEDGERACE20191015 = "ActivityHealthKnowledgeRace20191015";
    /*健康你我他，幸福千万家*/
    const ACTIVITYDEMOLITIONEXPRESS20191022 = "ActivityDemolitionExpress20191022";
    /*健康你我他，幸福千万家*/
    const ACTIVITYDEMOLITIONEXPRESS20191121 = "ActivityDemolitionExpress20191121";
    /*双11，健康包裹拆拆拆*/
    const ACTIVITYOPENPACKAGE20191023 = "ActivityOpenPackage20191023";
    /*冬季猜图，健康动动脑*/
    const ACTIVITYGUESSWORDS20191104 = "ActivityGuessWords20191104";
    /*幸运转转转，健康体检大礼包*/
    const ACTIVITYLUCKYWHEEL20191106 = "ActivityLuckyWheel20191106";
    /*感恩节，谁是大胃王*/
    const ACTIVITYEATRACE20191107 = "ActivityEatRace20191107";
    /*南北大战，这个冬至有点闹*/
    const ACTIVITYSOUTHNORTHRACE20191118 = "ActivitySouthNorthRace20191118";
    /*回血双十二，疯狂刷宝洞*/
    const ACTIVITYDOUBLETWELVE20191121 = "ActivityDoubleTwelve20191121";
    /*圣诞狂欢，健康树大变身*/
    const ACTIVITYCHRISTMASDAY20191126 = "ActivityChristmasDay20191126";
    /*圣诞狂欢，健康树大变身*/
    const ACTIVITYGOHOME20191203 = "ActivityGoHome20191203";
    /*中国联通，送优惠券活动*/
    const SUB_ID_ACTIVITYCOUPON20200722 = "ActivityCoupon20200722";
    /*新疆电信，大专家义诊活动*/
    const SUB_ID_ACTIVITYCONSULTATIONNEW20200603 ="ActivityConsultationNew20200603";

    //////////////////////////////////////////////////////////////////////////
    //                              联合活动标识                            //
    // ---------------------------------------------------------------------//
    //  命名：SUB_ID_A_JOINT_ACTIVITY_活动标识ID别名                        //
    //////////////////////////////////////////////////////////////////////////
    /*冬季运动会，活力跨栏*/
    const SUB_ID_JOINT_ACTIVITYHURDLE20191113 = "JointActivityHurdle20191113";
    /**熊熊分类，垃圾快跑（联合活动）*/
    const SUB_ID_JOINT_ACTIVITYREFUSECLASSIFICATION20190808 = "JointActivityRefuseClassification20190808";
    /** “答题-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_ANSWER20180514 = "JointActivityAnswer20180514";
    /** “冲浪-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_SURFING20180627 = "JointActivitySurfing20180627";
    /** “海洋-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_SEA20180712 = "JointActivitySea20180712";
    /** “米奇之家-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_CLEANING20180716 = "JointActivityCleaning20180716";
    /** “弹跳床-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_JUMPING20180719 = "JointActivityJumping20180719";
    /** “名医下基层-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_VISIT20180716 = "JointActivityVisit20180716";
    /** “月饼欢乐送”联合活动 */
    const SUB_ID_JOINT_ACTIVITY_MID_AUTUMN20180815 = "JointActivityMidAutumn20180815";
    /** “金秋国庆”联合活动 */
    const SUB_ID_JOINT_ACTIVITY_MONEY_TREE20180917 = "JointActivityMoneyTree20180917";
    /** "新春团圆季 字谜大冒险"中国联通EPG局方联合活动版 */
    const SUB_ID_JOINT_ACTIVITY_WORDSPUZZLE20190124 = "JointActivityWordsPuzzle20190124";
    /** “端午成长活动” */
    const SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517 = "JointActivityGrowingUp20190517";
    /** “女神计划，打造靓丽的你主页” */
    const SUB_ID_JOINT_ACTIVITY_WOMENDAY20200225 = "JointActivityWomenDay20200225";
    /** “暑期计划，喂饱喵小肥” */
    const SUB_ID_JOINT_ACTIVITY_FEED_CATS_ON_VACATION20200727 = "JointActivityFeedCatsOnVacation20200727";

    /** “腊八粥选美” */
    const SUB_ID_JOINT_ACTIVITY_LABA_RACE20201228 = "JointActivityLaBaRace20201228";
    /** “愚翻天” */
    const SUB_ID_JOINT_ACTIVITY_APRIL_RACE20210318 = "JointActivityApril20210318";

    /** “畅享健康给生活加点料-联合活动” */
    const SUB_ID_JOINT_ACTIVITY_HEALTHY_RACE20210318 = "ActivityHealthyLife20211228";

    /** “打造我的专属花园-联合活动”*/
    const SUB_ID_JOINT_ACTIVITY_EXCLUSIVE_GARDEN20220124 = "JointActivityExclusiveGarden20220124";

    const SUB_ID_ACTIVITY_SUMMER_REFRESH_NEW = 'JointActivitySummerUpUp20220523';

    /** “零食大作战-联合活动”*/
    const SUB_ID_JOINT_ACTIVITY_FETCHFOOD20220524 = "JointActivityFetchFood20220524";

    //////////////////////////////////////////////////////////////////////////
    //                         活动其它统一配置                              //
    // ---------------------------------------------------------------------//
    //////////////////////////////////////////////////////////////////////////
    /**
     * 通过活动ID，获取对应配置的所在模式路径（以文件夹为区别）
     *
     *      返回格式路径 --> {$活动名根目录}/{$V地区ID}/{$具体模式}
     *
     * <pre>
     * 例如：
     *      联合活动：                                         ActivityMidAutumn/V000051/union
     *      应用活动（中国联通-所有省份）：                    ActivityMidAutumn/V000051/V1
     *      应用活动（中国联通-天津市 201天津 区域编码）：     ActivityMidAutumn/V000051/V201
     * 注意：
     *      返回null，表示没有配置该活动！
     * </pre>
     *
     * @param $activityId
     * @return null
     */
    public static function getActivityFolder($activityId)
    {
        $carrierId = MasterManager::getCarrierId();
        $ACTIVITY_FOLDERS = C('ACTIVITY_FOLDERS'); //从本模块的Conf/config.php获取到定义的活动页面信息
        if (isset($ACTIVITY_FOLDERS[$carrierId])) {
            $activityFoldersOfCarrierId = $ACTIVITY_FOLDERS[$carrierId];
            if (isset($activityFoldersOfCarrierId[$activityId])) {
                return $activityFoldersOfCarrierId[$activityId];
            }
        } else {
            return null;
        }
    }

    /**
     * 通过活动ID，获取对应配置的所在模式路径（以文件夹为区别）
     *
     * @param $activityId
     * @return null
     */
    public static function getNewActivityFolder($activityId)
    {
        $carrierId = MasterManager::getCarrierId();
        //从本模块的Conf/config.php获取到定义的活动页面信息
        $ACTIVITY_FOLDERS = C('NEW_ACTIVITY_FOLDERS');
        if (isset($ACTIVITY_FOLDERS[$carrierId])) {
            $activityFoldersOfCarrierId = $ACTIVITY_FOLDERS[$carrierId];
            if (isset($activityFoldersOfCarrierId[$activityId])) {
                return $activityFoldersOfCarrierId[$activityId];
            }
        } else {
            return null;
        }
    }

    //////////////////////////////////////////////////////////////////////////
    //                         特殊活动常量数据                             //
    // ---------------------------------------------------------------------//
    //////////////////////////////////////////////////////////////////////////

    /**
     * 获取题目信息，使用本地数据
     *
     * @return mixed
     */
    public static function getAnswer()
    {
        $answers = array(
            array('index' => 1, 'question' => '每天至少刷牙几次？', 'answerA' => '5次', 'answerB' => '2次', 'answerC' => '1次', 'rightAnswer' => 'B'),
            array('index' => 2, 'question' => '霉变的甘蔗可以吃吗？', 'answerA' => 'A、不能吃 ', 'answerB' => 'B、可以吃', 'answerC' => 'C、削皮后可以吃', 'rightAnswer' => 'A'),
            array('index' => 3, 'question' => '什么是四害？', 'answerA' => 'A、苍蝇、蚊子、老鼠、蟑螂', 'answerB' => 'B、苍蝇、蚊子、老鼠、臭虫', 'answerC' => 'C、苍蝇、蚊子、老鼠、麻雀', 'rightAnswer' => 'A'),
            array('index' => 4, 'question' => '以下食品中铅含量最高的是？', 'answerA' => 'A、黄瓜', 'answerB' => 'B、松花蛋', 'answerC' => 'C、面包', 'rightAnswer' => 'B'),
            array('index' => 5, 'question' => '蜂蜜不宜在哪种容器中存放？', 'answerA' => 'A、玻璃瓶', 'answerB' => ' B、铁罐', 'answerC' => '塑料罐', 'rightAnswer' => 'B'),
            array('index' => 6, 'question' => '使用哪种材料的锅炒菜对健康最有益？', 'answerA' => 'A、铝锅', 'answerB' => 'B、不锈钢锅', 'answerC' => 'C、铁锅', 'rightAnswer' => 'C'),
            array('index' => 7, 'question' => '电脑的哪个部位辐射最强？', 'answerA' => 'A、正面', 'answerB' => 'B、侧面', 'answerC' => 'C、背面', 'rightAnswer' => 'C'),
            array('index' => 8, 'question' => '流行性感冒的传播途径是什么？', 'answerA' => 'A、空气飞沫', 'answerB' => 'B、饮水', 'answerC' => 'C、苍蝇', 'rightAnswer' => 'A'),
            array('index' => 9, 'question' => '通常所说的煤气中毒是指什么气体中毒？', 'answerA' => 'A、一氧化碳', 'answerB' => ' B、二氧化碳', 'answerC' => 'C、氮气', 'rightAnswer' => 'A'),
            array('index' => 10, 'question' => '小孩一岁内需接种乙肝疫苗几次？', 'answerA' => 'A、一次', 'answerB' => 'B、二次', 'answerC' => 'C、三次', 'rightAnswer' => 'C'),
            array('index' => 11, 'question' => '慢性非传染性疾病主要的病因之一是？', 'answerA' => 'A、没有及时打预防针', 'answerB' => 'B、没有经常吃保健药品', 'answerC' => 'C、不良生活方式 ', 'rightAnswer' => 'C'),
            array('index' => 12, 'question' => '用眼卫生要做到什么？', 'answerA' => 'A、连续用眼要休息或向远处眺望', 'answerB' => 'B、光线暗或直射阳光下看书写字', 'answerC' => 'C、经常躺着看书看电视', 'rightAnswer' => 'A'),
            array('index' => 13, 'question' => '以下哪种食品中所含致癌物质最多？', 'answerA' => 'A、水煮鱼', 'answerB' => 'B、烤羊肉串', 'answerC' => 'C、炒面', 'rightAnswer' => 'B'),
            array('index' => 14, 'question' => '乙型肝炎的传播途径与下列最相似的病是哪个？', 'answerA' => 'A、乙型脑炎', 'answerB' => 'B、伤寒', 'answerC' => 'C、艾滋病', 'rightAnswer' => 'C'),
            array('index' => 15, 'question' => '胡萝卜怎样吃最有营养？', 'answerA' => 'A、生吃', 'answerB' => 'B、油炒', 'answerC' => 'C、用肉炖食', 'rightAnswer' => 'C'),
            array('index' => 16, 'question' => '吃水果的最佳时间是？', 'answerA' => 'A、饭前', 'answerB' => 'B、饭后', 'answerC' => 'C、两餐之间', 'rightAnswer' => 'C'),
            array('index' => 17, 'question' => '多吃脂肪含量高的食品会引起肥胖和某些慢性病，下面哪种肉类脂肪含量最高？', 'answerA' => 'A、猪肉', 'answerB' => 'B、鱼肉', 'answerC' => 'C、鸡肉', 'rightAnswer' => 'A'),
            array('index' => 18, 'question' => '提倡老年人应多吃些鱼,主要是因为鱼？', 'answerA' => 'A 、热量含量高', 'answerB' => 'B 、饱和脂肪酸较多', 'answerC' => 'C、 不饱和脂肪酸较多', 'rightAnswer' => 'C'),
            array('index' => 19, 'question' => '长期吸烟容易引起什么疾病？', 'answerA' => 'A、结构病', 'answerB' => 'B、支气管炎', 'answerC' => 'C、肺水肿', 'rightAnswer' => 'B'),
            array('index' => 20, 'question' => '流感流行的季节,你应该？', 'answerA' => 'A、外出戴好口罩,在家关好门窗', 'answerB' => 'B、自己吃感冒药预防', 'answerC' => 'C、少去公共场所，提高抵抗力', 'rightAnswer' => 'C'),
            array('index' => 21, 'question' => '下列哪一项符合家庭健康饮食环境的要求？', 'answerA' => 'A、炒菜清淡少盐', 'answerB' => 'B、经常做油炸食品', 'answerC' => 'C、一天中只有一餐配合蔬菜', 'rightAnswer' => 'A'),
            array('index' => 22, 'question' => '在新鲜蔬菜的叶、花、茎中，哪种微量营养素含量较高？', 'answerA' => 'A．维生素A', 'answerB' => 'B、维生素B', 'answerC' => 'C、维生素C', 'rightAnswer' => 'C'),
            array('index' => 23, 'question' => '下列哪一种疾病属于食物中毒？', 'answerA' => 'A、食物过敏', 'answerB' => 'B、慢性汞中毒', 'answerC' => 'C、 吃发芽土豆引起的疾病', 'rightAnswer' => 'C'),
            array('index' => 24, 'question' => '不健康的减肥方法包括下面的哪种？', 'answerA' => 'A、多吃水果蔬菜', 'answerB' => 'B、少吃高糖、高脂肪膳食', 'answerC' => 'C、吃减肥药', 'rightAnswer' => 'C'),
            array('index' => 25, 'question' => '为保证健康合理饮食，成人每天吃盐量不应超过多少克？', 'answerA' => 'A、3', 'answerB' => ' B、4', 'answerC' => ' C、6', 'rightAnswer' => 'C'),
            array('index' => 26, 'question' => '下列食物中，不属于纯能量的物质是？', 'answerA' => 'A、猪油', 'answerB' => ' B、大豆油', 'answerC' => ' C、米饭', 'rightAnswer' => 'C'),
            array('index' => 27, 'question' => '食品冷藏的温度一般在多少摄氏度？', 'answerA' => 'A、0~5℃之间', 'answerB' => ' B、0~10℃之间', 'answerC' => ' C、5~10℃之间', 'rightAnswer' => 'C'),
            array('index' => 28, 'question' => '儿童缺碘，最可能造成以下哪种疾病？', 'answerA' => 'A、口角炎', 'answerB' => ' B、皮肤干裂', 'answerC' => ' C、甲状腺肿大', 'rightAnswer' => 'C'),
            array('index' => 29, 'question' => '以下哪种食物为早餐中必须包括的，它在体内能很快转化为葡萄糖，为大脑提供能量？', 'answerA' => 'A、谷类', 'answerB' => ' B、牛奶', 'answerC' => ' C、鸡蛋', 'rightAnswer' => 'A'),
            array('index' => 30, 'question' => '需要熟制加工的食品应当烧熟煮透，其中心温度不低于多少？', 'answerA' => 'A、60℃', 'answerB' => ' B、65℃', 'answerC' => ' C、70℃', 'rightAnswer' => 'A'),
            array('index' => 31, 'question' => '下面哪一项不符合健康家庭环境的要求？', 'answerA' => 'A、注意粗粮和细粮合理搭配', 'answerB' => ' B、多常备多种水果种', 'answerC' => ' C、用成年人的大碗给孩子盛饭', 'rightAnswer' => 'C'),
            array('index' => 32, 'question' => '下列哪种方法有助于儿童青少年身高、体重增长？', 'answerA' => 'A、吃保健品', 'answerB' => ' B、多吃甜食', 'answerC' => ' C、平衡膳食+体育锻炼', 'rightAnswer' => 'C'),
            array('index' => 33, 'question' => '在新鲜蔬菜的叶、花、茎中，哪种微量营养素含量较高？', 'answerA' => 'A、维生素A', 'answerB' => ' B、维生素B', 'answerC' => ' C、维生素C', 'rightAnswer' => 'C'),
            array('index' => 34, 'question' => '不健康的减肥方法包括下面的哪种？', 'answerA' => 'A、多吃水果蔬菜', 'answerB' => ' B、少吃高糖、高脂肪膳食', 'answerC' => ' C、吃减肥药', 'rightAnswer' => 'C'),
            array('index' => 35, 'question' => '为满足身体代谢需要，健康成年人每天需要饮水多少毫升？', 'answerA' => 'A、1200', 'answerB' => ' B、1500', 'answerC' => ' C、2000', 'rightAnswer' => 'B'),
            array('index' => 36, 'question' => '为保持健康，每天最好进行多少分钟中等强度的运动？', 'answerA' => 'A、10分钟', 'answerB' => ' B、20分钟', 'answerC' => ' C、30分钟', 'rightAnswer' => 'C'),
            array('index' => 37, 'question' => '牛奶是人体中什么的最好来源？', 'answerA' => 'A、铁', 'answerB' => ' B、钙', 'answerC' => ' C、碘', 'rightAnswer' => 'B'),
            array('index' => 38, 'question' => '食物的粗细搭配更有利于健康，以下哪种食物是粗粮？', 'answerA' => 'A、白面', 'answerB' => ' B、精米', 'answerC' => ' C、玉米', 'rightAnswer' => 'C'),
            array('index' => 39, 'question' => '蔬菜水果位于宝塔的第几层？', 'answerA' => 'A、第一层', 'answerB' => ' B、第二层', 'answerC' => ' C、第三层', 'rightAnswer' => 'B'),
            array('index' => 40, 'question' => '如何抵御不健康饮食的诱惑？', 'answerA' => 'A、常看媒体的快餐广告', 'answerB' => ' B、经常购买甜饮料', 'answerC' => ' C、购买健康食品', 'rightAnswer' => 'C'),
            array('index' => 41, 'question' => '对于超重肥胖者应选择哪种奶制品？', 'answerA' => 'A、全脂奶', 'answerB' => ' B、低脂奶', 'answerC' => ' C、所有类型的酸奶', 'rightAnswer' => 'B'),
            array('index' => 42, 'question' => '喝豆浆时要注意？', 'answerA' => 'A、煮豆浆时不要冲入鸡蛋', 'answerB' => ' B、可以加牛奶煮', 'answerC' => ' C、煮开锅即可', 'rightAnswer' => 'A'),
            array('index' => 43, 'question' => '痢疾属于什么？', 'answerA' => 'A、属于食物中毒', 'answerB' => ' B、属于传染病', 'answerC' => ' C、属于寄生虫感染', 'rightAnswer' => 'B'),
            array('index' => 44, 'question' => '牛奶的主要成分有？', 'answerA' => 'A、蛋白质', 'answerB' => ' B、水分', 'answerC' => ' C、铁', 'rightAnswer' => 'A'),
            array('index' => 45, 'question' => '下列营养素的推荐量，哪个能满足一个8岁女生每天对其的需要量？', 'answerA' => 'A、能量：1800千卡/天', 'answerB' => ' B、蛋白质：65克/天', 'answerC' => ' C、铁：65毫克/天', 'rightAnswer' => 'B'),
            array('index' => 46, 'question' => '每人每天应饮用多少克牛奶最为合适？', 'answerA' => 'A、200', 'answerB' => ' B、300', 'answerC' => ' C、400', 'rightAnswer' => 'B'),
            array('index' => 47, 'question' => '上下楼梯应该靠哪边走？？', 'answerA' => 'A、左边', 'answerB' => ' B、右边', 'answerC' => ' C、中间', 'rightAnswer' => 'B'),
            array('index' => 48, 'question' => '医疗救助电话是？', 'answerA' => 'A、110', 'answerB' => ' B、119', 'answerC' => ' C、120', 'rightAnswer' => 'C'),
            array('index' => 49, 'question' => '每次刷牙的持续时间应为多长？', 'answerA' => 'A、小于1分钟', 'answerB' => 'B、2分钟', 'answerC' => 'C、3分钟', 'rightAnswer' => 'C'),
            array('index' => 50, 'question' => '人的胚胎发育是从什么时候开始的？', 'answerA' => 'A、精子', 'answerB' => 'B、卵细胞', 'answerC' => 'C、受精卵', 'rightAnswer' => 'C'),
            array('index' => 51, 'question' => '我国目前属于缺铁性贫血发生的______严重地区，防治任务依然艰巨。', 'answerA' => 'A、重度', 'answerB' => 'B、轻度', 'answerC' => 'C、中度', 'rightAnswer' => 'A'),
            array('index' => 52, 'question' => '药物滥用指的是使用？', 'answerA' => 'A、依赖性药物', 'answerB' => 'B、抗生素类药物', 'answerC' => 'C、OTC类药物', 'rightAnswer' => 'B'),
            array('index' => 53, 'question' => '有氧运动包含哪些？', 'answerA' => 'A、快走', 'answerB' => 'B、举重', 'answerC' => 'C、拔河', 'rightAnswer' => 'A'),
            array('index' => 54, 'question' => '污染食品的有害物质分为三大类：生物性污染物、化学性污染物和放射性污染物？', 'answerA' => 'A、正确', 'answerB' => 'B、错误', 'answerC' => 'C、前两个正确', 'rightAnswer' => 'A'),
            array('index' => 55, 'question' => '下列哪项是有关眼保健操的正确姿势？', 'answerA' => 'A、眼保健操没用', 'answerB' => 'B、第二节按太阳穴', 'answerC' => 'C、常做眼保健操可预防近视', 'rightAnswer' => 'C'),
            array('index' => 56, 'question' => '铁中毒的表现有哪些？', 'answerA' => 'A、恶心、呕吐', 'answerB' => 'B、失明', 'answerC' => 'C、呼吸困难', 'rightAnswer' => 'A'),
            array('index' => 57, 'question' => '如何才能够保持口腔卫生？', 'answerA' => 'A、只需早晨刷牙', 'answerB' => 'B、只需晚上刷牙', 'answerC' => 'C、早晚各刷一次，食后漱口', 'rightAnswer' => 'C'),
            array('index' => 58, 'question' => '蔬菜中含有的_______能促进肠胃蠕动、有利于食物消化？', 'answerA' => 'A、维生素', 'answerB' => 'B、纤维', 'answerC' => 'C、微量元素', 'rightAnswer' => 'B'),
            array('index' => 59, 'question' => '自然界中，有“智慧元素”之称的是？', 'answerA' => 'A、铁', 'answerB' => 'B、钙', 'answerC' => 'C、碘', 'rightAnswer' => 'C'),
            array('index' => 60, 'question' => '水是人体必须的营养素之一，我们每天离不开水，我们口渴时了，喝那种水最好？', 'answerA' => 'A、可乐', 'answerB' => 'B、白开水', 'answerC' => 'C、果汁', 'rightAnswer' => 'B'),
            array('index' => 61, 'question' => '以下哪种食物富含微量元素碘？', 'answerA' => 'A、苹果', 'answerB' => 'B、巧克力', 'answerC' => 'C、海带', 'rightAnswer' => 'C'),
            array('index' => 62, 'question' => '缺乏维生素D、缺钙会引起？', 'answerA' => 'A、佝偻病', 'answerB' => 'B、坏血病', 'answerC' => 'C、贫血病', 'rightAnswer' => 'A'),
            array('index' => 63, 'question' => '经常牙龈出血、流鼻血，可能缺乏什么？', 'answerA' => 'A、维生素A', 'answerB' => 'B、维生素B', 'answerC' => 'C、维生素C', 'rightAnswer' => 'C'),
            array('index' => 64, 'question' => '维生素C最主要的食物来源是？', 'answerA' => 'A、蔬菜、水果', 'answerB' => 'B、动物肝脏', 'answerC' => 'C、鱼类', 'rightAnswer' => 'A'),
            array('index' => 65, 'question' => '长期大量饮酒对人体的那个脏器损害最严重？', 'answerA' => 'A、心脏', 'answerB' => 'B、肝脏', 'answerC' => 'C、肾脏', 'rightAnswer' => 'B'),
            array('index' => 66, 'question' => '人体细胞中含量最高的是？', 'answerA' => 'A、水', 'answerB' => 'B、蛋白质', 'answerC' => 'C、脂肪', 'rightAnswer' => 'A'),
            array('index' => 67, 'question' => '生活中，人体热能最主要来源于下列那种营养素？', 'answerA' => 'A、糖类', 'answerB' => 'B、脂肪', 'answerC' => 'C、蛋白质', 'rightAnswer' => 'A'),
            array('index' => 68, 'question' => '水是人体中含量最多的物质，约占人体体重的？', 'answerA' => 'A、65%左右', 'answerB' => 'B、70%-80%', 'answerC' => 'C、90%', 'rightAnswer' => 'A'),
            array('index' => 69, 'question' => '贫血是儿童常见病，可能与下列那种矿物质缺乏有关？', 'answerA' => 'A、钙', 'answerB' => 'B、铁', 'answerC' => 'C、铜', 'rightAnswer' => 'B'),
            array('index' => 70, 'question' => '一般情况下成人每天保证睡多少小时？', 'answerA' => 'A、5-6小时', 'answerB' => 'B、7-8小时	', 'answerC' => 'C、9-10小时', 'rightAnswer' => 'B'),
            array('index' => 71, 'question' => '体温计中的白色液体是什么物质？', 'answerA' => 'A、汞（水银）', 'answerB' => 'B、水', 'answerC' => 'C、硫酸', 'rightAnswer' => 'A'),
            array('index' => 72, 'question' => '世界无烟日是每年的？', 'answerA' => 'A、4月30日', 'answerB' => 'B、5月31日', 'answerC' => 'C、6月31日', 'rightAnswer' => 'B'),
            array('index' => 73, 'question' => '健康成年人每次献血多少毫升对身体无害？', 'answerA' => 'A、200-400ml', 'answerB' => 'B、450-500ml', 'answerC' => 'C、550-600ml', 'rightAnswer' => 'A'),
            array('index' => 74, 'question' => '腋下体温正常是多少度？', 'answerA' => 'A、40-41度', 'answerB' => 'B、38-39度', 'answerC' => 'C、36-37度', 'rightAnswer' => 'C'),
            array('index' => 75, 'question' => '发现死、病禽后应向哪个部门报告？', 'answerA' => 'A、公安部门', 'answerB' => 'B、120急救中心', 'answerC' => 'C、畜牧部门', 'rightAnswer' => 'C'),
            array('index' => 76, 'question' => '世界艾滋病日是每年的那一天？', 'answerA' => 'A、10月5日', 'answerB' => 'B、12月1日', 'answerC' => 'C、11月2日', 'rightAnswer' => 'B'),
            array('index' => 77, 'question' => '成年人每年至少进行几次健康体检？', 'answerA' => 'A、1次', 'answerB' => 'B、2次', 'answerC' => 'C、3次', 'rightAnswer' => 'A'),
            array('index' => 78, 'question' => '正确的刷牙方法？', 'answerA' => 'A、横刷法', 'answerB' => 'B、竖刷法', 'answerC' => 'C、随意刷', 'rightAnswer' => 'B'),
            array('index' => 79, 'question' => '正确的洗手方法是？', 'answerA' => 'A、用流动的水、使用肥皂', 'answerB' => 'B、随意洗', 'answerC' => 'C、不洗手', 'rightAnswer' => 'A'),
            array('index' => 80, 'question' => '阳光照射与以下那种元素的吸收密切相关？', 'answerA' => 'A、维生素C', 'answerB' => 'B、硒', 'answerC' => 'C、钙', 'rightAnswer' => 'C'),
            array('index' => 81, 'question' => '妇女怀孕后至少几次孕期检查？', 'answerA' => 'A、5次', 'answerB' => 'B、7次', 'answerC' => 'C、8次', 'rightAnswer' => 'A'),
            array('index' => 82, 'question' => '血吸虫主要通过一下那种途径进入人体的？', 'answerA' => 'A、耳朵', 'answerB' => 'B、鼻子', 'answerC' => 'C、皮肤接触', 'rightAnswer' => 'C'),
            array('index' => 83, 'question' => '儿童缺碘的主要危害是什么？', 'answerA' => 'A、没有任何事', 'answerB' => 'B、智力损害', 'answerC' => 'C、肚子疼', 'rightAnswer' => 'B'),
            array('index' => 84, 'question' => '预防碘缺乏，最安全、有效、省钱的方法是？', 'answerA' => 'A、不管', 'answerB' => 'B、食碘盐', 'answerC' => 'C、食蔬菜', 'rightAnswer' => 'B'),
            array('index' => 85, 'question' => '准许食品使用保健食品标志，必须要有以下那种证书？', 'answerA' => 'A、食品安全证', 'answerB' => 'B、3C认证', 'answerC' => 'C、保健食品批准证书', 'rightAnswer' => 'C'),
            array('index' => 86, 'question' => '您认为按国家规定给孩子打预防针能够预防那类疾病？', 'answerA' => 'A、传染病', 'answerB' => 'B、糖尿病', 'answerC' => 'C、恶性肿瘤', 'rightAnswer' => 'A'),
            array('index' => 87, 'question' => '我国将预防针接种的疫苗分为几类？', 'answerA' => 'A、一类', 'answerB' => 'B、两类', 'answerC' => 'C、三类', 'rightAnswer' => 'B'),
            array('index' => 88, 'question' => '流感在我国多发生在哪个季节？', 'answerA' => 'A、夏季', 'answerB' => 'B、秋季', 'answerC' => 'C、春冬季', 'rightAnswer' => 'C'),
            array('index' => 89, 'question' => '降低室内空气污染最有效的方法是？', 'answerA' => 'A、使用活性炭', 'answerB' => 'B、开窗通风', 'answerC' => 'C、关好门窗', 'rightAnswer' => 'B'),
            array('index' => 90, 'question' => '那种食品是婴儿最理想的天然食品？', 'answerA' => 'A、奶粉', 'answerB' => 'B、酸奶', 'answerC' => 'C、母乳', 'rightAnswer' => 'C'),
            array('index' => 91, 'question' => '我国每年的“爱眼日”是？', 'answerA' => 'A、6月4日', 'answerB' => 'B、6月5日', 'answerC' => 'C、6月6日', 'rightAnswer' => 'C'),
            array('index' => 92, 'question' => '保持健康体重的两个主要因素是什么？', 'answerA' => 'A、进食量和运动量', 'answerB' => 'B、不吃肉类', 'answerC' => 'C、暴饮暴食', 'rightAnswer' => 'A'),
            array('index' => 93, 'question' => '《中国居民膳食指南》建议每人每天烹调油用量不应超过多少克？', 'answerA' => 'A、10克', 'answerB' => 'B、25克', 'answerC' => 'C、30克', 'rightAnswer' => 'B'),
            array('index' => 94, 'question' => '盐的摄入量过多主要引起下列什么疾病？', 'answerA' => 'A、高血压', 'answerB' => 'B、心脏病', 'answerC' => 'C、恶心肿瘤', 'rightAnswer' => 'A'),
            array('index' => 95, 'question' => '家庭餐具常用的消毒方法是哪一种？', 'answerA' => 'A、煮沸、漂白粉', 'answerB' => 'B、紫外线', 'answerC' => 'C、用水冲洗', 'rightAnswer' => 'A'),
            array('index' => 96, 'question' => '手足口病主要传播途径是？', 'answerA' => 'A、密切接触传播', 'answerB' => 'B、空气飞沫传播', 'answerC' => 'C、粪', 'rightAnswer' => 'B'),
            array('index' => 97, 'question' => '目前我国流行最广、危害最严重、被认为是“毒品之王”的毒品是？', 'answerA' => 'A、摇头丸', 'answerB' => 'B、海洛因', 'answerC' => 'C、吗啡', 'rightAnswer' => 'B'),
            array('index' => 98, 'question' => '闻到有浓烈的煤气异味，应立即？', 'answerA' => 'A、打开门窗、关闭煤气阀', 'answerB' => 'B、打开抽风机，抽走煤气', 'answerC' => 'C、逃离现场', 'rightAnswer' => 'A'),
            array('index' => 99, 'question' => '含不饱和脂肪的动物食物是？', 'answerA' => 'A、猪肉', 'answerB' => 'B、鱼肉', 'answerC' => 'C、羊肉', 'rightAnswer' => 'B'),
            array('index' => 100, 'question' => '夏季在烈日下剧烈运动出汗过多时，为预防中暑应多喝？', 'answerA' => 'A、糖水', 'answerB' => 'B、淡盐水', 'answerC' => 'C、白开水', 'rightAnswer' => 'B'),

        );
        $index = rand(0, count($answers) - 1);
        $answer = $answers[$index];
        try {
            MasterManager::setAnswerInfo($answer);
        } catch (Exception $e) {
            LogUtils::error("ActivityConstant::getAnswer()  ---->>> exception: " . $e->getMessage());
        }
        return $answer;
    }

    /**
     * 获取题目信息2，使用本地数据
     *
     * @return mixed
     */
    public static function getAnswer2()
    {
        $answers = array(
            array('index' => 2, 'question' => '霉变的甘蔗可以吃吗？', 'answerA' => 'A、不能吃 ', 'answerB' => 'B、可以吃', 'answerC' => 'C、削皮后可以吃', 'rightAnswer' => 'A'),
            array('index' => 37, 'question' => '牛奶是人体中什么的最好来源？', 'answerA' => 'A、铁', 'answerB' => ' B、钙', 'answerC' => ' C、碘', 'rightAnswer' => 'B'),
            array('index' => 41, 'question' => '对于超重肥胖者应选择哪种奶制品？', 'answerA' => 'A、全脂奶', 'answerB' => ' B、低脂奶', 'answerC' => ' C、所有类型的酸奶', 'rightAnswer' => 'B'),
            array('index' => 44, 'question' => '牛奶的主要成分有？', 'answerA' => 'A、蛋白质', 'answerB' => ' B、水分', 'answerC' => ' C、铁', 'rightAnswer' => 'A'),
            array('index' => 48, 'question' => '医疗救助电话是？', 'answerA' => 'A、110', 'answerB' => ' B、119', 'answerC' => ' C、120', 'rightAnswer' => 'C'),
        );
        $index = rand(0, count($answers) - 1);
        $answer = $answers[$index];
        try {
            MasterManager::setAnswerInfo($answer);
        } catch (Exception $e) {
            LogUtils::error("ActivityConstant::getAnswer2()  ---->>> exception: " . $e->getMessage());
        }
        return $answer;
    }

    /**
     * “健康测一测”：获取不同的题库。
     * <pre>
     *      题库数组元素示例：
     *      [
     *          type: 1
     *          index: 4
     *          subject: "趣味小常识"
     *          subjectDesc: "生活中的小常识，你知道吗？"
     *          question: "我的肥胖信号"
     *          answerA: "A、一个月增重1Kg "
     *          answerB: "B、一个月增重1.5Kg"
     *          answerC: "C、一个月增重0.5Kg"
     *          rightAnswer: "B" / "opened"
     *      ]
     *
     *    type含义：
     *          1 - 趣味小常识               2 - 抑郁症程度自测                 3 - 焦虑症程度自测
     *          4 - 测测自己是否有强迫症     5 - 是不是肾阴虚，25秒就知道       6 - 小肠实热自测          7 - 什么问题造成气血虚
     *    index含义： 题目索引号
     *    rightAnswer: 正确答案为"空"或者"opened"，表示开放性答案，无定值
     * </pre>
     * @param $answersType
     * @return mixed
     */
    public static function getHeathTestAnswersBy($answersType)
    {
        switch ($answersType) {
            case 1: // 趣味小常识
                return self::getHeathTestAnswersLevel1();
            case 2: // 心理测试
                return self::getHeathTestAnswersLevel2();
            case 3: // 亚健康测试
                return self::getHeathTestAnswersLevel3();
            case 4: // 健康自测
                return self::getHeathSelfTesting();

            default:
                return self::getHeathTestAnswersLevel1();
        }
    }

    /** “零食大作战-联合活动”*/
    const SUB_ID_JOINT_ACTIVITY_SNACK_WARS20220608 = "JointActivitySnackWars20220608";


    /**
     * IPTV“快乐大挑战，健康测一测”  "健康自测题目" 新疆电信
     */
    private static function getHeathSelfTesting()
    {
        // 当前主题及描述，即大标题下的内容描述提示

        $subjectType2 = '抑郁症程度自测';
        $subjectDescType2 = '抑郁症是青春期常见的情感性障碍，容易引起冲动、疲劳、忧郁、恐惧、内疚的念头，严重者导致自杀。';

        $subjectType3 = '焦虑症程度自测';
        $subjectDescType3 = '焦虑症是在儿童无明显原因下发生发作性紧张、莫名恐惧与不安，常伴有自主神经系统功能的异常，是一种较常见的情绪障碍。';

        $subjectType4 = '测测自己是否有强迫症';
        $subjectDescType4 = '自己是否有强迫症的症状呢？快来点击这里，通过这个小测试来测试一下自己是否患有强迫症吧。让自己，也让家人安个心。';

        $subjectType5 = '是不是肾阴虚，25秒就知道';
        $subjectDescType5 = '肾阴虚：是肾赃阴液不足表现的证候．多由久病伤肾，或禀赋不足房事过度，或过服温燥劫阴之品所致。';

        $subjectType6 = '小肠实热自测';
        $subjectDescType6 = '实热，证名。指邪气盛实之发热，或 热病而见发狂等精神见症。';

        $subjectType7 = '什么问题造成气血虚';
        $subjectDescType7 = '由于心血不足、脾虚气弱而表现的心神失养，脾失健运、统血的虚弱证候。简称心脾两虚证。';

        $allAnswers = array(

            // type = 2：表示属于“抑郁症程度自测”归类
            array(
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 1, 'question' => '您是否觉得闷闷不乐，情绪低沉？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 2, 'question' => '您是否没有要好的朋友，觉得很孤单？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 3, 'question' => '您是否对日常活动丧失兴趣，无愉快感？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 4, 'question' => '您是否社会关系不和谐，不合群？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 5, 'question' => '您是否常常入睡困难，长期失眠？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 6, 'question' => '您是否记忆力下降，常丢三落四？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            ),
            // type = 3：表示属于“焦虑症程度自测”归类
            array(
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 1, 'question' => '您的孩子是否常常感到烦躁、害怕？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 2, 'question' => '您的孩子是否常常莫名恐惧？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 3, 'question' => '您的孩子是否常常胆小，不愿意离开父母？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 4, 'question' => '您的孩子是否常常焦虑不安？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 5, 'question' => '您的孩子是否常常情绪不稳定和内向？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 6, 'question' => '您的孩子是否常常拒绝上学或有学校恐怖症？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            ),
            // type = 4：表示属于“测测自己是否有强迫症”归类
            array(
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 1, 'question' => '您是否常反复洗手且洗手的时间长，超过正常所必需？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 2, 'question' => '您是否有时不得不毫无理由地多次重复相同的内容，句子或数字？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 3, 'question' => '您是否觉得自己穿衣，脱衣，清洗，走路时要遵循特殊的顺序？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 4, 'question' => '您是否常常没有必要地检查门窗，煤气，钱物，文件，信件等？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 5, 'question' => '您是否不得不反复多次做某些事情，直到认为自己已经做好了为止？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 6, 'question' => '您是否因为没有必要地花很多时间重复做某些事情而经常迟到？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            ),
            // type = 5：表示属于“是不是肾阴虚，25秒就知道”归类
            array(
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 1, 'question' => '您是否常常腰酸、腿酸？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 2, 'question' => '您是否常常耳鸣？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 3, 'question' => '您是否常常上火？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 4, 'question' => '您是否常常失眠？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 5, 'question' => '您是否常常口干？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 6, 'question' => '您是否常有尿黄？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            ),
            // type = 6：表示属于“小肠实热自测”归类
            array(
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 1, 'question' => '您是否常常心烦口渴？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 2, 'question' => '您是否常有口舌生疮？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 3, 'question' => '您是否常常小便赤涩？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 4, 'question' => '您是否常常尿血？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 5, 'question' => '您是否常有舌红苔黄？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 6, 'question' => '您是否常常脉虚？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            ),
            // type = 7：表示属于“什么问题造成气血虚”归类
            array(
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 1, 'question' => '您是否常常小腹隐痛，按之痛减？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 2, 'question' => '您是否常常心悸、气短？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 3, 'question' => '您是否常常面色苍白？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 4, 'question' => '您是否常常精神倦怠？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 5, 'question' => '您是否常常舌淡苔白？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 6, 'question' => '您是否常常脉虚？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            )
        );

        // 随机选1类
        $which = rand(0, count($allAnswers) - 1);
        $answers = $allAnswers[$which];

        LogUtils::info('健康测一测活动 --> ActivityConstant::getHeathSelfTesting ---> "健康自测" 随机题库' . json_encode($answers));

        return $answers;
    }




    /**
     * “健康测一测”活动：“趣味小常识”题库（重要程度1）
     */
    private static function getHeathTestAnswersLevel1()
    {
        // 当前主题及描述，即大标题下的内容描述提示
        $subjectType1 = '趣味小常识';
        $subjectDescType1 = '生活中的小常识，你知道吗？';

        $allAnswers = array(
            // type = 1：表示属于“趣味小常识”归类
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 1, 'question' => '最近牙齿黄黄哒，这样做我的牙齿变白白', 'answerA' => 'A、用牙刷使劲刷', 'answerB' => 'B、牙膏上加小苏打', 'answerC' => 'C、延长刷牙时间', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 2, 'question' => '我的正常心率是', 'answerA' => 'A、75次/分', 'answerB' => 'B、65次/分', 'answerC' => 'C、70次/分', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 3, 'question' => '我的正常体温是', 'answerA' => 'A、35℃-36℃ ', 'answerB' => 'B、36℃-37℃', 'answerC' => 'C、37℃-38℃', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 4, 'question' => '我的肥胖信号', 'answerA' => 'A、一个月增重1Kg ', 'answerB' => 'B、一个月增重1.5Kg', 'answerC' => 'C、一个月增重0.5Kg', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 5, 'question' => '我每天食用多少克油最健康', 'answerA' => 'A、30', 'answerB' => 'B、25', 'answerC' => 'C、35', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 6, 'question' => '我每天食盐量不宜超过', 'answerA' => 'A、5g', 'answerB' => 'B、6g', 'answerC' => 'C、7g', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 7, 'question' => '我每天吃多少蔬菜为宜', 'answerA' => 'A、300-400g', 'answerB' => 'B、400-500g', 'answerC' => 'C、500-600g', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 8, 'question' => '我每天需摄入多少mg钙？', 'answerA' => 'A、100-300', 'answerB' => 'B、600-800', 'answerC' => 'C、300-500', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 9, 'question' => '我的骨密度最高时期是', 'answerA' => 'A、20-30岁', 'answerB' => 'B、30-40岁', 'answerC' => 'C、40-50岁', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 10, 'question' => '我的最佳减肥速度是', 'answerA' => 'A、一个月减重0-1Kg', 'answerB' => 'B、一个月减重1-2Kg', 'answerC' => 'C、一个月减重2-3Kg', 'rightAnswer' => 'B'),
        );

        // 随机选2道题
        $randomKeys = array_rand($allAnswers, 2);
        $answers = array();
        foreach ($randomKeys as $key => $value) {
            $answers[$key] = $allAnswers[$value];
        }

        LogUtils::info('健康测一测活动 --> ActivityConstant::getHeathTestAnswersLevel1 ---> "趣味小常识" 随机题库' . json_encode($answers));

        return $answers;
    }

    /**
     * “健康测一测”活动：“心理测试1”题库（重要程度2）
     */
    private static function getHeathTestAnswersLevel2()
    {
        // 当前主题及描述，即大标题下的内容描述提示
        $subjectType2 = '抑郁症程度自测';
        $subjectDescType2 = '抑郁症是青春期常见的情感性障碍，容易引起冲动、疲劳、忧郁、恐惧、内疚的念头，严重者导致自杀。';

        $subjectType3 = '焦虑症程度自测';
        $subjectDescType3 = '焦虑症是在儿童无明显原因下发生发作性紧张、莫名恐惧与不安，常伴有自主神经系统功能的异常，是一种较常见的情绪障碍。';

        $subjectType4 = '测测自己是否有强迫症';
        $subjectDescType4 = '自己是否有强迫症的症状呢？快来点击这里，通过这个小测试来测试一下自己是否患有强迫症吧。让自己，也让家人安个心。';

        $allAnswers = array(
            // type = 2：表示属于“抑郁症程度自测”归类
            array(
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 1, 'question' => '您是否觉得闷闷不乐，情绪低沉？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 2, 'question' => '您是否没有要好的朋友，觉得很孤单？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 3, 'question' => '您是否对日常活动丧失兴趣，无愉快感？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 4, 'question' => '您是否社会关系不和谐，不合群？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 5, 'question' => '您是否常常入睡困难，长期失眠？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 2, 'subject' => $subjectType2, 'subjectDesc' => $subjectDescType2, 'index' => 6, 'question' => '您是否记忆力下降，常丢三落四？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            ),
            // type = 3：表示属于“焦虑症程度自测”归类
            array(
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 1, 'question' => '您的孩子是否常常感到烦躁、害怕？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 2, 'question' => '您的孩子是否常常莫名恐惧？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 3, 'question' => '您的孩子是否常常胆小，不愿意离开父母？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 4, 'question' => '您的孩子是否常常焦虑不安？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 5, 'question' => '您的孩子是否常常情绪不稳定和内向？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 3, 'subject' => $subjectType3, 'subjectDesc' => $subjectDescType3, 'index' => 6, 'question' => '您的孩子是否常常拒绝上学或有学校恐怖症？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            ),
            // type = 4：表示属于“测测自己是否有强迫症”归类
            array(
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 1, 'question' => '您是否常反复洗手且洗手的时间长，超过正常所必需？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 2, 'question' => '您是否有时不得不毫无理由地多次重复相同的内容，句子或数字？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 3, 'question' => '您是否觉得自己穿衣，脱衣，清洗，走路时要遵循特殊的顺序？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 4, 'question' => '您是否常常没有必要地检查门窗，煤气，钱物，文件，信件等？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 5, 'question' => '您是否不得不反复多次做某些事情，直到认为自己已经做好了为止？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
                array('type' => 4, 'subject' => $subjectType4, 'subjectDesc' => $subjectDescType4, 'index' => 6, 'question' => '您是否因为没有必要地花很多时间重复做某些事情而经常迟到？', 'answerA' => 'A、是', 'answerB' => 'B、不一定', 'answerC' => 'C、否', 'rightAnswer' => 'opened'),
            )
        );

        // 随机选1类
        $which = rand(0, count($allAnswers) - 1);
        $answers = $allAnswers[$which];

        LogUtils::info('健康测一测活动 --> ActivityConstant::getHeathTestAnswersLevel2 ---> "心理测试" 随机题库' . json_encode($answers));

        return $answers;
    }

    /**
     * “健康测一测”活动：“亚健康测试”题库（重要程度3）
     */
    private static function getHeathTestAnswersLevel3()
    {
        // 当前主题及描述，即大标题下的内容描述提示
        $subjectType5 = '是不是肾阴虚，25秒就知道';
        $subjectDescType5 = '肾阴虚：是肾赃阴液不足表现的证候．多由久病伤肾，或禀赋不足房事过度，或过服温燥劫阴之品所致。';

        $subjectType6 = '小肠实热自测';
        $subjectDescType6 = '实热，证名。指邪气盛实之发热，或 热病而见发狂等精神见症。';

        $subjectType7 = '什么问题造成气血虚';
        $subjectDescType7 = '由于心血不足、脾虚气弱而表现的心神失养，脾失健运、统血的虚弱证候。简称心脾两虚证。';

        $allAnswers = array(
            // type = 5：表示属于“是不是肾阴虚，25秒就知道”归类
            array(
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 1, 'question' => '您是否常常腰酸、腿酸？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 2, 'question' => '您是否常常耳鸣？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 3, 'question' => '您是否常常上火？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 4, 'question' => '您是否常常失眠？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 5, 'question' => '您是否常常口干？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 5, 'subject' => $subjectType5, 'subjectDesc' => $subjectDescType5, 'index' => 6, 'question' => '您是否常有尿黄？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            ),
            // type = 6：表示属于“小肠实热自测”归类
            array(
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 1, 'question' => '您是否常常心烦口渴？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 2, 'question' => '您是否常有口舌生疮？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 3, 'question' => '您是否常常小便赤涩？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 4, 'question' => '您是否常常尿血？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 5, 'question' => '您是否常有舌红苔黄？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 6, 'subject' => $subjectType6, 'subjectDesc' => $subjectDescType6, 'index' => 6, 'question' => '您是否常常脉虚？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            ),
            // type = 7：表示属于“什么问题造成气血虚”归类
            array(
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 1, 'question' => '您是否常常小腹隐痛，按之痛减？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 2, 'question' => '您是否常常心悸、气短？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 3, 'question' => '您是否常常面色苍白？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 4, 'question' => '您是否常常精神倦怠？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 5, 'question' => '您是否常常舌淡苔白？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
                array('type' => 7, 'subject' => $subjectType7, 'subjectDesc' => $subjectDescType7, 'index' => 6, 'question' => '您是否常常脉虚？', 'answerA' => 'A、是', 'answerB' => 'B、否', 'rightAnswer' => 'opened'),
            )
        );

        // 随机选1类
        $which = rand(0, count($allAnswers) - 1);
        $answers = $allAnswers[$which];

        LogUtils::info('健康测一测活动 --> ActivityConstant::getHeathTestAnswersLevel3 ---> "亚健康测试" 随机题库' . json_encode($answers));

        return $answers;
    }

    /**
     * “健康测一测”：获取不同的题库-对应完测试后的评测参考。例如，正常、一般、危险等提示。
     *  answersType: 1-7
     * @param $answersType
     * @return array|mixed
     */
    public static function getHeathTestAnswersResultBy($answersType)
    {
        $desc = '评测参考(level_1: 正常, level_2: 一般程度, level_3: 严重程度)';
        $subjectType1 = '趣味小常识';
        $subjectType2 = '抑郁症程度自测';
        $subjectType3 = '焦虑症程度自测';
        $subjectType4 = '测测自己是否有强迫症';
        $subjectType5 = '是不是肾阴虚，25秒就知道';
        $subjectType6 = '小肠实热自测';
        $subjectType7 = '什么问题造成气血虚';

        $allTestAnswersResult = array(
            array('type' => 1, 'subject' => $subjectType1, 'desc' => $desc,
                'level_1' => '无',
                'level_2' => '无',
                'level_3' => '无'
            ),
            array('type' => 2, 'subject' => $subjectType2, 'desc' => $desc,
                'level_1' => '安全，暂时不用担心抑郁症，注意养成良好的生活习惯，保持良好的心态。',
                'level_2' => '要注意，你有抑郁症的多种表现，注意改善人际关系，到医院做相关检查，排除器质性疾病。',
                'level_3' => '危险，你已经有早期抑郁症症状，请在医生指导下做相关检查及测试。',
            ),
            array('type' => 3, 'subject' => $subjectType3, 'desc' => $desc,
                'level_1' => '近期不用担心患焦虑症，请保持正确的生活和学习习惯，若为易患素质或直系亲属中有此病者，还是应该加以注意。',
                'level_2' => '将来，有患焦虑症的危险，要积极采取措施，主要是教育方法及心理支持的问题，帮助孩子树立克服困难，搞好学习的信心，培养坚强的意志和开朗的性格，防止焦虑症的出现。',
                'level_3' => '已经怀疑有焦虑症了。要立刻去医院进行详细的心理咨询及检查，早诊断、早治疗，以综合性治疗为原则，以心理治疗为主要手段，要求家长和教师要正确对待孩子，讲究教育方法，充满信心，争取早日康复。'
            ),
            array('type' => 4, 'subject' => $subjectType4, 'desc' => $desc,
                'level_1' => '安全，近期不必担心会患有强迫症，注意保持健康的心理，养成良好的生活习惯。',
                'level_2' => '危险，怀疑患有强迫症，应及时注意自我疏导。',
                'level_3' => '危险，高度怀疑患有强迫症，应及时就医，接受治疗。',
            ),
            array('type' => 5, 'subject' => $subjectType5, 'desc' => $desc,
                'level_1' => '未发现你的身体出现肾阴虚症状，请继续保持健康的生活方式。',
                'level_2' => '你出现了肾阴虚的有关症状，请继续观察症状是否持续或是加重。',
                'level_3' => '根据您的测试，您已经出现肾阴虚的症状，请及时关注身体健康。',
            ),
            array('type' => 6, 'subject' => $subjectType6, 'desc' => $desc,
                'level_1' => '未发现你的身体出现小肠实热症状，请继续保持健康的生活方式。',
                'level_2' => '你有患病风险，必须引起重视，请及时咨询专业医师或到医院做进一步检查。',
                'level_3' => '你患有这种病的几率很高，为了您的健康，请尽快到相关医院进行检查。',
            ),
            array('type' => 7, 'subject' => $subjectType7, 'desc' => $desc,
                'level_1' => '未发现你的身体出现气血虚症状，请继续保持健康的生活方式。',
                'level_2' => '你有患病风险，必须引起重视，请及时咨询专业医师或到医院做进一步检查。',
                'level_3' => '你患有这种病的几率很高，为了您的健康，请尽快到相关医院进行检查。',
            ),
        );

        // 取出对应type的数组
        $retTestAnswersResult = [];
        foreach ($allTestAnswersResult as $testAnswersResult) {
            if ($testAnswersResult['type'] == $answersType) {
                $retTestAnswersResult = $testAnswersResult;
                break;
            }
        }

        LogUtils::info('健康测一测活动 --> ActivityConstant::getHeathTestAnswersResultBy(' . $answersType . ') ---> 当前题库对应评测结果：' . json_encode($retTestAnswersResult));

        return $retTestAnswersResult;
    }


    /**
     * “饮酒与健康”：获取不同的题库。
     * <pre>
     *      题库数组元素示例：
     *      [
     *          type: 1
     *          index: 4
     *          subject: "饮酒小常识"
     *          subjectDesc: "生活中的小常识，你知道吗？"
     *          question: "我的肥胖信号"
     *          answerA: "A、一个月增重1Kg "
     *          answerB: "B、一个月增重1.5Kg"
     *          answerC: "C、一个月增重0.5Kg"
     *          rightAnswer: "B" / "opened"
     *      ]
     *
     *    type含义：
     *          1 - 趣味小常识               2 - 抑郁症程度自测                 3 - 焦虑症程度自测
     *          4 - 测测自己是否有强迫症     5 - 是不是肾阴虚，25秒就知道       6 - 小肠实热自测          7 - 什么问题造成气血虚
     *    index含义： 题目索引号
     *    rightAnswer: 正确答案为"空"或者"opened"，表示开放性答案，无定值
     * </pre>
     * @param $answersType
     * @return mixed
     */
    public static function getHealthExaminationBy($answersType)
    {
        switch ($answersType) {
            case 1: // 饮酒小常识小常识
                return self::getHealthExaminationLevel1();
            case 2: // 肝功能测试
                return self::getHealthExaminationLevel2();
            case 3: // 肝功能测试
                return self::getVipInfor();
            default:
                return self::getHealthExaminationLevel1();
        }
    }


    public static function getWordsPuzzle()
    {
        return self::getWordsPuzzleLevel();

    }

    public static function getPlayerInfo()
    {
        return self::getInfo();

    }

    /**
     * “减脂活动”活动：
     */
    private static function getInfo()
    {
        $list = array(
            array('type' => 1, 'player' => "itv********8260", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "itv********7332", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "itv********5532", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********6911", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "itv********5255", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********4365", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "itv********6013", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********5914", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "itv********7222", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********6283", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********7418", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********7255", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********2225", 'data' => "2019-07-26"),
            array('type' => 1, 'player' => "tvh********5836", 'data' => "2019-07-26"),
        );

        LogUtils::info('"减肥比赛" 随机题库');

        return $list;
    }


    /**
     * “健康测一测”活动：“趣味小常识”题库（重要程度1）
     */
    private static function getHealthExaminationLevel1()
    {
        // 当前主题及描述，即大标题下的内容描述提示
        $subjectType1 = '饮酒小常识';
        $subjectDescType1 = '葡萄酒：众所周知，葡萄酒现以红葡萄酒居多也称为红酒，适量饮用有防衰老、助消化、减、增食欲、美容养颜等等。';
        $subjectDescType2 = '白酒：是各大婚庆宴会场合必不可少的酒。白酒具有循环系统发生兴奋效能，可暖胃、壮胆。适量饮用白酒，还有通风散寒、舒筋活血、有利于睡眠的作用。';

        $allAnswers = array(
            // type = 1：表示属于“趣味小常识”归类
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 1, 'question' => '如果饮酒，成年女性一天饮入的酒中其酒精量不能超过多少', 'answerA' => 'A、15克', 'answerB' => 'B、20克', 'answerC' => 'C、25克', 'answerD' => 'D、30克', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 2, 'question' => '除哪项外是过量饮酒会增加的风险？', 'answerA' => 'A、高血压、中风的风险', 'answerB' => 'B、多种营养素缺乏', 'answerC' => 'C、交通事故增加', 'answerD' => 'D、失眠', 'rightAnswer' => 'D'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 3, 'question' => '如工作需要饮酒，成年男性一天饮入的酒中其酒精量不能超过多少？', 'answerA' => 'A、75克 ', 'answerB' => 'B、50克', 'answerC' => 'C、35克', 'answerD' => 'D、25克', 'rightAnswer' => 'D'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 4, 'question' => '除哪项外是过量饮酒对身体会带来的危害？', 'answerA' => 'A、多种营养元素缺乏 ', 'answerB' => 'B、急慢性酒精中毒', 'answerC' => 'C、酒精性脂肪肝、肝硬化', 'answerD' => 'D、身体肥胖，抵抗力增强', 'rightAnswer' => 'D'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 5, 'question' => '孕妇和儿童、青少年可以喝酒吗？', 'answerA' => 'A、不应饮酒', 'answerB' => 'B、可多喝酒', 'answerC' => 'C、可少量饮酒', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 6, 'question' => '过量饮酒有损健康，应严禁酗酒、尽可能饮用。', 'answerA' => 'A、低度酒', 'answerB' => 'B、烈性酒', 'answerC' => 'C、.洋酒', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 7, 'question' => '除哪项外是经常过量饮酒所引起的。', 'answerA' => 'A、.肝炎', 'answerB' => 'B、急慢性酒精中毒', 'answerC' => 'C、脂肪肝', 'answerD' => 'D、肝硬化', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 8, 'question' => '长期大量饮酒损害最严重的脏器是', 'answerA' => 'A、肾脏', 'answerB' => 'B、肝脏', 'answerC' => 'C、脾脏', 'answerD' => 'D、心脏', 'rightAnswer' => 'B'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 9, 'question' => '人体必需的六大营养素有哪些？', 'answerA' => 'A、蛋白质、脂肪、维生素、钙、铁、水', 'answerB' => 'B、蛋白质、脂肪、糖类、纤维素、无机盐、水', 'answerC' => 'C、蛋白质、脂肪、糖类、维生素、无机盐、水', 'rightAnswer' => 'C'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 10, 'question' => '每天一杯或者一星期5到10杯哪种酒有助于男人预防糖尿病，酒量大的人还要喝得再少一点，有助于降低患2型糖尿病的可能？', 'answerA' => 'A、葡萄酒', 'answerB' => 'B、白酒', 'answerC' => 'C、啤酒', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 11, 'question' => '每天一杯酒，能促进什么功能，这是因为饮酒能促进心血管功能，改善血液循环，从而保护了大脑的认知能力，防止症状不明显的中风发生。', 'answerA' => 'A、防止智力水平下降', 'answerB' => 'B、防止体能下降', 'answerC' => 'C、防止睡眠质量下降', 'rightAnswer' => 'A'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 12, 'question' => '“酒是精品粮，滋阴又壮阳”看来还是有道理的。适度的酒精摄入可以使血液中的什么肌酸酐值显著减少，这有助于防止哪种的发生。', 'answerA' => 'A、心脏病', 'answerB' => 'B、肾脏疾病', 'answerC' => 'C、糖尿病', 'rightAnswer' => 'B'),
        );

        // 随机选2道题
        $randomKeys = array_rand($allAnswers, 2);
        $answers = array();
        foreach ($randomKeys as $key => $value) {
            $answers[$key] = $allAnswers[$value];
        }

        LogUtils::info('饮酒与健康一活动 --> ActivityConstant::getHeathTestAnswersLevel1 ---> "饮酒小常识" 随机题库' . json_encode($answers));

        return $answers;
    }


    /**
     * “猜字谜”活动：“字谜”题库（重要程度1）
     */
    private static function getWordsPuzzleLevel()
    {

        if (ActivityManager::isJointActivity()) {
            $allAnswers = array(
                array(
                    // type = 5：表示属于“趣味小常识”归类
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '龙王跨下驹', 'answerA' => 'A.大海', 'answerB' => 'B.海马', 'answerC' => 'C.浪花', 'rightAnswer' => 'B'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '他乡遇故知', 'answerA' => 'A.大枣', 'answerB' => 'B.一见喜', 'answerC' => 'C.八角', 'rightAnswer' => 'B'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '真心加虚心', 'answerA' => 'A.烦心', 'answerB' => 'B.木耳', 'answerC' => 'C.三七', 'rightAnswer' => 'C'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一歌名)', 'index' => 5, 'question' => '新媳妇探亲', 'answerA' => 'A.回娘家', 'answerB' => 'B.回家', 'answerC' => 'C.回到过去', 'rightAnswer' => 'A'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一歌名)', 'index' => 5, 'question' => '东南西北皆欲往', 'answerA' => 'A.走四方', 'answerB' => 'B.走在冷风中', 'answerC' => 'C.走天涯', 'rightAnswer' => 'A'),
                ),
                array(
                    // type = 4：表示属于“趣味小常识”归类
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一中药名)', 'index' => 4, 'question' => '长生不老', 'answerA' => 'A.野姜', 'answerB' => 'B.油葱', 'answerC' => 'C.万年青', 'rightAnswer' => 'C'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一中药名)', 'index' => 4, 'question' => '天高云淡', 'answerA' => 'A.玉桂', 'answerB' => 'B.空青', 'answerC' => 'C.甜瓜', 'rightAnswer' => 'B'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一食物名)', 'index' => 4, 'question' => '九九归一', 'answerA' => 'A.百合', 'answerB' => 'B.山药', 'answerC' => 'C.木瓜', 'rightAnswer' => 'A'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一歌名)', 'index' => 4, 'question' => '第一人称', 'answerA' => 'A.他说', 'answerB' => 'B.你的名字', 'answerC' => 'C.那就是我', 'rightAnswer' => 'C'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一歌名)', 'index' => 4, 'question' => '天涯海角', 'answerA' => 'A.在那遥远的地方', 'answerB' => 'B.仰望星空', 'answerC' => 'C.宇宙', 'rightAnswer' => 'A'),
                ),
                array(
                    // type = 3：表示属于“趣味小常识”归类
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '春夏秋', 'answerA' => 'A.冬瓜', 'answerB' => 'B.茴香', 'answerC' => 'C.隐冬', 'rightAnswer' => 'C'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '烤火费', 'answerA' => 'A.肉桂', 'answerB' => 'B.冬花', 'answerC' => 'C.山茶', 'rightAnswer' => 'B'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '女儿乐', 'answerA' => 'A.千金子', 'answerB' => 'B.石南', 'answerC' => 'C.石榴', 'rightAnswer' => 'A'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一歌名)', 'index' => 3, 'question' => '聊斋', 'answerA' => 'A.人鬼情未了', 'answerB' => 'B.鬼迷心窍', 'answerC' => 'C.狐狸', 'rightAnswer' => 'A'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一歌名)', 'index' => 3, 'question' => '相思苦', 'answerA' => 'A.情歌王', 'answerB' => 'B.情非得已', 'answerC' => 'C.好想好想', 'rightAnswer' => 'C'),
                ),
                array(
                    // type = 2：表示属于“趣味小常识”归类
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '故乡', 'answerA' => 'A.熟地', 'answerB' => 'B.怀熟地', 'answerC' => 'C.当归', 'rightAnswer' => 'A'),
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '涨潮', 'answerA' => 'A.向前', 'answerB' => 'B.胖大海', 'answerC' => 'C.海蛤', 'rightAnswer' => 'B'),
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '冰川', 'answerA' => 'A.天冬', 'answerB' => 'B.冬瓜', 'answerC' => 'C.寒水石', 'rightAnswer' => 'C'),
                    array('type' => 2, 'subject' => '二字谜', 'subjectDesc' => '(打一歌名)', 'index' => 2, 'question' => '十八日晴', 'answerA' => 'A.九九艳阳天', 'answerB' => 'B.天空之城', 'answerC' => 'C.雨一直下', 'rightAnswer' => 'A'),
                    array('type' => 2, 'subject' => '二字谜', 'subjectDesc' => '(打一歌名)', 'index' => 2, 'question' => '意志不坚定', 'answerA' => 'A.心太软', 'answerB' => 'B.心安理得', 'answerC' => 'C.心跳', 'rightAnswer' => 'A'),
                ),
                array(
                    // type = 1：表示属于“趣味小常识”归类
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一中药名)', 'index' => 1, 'question' => '明', 'answerA' => 'A.空青', 'answerB' => 'B.阴阳合', 'answerC' => 'C.大青', 'rightAnswer' => 'B'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一食物名)', 'index' => 1, 'question' => '车', 'answerA' => 'A.大枣', 'answerB' => 'B.地胆', 'answerC' => 'C.莲心', 'rightAnswer' => 'C'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一中药名)', 'index' => 1, 'question' => '纹', 'answerA' => 'A.双花', 'answerB' => 'B.破故纸', 'answerC' => 'C.萱草', 'rightAnswer' => 'B'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一歌名)', 'index' => 1, 'question' => '哑剧落了幕', 'answerA' => 'A.无言的结局', 'answerB' => 'B..曲中人', 'answerC' => 'C.无声的雨', 'rightAnswer' => 'A'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一歌名)', 'index' => 1, 'question' => '俯耳过来', 'answerA' => 'A.让我轻轻地告诉你', 'answerB' => 'B.告诉我', 'answerC' => 'C.告诉自己忘了他', 'rightAnswer' => 'A'),
                )
            );
        } else {
            // 当前主题及描述，即大标题下的内容描述提示
            $allAnswers = array(
                array(
                    // type = 5：表示属于“趣味小常识”归类
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '龙王跨下驹', 'answerA' => 'A、大海', 'answerB' => 'B、海马', 'answerC' => 'C、浪花', 'rightAnswer' => 'B'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '他乡遇故知', 'answerA' => 'A、一见喜', 'answerB' => 'B、大枣', 'answerC' => 'C、八角', 'rightAnswer' => 'A'),
                    array('type' => 5, 'subject' => '五字谜', 'subjectDesc' => '(打一中药名)', 'index' => 5, 'question' => '真心加虚心', 'answerA' => 'A、烦心', 'answerB' => 'B、三七', 'answerC' => 'C、木耳', 'rightAnswer' => 'B'),
                ),
                array(
                    // type = 4：表示属于“趣味小常识”归类
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一中药名)', 'index' => 4, 'question' => '长生不老', 'answerA' => 'A、野姜', 'answerB' => 'B、油葱', 'answerC' => 'C、万年青', 'rightAnswer' => 'C'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一中药名)', 'index' => 4, 'question' => '天高云淡', 'answerA' => 'A、玉桂', 'answerB' => 'B、空青', 'answerC' => 'C、甜瓜', 'rightAnswer' => 'B'),
                    array('type' => 4, 'subject' => '四字谜', 'subjectDesc' => '(打一中药名)', 'index' => 4, 'question' => '九九归一', 'answerA' => 'A、百合', 'answerB' => 'B、山药', 'answerC' => 'C、木瓜', 'rightAnswer' => 'A'),
                ),
                array(
                    // type = 3：表示属于“趣味小常识”归类
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '春夏秋', 'answerA' => 'A、冬瓜', 'answerB' => 'B、茴香', 'answerC' => 'C、隐冬', 'rightAnswer' => 'C'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '烤火费', 'answerA' => 'A、肉桂', 'answerB' => 'B、冬花', 'answerC' => 'C、山茶', 'rightAnswer' => 'B'),
                    array('type' => 3, 'subject' => '三字谜', 'subjectDesc' => '(打一中药名)', 'index' => 3, 'question' => '女儿乐', 'answerA' => 'A、千金子', 'answerB' => 'B、石南', 'answerC' => 'C、石榴', 'rightAnswer' => 'A'),
                ),
                array(
                    // type = 2：表示属于“趣味小常识”归类
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '故乡', 'answerA' => 'A、熟地', 'answerB' => 'B、怀熟地', 'answerC' => 'C、当归', 'rightAnswer' => 'A'),
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '涨潮', 'answerA' => 'A、向前', 'answerB' => 'B、胖大海', 'answerC' => 'C、海蛤', 'rightAnswer' => 'B'),
                    array('type' => 2, 'subject' => '二字迷', 'subjectDesc' => '(打一中药名)', 'index' => 2, 'question' => '冰川', 'answerA' => 'A、天冬', 'answerB' => 'B、冬瓜', 'answerC' => 'C、寒水石', 'rightAnswer' => 'C'),
                ),
                array(
                    // type = 1：表示属于“趣味小常识”归类
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一中药名)', 'index' => 1, 'question' => '明', 'answerA' => 'A、空青', 'answerB' => 'B、阴阳合', 'answerC' => 'C、大青', 'rightAnswer' => 'B'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一中药名)', 'index' => 1, 'question' => '车', 'answerA' => 'A、大枣', 'answerB' => 'B、地胆', 'answerC' => 'C、莲心', 'rightAnswer' => 'C'),
                    array('type' => 1, 'subject' => '一字谜', 'subjectDesc' => '(打一中药名)', 'index' => 1, 'question' => '纹', 'answerA' => 'A、双花', 'answerB' => 'B、破故纸', 'answerC' => 'C、萱草', 'rightAnswer' => 'B'),
                ),
            );
        }

        // 随机选2道题
        $answers = array();
        foreach ($allAnswers as $key => $value) {
            $randItemKey = array_rand($value, 1);
            $answers[] = $value[$randItemKey];
        }
        return $answers;
    }

    /**
     * “健康测一测”活动：“趣味小常识”题库（重要程度1）
     */
    private static function getHealthExaminationLevel2()
    {
        // 当前主题及描述，即大标题下的内容描述提示
        $subjectType1 = '肝功能检测';
        $subjectDescType1 = '研究发现，喝酒时间超过十年以上，罹患肝硬化的风险就是正常人的10-20倍，如果是重度饮酒者，风险可以达到30-50倍。';
        $subjectDescType2 = '啤酒可以使人心情愉悦、保持活力，适量的啤酒还带有美容效果，同时是夏秋季暑降温解渴止汗的清凉饮料。';
        $subjectDescType3 = '保健酒，又称药酒，顾名思义内有酒的作用和药物功效的双重功效，可暖身可养颜，养颜是因为现代医学研究证实适当饮酒可以促进人体新陈代谢，所以就有美容养颜、抗皱去雀斑的功效。';

        $allAnswers = array(
            // type = 1：表示属于“趣味小常识”归类
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType1, 'index' => 1, 'question' => '您有无特殊的症状，乏力，食欲不振，腹胀，腹痛，呕吐，消瘦。', 'answerA' => 'A、有', 'answerB' => 'B、无', 'rightAnswer' => 'opened'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType2, 'index' => 2, 'question' => '您有无特殊的体征，观察眼睛，舌头，胸口，腹部和手掌，有没有静脉曲张，有没有黄疸，有没有蜘蛛痣，有没有肝掌。', 'answerA' => 'A、有', 'answerB' => 'B、无', 'rightAnswer' => 'opened'),
            array('type' => 1, 'subject' => $subjectType1, 'subjectDesc' => $subjectDescType3, 'index' => 2, 'question' => '3.每次喝酒都容易脸红，容易醉酒，头晕呕吐等。', 'answerA' => 'A、有', 'answerB' => 'B、无', 'rightAnswer' => 'opened'),

        );
        LogUtils::info('饮酒与健康一活动 --> ActivityConstant::getHeathTestAnswersLevel1 ---> "肝功能测试" 随机题库' . json_encode($allAnswers));

        return $allAnswers;
    }

    /**
     * “健康测一测”活动：“模拟VIP订购用户”
     */
    private static function getVipInfor()
    {

        $list = array(
            // type = 1：表示属于“趣味小常识”归类
            array('account' => 'ver****87itv', 'prize_dt' => '2018-12-08', 'tel_number' => '139*****8038'),
            array('account' => 'sin****20itv', 'prize_dt' => '2018-12-09', 'tel_number' => '158*****0051'),
            array('account' => 'ggn****85itv', 'prize_dt' => '2018-12-10', 'tel_number' => '175*****6038'),
            array('account' => 'nxa****88itv', 'prize_dt' => '2018-12-02', 'tel_number' => '133*****5039'),
            array('account' => 'tuh****85itv', 'prize_dt' => '2018-12-06', 'tel_number' => '187*****9546'),
            array('account' => 'btb****89itv', 'prize_dt' => '2018-12-04', 'tel_number' => '157*****2587'),
            array('account' => 'aaf****57itv', 'prize_dt' => '2018-12-08', 'tel_number' => '157*****8038'),
            array('account' => 'jjd****70itv', 'prize_dt' => '2018-12-09', 'tel_number' => '138*****0451'),
            array('account' => 'ssd****98itv', 'prize_dt' => '2018-12-10', 'tel_number' => '139*****6035'),
            array('account' => 'ttu****89itv', 'prize_dt' => '2018-12-02', 'tel_number' => '155*****5087'),
            array('account' => 'ood****39itv', 'prize_dt' => '2018-12-06', 'tel_number' => '188*****9554'),
            array('account' => 'yan****49itv', 'prize_dt' => '2018-12-04', 'tel_number' => '184*****2532'),
        );
        LogUtils::info('饮酒与健康一活动 --> ActivityConstant::getHeathTestAnswersLevel1 ---> "肝功能测试" 随机题库' . json_encode($list));
        return $list;
    }

    /**
     * “宝宝健康大测评”当前期数
     */
    public static function getBabyHealthTestPhase()
    {
        return 2;
    }

    /**
     * “宝宝健康大测评”题目
     */
    public static function getBabyHealthTestProblems($phase)
    {
        switch ($phase) {
            case 1:
                $problems = array(
                    array('index' => '01', 'question' => '被竖抱时，宝宝能把头直立片刻，不摇晃吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '02', 'question' => '宝宝俯卧在床上时，能否将头抬起约45度？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '03', 'question' => '让宝宝站在父母的腿上，他的小腿能够蹬直吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '04', 'question' => '宝宝能双手一起去抓握东西吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '05', 'question' => '宝宝能经常吸吮自己的小手吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '06', 'question' => '宝宝能抓握带手柄的玩具吗？（例如：沙锤、摇铃、拨浪鼓）', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '07', 'question' => '宝宝有不同的需求时，能发出不同的声音吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '08', 'question' => '宝宝能一边吃奶，一边看周围，偶尔吐出乳头，看着妈妈咿呀作语吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '09', 'question' => '宝宝能对家人的说话声做出明确的反应吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '10', 'question' => '在平静的状态下，当宝宝看到熟悉的脸或者喜欢的东西时能笑一笑吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '11', 'question' => '父母从宝宝身边离开或者房间里没人，宝宝能大声叫或哭闹吸引父母过来？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '12', 'question' => '宝宝能识别主要照料者吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                );
                break;
            case 2:
                $problems = array(
                    array('index' => '01', 'question' => '宝宝平躺时，自己能慢慢移动身体吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '02', 'question' => '父母扶着宝宝腋下站立时，宝宝的双腿能交替弯曲蹬直吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '03', 'question' => '俯卧时，宝宝能拿肘部支撑并抬起头和肩吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '04', 'question' => '宝宝开始玩手，能把两手手指相碰并不时把手放入口中玩吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '05', 'question' => '宝宝能用双手一起去抓握东西吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '06', 'question' => '宝宝能经常吸吮自己的小手吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '07', 'question' => '宝宝能对家人的说话声作出明确的反应吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '08', 'question' => '宝宝能对熟悉的人发出“阿”“哦”的声音吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '09', 'question' => '在家人的引导下，宝宝能发出ba，ma，bu的声音吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '10', 'question' => '给宝宝看对称和不对称的图片时，宝宝更喜欢看对称的图片吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '11', 'question' => '宝宝能有目的的把手里的物体放进嘴里吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                    array('index' => '12', 'question' => '宝宝能有意识地抓住身边的玩具并注视它吗？', 'A' => '能', 'B' => '不能', 'C' => '不确定'),
                );
                break;
            default:
                break;
        }
        return $problems;
    }

    /**
     * “宝宝健康大测评”答案
     */
    public static function getBabyHealthTestAnswers()
    {
        $answers = array(
            array('type' => '大运动发展',
                'level_1' => '爸爸妈妈应提供安全、适宜的运动环境。希望您能帮助宝宝，更灵活地掌控自己的身体，更好地探索周围的世界。',
                'level_2' => '爸爸妈妈可以给宝宝提供更多练习运动技能的机会，让他们在运动中感知和了解周围的世界。',
                'level_3' => '不用过于担心，请继续关注宝宝这方面的发展。您可以参考我们的视频，促进宝宝大运动能力的发展。'),
            array('type' => '精细运动发展',
                'level_1' => '希望爸爸妈妈能继续帮助宝宝，锻炼手指的灵活性，做个心灵手巧的宝宝。',
                'level_2' => '爸爸妈妈可以给宝宝提供多种多样的手指玩具，让宝宝小手在玩耍中变得更加灵活！',
                'level_3' => '本月宝宝精细运动指标发展缓慢。不用过于担心，丰富的手指锻炼机会能有效促进宝宝精细动作的发展。'),
            array('type' => '语言发展',
                'level_1' => '让宝宝多听各种丰富的语言，鼓励宝宝用语言表达自己的想法，都能更好地提高宝宝的语言理解和表达能力。',
                'level_2' => '让宝宝多听各种丰富的语言，鼓励宝宝用语言表达自己的想法，都能更好地提高宝宝的语言理解和表达能力。',
                'level_3' => '不用过于担心，给宝宝提供有趣、丰富的语言环境能帮助宝宝更有效地获取语言信息。'),
            array('type' => '认知发展',
                'level_1' => '宝宝的优秀表现和爸爸妈妈平时的密切关注分不开。希望未来宝宝继续像现在一样，用好奇心拥抱周围精彩的世界。',
                'level_2' => '爸爸妈妈在日常生活中，可以有意识地让宝宝丰富自己的认知经验，这对他们未来身心的健康发展将大有益处。',
                'level_3' => '不用过于担心，耐心的引导可以帮助宝宝有效提高认知能力。'),
        );
        return $answers;
    }

    /**
     * “宝宝健康大测评”推荐专辑
     */
    public static function getBabyHealthTestRecommendAlbum($phase)
    {
        switch ($phase) {
            case 1:
                $albumList = array('albumName1' => 'album103', 'albumName2' => 'album90', 'albumName3' => 'album89');
                break;
            case 2:
                $albumList = array('albumName1' => 'video_1', 'albumName2' => 'video_2', 'albumName3' => 'video_3');
                break;
            default:
                break;
        }
        return $albumList;
    }

    /**
     * 设置活动“熊熊分类，垃圾快跑”数据
     * @param $char
     * @return array
     */
    public static function refuseData($char)
    {

        $prizeConfigItems = json_decode(ActivityManager::getActivityPrizeConfig())->list;
        $consume1 = explode(',', explode(";", $prizeConfigItems[0]->description)[1]);
        $consume2 = explode(',', explode(";", $prizeConfigItems[1]->description)[1]);
        $consume3 = explode(',', explode(";", $prizeConfigItems[2]->description)[1]);
        /**
         * 设置兑换消耗的材料数量
         */
        $consumeNum = [
            [$consume1[0], $consume1[1], $consume1[2]],
            [$consume2[0], $consume2[1], $consume2[2]],
            [$consume3[0], $consume3[1], $consume3[2]]
        ];
        // 一等奖兑换个数
        $ruleNum1 = $consumeNum[0];
        // 二等奖兑换个数
        $ruleNum2 = $consumeNum[1];
        // 三等奖兑换个数
        $ruleNum3 = $consumeNum[2];
        $exchangeConsumeNum = [
            '1' => ['bambooShoots' => $ruleNum1[0], 'bambooBranch' => $ruleNum1[1], 'bambooLeaf' => $ruleNum1[2]],
            '2' => ['bambooShoots' => $ruleNum2[0], 'bambooBranch' => $ruleNum2[1], 'bambooLeaf' => $ruleNum2[2]],
            '3' => ['bambooShoots' => $ruleNum3[0], 'bambooBranch' => $ruleNum3[1], 'bambooLeaf' => $ruleNum3[2]]
        ];

        /**
         * 兑换增加的材料数量
         */
        $add = explode(',', explode(";", $prizeConfigItems[0]->description)[0]);
        $addMaterialCount = [
            'bambooShoots' => $add[0],
            'bambooBranch' => $add[1],
            'bambooLeaf' => $add[2],
        ];

        /**
         * 拥有的垃圾分类数据
         */
        $refuseClassifiedData = [
            'totalRefuse' => ['apple', 'egg', 'fish', 'melon', 'plastic', 'bottle', 'cans', 'Waste_paper', 'battery', 'insecticide', 'lipstick', 'oil', 'ceramics', 'diapers', 'toilet_paper', 'snipe'],
            // 厨余垃圾
            'kitchenRefuse' => ['apple', 'egg', 'fish', 'melon'],
            // 可回收垃圾
            'recyclableRefuse' => ['plastic', 'bottle', 'cans', 'Waste_paper'],
            // 有毒垃圾
            'poisonousRefuse' => ['battery', 'insecticide', 'lipstick', 'oil'],
            // 其他垃圾
            'othersRefuse' => ['ceramics', 'diapers', 'toilet_paper', 'snipe']
        ];

        if ($char == 1) {
            $result = $exchangeConsumeNum;
        } else if ($char == 2) {
            $result = $addMaterialCount;
        } else {
            $result = $refuseClassifiedData;
        }
        return $result;
    }
}