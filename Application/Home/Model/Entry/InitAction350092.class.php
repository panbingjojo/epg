<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;

class InitAction350092 extends InitActionTelecom{

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue; // 不解析字符串
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        return $this->infoValue . "<SPID>spaj0080</SPID>"; // 不解析字符串
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        $specialCode = '59';
        if ($specialCode == substr($epgInfoMap['userAccount'], 0, 2)) {
            // 提取前三位，再补上0在最前面 （5992750399783 ---> 0599）
            $areaCode = '0'. substr($epgInfoMap['userAccount'], 0, 3);
        } else {
            $areaCode = "";
        }
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}}");
        MasterManager::setAreaCode($areaCode); //设置区域码
    }
}
