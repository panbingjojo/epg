<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/2
 * Time: 下午5:27
 */

namespace Home\Model\Order;
/**
 * 订购抽象类，所有的平台都需要继承该类进行订购管理
 * Class OrderAbstract
 */
abstract class PayAbstract
{
    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    abstract public function authentication($param = null);

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    abstract public function buildVerifyUserUrl($param = null);

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    abstract public function buildPayUrl($payInfo = null);

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    abstract public function buildUnPayUrl($payInfo = null);

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    abstract public function directToPay($orderInfo = null);

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    abstract public function payCallback($payResultInfo = null);

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    abstract public function unPayCallback($unPayResultInfo = null);

//    /**
//     * 构建用户信息
//     * @param null
//     * @return mixed
//     */
//    abstract public function buildUserInfo();
//
//    /**
//     * 通过web浏览器进行订购
//     * @param null $userInfo
//     * @return mixed
//     */
//    abstract public function webPagePay($userInfo);
}