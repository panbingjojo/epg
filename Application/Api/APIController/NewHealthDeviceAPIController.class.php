<?php


namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Entry\MasterManager;

class NewHealthDeviceAPIController extends BaseController
{
    const Header = array('Content-type: application/json;charset=utf-8');

    public function config()
    {
        return array();
    }

    public function getBaseDeviceTypeAction(){
        $healthDeviceKey = RedisManager::$REDIS_HEALTH_DEVICE_BASE . "_" . CARRIER_ID;
        $result = RedisManager::getPageConfig($healthDeviceKey);
        if (!$result) {
            $json = array();
            $httpManager = new HttpManager(HttpManager::PACK_GET_BASE_DEVICE_TYPE);
            $result = $httpManager->requestPost($json);
            RedisManager::setPageConfig($healthDeviceKey, $result);
        }

        $this->ajaxReturn($result,"EVAL");
    }

    public function getDeviceListAction(){
        $deviceType = isset($_REQUEST['deviceType']) ? $_REQUEST['deviceType'] : '0';
        $deviceModelId = isset($_REQUEST['deviceModelId']) ? $_REQUEST['deviceModelId'] : '';

        $json = array(
            "device_type"=>$deviceType,
            "device_model_id"=>$deviceModelId,
            "is_test"=>1
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_BASE_DEVICE_LIST);
        $result = $httpManager->requestPost($json);

        $this->ajaxReturn($result,"EVAL");
    }

    public function getDeviceIntroAction(){
        $configId = isset($_REQUEST['deviceId']) ? $_REQUEST['deviceId'] : '';

        $healthDeviceKey = RedisManager::$REDIS_HEALTH_DEVICE_INTRO . "_$configId". "_" . CARRIER_ID;
        $result = RedisManager::getPageConfig($healthDeviceKey);
        if (!$result) {
            $json = array(
                'config_id' => $configId
            );

            $httpManager = new HttpManager(HttpManager::PACK_GET_BASE_DEVICE_INTRO);
            $result = $httpManager->requestPost($json);
            LogUtils::info('------- getDeviceIntro-----》'.json_encode($result));
            RedisManager::setPageConfig($healthDeviceKey, $result);
        }

        $this->ajaxReturn($result,"EVAL");
    }

    public function checkDeviceWhetherLockAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $url = HEALTH_DEVICE . "/common/checkUnlock";

        $json = array(
            "carrierId"=>$carrierId,
            "userId"=>$userId
        );

        $result =  HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- checkDeviceWhetherLock-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function checkSNNumAction(){
        $userId = MasterManager::getUserId();
        $carrierId =MasterManager::getCarrierId();
        $snCode = isset($_REQUEST['snCode']) ? $_REQUEST['snCode'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            "snCode" => $snCode
        );
        $url = HEALTH_DEVICE . "/common/checkDevice";

        $result =  HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- checkSNNum-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function getDeviceQRAction(){
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : '';
        $payload= isset($_REQUEST['payload']) ? $_REQUEST['payload'] : '';
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        
        $payload = json_decode($payload,true);
        if ($payload) {
            $payload["userGroupId"] = defined("USER_GROUP_ID_FOR_APPLET") ? USER_GROUP_ID_FOR_APPLET: -1;
        }

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            "type" => $type,
            "payload"=> $payload
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_JAVA_QR);
        $result = $httpManager->requestPost($json);
        LogUtils::info('------- getDeviceQR----->'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function checkQRStatusAction(){
        $scene = isset($_REQUEST['scene']) ? $_REQUEST['scene'] : '';
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            "scene" => $scene
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_JAVA_QR_STATUS);
        $result = $httpManager->requestPost($json);
        LogUtils::info('------- checkQRStatus-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function getNeedWriteDataAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
        );
        $url = HEALTH_DEVICE . "/manualHealth/basicData";

        $result =  HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- getNeedWriteData-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function upWriteDataAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : '';
        $measureDt = isset($_REQUEST['measure_dt']) ? $_REQUEST['measure_dt'] : '';
        $paperType = isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '';
        $repastId = isset($_REQUEST['testStatus']) ? $_REQUEST['testStatus'] : '';
        $upList = isset($_REQUEST['upList']) ? $_REQUEST['upList'] : '';
        $upList = json_decode($upList);

        $url = HEALTH_DEVICE . "/manualHealth/pushData";

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            'paperType'=>$paperType,
            'memberId'=>$memberId,
            'measureDt'=>$measureDt,
            'repastId'=>$repastId,
        );

        LogUtils::info("---request---" . json_encode($_REQUEST));

        foreach ($upList as $item){
            $json[$item->name] = $item->value;
        }

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- upWriteData-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");

    }

    public function getUserReadeTestStatusAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $url = HEALTH_DEVICE . "/common/healthTips";

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- getUserReadeTestStatus-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function closeReadeTestTipAction(){
        $url = HEALTH_DEVICE. "/common/closeAbnormalTips";
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId= isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            'memberId'=>$memberId,
        );


        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- closeReadeTestTip-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function updateReadeTestStatusAction(){
        $url = HEALTH_DEVICE . "/iptv/updateReadStatus";
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId= isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $itemId= isset($_REQUEST['itemId']) ? $_REQUEST['itemId'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            'memberId'=>$memberId,
            'itemId'=>$itemId
        );


        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- updateReadeTestStatus-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function deleteTestRecordAction(){

        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId= isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $paperType =isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '';
        $dataUuid = isset($_REQUEST['dataUuid']) ? $_REQUEST['dataUuid'] : '';
        $abnormalCount = isset($_REQUEST['abnormalCount']) ? $_REQUEST['abnormalCount'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            'memberId'=>$memberId,
            "paperType"=>$paperType,
            "dataUuid"=>$dataUuid,
            "abnormalCount"=>$abnormalCount
        );

        $url = HEALTH_DEVICE. "/iptv/deleteMemberArchivingData/";
        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('-------  deleteTestRecord-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function deleteClassifyDataAction(){
        $uuid= isset($_REQUEST['uuid']) ? $_REQUEST['uuid'] : '';

        $url = HEALTH_DEVICE. "/iptv/deleteArchivingdata/".$uuid;
        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,'',true);
        $this->ajaxReturn($result,"EVAL");
    }


    public function deleteAllTestRecordAction(){
        $idList= isset($_REQUEST['idList']) ? $_REQUEST['idList'] : '';
        $url = HEALTH_DEVICE. "/iptv/deleteAllMemberArchivingData";

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,$idList,true);
        LogUtils::info('------- deleteAllTestRecord-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function getUserTestDataAction(){
        $url = HEALTH_DEVICE. "/iptv/memberArchivingData";
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId= isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $itemId= isset($_REQUEST['itemId']) ? $_REQUEST['itemId'] : '1';
        $synData= isset($_REQUEST['synData']) ? $_REQUEST['synData'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            'memberId'=>$memberId,
            "itemId"=>$itemId,
            "synData"=>$synData
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- getUserTestData-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function getNeedClassifyDataAction(){
        $url = HEALTH_DEVICE . "/iptv/archivingdataInfo";
        LogUtils::info('------- getNeedClassifyData-----》'.$url);
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- getNeedClassifyData-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function classifyDataAction(){
        $url = HEALTH_DEVICE. "/wx/dataReport";
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $uuid = isset($_REQUEST['uuid']) ? $_REQUEST['uuid'] : '';
        $paperType = isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '';
        $jsonData =  isset($_REQUEST['jsonData']) ? $_REQUEST['jsonData'] : '';

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            "dataSource"=>"IPTV",
            "handlerType"=>"DATAARCHIVING",
            'uuid'=>$uuid,
            'paperType'=>$paperType,
            'jsonData'=>json_decode($jsonData)
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- classifyData-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }



    public function bindDeviceAction(){
        $sn= isset($_REQUEST['sn']) ? $_REQUEST['sn'] : '';
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $url = HEALTH_DEVICE . "/device/subscribe";

        $json = array(
            "carrierId" => $carrierId,
            "userId" => $userId,
            "snCode"=>$sn,
            "deviceModelId"=>"",
            "manufacturerId"=>"",
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- bindDevice-----》'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function getWeightDetailAction(){
        $json= isset($_REQUEST['json']) ? $_REQUEST['json'] : '';

        $url = HEALTH_DEVICE. "/ls/weight/api/calculate";


        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,$json,true);
        $this->ajaxReturn($result,"EVAL");
    }

    public function pollingCheckNewDataAction(){
        $url = HEALTH_DEVICE. "/common/locatingRoute";
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();

        $json = array(
            "carrierId"=>$carrierId,
            "userId"=>$userId
        );

        LogUtils::info('------- pollingCheckNewData url: '.$url);
        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- pollingCheckNewData----->'.json_encode($result));

        $this->ajaxReturn($result,"EVAL");
    }

    public function synDataAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $synList = isset($_REQUEST['synList']) ? $_REQUEST['synList'] : '';
        $url = HEALTH_DEVICE. "/iptv/memberSynData";

        $json = array(
            "carrierId"=>$carrierId,
            "userId"=>$userId,
            "memberId"=>$memberId,
            "dataUuid"=>$synList
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- synDataAction----->'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

    public function checkNeedLockAction(){
        $json = array(
            "key"=>"is_show_measure_lock_page"
        );
        $httpManager = new HttpManager(HttpManager::PACK_GET_DEVICE_NEED_LOCK);
        $result = $httpManager->requestPost($json);

        $this->ajaxReturn($result,"EVAL");
    }

    public function deviceDataLastAction(){
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $deviceModelId = isset($_REQUEST['deviceModelId']) ? $_REQUEST['deviceModelId'] : '';
        //该接口非湖北地区也可调用
        $url = HEALTH_DEVICE. "/hubei/deviceDataLast";

        $json = array(
            "carrierId"=>$carrierId,
            "userId"=>$userId,
            "deviceModelId"=>$deviceModelId
        );

        $result = HttpManager::httpRequestByHeader("POST",$url,NewHealthDeviceAPIController::Header,json_encode($json),true);
        LogUtils::info('------- deviceDataLastAction----->'.json_encode($result));
        $this->ajaxReturn($result,"EVAL");
    }

}