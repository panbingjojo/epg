<?php

namespace Home\Model\User;
use Home\Model\Common\LogUtils;
use Home\Model\Order\Pay10220094;

class InfoLoader10220094 extends UserInfoLoader{

    // 覆写鉴权方法，鉴权操作在前端执行,结果从传参中获取
    public function authVip()
    {
        return isset($_REQUEST['isVip']) ? $_REQUEST['isVip'] : 0; //在局方（吉林广电）鉴权是否为vip：1-vip 其它-非vip
    }

    public function handleAreaSpecial()
    {
        LogUtils::info("InfoLoader10220094 user_id=$this->userId isVip=".$_REQUEST['isVip']);
        // 处理续订字段
        Pay10220094::queryAndSetAutoOrderFlag($this->userId); //查询vip信息
    }
}