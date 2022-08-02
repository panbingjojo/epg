<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 活动相关的API封装
// +----------------------------------------------------------------------
// | 功能：活动（包括联合活动）中常用的交互API封装，如：设置/获取手机号码、
// | 上报参与活动记录、参与抽奖活动、是否可玩（或是否可答题）等
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/8/22 11:34
// +----------------------------------------------------------------------


namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\AlbumAPI;


class AlbumAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    public function getAlbumIdByAliasAction()
    {
        $retStoreData = AlbumAPI::getAlbumIdByAlias($_REQUEST['aliasName']);
        $this->ajaxReturn($retStoreData);
    }

    public function getTemplateIdListAction()
    {
        $retStoreData = AlbumAPI::getTemplateIdList('', $_REQUEST['graphicCode']);
        $this->ajaxReturn($retStoreData);
    }

    /**
     * UI专辑
     * 通过专辑名称获取
     */
    public function getAlbumDataAction()
    {
        $retData = AlbumAPI::getAlbumUserLimit($_REQUEST['albumName']);
        $limitNumber = $retData['data']['subject_list'][0]['access_ctrl'];
        $this->ajaxReturn($limitNumber);
    }
}
