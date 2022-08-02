<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [订购]模块相关的API封装
// +----------------------------------------------------------------------
// | [使用者]：第三方合作者
// | [目的]：避免第三方直接访问我方cws。
// | [功能]：关于[视频问诊]的系列接口跳转实现。相当于中间代理，与cws直接交互，下发从cws
// | 请求到的数据给第三方。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/5/15 18:36
// +----------------------------------------------------------------------


namespace Provider\APIController;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Entry\MasterManager;
use Provider\Model\Common\MyUtil;
use Provider\Model\Common\ServerAPI\MyPayApi;

class PayAPIController extends AbsBaseAPIController
{

    /**
     * 校验，子类根据自己的规则写不同的判断逻辑
     *
     * @param $args //json对象参数
     * @param $func_flag //待校验唯一标识
     * @return array //校验参数通过/失败的array封装。结构如下: array('code' => $code, 'msg' => $msg)
     */
    protected function validate_rule($args, $func_flag)
    {
        switch ($func_flag) {
            case "callbackAction":
                switch (MasterManager::getCarrierId()) {
                    case CARRIER_ID_SICHUANGD: // 鉴于计费回调接口的时候用户未获取到应用ID的参数，目前需要手动调用参数
                        if (self::c_func_is_null_empty($args->json->order_id)) {
                            LogUtils::error("[$func_flag]--->[verify failed!]: param \"order_id\" is empty!");
                            return self::c_func_new_def_model(false, '"order_id" 不能为空！');
                        }
                        if (self::c_func_is_null_empty($args->json->account_id)) {
                            LogUtils::error("[$func_flag]--->[verify failed!]: param \"account_id\" is empty!");
                            return self::c_func_new_def_model(false, '"account_id" 不能为空！');
                        }
                        if (self::c_func_is_null_empty($args->json->vip_pack_id) || !property_exists(MyUtil::getThirdAppInfo()->vip_pack_id_map, $args->json->vip_pack_id)) {
                            LogUtils::error("[$func_flag]--->[verify failed!]: param \"vip_pack_id\" is empty or not contained in config.php \"vip_pack_id_map\"!");
                            return self::c_func_new_def_model(false, '"vip_pack_id" 为空或不在开放范围内！');
                        }
                        break;
                    default:
                        break;
                }
                break;
        }
    }

    //************************ 订购模块相关[START] ************************//
    //

    /**
     * 接口：查询剩余问诊次数。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{}"//不同地区的参数不一样，请根据实际情况
     * }
     */
    public function callbackAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyPayApi::doCallback($args->head, $args->json);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    //************************ 订购模块相关[END] ************************//
}