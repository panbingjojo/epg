<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [用户鉴权]相关的API封装
// +----------------------------------------------------------------------
// | [使用者]：第三方合作者
// | [目的]：避免第三方直接访问我方cws。
// | [功能]：关于[用户相关]的系列接口跳转实现。相当于中间代理，与cws直接交互，下发从cws
// | 请求到的数据给第三方。
// | [注意]：其中的参数请勿随意变更，如需请按实际情况。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/2 9:26
// +----------------------------------------------------------------------


namespace Provider\APIController;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Entry\MasterManager;

class UserAPIController extends AbsBaseAPIController
{
    /**
     * 校验，子类根据自己的规则写不同的判断逻辑
     *
     * @param $json //json对象参数
     * @param $func_flag //待校验唯一标识
     * @return array //校验参数通过/失败的array封装。结构如下: array('code' => $code, 'msg' => $msg)
     */
    protected function validate_rule($json, $func_flag)
    {
        switch ($func_flag) {
            case "authAction":
                if (self::c_func_is_null_empty($json->user_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"user_id\" is empty!");
                    return self::c_func_new_def_model(false, '"user_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($json->stb_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"stb_id\" is empty!");
                    return self::c_func_new_def_model(false, '"stb_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($json->stb_mac)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"stb_mac\" is empty!");
                    return self::c_func_new_def_model(false, '"stb_mac" 不能为空！');
                }
                break;
        }
        return self::c_func_new_def_model(true, "verify success!");
    }

    /**
     * 接口：用户鉴权
     * 说明：第三方调用者使用我方提供的接口时，必须成功我方会员。即注册、激活、登录成功等。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"user_id\":\"第三方使用者提供的表示他们应用的唯一标识，如机顶盒id、机顶盒智能卡id、业务账号id等均可\",
     *       \"stb_id\":\"第三方使用者提供的表示他们应用的唯一标识，如机顶盒id、机顶盒智能卡id、业务账号id等均可\",
     *       \"stb_mac\":\"第三方使用者提供的机顶盒mac地址\",
     *   }"
     * }
     */
    public function authAction()
    {
        $json = json_decode(urldecode($_REQUEST['json']));
        if (($ret = $this->validate_rule($json, __FUNCTION__)) && $ret['code'] == self::ret_failed) {
            $this->ajaxReturn($ret);
            return;
        }

        // 预先缓存某些输入参数，userLogin等api需要
        MasterManager::setAccountId($json->user_id);
        MasterManager::setPlatformType($json->stb_platformType == SL_TYPE_HD ? STB_TYPE_HD : STB_TYPE_SD);
        MasterManager::setSTBId($json->stb_id);
        MasterManager::setSTBMac($json->stb_mac);

        $isSuccess = false;
        $msg = '鉴权失败';
        $lmUserId = '';
        $lmSessionId = '';
        $lmLoginId = '';

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> params[json]: ' . json_encode($json));

        // 注册
        $resultRegStr = UserAPI::userReg($json->user_id, ACCOUNT_TYPE, $json->stb_mac);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [register]result: ' . $resultRegStr);

        $resultReg = json_decode($resultRegStr);
        if ($resultReg->result == 0) {
            //注册成功！然后进行登录操作
            $lmUserId = $resultReg->user_id;
            $lmSessionId = $resultReg->session_id;

            //开始登录
            $resultLoginStr = UserAPI::userLogin($lmUserId, $lmSessionId, ACCOUNT_TYPE);
            LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [login]result: ' . $resultRegStr);
            $resultLogin = json_decode($resultLoginStr);
            if (!is_null($resultLogin) && is_object($resultLogin) && $resultLogin->result == 0) {
                //登录成功
                $isSuccess = true;
                $lmLoginId = $resultLogin->login_id;
            } else {
                $msg = "用户登录失败！$resultLogin->result";
            }
        } else if ($resultReg->result == -102) {
            //已注册！然后进行激活操作
            $lmUserId = $resultReg->user_id;
            $lmSessionId = $resultReg->session_id;

            //开始登录
            $resultLoginStr = UserAPI::userLogin($lmUserId, $lmSessionId, ACCOUNT_TYPE);
            LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [login]result: ' . $resultRegStr);
            $resultLogin = json_decode($resultLoginStr);
            if (!is_null($resultLogin) && is_object($resultLogin) && $resultLogin->result == 0) {
                //登录成功
                $isSuccess = true;
                $lmLoginId = $resultLogin->login_id;
            } else {
                $msg = "用户登录失败！$resultLogin->result";
            }
        } else {
            //注册失败
            $msg = "用户注册失败！$resultReg->result";
        }

        if ($isSuccess) {
            // 缓存到本地session
            MasterManager::setAccountId($json->user_id);
            MasterManager::setSTBId($json->stb_id);
            MasterManager::setSTBMac($json->stb_mac);
            MasterManager::setPlatformType($json->stb_platformType == SL_TYPE_HD ? STB_TYPE_HD : STB_TYPE_SD);
            MasterManager::setUserId($lmUserId);
            MasterManager::setCwsSessionId($lmSessionId);
            MasterManager::setLoginId($lmLoginId);

            $ret = array(
                'code' => 0,
                'msg' => '鉴权成功',
                'lm_userId' => $lmUserId,
                'lm_sessionId' => $lmSessionId,
                'lm_loginId' => $lmLoginId,
            );
        } else {
            $ret = array(
                'code' => -1,
                'msg' => $msg,
            );
        }
        $this->ajaxReturn($ret);
    }

}