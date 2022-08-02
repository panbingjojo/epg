<?php

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\SkinAPI;

class SkinAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }


    /**
     * 获取自定义皮肤列表
     */
    public function getSkinListAction()
    {
        $resultData = SkinAPI::getSkinList();
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 兑换自定义皮肤
     */
    public function exchangeSkinAction()
    {
        $skin_id = $_REQUEST['skin_id'];
        $resultData = SkinAPI::exchangeSkin($skin_id);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 使用自定义皮肤(传-1表示停用已使用的皮肤，代表用户目前没有使用自定义皮肤，使用的是默认皮肤)
     */
    public function useSkinAction()
    {
        $skin_id = $_REQUEST['skin_id'];
        $resultData = SkinAPI::useSkin($skin_id);
        $this->ajaxReturn(json_encode($resultData));
    }

}
