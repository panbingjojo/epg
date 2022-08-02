<?php

namespace Home\Model\Entry;

use Home\Common\Tools\Crypt3DES;

class InitAction450092 extends InitActionTelecom {

    protected function getEPGInfo()
    {
        $infoValue = isset($_GET['INFO']) ? $_GET['INFO'] : null;
        if ($_GET["amp;returnurl"] || $_GET["returnurl"]) {
            $infoValue = $infoValue . "returnurl=" . $_GET["amp;returnurl"];
        }
        return $infoValue;
    }

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue;
    }

    protected function checkParams($key, $spId)
    {
        return true; // 广西电信使用新入口参数，SPID传空值，不对SPID校验
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        if (strpos($backUrl, "SPToAmsEducation")) {
            return urldecode($this->infoValue . "<SPID>spaj0080</SPID>");
        }
        return urldecode($this->infoValue);
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        $this->setPlatformTypeByGroupId($epgInfoMap["GroupId"]);

        $accountPrefix = substr($epgInfoMap['userAccount'], 0, 4);
        $areaCode = "";
        if (strtolower($accountPrefix) == "iptv") {
            $fiveBit = (int)substr($epgInfoMap['userAccount'], 4, 1);
            if ($fiveBit === 0) {
                $areaCode = substr($epgInfoMap['userAccount'], 5, 3);
            } else {
                $areaCode = substr($epgInfoMap['userAccount'], 4, 3);
            }
        }
        MasterManager::setAreaCode($areaCode);

        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        MasterManager::setUserToken($userToken);
    }

    /**
     * 設置平台類型
     * @param string $gID 分组ID
     */
    private function setPlatformTypeByGroupId($gID)
    {
        $groupIdMap = array(
            103 => array(
                "model" => "标清测试2",
                "flag" => "sd"
            ),
            105 => array(
                "model" => "标清测试3",
                "flag" => "sd"
            ),
            106 => array(
                "model" => "高清测试1",
                "flag" => "hd"
            ),
            421 => array(
                "model" => "计费测试",
                "flag" => "hd"
            ),
            201 => array(
                "model" => "广电测试高",
                "flag" => "hd"
            ),
            41 => array(
                "model" => "柳州中广核",
                "flag" => "hd"
            ),
            51 => array(
                "model" => "智慧小区",
                "flag" => "hd"
            ),
            501 => array(
                "model" => "营业厅高清",
                "flag" => "hd"
            ),
            600 => array(
                "model" => "高清验收正式域",
                "flag" => "hd"
            ),
            4003 => array(
                "model" => "营业厅4k分组",
                "flag" => "hd"
            ),
            -1 => array(
                "model" => "无分组",
                "flag" => "hd"
            ),
            -2 => array(
                "model" => "不可用分组",
                "flag" => "hd"
            ),
            -3 => array(
                "model" => "停机用户分组",
                "flag" => "hd"
            ),
            200 => array(
                "model" => "广电测试标",
                "flag" => "hd"
            ),
            305 => array(
                "model" => "象州金通大酒店(来宾)",
                "flag" => "hd"
            ),
            309 => array(
                "model" => "广西巴马寿乡大酒店(南宁)",
                "flag" => "hd"
            ),
            307 => array(
                "model" => "武宣缘江酒店(来宾)",
                "flag" => "hd"
            ),
            310 => array(
                "model" => "广西俊发酒店管理有限公司(来宾)",
                "flag" => "hd"
            ),
            100 => array(
                "model" => "标清分组",
                "flag" => "sd"
            ),
            500 => array(
                "model" => "营业厅标清",
                "flag" => "sd"
            ),
            4000 => array(
                "model" => "4K分组",
                "flag" => "hd"
            ),
            61 => array(
                "model" => "党建测试",
                "flag" => "hd"
            ),
            4001 => array(
                "model" => "无增值4K分组",
                "flag" => "hd"
            ),
            308 => array(
                "model" => "来宾市兴宾区鑫临商务酒店(来宾)",
                "flag" => "hd"
            ),
            311 => array(
                "model" => "钱江源大酒店(玉林)",
                "flag" => "hd"
            ),
            2016083002 => array(
                "model" => "探针测试标",
                "flag" => "hd"
            ),
            101 => array(
                "model" => "高清分组",
                "flag" => "hd"
            ),
            1 => array(
                "model" => "测试分组",
                "flag" => "hd"
            ),
            301 => array(
                "model" => "无增值业务高清分组",
                "flag" => "hd"
            ),
            302 => array(
                "model" => "无增值业务标清分组",
                "flag" => "sd"
            ),
            400 => array(
                "model" => "标清开机分组",
                "flag" => "sd"
            ),
            401 => array(
                "model" => "高清开机分组",
                "flag" => "hd"
            ),
            601 => array(
                "model" => "标清验收正式域",
                "flag" => "sd"
            ),
            303 => array(
                "model" => "祥城酒店（崇左)",
                "flag" => "hd"
            ),
            304 => array(
                "model" => "宜州市城市便捷酒店二桥店(河池)",
                "flag" => "hd"
            ),
            306 => array(
                "model" => "卡意酒店(柳州)",
                "flag" => "hd"
            ),
            312 => array(
                "model" => "华锦大酒店(玉林)",
                "flag" => "hd"
            ),
            102 => array(
                "model" => "高清测试2",
                "flag" => "hd"
            ),
            104 => array(
                "model" => "高清测试3",
                "flag" => "hd"
            ),
            107 => array(
                "model" => "标清测试1",
                "flag" => "sd"
            ),
            300 => array(
                "model" => "酒店个性化",
                "flag" => "hd"
            ),
            2016083001 => array(
                "model" => "探针测试高",
                "flag" => "hd"
            ),
            606 => array(
                "model" => "员工之家（高清）",
                "flag" => "hd"
            ),
            720 => array(
                "model" => "龙安宾馆",
                "flag" => "hd"
            ),
            728 => array(
                "model" => "那坡妇幼保健院",
                "flag" => "hd"
            ),
            731 => array(
                "model" => "玉林市雅腾艺术酒店",
                "flag" => "hd"
            ),
            604 => array(
                "model" => "环球大酒店",
                "flag" => "hd"
            ),
            603 => array(
                "model" => "柳州融安国大智慧酒店",
                "flag" => "hd"
            ),
            800 => array(
                "model" => "象山区悦璟酒店",
                "flag" => "hd"
            ),
            803 => array(
                "model" => "钦州市灵山县朗德悦酒店",
                "flag" => "hd"
            ),
            809 => array(
                "model" => "玉林五彩田园文化旅游投资股份有限公司",
                "flag" => "hd"
            ),
            810 => array(
                "model" => "防城港南城大酒店",
                "flag" => "hd"
            ),
            818 => array(
                "model" => "贺州富川华新大酒店",
                "flag" => "hd"
            ),
            821 => array(
                "model" => "桂林象山海源宾馆",
                "flag" => "hd"
            ),
            828 => array(
                "model" => "三江风雨桥国际大酒店",
                "flag" => "hd"
            ),
            834 => array(
                "model" => "桂林国税培训中心",
                "flag" => "sd"
            ),
            735 => array(
                "model" => "容州宾馆",
                "flag" => "hd"
            ),
            736 => array(
                "model" => "容县丽景大酒店",
                "flag" => "hd"
            ),
            783 => array(
                "model" => "田东县龙池足道",
                "flag" => "hd"
            ),
            313 => array(
                "model" => "北海银滩一号酒店",
                "flag" => "hd"
            ),
            785 => array(
                "model" => "广西乐源大容山文化旅游投资有限公司",
                "flag" => "hd"
            ),
            602 => array(
                "model" => "精准扶贫（桂林）",
                "flag" => "hd"
            ),
            778 => array(
                "model" => "贺州市吉利酒店",
                "flag" => "hd"
            ),
            766 => array(
                "model" => "贺州市赛尚艺术酒店",
                "flag" => "hd"
            ),
            805 => array(
                "model" => "浴潮足浴中心",
                "flag" => "hd"
            ),
            806 => array(
                "model" => "广西电网有限责任公司北海培训中心（高清）",
                "flag" => "hd"
            ),
            813 => array(
                "model" => "柳州皇冠如家酒店",
                "flag" => "hd"
            ),
            816 => array(
                "model" => "玉林市玉州区水泉大酒店",
                "flag" => "hd"
            ),
            817 => array(
                "model" => "柳州市泽丰娱乐有限责任公司",
                "flag" => "sd"
            ),
            820 => array(
                "model" => "河池金城江区花园宾馆",
                "flag" => "hd"
            ),
            829 => array(
                "model" => "贵港平南君苑大酒店",
                "flag" => "hd"
            ),
            830 => array(
                "model" => "贵港精途酒店",
                "flag" => "hd"
            ),
            831 => array(
                "model" => "河池惠都美食城",
                "flag" => "hd"
            ),
            608 => array(
                "model" => "员工之家（4K）",
                "flag" => "hd"
            ),
            700 => array(
                "model" => "海兴房地产",
                "flag" => "hd"
            ),
            701 => array(
                "model" => "辰茂海滩酒店",
                "flag" => "hd"
            ),
            702 => array(
                "model" => "帝莱酒店",
                "flag" => "hd"
            ),
            738 => array(
                "model" => "粤海宾馆",
                "flag" => "hd"
            ),
            741 => array(
                "model" => "陆川县锦华温泉酒店有限公司",
                "flag" => "hd"
            ),
            772 => array(
                "model" => "柳州丽晶酒店",
                "flag" => "sd"
            ),
            784 => array(
                "model" => "贺州陶然居",
                "flag" => "hd"
            ),
            777 => array(
                "model" => "贺州市兴业宾馆",
                "flag" => "hd"
            ),
            755 => array(
                "model" => "贺州市悉尼风尚酒店",
                "flag" => "hd"
            ),
            257 => array(
                "model" => "和天下酒店",
                "flag" => "hd"
            ),
            801 => array(
                "model" => "盤王谷便捷酒店",
                "flag" => "hd"
            ),
            807 => array(
                "model" => "广西电网有限责任公司北海培训中心（标清）",
                "flag" => "sd"
            ),
            824 => array(
                "model" => "桂林智慧客房体验室",
                "flag" => "hd"
            ),
            832 => array(
                "model" => "崇左圣展酒店",
                "flag" => "hd"
            ),
            833 => array(
                "model" => "桂林象山九龙宾馆",
                "flag" => "hd"
            ),
            835 => array(
                "model" => "环江亿东精选酒店",
                "flag" => "hd"
            ),
            706 => array(
                "model" => "中航宾馆",
                "flag" => "hd"
            ),
            707 => array(
                "model" => "城市达人酒店",
                "flag" => "hd"
            ),
            708 => array(
                "model" => "上宾公寓",
                "flag" => "hd"
            ),
            709 => array(
                "model" => "派美艺术酒店",
                "flag" => "hd"
            ),
            710 => array(
                "model" => "青龙山宾馆",
                "flag" => "hd"
            ),
            711 => array(
                "model" => "金秀县华东大酒店",
                "flag" => "hd"
            ),
            719 => array(
                "model" => "国正酒店",
                "flag" => "hd"
            ),
            722 => array(
                "model" => "岑溪市海陆空大酒店",
                "flag" => "hd"
            ),
            723 => array(
                "model" => "宝盈海悦酒店",
                "flag" => "hd"
            ),
            724 => array(
                "model" => "浙商时尚酒店",
                "flag" => "hd"
            ),
            729 => array(
                "model" => "兴业县景豪商务酒店",
                "flag" => "hd"
            ),
            730 => array(
                "model" => "玉林市城市名人酒店",
                "flag" => "hd"
            ),
            732 => array(
                "model" => "广西玉林市金海湾国际大酒店有限公司",
                "flag" => "hd"
            ),
            733 => array(
                "model" => "广西玉林市维也纳假日酒店有限公司",
                "flag" => "hd"
            ),
            734 => array(
                "model" => "玉林宾馆",
                "flag" => "hd"
            ),
            737 => array(
                "model" => "北流市锦华宾馆",
                "flag" => "hd"
            ),
            739 => array(
                "model" => "新华世纪大酒店",
                "flag" => "hd"
            ),
            740 => array(
                "model" => "德鑫大酒店",
                "flag" => "hd"
            ),
            742 => array(
                "model" => "桂林驿特色酒店",
                "flag" => "hd"
            ),
            743 => array(
                "model" => "桂林市中医医院",
                "flag" => "hd"
            ),
            768 => array(
                "model" => "森林酒店",
                "flag" => "hd"
            ),
            769 => array(
                "model" => "那坡中医医院",
                "flag" => "hd"
            ),
            771 => array(
                "model" => "玉林玉州夏威夷酒店",
                "flag" => "hd"
            ),
            780 => array(
                "model" => "铂乐思酒店",
                "flag" => "hd"
            ),
            782 => array(
                "model" => "精途酒店",
                "flag" => "hd"
            ),
            808 => array(
                "model" => "桂林医学院附属医院",
                "flag" => "hd"
            ),
            822 => array(
                "model" => "临桂区太阳大酒店有限公司",
                "flag" => "hd"
            ),
            837 => array(
                "model" => "金色维也纳酒店",
                "flag" => "hd"
            ),
            703 => array(
                "model" => "春晖酒店",
                "flag" => "hd"
            ),
            704 => array(
                "model" => "天泽驿酒店",
                "flag" => "hd"
            ),
            705 => array(
                "model" => "金龙酒店",
                "flag" => "hd"
            ),
            712 => array(
                "model" => "武宣县威尼斯大酒店",
                "flag" => "hd"
            ),
            713 => array(
                "model" => "武宣县英皇商务酒店",
                "flag" => "hd"
            ),
            714 => array(
                "model" => "武宣县金隆商务酒店",
                "flag" => "hd"
            ),
            715 => array(
                "model" => "武宣县万通商务酒店",
                "flag" => "hd"
            ),
            716 => array(
                "model" => "三月花大酒店",
                "flag" => "hd"
            ),
            717 => array(
                "model" => "星岛商务酒店",
                "flag" => "hd"
            ),
            718 => array(
                "model" => "白天鹅宾馆",
                "flag" => "hd"
            ),
            721 => array(
                "model" => "麦肯基商务酒店",
                "flag" => "hd"
            ),
            725 => array(
                "model" => "和天下酒店",
                "flag" => "hd"
            ),
            726 => array(
                "model" => "平果妇幼保健院",
                "flag" => "hd"
            ),
            727 => array(
                "model" => "平果广兴大酒店",
                "flag" => "hd"
            ),
            744 => array(
                "model" => "贺州市正菱大酒店",
                "flag" => "hd"
            ),
            767 => array(
                "model" => "岑溪市阿里香大酒店",
                "flag" => "hd"
            ),
            770 => array(
                "model" => "阳关宾馆",
                "flag" => "hd"
            ),
            781 => array(
                "model" => "格林豪泰酒店",
                "flag" => "hd"
            ),
            779 => array(
                "model" => "贺州市米兰酒店",
                "flag" => "hd"
            ),
            605 => array(
                "model" => "玉林电信智慧城市体验厅",
                "flag" => "hd"
            ),
            802 => array(
                "model" => "柳州柳江恒泰大酒店",
                "flag" => "hd"
            ),
            804 => array(
                "model" => "北海蓝唐度假公寓有限公司",
                "flag" => "hd"
            ),
            811 => array(
                "model" => "玉林五彩田园文化旅游投资股份有限公司",
                "flag" => "hd"
            ),
            812 => array(
                "model" => "柳州阳桦宾馆",
                "flag" => "hd"
            ),
            814 => array(
                "model" => "柳州丽都商务宾馆",
                "flag" => "hd"
            ),
            815 => array(
                "model" => "柳州美嘉酒店",
                "flag" => "hd"
            ),
            819 => array(
                "model" => "河池天峨县五吉大酒店",
                "flag" => "hd"
            ),
            823 => array(
                "model" => "百色城市便捷酒店锦华新天地店",
                "flag" => "hd"
            ),
            825 => array(
                "model" => "广西北海四季典爱酒店投资有限公司",
                "flag" => "hd"
            ),
            826 => array(
                "model" => "贺州市八步博盛花园酒店",
                "flag" => "hd"
            ),
            827 => array(
                "model" => "贺州市八步顺义旅馆",
                "flag" => "sd"
            ),
        );
        $flag = "hd";
        if (array_key_exists($gID, $groupIdMap)) {
            $flag = $groupIdMap[$gID]["flag"];
        }
        MasterManager::setPlatformType($flag);
    }
}