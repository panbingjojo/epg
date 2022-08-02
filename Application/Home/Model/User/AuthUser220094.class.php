<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser220094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        $result = $this->getCommonAJAXResult();

        if(CARRIER_ID == CARRIER_ID_JILINGD || CARRIER_ID == CARRIER_ID_JILINGD_MOFANG){ // 吉林广电联通 -- 查询更新续订字段
            $this->orderManager->queryAndSetAutoOrderFlag($result['userId']); //查询vip信息
        }

        return $result;
    }

    /**
     * 辽宁电信应用业务参数保存
     */
    private function _setEPGParams()
    {
        $initParams = array(
            "stbModel" => "",
            "stbMac" => "",
            "stbId" => "",
            "userAccount" => "",
            "userToken" => "",
            "epgDomain" => "",
            "UpgradeDomain" => "",
            "Channel" => "",
            "BTVEPGUrl" => "",
            "VODEPGUrl" => "",
            "SelfServiceEPGURL" => "",
            "UserSpaceURL" => "",
            "InfoEPGUrl" => "",
        );
        $epgInfoMap = URLUtils::parseURLInfo($initParams, URLUtils::COMMON_REQUEST_TYPE);
        $epgInfoMap['userIP'] = get_client_ip(); // 由于客户端没有传ip过来，所以只能读取

        // 地区编码。根据业务账号得到地市编码（规律：0431-0439 或 860431-860439，其它默认不计入）
        // 吉林广电共9个地市，区号分别为 “0431~0439”（或“86”开头表示同一地区，例如：860431-860439）(电信是以iptv开头)。
        // 统计地区列表：
        //      长春区号(0431) 吉林区号(0432) 延边区号(0433) 四平区号(0434) 通化区号(0435)
        //      白城区号(0436) 辽源区号(0437) 松原区号(0438) 白山区号(0439)
        // -----> 最后修改 Songhui 2019-6-11
        $areaCode = "";
        $pattern = CARRIER_ID == CARRIER_ID_JILINGD || CARRIER_ID == CARRIER_ID_JILINGD_MOFANG ? "/^(86)*043[1-9]/" : "/^(iptv)*043[1-9]/";
        if (preg_match($pattern, $epgInfoMap['userAccount'], $matches)) {
            if(CARRIER_ID == CARRIER_ID_JILINGDDX){
                $areaCode = strlen($matches[0]) > 4 ? substr($matches[0], 4) : $matches[0];//“86043X”与“043X”表示同一区号，用一份即可
            }else{
                $areaCode = strlen($matches[0]) > 4 ? substr($matches[0], 2) : $matches[0];//“86043X”与“043X”表示同一区号，用一份即可
            }
            LogUtils::info("_setEPGParams--->Already found area_code[$areaCode] and matches: " . json_encode($matches));
        }

        MasterManager::setUserToken($epgInfoMap['userToken']);

        MasterManager::setAreaCode($areaCode);
        MasterManager::setEPGInfoMap($epgInfoMap);

        MasterManager::setAccountId($epgInfoMap['userAccount']);
        MasterManager::setIPTVPortalUrl($epgInfoMap['epgDomain']);

        LogUtils::info("_setEPGParams: " . implode(',', $epgInfoMap));
    }

    /** 鉴权当前用户身份 -- 区分吉林广电联通（前端鉴权）；吉林广电电信（调用后端接口鉴权） */
    public function checkVIPState()
    {
        return 1;
        if (CARRIER_ID == CARRIER_ID_JILINGD || CARRIER_ID == CARRIER_ID_JILINGD_MOFANG) {
            $vipState = $_REQUEST['vipState'];
        } else {
            $vipState = parent::checkVIPState();
        }
        return $vipState;
    }

}