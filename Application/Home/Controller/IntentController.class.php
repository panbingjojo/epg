<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/5/9
 * Time: 下午3:25
 */

namespace Home\Controller;

use Home\Model\Common\CookieManager;
use Home\Model\Common\IntentStatManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentStack;
use Home\Model\Page\PageManager;
use Think\Exception;

/**
 * Intent控制器，用来控制页面调转
 * Class IntentController
 * @package Home\Controller
 */
if(CARRIER_ID == CARRIER_ID_SHANDONGDX_HAIKAN) {
    define('DEF_HAIKAN_REPORT_ADDRESS', 'http://sddx.39health.visionall.cn:10012/');
}
class IntentController extends BaseController
{
    // 入栈参数
    public $INTENT_FLAG_DEFAULT = 0;   // 正常入栈
    public $INTENT_FLAG_CLEAR_TOP = 1;   //  清空栈，入栈元素为栈顶
    public $INTENT_FLAG_NOT_STACK = 2;   // 元素不入栈



    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     *  页面跳转
     */
    public function indexUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $src = parent::getFilter("src", "", false);
        $dst = parent::getFilter("dst", "", false);
        $backPage = parent::getFilter("backPage", "", false);
        $intentFlag = parent::getFilter("intentFlag", 0, false);

        // 记录参数日志
        LogUtils::info("IntentController ---> indexUI() 跳转参数："
            . " src=" . $src
            . " dst=" . $dst
            . " backPage=" . $backPage
            . " stackFlag=" . $intentFlag
        );

        //转换json数据为数组
        try {
            $srcData = json_decode(urldecode($src), true);
            $dstData = json_decode(urldecode($dst), true);
            $backData = json_decode(urldecode($backPage), true);

            $this->onStat($srcData, $dstData);

            $url = $this->getUrl($dstData);

            if(CARRIER_ID == CARRIER_ID_GUIZHOUGD_XMT){
                if(strpos($url,'lmzhjkpic') === false && !LOCALHOST_DEBUG){
                    $url = str_replace("index.php","lmzhjkpic/index.php",$url);
                }
            }
            // 记录参数日志
            LogUtils::info("IntentController ---> 跳转地址：" . $url);

            if (!empty($url)) {
                if ($backData != null && count($backData) > 0) {
                    $this->updateStack($backData, $dstData, $intentFlag);
                } else {
                    $this->updateStack($srcData, $dstData, $intentFlag);
                }
                CookieManager::setCookie('isVip',MasterManager::getUserIsVip());
                $this->setCurrentPage($dstData);
                $this->jumpUrl($url);
            } else {
                $this->error("需要跳转的目标页面地址为空！ dst ===> " . parent::getFilter("dst"));
            }
        } catch (Exception $e) {
            LogUtils::info("IntentController ---> indexUI() Exception：" . $e);

        }
    }

    /**
     * 返回上一级页面
     * @throws \Think\Exception
     */
    public function backUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $keyName = parent::getFilter("pageName", "", false);

        $currentPage = $this->getCurrentPage();

        if (empty($keyName) || $keyName == "undefined"
            || $keyName == "null") {
            $keyName = null;
        }

        //if(CARRIER_ID == CARRIER_ID_GUIZHOUDX && IntentStack::count() == 1 && empty($keyName)){
        //    $pageArray = IntentStack::pop($keyName);
        //    $keyName = $pageArray["name"];
        //}
        LogUtils::info("IntentController ===> backUI  pageName: " . $keyName . " intentStack-count: " . IntentStack::count());
        if ($keyName == "IPTVPortal" || IntentStack::count() <= 0) {

            // 退出应用
            $url = MasterManager::getIPTVPortalUrl();
            LogUtils::info("IntentController ===> backUI  IPTVPortalUrl: " . $url);
            CookieManager::clearCookie(null);
            // 如果$url 为空
            if ($url == null || empty($url)) {
                // 跳转到退出应用页面
                $url = U('Home/Index/exitApp');
            }
        } else {
            $pageArray = IntentStack::pop($keyName);
            $pageName = $pageArray["name"];
            LogUtils::info("IntentController ===> backUI  pageName from IntentStack：" . $pageName);
            if (empty($pageName)) {
                LogUtils::info("IntentController ===> backUI  pageName is empty!  ");
                return;
            }
            $url = $this->getUrl($pageArray);
            if ($url == null && empty($url)) {
                LogUtils::info("IntentController ===> backUI  url is empty!  ");
                return;
            }

            $this->onStat($currentPage, $pageArray);

            $this->setCurrentPage($pageArray);
        }
        if(CARRIER_ID == CARRIER_ID_GUIZHOUGD_XMT){
            if(strpos($url,'lmzhjkpic') === false && !LOCALHOST_DEBUG){
                $url = str_replace("index.php","lmzhjkpic/index.php",$url);
            }
        }
        LogUtils::info("IntentController ===> backUI  url : " . $url);

        $this->jumpUrl($url);
    }


    /**
     * 获取上一级URL
     * @throws \Think\Exception
     */
    public function getBackUrlUI()
    {
        $returnArr = array(
            "result" => 0,
            "url" => "",
        );
        $keyName = parent::getFilter("pageName", "", false);

        $currentPage = $this->getCurrentPage();

        if (empty($keyName) || $keyName == "undefined"
            || $keyName == "null") {
            $keyName = null;
        }
        LogUtils::info("IntentController ===> backUI  pageName: " . $keyName . " intentStack-count: " . IntentStack::count());
        if ($keyName == "IPTVPortal" || IntentStack::count() <= 0) {

            // 退出应用
            $url = MasterManager::getIPTVPortalUrl();
            LogUtils::info("IntentController ===> backUI  IPTVPortalUrl: " . $url);
            // 如果$url 为空
            if ($url == null || empty($url)) {
                // 跳转到退出应用页面
                $url = U('Home/Index/ExitApp');
            }
        } else {
            $pageArray = IntentStack::pop($keyName);
            $pageName = $pageArray["name"];
            if (empty($pageName)) {
                LogUtils::info("IntentController ===> backUI  pageName is empty!  ");
                $returnArr["result"] = -1;
                $this->ajaxReturn(json_encode($returnArr), "EVAL");
                return;
            }
            $url = $this->getUrl($pageArray);
            if ($url == null && empty($url)) {
                LogUtils::info("IntentController ===> backUI  url is empty!  ");
                $returnArr["result"] = -2;
                $this->ajaxReturn(json_encode($returnArr), "EVAL");
                return;
            }

            $this->onStat($currentPage, $pageArray);

            $this->setCurrentPage($pageArray);
        }
        if(CARRIER_ID == CARRIER_ID_GUIZHOUGD_XMT){
            if(strpos($url,'lmzhjkpic') === false && !LOCALHOST_DEBUG){
                $url = str_replace("index.php","lmzhjkpic/index.php",$url);
            }
        }
        LogUtils::info("IntentController ===> backUI  url : " . $url);
        $returnArr["url"] = $url;
        $this->ajaxReturn(json_encode($returnArr), "EVAL");
    }

    /**
     * 得到当前页面
     */
    public function getCurrentPage()
    {
        $currentPage = MasterManager::getCurrentPage();
        return $currentPage;
    }

    /**
     * 设置当前页面
     * @param $currentPage
     * @throws \Think\Exception
     */
    public function setCurrentPage($currentPage)
    {
        MasterManager::setCurrentPage($currentPage);
    }

    private function updateStack($backPage, $dstPage, $intentFlag)
    {

        // 如果跳转的目标页面在栈中，清除目标页面之上的所有缓存。
        if (is_array($dstPage)) {
            $dstPageName = $dstPage["name"];   //得到页面名称
            if (!empty($dstPageName)) {
                IntentStack::pop($dstPageName);
            }
        }

        if (!is_array($backPage)) {
            return;
        }

        $pageName = $backPage["name"];   //得到页面名称
        if (empty($pageName)) {
            return;
        }

        switch ((int)$intentFlag) {
            case $this->INTENT_FLAG_DEFAULT:
                IntentStack::push($pageName, $backPage);
                break;
            case $this->INTENT_FLAG_CLEAR_TOP:
                IntentStack::clear();
                IntentStack::push($pageName, $backPage);
                break;
            case $this->INTENT_FLAG_NOT_STACK:
                break;
            default:
                IntentStack::push($pageName, $backPage);
                break;
        }
    }

    /**
     * 通过页面参数获取URL地址
     * @param $pageArray 页面参数，数组形式
     * @return int
     */
    private function getUrl($pageArray)
    {
        $url = "";
        if (!is_array($pageArray)) {
            return $url;
        }

        $pageName = $pageArray["name"];   //得到页面名称
        if (empty($pageName)) {
            return $url;
        }

        $rootPage = PageManager::getBasePagePath($pageName);
        if (empty($rootPage)) {
            return $url;
        }

        $url = $rootPage;
        //解析参数
        $pageParam = $pageArray["param"];
        if (count($pageParam) > 0) {
            $url = $url . "/";
        }
        foreach ($pageParam as $key => $value) {
            if (strpos($url, '?') === false) {
                $url = $url . '?';
                $url = $url . $key . "=" . urlencode($value);
            } else {
                $url = $url . '&';
                $url = $url . $key . "=" . urlencode($value);
            }
        }
        return $url;
    }

    /**
     * 跳转到对应的URL页面
     * @param $url
     */
    private function jumpUrl($url)
    {
        if (!empty($url)) {
            header('Location:' . $url);
        }
    }

    /**
     * 数据统计
     * @param $src
     * @param $dst
     */
    private function onStat($src, $dst)
    {
        IntentStatManager::init($src, $dst);
    }
}