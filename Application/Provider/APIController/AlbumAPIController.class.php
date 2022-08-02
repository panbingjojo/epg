<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [图文专辑]相关的API封装
// +----------------------------------------------------------------------
// | [使用者]：第三方合作者
// | [目的]：避免第三方直接访问我方cws。
// | [功能]：关于[图文专辑]的系列接口跳转实现。相当于中间代理，与cws直接交互，下发从cws
// | 请求到的数据给第三方。
// | [注意]：其中的参数请勿随意变更，如需请按实际情况。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/30 15:30
// +----------------------------------------------------------------------


namespace Provider\APIController;


use Home\Model\Common\LogUtils;
use Provider\Model\Common\ServerAPI\MyAlbumApi;

class AlbumAPIController extends AbsBaseAPIController
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
            case "getAlbumContentListAction":
                if (self::c_func_is_null_empty($args->json->album_name)) {
                    LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '][' . $func_flag . '][verify failed!] --->: param "album_name" is empty!');
                    return self::c_func_new_def_model(false, '"album_name" 不能为空！');
                }
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
        }
    }

    /**
     * 接口：获取健康小贴士列表
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"album_name\":\"专辑唯一标识名，由朗玛39健康iptv配置并分配提供\",
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *   }"
     * }
     */
    public function getAlbumContentListAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyAlbumApi::getAlbumContentList($args->json->album_name, $args->json->page, $args->json->page_size);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

}