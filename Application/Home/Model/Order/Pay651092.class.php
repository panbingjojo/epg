<?php

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\LogUtils;

class Pay651092 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * 增加：1、鉴权加密串中加freeDay=1字段
     * 2、免费看鉴权返回参数中，ordered参数会返回-1，这种情况要放行，不要弹订购
     * @param null $param
     * @return int|mixed
     */

    public function authentication($param = null)
    {
        return 1;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
    }

    /**
     * 我方订购页构建到局方的订购地址
     * 说明：由于要使用post方式提交到局方的订购界面，使用了html的表单提交，所以这里返回了局方post需要使用的参数，
     *       而不是完整的url订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {

    }

    /**
     * @param null $payResultInfo
     * @return mixed|void
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {

    }

    /**
     * 说明：程序执行完后必须打印输出“success”（不包含引号）。如果供应商反馈给iTV增值业务平台的字符
     * 不是success这7个字符，iTV增值业务平台会不断重发通知，通知的次数不超过6次，6次通知的间隔频率是：
     * 0m（1分钟之内）,10m,1h,2h,6h,24h。
     * @throws \Think\Exception
     */
    public function asyncPayCallback()
    {
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
    }

    /**
     * 获取局方订购回调地址
     * @param $returnPageName
     * @param $reason 0--正常订购，1--人工订购
     * @param int $isPlaying 1视频播放过程中订购，0：非视频播放过程中
     * @param $orderId
     * @param bool $isAsync 是否获取异步回调地址
     * @return string
     */
    private function getOurOrderCallback($returnPageName, $reason, $isPlaying = 0, $orderId, $isAsync = false)
    {

    }

    /**
     * 通过待加密的字符串获取加密字符串ss
     * @param $queryArr  加密数组   array("providerId" => 123,"orderInfo" => 456);
     * @return string
     */
    private function getEncodeCBCStrWithArr($queryArr)
    {
        $ret = "";
        if (!is_array($queryArr)) {
            return $ret;
        }

        foreach ($queryArr as $key => $value) {
            $prefixStr = "";
            if ($value != end($queryArr)) {
                $prefixStr = $key . "=" . $value . "|";
            } else {
                $prefixStr = $key . "=" . $value;
            }
            $ret .= $prefixStr;
        }
        LogUtils::info("getEncodeCBCStrWithArr ret=" . $ret);
        $orderInfo = Crypt3DES::encodeCBC($ret, Encrypt_3DES, "01234567");
        LogUtils::info("getEncodeCBCStrWithArr=" . $orderInfo);
        return $orderInfo;
    }

}