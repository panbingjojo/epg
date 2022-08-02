<?php
/**
 * Created by longmaster.
 * Date: 2018-09-08
 * Time: 14:08
 * Brief: 此文件（或类）用于处理商品相关操作
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class ProductsAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
        return array();
    }

    /**
     * @Brief:此函数用于获取已订购产品列表接口
     */
    public function queryOrderProductListAction() {
        // 查询地址
        $queryUrl = ORDER_SERVICE_QUERY_ORDER_PRODUCT_URL;

        // 获取用户的省份ID
        $provinceInfo = Utils::getUserProvince(MasterManager::getAreaCode());
        // 构建查询用户消费记录的参数
        $info = array(
            "serviceId" => self::getUserAccountId(),
            "userProvince" => $provinceInfo[0],
            "outSource" => '1', // 第三方调用
            "signature" => "", // sha256(<private key>+<userProvince>+< outSource >+<timestamp>)+<timestamp> timestamp是14
        );

        $timeFormat = date('YmdHis'); // timestamp是14
        // 要加密的字段
        $data = SHA256_SECRET_KEY;
        $option = array("serviceId", "userProvince", "outSource");
        foreach ($info as $key => $value) {
            if (in_array($key, $option)) {
                $data .= $value;
            }
        }
        // 再加上时间
        $data .= $timeFormat;

        // 对data进行加密，然后再追加上时间
        $sha256Signature = hash('sha256', $data, false);
        $sha256Signature .= $timeFormat;

        // 调整$info里的signature的值
        $info["signature"] = $sha256Signature;

        $result = HttpManager::httpRequest("POST", $queryUrl, json_encode($info));
        LogUtils::info("queryOrderProductListAction--> result: $result");

        // 解析数据
        // {"description":"getOrders success","extensionInfo":"",
        //  "orders":[{"appId":"","area":"","campaignType":"","cancelOrderFlag":"1","cancelTime":"","contentId":"",
        //             "cpId":"","creatTime":"20171224163415","cycleLength":1,"cycleUnit":"1","desc":"1","domain":"1",
        //             "domainType":"0","endTime":"20991231235959","extProductId":"","fee":1000,"orderMode":"1",
        //             "partyId":"","payChannel":"1","payStatus":"0","prmId":"333","productId":"39jk010cp@201",
        //             "productName":"39健康10元","purchaseType":0,"serviceType":"","spId":"96596",
        //             "startTime":"20171224163415","subTime":"20171224163415"
        //           }],
        //  "result":0,"signature":"428f6fbb49aa08e8e817ae372c04d789a22db2aaf80d7a1bbaa57ad770a7916d20180907100036"}
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * @Brief:此函数用于查询用户的消费记录
     */
    public function queryConsumeRecordAction() {

        // 查询地址
        $queryUrl = ORDER_SERVICE_QUERY_CONSUME_URL;

        // 获取用户的省份ID
        $provinceInfo = Utils::getUserProvince(MasterManager::getAreaCode());

        $month = date('Ym');
        // 构建查询用户消费记录的参数
        $info = array(
            "serviceId" => self::getUserAccountId(),
            "userProvince" => $provinceInfo[0],
            "month" => $month, // 所查用户消费记录的月份。格式为：YYYYMM
            "outSource" => '1', // 第三方调用
            "signature" => "", // sha256(<private key>+< serviceId>+<userProvince>+< month >+< outSource >+<timestamp>)+<timestamp> timestamp是14
        );

        $timeFormat = date('YmdHis'); // timestamp是14
        // 要加密的字段
        $data = SHA256_SECRET_KEY;
        $option = array("serviceId", "userProvince", "month", "outSource");
        foreach ($info as $key => $value) {
            if (in_array($key, $option)) {
                $data .= $value;
            }
        }
        // 再加上时间
        $data .= $timeFormat;

        // 对data进行加密，然后再追加上时间
        $sha256Signature = hash('sha256', $data, false);
        $sha256Signature .= $timeFormat;

        // 调整$info里的signature的值
        $info["signature"] = $sha256Signature;

        $result = HttpManager::httpRequest("POST", $queryUrl, json_encode($info));
        LogUtils::info("queryConsumeRecordAction--> result: $result");

        // 解析数据
        // {"consumptionList":
        //       [{"appId":"","areaCode":"","campaignType":"","contentId":"","cpId":"","domain":"1","domainType":"0",
        //        "endTime":"20180801014137","fee":1000,"isRent":1,"isSign":"0","orderMode":"1","prmId":"333",
        //        "productId":"39jk010cp@201","productName":"39健康10元","purchaseType":0,"spId":"",
        //        "startTime":"20180801014137","transactionId":"e2c15359-79ee-474a-b432-5c2cf13119d1"
        //       }],
        //   "description":"success","result":0,"signature":""}

        $this->ajaxReturn($result, 'EVAL');
    }


    /**
     * @Brief:此函数用于产品取消续订接口
     */
    public function cancelOrderProductAction() {
        // 地址
        $cancelUrl = ORDER_SERVICE_CANCEL_ORDER_URL;

        // 商品ID
        $productId = isset($_REQUEST['productId']) ? $_REQUEST['productId'] : "";

        $info = self::buildCancelOrderInfo($productId);

        $result = HttpManager::httpRequest("POST", $cancelUrl, json_encode($info));
        LogUtils::info("cancelOrderProductAction--> result: $result");

        // 上报退订结果给cws，把用户业务帐号增加进去一起上传
        $cancelData = json_decode($result, true);
        $cancelData['userID'] = MasterManager::getAccountId();
        PayAPI::postCancelOrderResultBy0000051($cancelData);

        // {"currentAmout":0,"description":"getOrders or cancelOrder success",
        //  "expiredTime":"20180930235959","extensionInfo":"","externalTransactionId":"",
        //  "fee":0,"limitAmout":0,"orderMode":"1","payValidLen":0,"paymentInfo":"",
        //  "paymentMode":"","productId":"sjjklx@216","productName":"39健康","productType":"",
        //  "promptSwitch":false,"qrCodeUrl":"","result":0,"serEndTime":"20180930235959","serStartTime":"20180921094544",
        //  "signature":"4534510cc3439350f24049a82a1a50dd085bac3319c95a426dcfe99bdb91ba9620180926045613","spId":""}
        $this->ajaxReturn($result, 'EVAL');
    }

    public static function buildCancelOrderInfo($productId)
    {
        // 获取用户的省份ID
        $provinceInfo = Utils::getUserProvince(MasterManager::getAreaCode());

        // 构建用户退订的参数
        $info = array(
            "serviceId" => self::getUserAccountId(),
            "userProvince" => $provinceInfo[0],
            "productId" => $productId, // 产品ID
            "action" => "2", // 操作类型 1：表示订购；2: 表示退订
            "orderMode" => "1", // 默认为1－金额订购
            "outSource" => '1', // 第三方调用
            "signature" => "", // sha256(<private key>+< serviceId>+<userProvince>+< month >+< outSource >+<timestamp>)+<timestamp> timestamp是14
        );

        $timeFormat = date('YmdHis'); // timestamp是14
        // 要加密的字段
        $data = SHA256_SECRET_KEY;
        $option = array("serviceId", "userProvince", "productId", "action", "orderMode", "outSource");
        foreach ($info as $key => $value) {
            if (in_array($key, $option)) {
                $data .= $value;
            }
        }
        // 再加上时间
        $data .= $timeFormat;

        // 对data进行加密，然后再追加上时间
        $sha256Signature = hash('sha256', $data, false);
        $sha256Signature .= $timeFormat;

        // 调整$info里的signature的值
        $info["signature"] = $sha256Signature;

        return $info;
    }

    /**
     * @Brief:此函数用于获取用户的业务帐号（是去_xxx区域码的）
     *          如：053222222_216 ----> 053222222
     * @return: $accountId  没有区域码的业务帐号
     */
    private static function getUserAccountId() {
        $accountId = MasterManager::getAccountId();
        // 判断能读到业务帐号后面的内容
        $idx = strripos($accountId, '_');
        if ($idx && ($idx > 0)) {
            $accountId = substr($accountId, 0, $idx);
        }

        return $accountId;
    }

    /**
     * 积分兑换
     */
    public function exchangePointAction() {
        $userInfo = isset($_REQUEST['userInfo']) ? $_REQUEST['userInfo'] : "";
        LogUtils::info("exchangePointAction userInfo ---> " . $userInfo);
        $userInfo = json_decode($_REQUEST['userInfo']);

        MasterManager::setAreaCode($userInfo->area_code);
        MasterManager::setAccountId($userInfo->user_account);
        MasterManager::setCarrierId(CARRIER_ID);
        MasterManager::setUserId($userInfo->user_id);
        MasterManager::setCwsSessionId($userInfo->session_id);
        MasterManager::setLoginId($userInfo->login_id);

        $orderInfo = new \stdClass();
        $orderInfo->userId = $userInfo->user_id;
        $orderInfo->orderReason = 231;
        $orderInfo->remark = "login-jifen";
        $orderInfo->lmreason = 1;
        $orderInfo->contentId = CONTENT_ID;

        $url = OrderManager::getInstance()->buildPointExchangeUrl($orderInfo);
        if ($url) {
            header("Location:" . $url);
        } else {
            echo "failed";
        }
    }

}