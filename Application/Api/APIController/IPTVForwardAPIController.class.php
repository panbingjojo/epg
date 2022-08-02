<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\IPTVForward\IPTVForwardManager;


class IPTVForwardAPIController extends BaseController
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
     * 获取二维码
     */
    public function getQRCodeAction()
    {
        $data = isset($_REQUEST['data']) ? $_REQUEST['data'] : "";
        $param = array(
            'data' => base64_encode($data),
        );
        $res = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_GET_QRCODE, json_encode($param));
        $this->ajaxReturn($res, "EVAL");
    }

    /**
     * 查询数据
     */
    public function queryDataAction()
    {
        $data = isset($_REQUEST['data']) ? $_REQUEST['data'] : "";
        $param = array(
            'data' => base64_encode($data),
        );
        $res = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_QUERY_DATA, json_encode($param));
        $this->ajaxReturn($res, "EVAL");
    }

    /** 查询二维码图片
     *      -- 新疆电信上报数据到天翼云，需要先获取手机端登录的二维码，扫描登录后才能上报数据
     */
    public function getQRCodeImageAction()
    {
        $userId = MasterManager::getUserId();
        // $domain = "http://jf.21cn.com:8080"; -- 测试服
        $domain = "https://api.cloud.189.cn";
        // $appId = "20120260994"; -- 测试服
        $appId = "21012530197";
        $timestamp = Utils::getMillisecond();
        $uuid = $userId . $timestamp;
        //$returnUrl = "http://test-healthiptv.langma.cn:8015/login_success?key=$uuid"; -- 测试服
        $returnUrl = urlencode("http://healthiptv.langma.cn:10019/login_success?key=$uuid");
        $keys = "appId=$appId&timestamp=$timestamp";
        LogUtils::info("IPTVForwardAPI--getQRCodeImg--keys--$keys");
        // $secret = "zYbsSrH2ingh8Aqd2RpYFVxc"; -- 测试服
        $secret = "jv3qOSWaCDX1FVkL9vyx469R";
        $sign = hash_hmac("sha1", $keys, $secret);
        $authUrl = "$domain/app/oauth/authorize?appId=$appId&returnURL=$returnUrl&state=20200225&sign=$sign&timestamp=$timestamp";
        LogUtils::info("IPTVForwardAPI--getQRCodeImg--loginUrl--$authUrl");
        // get请求
        $authResult = HttpManager::httpRequest("GET", $authUrl, null);
        LogUtils::info("IPTVForwardAPI--getQRCodeImg--authResult--" . $authResult);
        $authResult = json_decode($authResult);
        if ($authResult->code == "0") {
            $params = array(
                "userId" => $userId,
                "loginUrl" => urlencode($authResult->loginUrl),
                "uuid" => $uuid,
            );
            // 请求返回链接
            $result = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_GET_QR_CODE_IMG, $params);
            LogUtils::info("IPTVForwardAPI--getQRCodeImg--result--$result");
        } else {
            $result = array(
                "code" => -1,
                "message" => "Auth Fail!!" . $authResult->message,
            );
        }
        $this->ajaxReturn($result, "EVAL");
    }

    /** 查询二维码扫描状态 -- status：0 未扫描；1 已扫描 */
    public function queryScanStatusAction()
    {
        $imageId = $_REQUEST['imageId'];
        LogUtils::info("IPTVForwardAPI--queryScanStatus--imageId--$imageId");
        $params = array(
            "imageId" => $imageId
        );
        $result = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_QUERY_SCAN_STATUS, $params);
        LogUtils::info("IPTVForwardAPI--queryScanStatus--result--$result");
        $this->ajaxReturn($result, "EVAL");
    }

    /** 查询登录状态 -- 获取用户完成登录之后的code值 */
    public function queryLoginStatusAction()
    {
        $imageId = $_REQUEST['imageId'];
        LogUtils::info("IPTVForwardAPI--queryLoginStatus--imageId--$imageId");
        $params = array(
            "imageId" => $imageId
        );
        $result = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_QUERY_LOGIN_STATUS, $params);
        LogUtils::info("IPTVForwardAPI--queryLoginStatus--result--$result");
        $this->ajaxReturn($result, "EVAL");
    }

    //获取用户授权凭证，access_token为空表示未登录或未成功授权
    public function queryAccessTokenAction(){
        $http = new HttpManager(HttpManager::PACK_ID_QUERY_ACCESS_TOKEN);
        $result = json_decode($http->requestPost(array()));

        LogUtils::info("IPTVForwardAPI--queryAccessTokenAction--result--$result");

        $this->ajaxReturn($result);
    }
}
