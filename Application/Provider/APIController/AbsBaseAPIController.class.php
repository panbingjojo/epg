<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [XXXAPIController]的抽象基类
// +----------------------------------------------------------------------
// | [说明]：对于XXXAPIController接口方法具有通用重复操作的代码进行抽象封装，进一
// | 减少冗余代码，以复用相同操作。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/30 14:32
// +----------------------------------------------------------------------

namespace Provider\APIController;


use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Provider\Model\Common\MyUtil;
use Think\Controller;

/**
 * Class AbsBaseAPIController
 * @package Provider\APIController
 */
abstract class AbsBaseAPIController extends Controller
{
    // 自定义响应码表示
    const ret_success = 0, ret_failed = -1;

    /**
     * 统一判断是否为null或者空内容
     *
     * @param $var //校验内容
     * @return bool
     */
    protected static final function c_func_is_null_empty($var)
    {
        if (is_null($var)) return true;
        if ($var === '') return true;
        return false;
    }

    /**
     * 生成并返回一个成功或失败情况下默认的实体array，用于校验参数
     *
     * @param bool $success //成功或失败标志
     * @param string $msg //消息说明
     * @return array
     */
    protected static final function c_func_new_def_model($success, $msg)
    {
        return self::c_func_new_verify_model($success ? self::ret_success : self::ret_failed, $msg);
    }

    /**
     * 生成一个统一的返回校验实体array，用于校验参数
     *
     * @param int $code //状态码
     * @param string $msg //消息说明
     * @return array
     */
    protected static final function c_func_new_verify_model($code, $msg)
    {
        return array(
            'code' => $code,
            'msg' => $msg,
        );
    }

    /**
     * 由子类方法手动调用。与{@link validate_rule}配合使用
     *
     * @param $args //json对象参数
     * @param $func_flag //待校验唯一标识
     * @param bool $need_check_3rd_app //是否需要校验第三方客户端签名之类的合法性
     * @return \stdClass
     */
    protected final function c_func_check_args($args, $func_flag, $need_check_3rd_app = true)
    {
        $retObj = new \stdClass();

        // step1, 第三方授权客户端校验
        if ($need_check_3rd_app) {
            $checkResult = self::c_func_check_3rd_app($args);
            if ($checkResult['code'] == self::ret_failed) {
                $retObj->success = 0;
                $retObj->data = $checkResult; //具体的校验结果对象
                return $retObj;
            }
        }

        // step2, 统一校验head/json参数及其格式合法性
        $checkResult = $this->c_func_check_common_args_head($args->head);
        if ($checkResult['code'] == self::ret_failed) {
            $retObj->success = 0;
            $retObj->data = $checkResult; //具体的校验结果对象
            return $retObj;
        }
        $checkResult = $this->c_func_check_common_args_json($args->json);
        if ($checkResult['code'] == self::ret_failed) {
            $retObj->success = 0;
            $retObj->data = $checkResult; //具体的校验结果对象
            return $retObj;
        }

        // step3, 方法参数校验
        $checkResult = $this->validate_rule($args, $func_flag);//子类私有实现
        if (!isset($checkResult) || !is_array($checkResult)) {
            LogUtils::warn("[c_func_check_args][$func_flag]---> func 'validate_rule' returns('$checkResult') not an array! So we regard it as legal!");
            $checkResult = self::c_func_new_verify_model(self::ret_success, "c_func_check_args success");
        }
        $retObj->success = $checkResult['code'] == self::ret_success ? 1 : 0;
        $retObj->data = $checkResult; //具体的校验结果对象

        return $retObj;
    }

    /**
     * 第三方可信设备来源校验。
     *
     * @param $args //json对象参数
     * @return array
     */
    protected final function c_func_check_3rd_app($args)
    {
        // 空判断
        if (self::c_func_is_null_empty($args->head->appkey)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [c_func_check_3rd_app failed!]: param "appkey" is empty!');
            return self::c_func_new_def_model(false, '"appkey"不能为空！');
        }

        // appkey校验
        $thirdAppClientKey = MyUtil::getThirdAppInfo()->client_key;
        if ($args->head->appkey != md5($thirdAppClientKey)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [c_func_check_3rd_app failed!]: param "appkey"[' . $args->json->appkey . '] is invalid!');
            return self::c_func_new_def_model(false, '"appkey"无效！');
        }
        return self::c_func_new_def_model(true, "c_func_check_3rd_app success!");
    }


    /**
     * 统一校验参数head的合法性。
     *
     * @param $head //json对象参数
     * @return array
     */
    protected final function c_func_check_common_args_head($head)
    {
        if (is_null($head) || !is_object($head)) {
            return self::c_func_new_def_model(false, 'head参数格式不合法！');
        }

        // 非空判断
        if (self::c_func_is_null_empty($head->lm_userId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_userId" is empty!');
            return self::c_func_new_def_model(false, '"lm_userId" 不能为空！');
        }
        if (self::c_func_is_null_empty($head->lm_sessionId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_sessionId" is empty!');
            return self::c_func_new_def_model(false, '"lm_sessionId" 不能为空！');
        }
        if (self::c_func_is_null_empty($head->lm_loginId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_loginId" is empty!');
            return self::c_func_new_def_model(false, '"lm_loginId" 不能为空！');
        }

        // 有效性判断
//        if (MasterManager::getUserId() != $head->lm_userId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_userId" is invalid!' . MasterManager::getUserId() . ',userid:' . $head->lm_userId);
//            return self::c_func_new_def_model(false, '无效的"lm_userId"！');
//        }
//        if (MasterManager::getCwsSessionId() != $head->lm_sessionId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_sessionId" is invalid!');
//            return self::c_func_new_def_model(false, '无效的"lm_sessionId"！');
//        }
//        if (MasterManager::getLoginId() != $head->lm_loginId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_loginId" is invalid!');
//            return self::c_func_new_def_model(false, '无效的"lm_loginId"！');
//        }

        return self::c_func_new_def_model(true, 'head校验成功');
    }

    /**
     * 统一校验参数json的合法性。
     *
     * @param $json //json对象参数
     * @return array
     */
    protected final function c_func_check_common_args_json($json)
    {
        if (is_null($json) || !is_object($json)) {
            return self::c_func_new_def_model(false, 'json参数格式不合法！');
        }
        return self::c_func_new_def_model(true, 'json参数格式校验成功');
    }

    /**
     * 获取请求参数。按照我们制定规则，客户端按要求传递head和json两个json字符串。
     * 其中，命名"c_"即"custom_"，表示自定义获取参数方法！
     *
     * @param string $class_name //日志跟踪-当前类名
     * @param string $func_name //日志跟踪-当前方法名
     * @return \stdClass //包含head和json两个成员json对象
     */
    protected final function c_func_get_args($class_name = "AbsBaseController", $func_name = "c_func_get_args")
    {
        $args = new \stdClass();
        $args->head = json_decode(urldecode($_REQUEST['head']));
        $args->json = json_decode(urldecode($_REQUEST['json']));

        // 日志打印
        LogUtils::info("[$class_name][$func_name]---> params[head]: " . json_encode($args->head));
        LogUtils::info("[$class_name][$func_name]---> params[json]: " . json_encode($args->json));

        return $args;
    }

    /**
     * 校验，子类根据自己的规则写不同的判断逻辑
     *
     * @param $args //json对象参数
     * @param $func_flag //待校验唯一标识
     * @return array //校验参数通过/失败的array封装。结构如下: array('code' => $code, 'msg' => $msg)
     */
    protected abstract function validate_rule($args, $func_flag);

}