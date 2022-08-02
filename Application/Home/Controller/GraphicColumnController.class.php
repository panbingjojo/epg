<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/9/26
 * Time: 17:10
 */

namespace Home\Controller;


use Home\Model\Common\ServerAPI\GraphicAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class GraphicColumnController extends BaseController
{

    const MAX_PAGE_NUM = 200;

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_QINGHAIDX:
			case CARRIER_ID_GUANGDONGGD_NEW:
            case CARRIER_ID_MANGOTV_LT:
            case CARRIER_ID_MANGOTV_YD:
            case CARRIER_ID_NINGXIADX:
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                return array(
                    "graphicColumnUI" => "GraphicColumn/V10/GraphicColumn",
                );
                break;
            default :
                break;
        }
    }

    public function graphicColumnUI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // TODO 获取图文栏目分类
        $graphicColumnList = GraphicAPI::getColumnList();

        // 检测是否传入具体的某个分类
        $modelType = isset($_GET['modelType']) && $_GET['modelType'] != "" ? $_GET['modelType'] : "";
        // 当前加载的数据的分类
        if ($_GET['modelType'] != "") {
            $graphicList = GraphicAPI::getGraphicList(1, self::MAX_PAGE_NUM, $modelType);
            $this->assign("modelType", $modelType);
        } else {
            $graphicList = GraphicAPI::getGraphicList(1, self::MAX_PAGE_NUM, $graphicColumnList->list[0]->class_id);
            $this->assign("modelType", "");
        }

        // 焦点保持相关
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $pageCurrent = isset($_GET['pageCurrent']) ? $_GET['pageCurrent'] : 1;
        $this->assign("pageCurrent", $pageCurrent);
        $navFocusIndex = isset($_GET['navFocusIndex']) ? $_GET['navFocusIndex'] : "";
        $this->assign("navFocusIndex", $navFocusIndex);
        $navPageCurrent = isset($_GET['navPageCurrent']) ? $_GET['navPageCurrent'] : 0;
        $this->assign("navPageCurrent", $navPageCurrent);

        $this->assign("columnList", $graphicColumnList);
        $this->assign("graphicList", $graphicList);
        $this->displayEx(__FUNCTION__);
    }
}