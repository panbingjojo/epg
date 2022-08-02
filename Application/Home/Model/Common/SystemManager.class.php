<?php
/**
 * Created by longmaster.
 * Date: 2018-06-13
 * Time: 14:07
 * Brief: 此文件（或类）用于对获取、设置系统数据的操作
 */

namespace Home\Model\Common;

use Home\Model\Common\ServerAPI\SkinAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Resource\ResManager;

class SystemManager
{
    /**
     * @brief 此接口用于向cws获取配置的主题背景图片信息，然后保存在session里
     */
    public static function loadEpgThemePicture()
    {
        // 向服务器请求背景图片信息
        return SystemAPI::getEpgThemeInfo();
    }

    /**
     * @brief 此接口用于获取配置的主题背景图片信息
     *          根据$navId的值来确定返回具体哪个位置的图片
     * @param: $navId 导航栏编号(-1是欢迎页,1是首页,2,3,4,5分别是其它栏目)
     * @param null $areaCode
     * @param null $platformType
     * @param null $enterPosition
     * @return null $imgUrl 返回背景图的url，如果找不到就返回null
     */
    public static function getEpgThemePicture($navId, $areaCode = null, $platformType = null, $enterPosition = null)
    {
        $imgUrl = null;
        // 加载背景图片信息
        $themeInfo = SystemAPI::getEpgThemeInfo($areaCode, $platformType, $enterPosition);

        if (is_array($navId)) { // 如果是批量获取的情况
            $themeImageArray = array();
            foreach ($navId as $value) { // 轮询导航栏ID
                array_push($themeImageArray, $themeInfo->themeImg->$value);
            }
            return $themeImageArray;
        }

        // 启动页背景图，pos_list数组中有配置对应的图片链接，直接获取，即引导页的背景图pos_list优先级更高
        if ($navId == -1 && isset($themeInfo->posImg) && !empty($themeInfo->posImg->navId)) {
            return $themeInfo->posImg->navId;
        }

        // 导航栏作为键，获取对应的图片链接作为值返回
        return $themeInfo->themeImg->$navId;
    }

    /**
     * @Brief:此函数用于获取滚动字幕，优先判断后台是否有配置，如果有，就使用后台的数据，
     *          如果后台没有配置，就使用程序默认的数据。
     * @param null $areaCode
     * @return string : $marqueeText 滚动字幕
     */
    public static function getMarqueeText($areaCode = null)
    {
        //session获取
        $marqueeInfo = SystemAPI::getMarqueeInfo();
        if ($marqueeInfo != null && $marqueeInfo->result == 0 && $marqueeInfo->tips_txt) {
            return $marqueeInfo->tips_txt;
        }

        //本地资源
        $marqueeText = ResManager::getConstString("GLOBAL_MARQUEE_TEXT");
        if (empty($areaCode)) { // 兼容未传参，减少session操作
            $areaCode = MasterManager::getAreaCode();
        }
        if (CARRIER_ID === CARRIER_ID_CHINAUNICOM && $areaCode == '204') {
            $marqueeText = ResManager::getConstStringByAreaCode($areaCode, "GLOBAL_MARQUEE_TEXT");
        }
        return $marqueeText;
    }

    /**
     * @Brief:此函数用于设置http请求头部信息
     */
    public static function setPackageHeader($header)
    {
        MasterManager::setUserId($header->user_id);
        MasterManager::setCwsSessionId($header->session_id);
        MasterManager::setClientVersion($header->client_type);
        MasterManager::setCarrierId($header->carrier_id);
        MasterManager::setPlatformType($header->platform_type);
        MasterManager::setLoginId($header->login_id);
        MasterManager::setEnterPosition($header->entry_pos);
    }

    /**
     * 加载用户自定义皮肤，然后保存在session里
     * @param null $platformType
     * @return mixed
     */
    public static function loadUserSkin($platformType = null)
    {
        $skinList = SkinAPI::getSkinList();
        if ($skinList->result == 0) {
            // 保存请求得到的信息
            MasterManager::setUserSkinInfo($skinList);
        }
        if (empty($platformType)) {
            $platformType = MasterManager::getPlatformType();
        }
        $skin = SystemManager::parseSkinList($skinList, $platformType);
        if ($skin->cpbjt == null || empty($skin->cpbjt)) {
            $skin = SystemManager::parseSysSkinList($skinList, $platformType);
        }
        return $skin;
    }

    /**
     * 获取用户自定义皮肤
     */
    public static function getUserSkin()
    {
        $skin = new \stdClass();

        $skin->sy = ""; // 首页
        $skin->cpbjt = ""; // 产品背景图
        $skin->spj = ""; // 视频集
        // 先判断是否已经提取过放置在本地缓存，如果是则直接读取
        $skinList = MasterManager::getUserSkinInfo();
        //用户未设置自定义皮肤，则调用后台配置的首套系统皮肤作为背景图
        if ($skinList == null || empty($skinList)) {
            $skin = SystemManager::loadUserSkin();
        } else {
            $skin = self::parseSkinList($skinList);
            if ($skin->cpbjt == null || empty($skin->cpbjt)) {
                $skin = self::parseSysSkinList($skinList);
            }
        }
        return $skin;
    }

    public static function getPlaceholderConfig()
    {
        $placeholder = new \stdClass();
        $placeholder->pathUrl = ""; //所属地区占位图规划路径path
        $placeholder->imgUrl = ""; //所属地区占位图url：默认
        //$placeholder->imgUrl_1 = ""; //占位图扩展1：imgUrl_{编号}

        $cid = MasterManager::getCarrierId();
        switch ($cid) {
            case CARRIER_ID_QINGHAI_YD:
                $placeholder->pathUrl = __ROOT__ . "/Public/img/hd/Placeholder/V$cid";
                $placeholder->imgUrl = "$placeholder->pathUrl/placeholder_1.jpg";
                break;
            default:
                $placeholder->imgUrl = __ROOT__ . "/Public/img/Common/spacer.gif"; //默认
                break;
        }

        return $placeholder;
    }

    /**
     * 解析用户设置的皮肤参数
     * @param: $skinList 接口中获取的参数
     * @param null $platformType
     * @return \stdClass
     */
    public static function parseSkinList($skinList, $platformType = null)
    {
        $skin = new \stdClass();
        if (empty($platformType)) {
            $platformType = MasterManager::getPlatformType();
        }
        if ($skinList->result == 0) {
            $user_list = $skinList->user_list;
            $sys_list = $skinList->sys_list;
            for ($i = 0; $i < count($user_list); $i++) {
                if ($user_list[$i]->in_use == 1) {
                    for ($k = 0; $k < count($sys_list); $k++) {
                        if ($user_list[$i]->skin_id == $sys_list[$k]->skin_id) {
                            $bk_img_urls = json_decode($sys_list[$k]->bk_img_urls);
                            if ($platformType == 'hd') {
                                $skin->sy = $bk_img_urls->sy_gq;
                                $skin->cpbjt = $bk_img_urls->cpbjt_gq;
                                $skin->spj = $bk_img_urls->spj_gq;
                            } else {
                                $skin->sy = $bk_img_urls->sy_bq;
                                $skin->cpbjt = $bk_img_urls->cpbjt_bq;
                                $skin->spj = $bk_img_urls->spj_bq;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        return $skin;
    }

    /**
     * 解析系统皮肤参数，使用第一套启用的系统皮肤作为背景图片，原则上系统皮肤只启用一套
     * @param: $skinList 接口中获取的参数
     * @param null $platformType
     * @return \stdClass
     */
    public static function parseSysSkinList($skinList, $platformType = null)
    {
        $skin = new \stdClass();
        if (empty($platformType)) {
            $platformType = MasterManager::getPlatformType();
        }
        if ($skinList->result == 0) {
            $sys_list = $skinList->sys_list;
            $bk_img_urls = json_decode($sys_list[0]->bk_img_urls);
            if ($platformType == 'hd') {
                $skin->sy = $bk_img_urls->sy_gq;
                $skin->cpbjt = $bk_img_urls->cpbjt_gq;
                $skin->spj = $bk_img_urls->spj_gq;
            } else {
                $skin->sy = $bk_img_urls->sy_bq;
                $skin->cpbjt = $bk_img_urls->cpbjt_bq;
                $skin->spj = $bk_img_urls->spj_bq;
            }
        }
        return $skin;
    }

    /**
     * 拉取各模块的栏目配置信息
     *
     * @param $type //模块类型（整型: 0药品查询 1疾病自查 2症状自查 3健康自测 4健康知识管理）
     * @return mixed
     */
    public static function getColumnsConfigInfo($type)
    {
        $result = SystemAPI::getColumnsConfigInfo($type);
        return $result;
    }

    /**
     * 拉取详情页（左侧）导航列表
     *
     * @param $type //模块类型（整型: 0药品查询 1疾病自查 2症状自查 3健康自测 4健康知识管理）
     * @return mixed
     */
    public static function getColumnDetailNavigationInfo($type)
    {
        $result = SystemAPI::getColumnDetailNavigation($type);

        $detailNavInfoList = array();
        if (!empty($result) && is_object($result) && $result->result == 0) {
            $detailNavInfoList = $result->list;
        }
        return $detailNavInfoList;
    }

    public static function getCustomizeModuleConfig($moduleId)
    {
        $result = SystemAPI::getCustomizeModuleConfig($moduleId);

        $detailNavInfoList = array();
        if (!empty($result) && is_object($result) && $result->result == 0) {
            $detailNavInfoList = $result->data;
        }
        return $detailNavInfoList;
    }
}