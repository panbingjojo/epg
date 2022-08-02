<?php
/**
 * +----------------------------------------------------------------------
 * |
 * +----------------------------------------------------------------------
 * |
 * +----------------------------------------------------------------------
 * | Author: wangjiang
 * | Date: 2021/1/18 14:44
 * +----------------------------------------------------------------------
 */

namespace Home\Model\Order;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Common\SoapManager;

class Pay430002 extends PayAbstract{
    const isNewPay = true;

    public function authentication($param = null)
    {
        // TODO: Implement authentication() method.
        $timeStampFormat = date("YmdHis");
        $epgInfo  = json_decode(MasterManager::getEPGInfoMap());
        $id = SP_NAME.time();
        $transactionID = SP_ID.$timeStampFormat.$id;
        $requestParam = array(
            "req" => array(
                "transactionID" => $transactionID,
                "SPID" => SP_ID,
                "userID" => $epgInfo->user_id,
                "userIDType" => NORMAL_USER,
                "userToken" => $epgInfo->user_token,
                "productIDList" => PRODUCT_ID_CONTINUED.",".PRODUCT_ID.",".PRODUCT_ID_1YUAN.",".PRODUCT_ID_3YUAN.",".PRODUCT_ID_5YUAN.",".PRODUCT_ID_9YUAN.",".PRODUCT_ID_90DAY.",".PRODUCT_ID_FIGT.",".PRODUCT_ID_ADVISER.",".PRODUCT_ID_GAME.",".PRODUCT_ID_SALE."," .PRODUCT_ID_HEALTH_ADVISER.",".PRODUCT_ID_ONE_3DAY.",".PRODUCT_ID_ONE_7DAY.",".PRODUCT_ID_ONE_30DAY,
                "timeStamp" => $timeStampFormat,
            ),
        );
        $userAuthFunc = "batchAuth";

        $result = SoapManager::request(AUTH_RELEASE_URL, $userAuthFunc, $requestParam);

        LogUtils::info("authentication url = ".AUTH_RELEASE_URL);
        LogUtils::info("authentication data = ".json_encode($requestParam));
        $result = SoapManager::request(AUTH_RELEASE_URL,$userAuthFunc,$requestParam);
        LogUtils::info("authentication result = ".json_encode($result));
        if(isset($result) && !empty($result)){
            $batchAuthReturn = $result->batchAuthReturn;
            if($batchAuthReturn->result === '0'){
                $authInfoList = $batchAuthReturn->authInfoList;
                $list = $authInfoList->item;
                //循环遍历
                foreach ($list as $key => $value) {
                    LogUtils::info('authentication productName = '.$value->productName.' authresult = '.$value->authresult);
                    if($value->authresult === '0'){
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    public function buildVerifyUserUrl($param = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
    }

    public function payShow()
    {
        // TODO: Implement payShow() method.
    }

    public function buildPayUrl($payInfo = null)
    {
        // TODO: Implement buildPayInfo() method.
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay430002::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $epgInfoMap = json_decode(MasterManager::getEPGInfoMap());
        $payInfo->tradeNo = $orderInfo->order_id;
        $pay = new \stdClass();
        $timeStampFormat = date("YmdHis");
        $id = SP_NAME.time();
        $pay->transactionID = SP_ID.$timeStampFormat.$id;
        $pay->SPID = SP_ID;
        $pay->userId = $epgInfoMap->user_id;
        $pay->userToken = $epgInfoMap->user_token;
        $pay->key = '';
        if($payInfo->vip_type === '2'){
            $pay->productID = PRODUCT_ID_CONTINUED;
        }else if($payInfo->vip_type === '1'){
            $pay->productID = PRODUCT_ID;
        }
        //扣费金额，单位：分
        //此值不大于产品定价费用
        $pay->price = $payInfo->price;
        if($payInfo->vip_type === '2'){
            $pay->productName = '连续包月';
        }else if($payInfo->vip_type === '1'){
            $pay->productName = '包月';
        }
        $pay->backPackage = BACKPACKAGE;
        $pay->backClass = BACKCLASS;
        $pay->notifyUrl = NOTIFYURL;

        /**
         * 标志位，可扩展：
         * “VAS” ：增值业务
         * “EPG” ：广电EPG
         */
        $pay->optFlag = 'VAS'; //

        if($payInfo->vip_id == "28" && $payInfo->price == "69600"){
            $pay->productName = '健康顾问礼包';
            $pay->productID = PRODUCT_ID_FIGT;
        }

        //新计费测试
        if(self::isNewPay){
            //获得加密密钥key
            if(strlen($epgInfoMap->user_token)<= strlen($epgInfoMap->user_id)){
                $key = Crypt3DES::getKey($epgInfoMap->user_token);
            }else{
                $key = Crypt3DES::getKey($epgInfoMap->user_id);
            }
            $userId = Crypt3DES::encode430002($epgInfoMap->user_id, $key);
            $userToken = Crypt3DES::encode430002($epgInfoMap->user_token, $key);
            $pay->userId = $userId;
            $pay->userToken = $userToken;
            $pay->key = $key;
            $pay->optFlag = 'SJJKMA';
        }
        LogUtils::info("task pay:".json_encode($pay));

        $sign = $pay->transactionID.'+'.$pay->SPID.'+'.$pay->userId.'+'.$pay->userToken.'+'.$pay->key
            .'+'.$pay->productID.'+'.$pay->orderPrice.'+'.$pay->productName.'+'.$pay->backPackage
            .'+'.$pay->backClass.'+'.$pay->notifyUrl.'+'.$pay->optFlag.'+';
        LogUtils::info("task sign:".$sign);
        $pay->sign = md5($sign); //
        $payInfo->payInfo = $pay;
        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;
        return json_encode($ret);
    }


    public function uploadPayResult($payResultInfo){
        $result = -1;
        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        if ($isUploadResult) $result = 0;
        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult(1);
        MasterManager::setVIPUser(1); // 当前用户设置VIP
        MasterManager::setUserIsVip(1);
        $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        if ($payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback 430002 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        }
        return json_encode(array("result" => $result));
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return bool
     */
    private function _uploadPayResult($payResultInfo)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $requestData = array(
            "tradeNo" => $payResultInfo->lmTradeNo,
            "accountId" => MasterManager::getAccountId(),
            "orderSuccess" => 0,
            "reason" => $payResultInfo->lmReason
        );
        $uploadPayResult = HttpManager::httpRequest("POST", ORDER_CALLBACK, $requestData);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }



    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
    }

    public function directToPay($orderInfo = null)
    {
        // TODO: Implement directToPay() method.
    }

    public function payCallback($payResultInfo = null)
    {
        // TODO: Implement payCallback() method.
    }

    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    public function payShowResult($payController = null)
    {
        // TODO: Implement payShowResult() method.
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string|array
     */
    public function buildDirectPayUrl() {
        $payInfo = [];
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay430002::buildDirectPayUrl ---> pay orderItem is empty");
            return $payInfo;
        }
        LogUtils::error("Pay430002::orderItems：".json_encode($orderItems));
        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;//连续包月

        $date = date('Y-m-d');
        if(MasterManager::getEnterPosition() == "15" /*|| ($date >= "2021-12-09" && $date <= "2021-12-31")*/){
            $orderInfo->vipId = $orderItems[2]->vip_id;//首月0元连续包月
        }
        $epgInfoMap = json_decode(MasterManager::getEPGInfoMap());

        $pay = new \stdClass();
        $timeStampFormat = date("YmdHis");
        $id = SP_NAME.time();
        $pay->transactionID = SP_ID.$timeStampFormat.$id;
        $pay->SPID = SP_ID;
        $pay->userId = $epgInfoMap->user_id;
        $pay->userToken = $epgInfoMap->user_token;
        $pay->key = '';
        $pay->productID = PRODUCT_ID_CONTINUED;
        $pay->price = "2700";
        $pay->productName = '连续包月';
        $pay->backPackage = BACKPACKAGE;
        $pay->backurl = BACKURL;
        $pay->backClass = BACKCLASS;
        $pay->notifyUrl = NOTIFYURL;

        /**
         * 标志位，可扩展：
         * “VAS” ：增值业务
         * “EPG” ：广电EPG
         */
        $pay->optFlag = 'VAS'; //

        if(self::isNewPay){
            //获得加密密钥key
            if(strlen($epgInfoMap->user_token)<= strlen($epgInfoMap->user_id)){
                $key = Crypt3DES::getKey($epgInfoMap->user_token);
            }else{
                $key = Crypt3DES::getKey($epgInfoMap->user_id);
            }
            $userId = Crypt3DES::encode430002($epgInfoMap->user_id, $key);
            $userToken = Crypt3DES::encode430002($epgInfoMap->user_token, $key);
            $pay->userId = $userId;
            $pay->userToken = $userToken;
            $pay->key = $key;
            $pay->optFlag = 'SJJKMA';
        }

        $sign = $pay->transactionID.'+'.$pay->SPID.'+'.$pay->userId.'+'.$pay->userToken.'+'.$pay->key
            .'+'.$pay->productID.'+'.$pay->price.'+'.$pay->productName.'+'.$pay->backPackage
            .'+'.$pay->backClass.'+'.$pay->notifyUrl.'+'.$pay->optFlag.'+';
        $pay->sign = md5($sign); //

        LogUtils::error("Pay430002::pay：".json_encode($pay));

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay430002::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;

            $info='<userId>'.$pay->userId.'</userId>'
                .'<userToken>'.$pay->userToken.'</userToken>'
                .'<key>'.$pay->key.'</key>'
                .'<productID>'.$pay->productID.'</productID>'
                .'<price>'.$pay->price.'</price>'
                .'<productName>'.$pay->productName.'</productName>'
                .'<backurl>'.$pay->backurl.'</backurl>'
                .'<optFlag>'.$pay->optFlag.'</optFlag>'
                .'<notifyUrl>'.$pay->notifyUrl.'</notifyUrl>'
                .'<backPackage>'.$pay->backPackage.'</backPackage>'
                .'<sign>'.$pay->sign.'</sign>'
                .'<SPID>'.$pay->SPID.'</SPID>'
                .'<transactionID>'.$pay->transactionID.'</transactionID>'
                .'<backClass>'.$pay->backClass.'</backClass>'
                .'<backPackage>'.$pay->backPackage.'</backPackage>'
                .'<notifyUrl>'.$pay->notifyUrl.'</notifyUrl>';

            $info= urlencode($info);

            $payUrl="http://222.246.132.231:8296/UserOrderHN?INFO=".$info;

            $payInfo["payUrl"] = $payUrl;
            $payInfo["tradeNo"] = $orderInfo->tradeNo;
            LogUtils::info("_buildPayUrl: ".$payUrl);
        }
        LogUtils::info("buildDirectPayUrl pay payInfo: " . json_encode($payInfo));

        return $payInfo;
    }

    /**
     * 订购关系鉴权并上报数据
     * @param $param
     * @return mixed
     */
    public function PayAuthentication($tradeNo = null)
    {
        $isVip = $this->authentication();
        LogUtils::info("task::tradeNo: " . $tradeNo."---isVip:".$isVip);
        if($isVip){
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getAccountId();
            $payResultInfo->lmTradeNo = $tradeNo;
            $payResultInfo->lmReason = 0;
            $payResultInfo->returnPageName = "";
            $payResultInfo->isPlaying = 0;
            $payResultInfo->isIFramePay =  0;
            $payResultInfo->videoInfo = "";

            $this->_uploadPayResult($payResultInfo);
        }
        return $isVip;
    }

    //获取产品信息接口
    public function getProductInfo($param = null)
    {
        LogUtils::info("getProductInfo param: " . json_encode($param));
        $PRODUCT_ID_CONTINUED =  "productIDa2000000000000000016545";
        $PRODUCT_ID =  "productIDa2000000000000000016547";

        $name_1 = "&#x5BB6;&#x5EAD;&#x5065;&#x5EB7;&#x987E;&#x95EE;&#xFF08;&#x8FDE;&#x7EED;&#x5305;&#x6708;&#xFF09;";//$this->utf8_unicode("家庭健康顾问（连续包月）");
        $name_2 = "&#x5BB6;&#x5EAD;&#x5065;&#x5EB7;&#x987E;&#x95EE;&#xFF08;&#x5305;&#x6708;30&#x5929;&#xFF09;";//$this->utf8_unicode("家庭健康顾问（包月30天）");
        $unit = "&#x5143;";//$this->utf8_unicode("元");
        $time = "&#x6708;";//$this->utf8_unicode("月");

        $res = (array(
            "result" => 0,
            "status" => "0000",
            "msg" => array(
                "newproduct" => array(
                    array(
                        "higher_interest" => "",
                        "products" => array(array(
                            "id" => 1,
                            "name" => $name_1,
                            "price" => "27.00",
                            "time" => $time,
                            "order_url" => "",
                            "unit" => $unit,
                            "product_type" => "0",
                            "originalPrice" => "",
                            "discounted_price" => "",
                            "duration" => "0",
                            "duration_illu" => "",
                            "elaborate" => "",
                            "subscript" => "",
                            "auto_buy" => "1",
                            "first_label" => "",
                            "second_label" => "",
                            "valid" => "",
                            "equity" => "",
                            "description" => "",
                            "telecomid" => $PRODUCT_ID_CONTINUED
                        )),
                        "quit_stay" => "",
                        "sales_name" => $name_1,
                        "sales_package_id" => "1",
                    ),
                    array(
                        "higher_interest" => "",
                        "products" => array(array(
                            "id" => 2,
                            "name" => $name_2,
                            "price" => "32.00",
                            "time" => $time,
                            "order_url" => "",
                            "unit" => $unit,
                            "product_type" => "0",
                            "originalPrice" => "",
                            "discounted_price" => "",
                            "duration" => "0",
                            "duration_illu" => "",
                            "elaborate" => "",
                            "subscript" => "",
                            "auto_buy" => "0",
                            "first_label" => "",
                            "second_label" => "",
                            "valid" => "",
                            "equity" => "",
                            "description" => "",
                            "telecomid" => $PRODUCT_ID
                        )),
                        "quit_stay" => "",
                        "sales_name" => $name_2,
                        "sales_package_id" => "2",
                    )))));

        LogUtils::info("task::res: " . json_encode($res));

        return $res;
    }

    public function htou($c) {
        $n = (ord($c[0]) & 0x1f) << 12;
        $n += (ord($c[1]) & 0x3f) << 6;
        $n += ord($c[2]) & 0x3f;
        return $n;
    }

    public function utf8_unicode($str) {
        $encode='';
        for($i=0;$i<strlen($str);$i++) {
            if(ord(substr($str,$i,1))> 0xa0) {
                $encode.='&#'.$this->htou(substr($str,$i,3)).';';
                $i+=2;
            } else {
                $encode.='&#'.ord($str[$i]).';';
            }
        }
        return $encode;
    }



    //new add
    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 通过缓存得到用户账号和token
        $deviceInfo = isset($_POST['deviceInfo']) && !empty($_POST['deviceInfo']) ? $_POST['deviceInfo'] : null;
        if ($deviceInfo) {
            $data = json_decode(MasterManager::getEPGInfoMap());
            $deviceInfo = json_decode($deviceInfo);
            $userInfo = array(
                'accountId' => $data->user_id,
                'userId' => MasterManager::getUserId(),
                'lmcid' => CARRIER_ID,
                'platformType' => MasterManager::getPlatformType(),
                "stbId" => $data->stb_id,
                "userToken" => $data->user_token,
                "userIP" => $deviceInfo->ip_address,
                "userMAC" => $deviceInfo->mac_address,
            );
        }else{
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $userAccount = MasterManager::getAccountId();
            $userToken = $epgInfoMap["userToken"];
            $adContentId = rawurlencode($epgInfoMap["adContentId"]);        // 广告内容编码
            $adContentName = rawurlencode($epgInfoMap["adContentName"]);    // 广告内容名称
            $recSourceId = rawurlencode($epgInfoMap["recSourceId"]);        // 推荐入口来源编码
            $stbId = rawurlencode($epgInfoMap["stbId"]);                    // 设备Id
            $userInfo = array(
                'accountId' => $userAccount,
                'userToken' => $userToken,
                'userId' => MasterManager::getUserId(),
                'lmcid' => CARRIER_ID,
                'platformType' => MasterManager::getPlatformType(),
                'adContentId' => $adContentId,
                'adContentName' => $adContentName,
                'recSourceId' => $recSourceId,
                'stbId' => $stbId,
            );
        }

        return $userInfo;
    }

    public function strToUtf8($str){
        $encode = mb_detect_encoding($str, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
        if($encode == 'UTF-8'){
            return $str;
        }else{
            return mb_convert_encoding($str, 'UTF-8', $encode);
        }
    }
}