<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/9/27
 * Time: 10:01
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\GraphicAPI;

class GraphicAPIController extends BaseController
{

    const MAX_PAGE_NUM = 200;

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     *  获取图文资源列表
     */
    public function getGraphicListAction(){
        $model_type = $_REQUEST['model_type'];
        $resultData = GraphicAPI::getGraphicList(1, self::MAX_PAGE_NUM, $model_type);
        $this->ajaxReturn(json_encode($resultData));
    }
}