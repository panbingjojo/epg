<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\VideoAPI;


class ChannelAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /** 这个是在页面上点击更多视频进入的，用于进行请求此分类的更多视频*/
    public function moreAjaxListAction()
    {

        if (isset($_REQUEST['page'])) {
            $page = $_REQUEST['page'];
        } else {
            $page = 1;
        }

        $userId = $_REQUEST['userId'];
        $modeType = $_REQUEST['modeType']; // 视频分类id
        $pageNum = isset($_REQUEST['pageNum']) ? $_REQUEST['pageNum'] : 8; // 每页数量
        $data = VideoAPI::getVideoByClassifyId($userId, $modeType, $page, $pageNum);
        $data_obj = json_decode($data, true);
        $this->ajaxReturn($data_obj);
    }
}
