<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;

class InitAction360092 extends InitActionTelecom{

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue;
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        return $this->infoValue . "<SPID>spaj0080</SPID>";
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        $areaCode = substr($epgInfoMap['userAccount'], 0, 4);
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}}");
        //设置区域码
        MasterManager::setAreaCode($areaCode);
    }
}