<?php

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Entry\MasterManager;

class AndroidAPIController extends BaseController
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
     * 获取Android服务器配置
     */
    public function getAndroidServerConfigAction()
    {
        $resultData = ANDROID_SERVER_CONFIG;
        echo $resultData;
    }

    /**
     * 打印Android日志
     */
    public function postAndroidLogAction()
    {
        $logData = $_REQUEST['logData'];
        $info = array("result" => 0);
        // LogUtils::debug("postAndroidLogAction decodeUrl >>> " . urldecode($logData));
        // 将日志写入日志文件
        $this->_writeInquiryLog(urldecode($logData));
        $this->ajaxReturn($info);
    }

    /**
     * 记录问诊相关日志
     * @param $logData string 日志
     */
    private function _writeInquiryLog($logData)
    {
        $fullPath = INQUIRY_LOG_PATH . date('y-m-d') . '.log';
        // LogUtils::info("_writeInquiryLog file = " . $fullPath . ", content = " . $logInfo);
        // logInfo是Json数据，取message字段即可
        $logDataArray = json_decode($logData, true);
        $logMessage = $logDataArray['message'];

        if (!file_exists(INQUIRY_LOG_PATH) && !mkdir(INQUIRY_LOG_PATH, 0777, true)) {
            LogUtils::info("_writeInquiryLog dir not exist and mkdir fail!!");
            return;
        }

        if (!file_exists($fullPath)) {
            file_put_contents($fullPath, $logMessage, FILE_APPEND);//如果文件不存在，则创建一个新文件。
        } else {
            $contents = $logMessage . "\r\n";
            file_put_contents($fullPath, $contents, FILE_APPEND);
        }
    }

    /**
     * Android中访问CWS的接口，通过此函数中转
     */
    public function requestForwardAction()
    {
        $url = $_REQUEST['url'];
        $urlArr = explode('?', $url);
        $url2 = $urlArr[0];

        if ($url2 !== SERVER_URL) {
            $url = str_replace($url2, SERVER_URL, $url);
        }

        LogUtils::debug("requestForwardAction requestUrl >>> $url");
        $forwardUrl = $this->handleRequestUrlByCarrier($url);
        echo HttpManager::httpRequest("GET", $forwardUrl, null);
    }

    public function handleRequestUrlByCarrier($requestUrl)
    {
        $handledUrl = $requestUrl;
        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_XINJIANGDX:
                $handledUrl = $this->getUrlByCarrierXJ($requestUrl);
                break;
        }
        return $handledUrl;
    }

    public function getUrlByCarrierXJ($requestUrl)
    {
        LogUtils::debug("getUrlByCarrierXJ requestUrl >>> {$requestUrl}");
        $forwardUrl = $requestUrl;
        $decodeUrl = urldecode($requestUrl);
        $reportUrl = '"pack_id":"19009"';
        if (strpos($decodeUrl, $reportUrl)) {
            $decodeUrl = str_replace("??", "?", $decodeUrl);
            LogUtils::debug("getUrlByCarrierXJ decodeUrl >>> {$decodeUrl}");
            $requestServer = explode('?', $decodeUrl)[0];
            $urlQuery = parse_url($decodeUrl, PHP_URL_QUERY);
            $queryArray = $this->convertUrlQuery($urlQuery);
            //$headJson = json_decode($queryArray['head']);
            $dataJson = json_decode($queryArray['json'], true);
            $userId = $dataJson["user_id"];
            LogUtils::debug("getUrlByCarrierXJ user_id >>> {$userId}");
            $usrSrcKey = $userId . "_inquiry";
            // $inquiryEntry = MasterManager::getInquiryUserEntry();
            $inquiryEntry = RedisManager::getPageConfig($usrSrcKey);
            LogUtils::debug("getUrlByCarrierXJ get hospitalName >>> {$inquiryEntry}");
            $dataJson["user_src"] = is_string($inquiryEntry) ? $inquiryEntry : (string)$inquiryEntry;
            LogUtils::debug("getUrlByCarrierXJ dataJson >>> " . json_encode($dataJson));
            $newQuery = "head=" . urlencode($queryArray['head']) . "&json=" . urlencode(json_encode($dataJson));
            $forwardUrl = $requestServer . "?" . $newQuery;
        }
        LogUtils::debug("getUrlByCarrierXJ forwardUrl >>> {$forwardUrl}");
        return $forwardUrl;
    }

    public function convertUrlQuery($query)
    {
        $splitPos = stripos($query, '&', 1);
        $headStr = substr($query, 1, $splitPos - 1);
        $jsonStr = substr($query, $splitPos + 1);
        $params = array(
            "head" => substr($headStr, 5),
            "json" => substr($jsonStr, 5)
        );

        return $params;
    }

    /**
     * 获取Websocket发送数据的相关信息
     * -- appId,appKey
     */
    public function getWebSocketInfoAction()
    {
        $result = array(
            "result" => 0,
            "message" => "Success!!!"
        );
        $localInquiry = CookieManager::getCookie(CookieManager::$C_LOCAL_INQUIRY);
        LogUtils::info("localInquiry = " . $localInquiry);
        LogUtils::info("INQUIRY_APP_ID = " . INQUIRY_APP_ID);
        LogUtils::info("INQUIRY_APP_KEY = " . INQUIRY_APP_KEY);
        //localInquiry由入口链接传入,INQUIRY_APP_ID,INQUIRY_APP_KEY定义在AndroidServer里面
        if (isset($localInquiry) && defined("INQUIRY_APP_ID") && defined("INQUIRY_APP_KEY")) {
            $result['appId'] = INQUIRY_APP_ID;
            $result['appKey'] = INQUIRY_APP_KEY;
        } else {

        }
        echo json_encode($result);
    }
}
