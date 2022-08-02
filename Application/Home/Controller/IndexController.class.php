<?php
/**
 * 应用程序入口
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\TextUtils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\Application;
use Home\Model\Entry\ApplicationFactory;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Intent\IntentStack;
use Think\Exception;


/**
 * 应用入口控制器
 * Class IndexController
 * @package Home\Controller
 */
class IndexController extends BaseController {
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * @brief: 在进入应用之前，先对其进行校验
     * @throws Exception
     */
    public function _before_indexUI() {
        MasterManager::setEnterAppTime(time());
        LogUtils::info("IndexController begin _before_indexUI entry! GO,GO,GO,GO......" . time());
        //获取地区id
        $lmCarrierID = parent::getFilter("lmcid");

        //重定向页面时不会传入lmcid，需要去缓存中获取
        if ($lmCarrierID == null || empty($lmCarrierID)) {
            $lmCarrierID = MasterManager::getCookieCarrierId() ? MasterManager::getCookieCarrierId() : MasterManager::getCarrierId();
        } else {
            MasterManager::setCarrierId($lmCarrierID);
        }

        // 重置应用状态
        $this->resetState();
    }

    /**
     * 重置应用状态，当前函数重置应用内保存的状态值
     */
    private function resetState() {
        // 清空背景图片
        MasterManager::setEpgThemeInfo(null);
        // 清空用户自定义皮肤
        MasterManager::setUserSkinInfo(null);
        // 清空用户上报局方操作轨迹
        MasterManager::setReportOperateTrace(null);
        // 清空促订显示次数
        MasterManager::clearInspireOrderTimes();
        // 清空订购相关参数
        MasterManager::clearOrderParams();
        // 写入进入应用的当前时间
        MasterManager::setEnterAppTime(time());
        // 清空上报状态
        MasterManager::setIsReportUserInfo(0);
        // 清除cookie里订购结果的记录
        MasterManager::setOrderResult(0);
        // 清除cookie里是否允许订购的记录
        MasterManager::setIsForbiddenOrder(0);
        //设置积分初始状态值
        MasterManager::setJifenStatus(1);
        // 设置免费体验状态
        MasterManager::setFreeExperience(0);
        //清空应用栈
        IntentStack::clear();
        //清空时长缓存
        MasterManager::setWaitTime(0);
    }

    /**
     * 应用程序启动入口
     */
    public function indexUI() {
        //判断用户进入的地区ID是否正确,如果不正确，不让用户进入
        if (MasterManager::getCarrierId() != CARRIER_ID) {
            LogUtils::info("IndexController CarrierId : " . MasterManager::getCarrierId());

            $intent = IntentManager::createIntent("error");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            header("Location:" . $intentUrl);
            exit();
        }

        // 记录从局方访问进来
        MasterManager::setAccessModule("EPG - home");
        // 获取各个地区的应用实例
        $instance = ApplicationFactory::getApplicationInstance();
        // 执行初始化操作
        $instance && $instance instanceof Application && $instance->init();
        return;
    }

    /**
     * 退出应用程序
     */
    public function exitAppUI() {
        $this->assign("carrierId", CARRIER_ID);
        $this->assign('isRunOnAndroid', IS_RUN_ON_ANDROID); // apk版本合并回epg版本时，配置是否运行在android
        $this->assign("url", parent::getFilter("url"));
        $this->displayEx(__FUNCTION__);
    }
}