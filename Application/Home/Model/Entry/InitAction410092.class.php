<?php

namespace Home\Model\Entry;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\LogUtils;

class InitAction410092 extends InitActionTelecom
{
    public function getEPGInfoMap()
    {
        $loginToSP = isset($_GET['loginToSP']) ? $_GET['loginToSP'] : 0;
        $loginContentId = isset($_GET['loginContentId']) ? $_GET['loginContentId'] : "";
        $platForm = isset($_GET['PlatForm']) ? $_GET['PlatForm'] : 0; // 华为平台： hw， 中兴平台： zx
        MasterManager::setLoginToSP($loginToSP);
        MasterManager::setLoginContentId($loginContentId);
        MasterManager::setPlayerPlatform($platForm);
        MasterManager::setPositionTwoConfig("1"); //设置首页二号位置配置为普通推荐位
        if (isset($_GET['loginContentId']) || isset($_GET['PlatForm'])) {
            MasterManager::setAccountId($_GET['UserId']);
            MasterManager::setUserToken($_GET['UserToken']);
            MasterManager::setLoginToSP(1);
            //针对46入口直接跳活动页面
            if($_GET['lmp'] == '46'){
                MasterManager::setLoginContentId("content0000000000000000000013852");
            }else if($_GET['lmp'] == '56'){
                MasterManager::setLoginContentId("content0000000000000000000002579");
            }else if($_GET['lmp'] == '58'){
                MasterManager::setLoginContentId("content0000000000000000000002577");
            }else{
                MasterManager::setLoginContentId("content0000000000000000000008878");
            }
            return array();
        }else {
            return parent::getEPGInfoMap(); // TODO: Change the autogenerated stub
        }
    }

    /**
     * 在聚精彩外面进入，没有经过转码的，所以要先跳入聚精彩再进来
     * 请求示例：http://222.85.91.211:10101/index.php?lmuf=3&lmsid=&lmsl=hd-1&lmcid=410092&lmp=14&UserId=837115551978@HAITV&UserToken=aQYotplu&PlatForm=hw
     * @return mixed|void|null
     */
    protected function getEPGInfo()
    {
        return isset($_GET['INFO']) ? $_GET['INFO'] : null;
    }

    protected function checkParams($key, $spId)
    {
        return true; // 河南电信跳过检测参数步骤
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        return urlencode($this->infoValue . "<SPID>spaj0080</SPID>");
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        if (MasterManager::getLoginToSP() == 1) {
            $epgInfoMap['key'] = 1;
        }
        // 从第2位开始获取3个数字，再在其前面增加0，变成4位数字
        $areaCode = substr($epgInfoMap['userAccount'], 1, 3);
        $areaCode = '0' . $areaCode;
        if (!preg_match("/^[0-9]*$/", $areaCode)) {
            $areaCode = "";
        }
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}");
        MasterManager::setAreaCode($areaCode); //设置区域码

        // 华为平台： hw， 中兴平台： zx
        $platForm = isset($_GET['PlatForm']) ? $_GET['PlatForm'] : -1;
        if ($platForm == -1) {
            // 这里取值，是因为如果从聚精彩外面进来时，再向聚精彩注册用户，把平台通过areaCode值给了聚精彩
            // 当用户从聚精彩注册完成回来，再通过areaCode取出来值
            $platForm = isset($epgInfoMap['TradeId']) ? $epgInfoMap['TradeId'] : 0; // 华为平台： hw， 中兴平台： zx
        }
        if (in_array($platForm, ['zx', 'hw'])) {
            $platForm = ($platForm == 'hw' ? 'hw' : 'zte');
            MasterManager::setPlayerPlatform($platForm);
        } else {
            // 根据areaCode的值来判断使用哪个平台的播放器
            $this->setPlayerPlatForm($areaCode);
        }
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        MasterManager::setUserToken($userToken);
    }


    /**
     * @brief: 根据areaCode的值来判断使用哪个平台的播放器
     * @param $areaCode
     */
    private function setPlayerPlatForm($areaCode)
    {
        if (empty($areaCode)) {
            // 判断不到区域码，则默认为中兴平台
            MasterManager::setPlayerPlatform('zte');
        }

        // 华为平台列表
        $hw = ['0370', '0371', '0374', '0376', '0377', '0378', '0394', '0395', '0396'];
        // 中兴平台列表
        $zte = ['0372', '0373', '0375', '0379', '0390', '0391', '0392', '0393', '0398'];

        if (in_array($areaCode, $hw)) {
            MasterManager::setPlayerPlatform('hw');
        }
        if (in_array($areaCode, $zte)) {
            MasterManager::setPlayerPlatform('zte');
        }
    }

}