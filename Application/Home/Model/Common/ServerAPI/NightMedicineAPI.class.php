<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/3/20
 * Time: 下午6:53
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class NightMedicineAPI
{
    public static function getCityOfArea($cityCode, $areaCode, $curPage)
    {
        $json = array(
            "city_code" => $cityCode,
            "area_code" => $areaCode,
            "cur_page" => $curPage,
            "length" => 1000
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_SHOP_LIST);
        $result = $httpManager->requestPost($json);
        return json_encode($result, true);
    }
}