<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/5/11
 * Time: 上午11:00
 */

namespace Home\Model\Intent;

use Home\Model\Common\LogUtils;
use Home\Model\Page\PageManager;
use Think\Page;

class IntentManager {
    public static $INTENT_FLAG_DEFAULT = 0;     // 正常入栈
    public static $INTENT_FLAG_CLEAR_TOP = 1;   // 清空栈，入栈元素为栈顶
    public static $INTENT_FLAG_NOT_STACK = 2;   // 元素不入栈

    public static $INTENT_JUMP_URL = "/index.php/Home/Intent/index";
    public static $INTENT_BACK_URL = "/index.php/Home/Intent/back";

    /**
     * 跳转页面
     * @param $dst
     * @param null $src
     * @param int $intentFlag
     * @param null $backPage
     */
    static public function jump($dst, $src = null, $intentFlag = 0, $backPage = null) {
        $intentFlag = intentFlag == null ? self::$INTENT_FLAG_DEFAULT : $intentFlag;
        $url = self::getAbsolutePath(self::$INTENT_JUMP_URL);
        $url = $url . "/"
            . "?dst=" . json_encode($dst instanceof Intent ? $dst->toStdClass() : $dst)
            . "&src=" . json_encode($src instanceof Intent ? $src->toStdClass() : $src)
            . "&backPage=" . json_encode($backPage instanceof Intent ? $backPage->toStdClass() : $backPage)
            . "&intentFlag=" . $intentFlag;

        if (CARRIER_ID == CARRIER_ID_GUIZHOUGD_XMT) {
            if (strpos($url, 'lmzhjkpic') === false && !LOCALHOST_DEBUG) {
                $url = str_replace("index.php", "lmzhjkpic/index.php", $url);
            }
        }
        header("Location:" . $url);
    }

    /**
     * 返回上一页
     * @param string $pageName
     */
    static public function back($pageName = "") {
        $url = self::getAbsolutePath(self::$INTENT_BACK_URL);
        $url = $url . "?pageName=" . $pageName;
        if (CARRIER_ID == CARRIER_ID_GUIZHOUGD_XMT) {
            if (strpos($url, 'lmzhjkpic') === false && !LOCALHOST_DEBUG) {
                $url = str_replace("index.php", "lmzhjkpic/index.php", $url);
            }
        }
        header("Location:" . $url);
    }

    /**
     * 获取返回上一页的返回链接
     * @return string
     */
    static public function getBackPageUrl() {
        $backPage = IntentStack::getTopValue();
        $backPageUrl = '';
        $isExitBackPage = !empty($backPage);
        if ($isExitBackPage) {
            $backPageName = $backPage['name'];
            $backPageParams = $backPage['param'];
            $backPagePath = PageManager::getBasePagePath($backPageName);
            if (count($backPageParams) > 0) {
                $backPageUrl = $backPagePath . "/";
                foreach ($backPageParams as $key => $value) {
                    if (strpos($backPageUrl, '?') === false) {
                        $backPageUrl .= '?';
                    } else {
                        $backPageUrl .= '&';
                    }
                    $backPageUrl = $backPageUrl . $key . "=" . urlencode($value);
                }
            }
        }
        LogUtils::debug("IntentManager--getBackPageUrl--backPageUrl--$backPageUrl");
        return $backPageUrl;
    }

    /**
     * 创建页面跳转对象
     * @param string $pageName
     * @param null $pageParam
     * @return Intent
     */
    static public function createIntent($pageName = "", $pageParam = null) {
        $intent = new Intent($pageName, $pageParam);
        return $intent;
    }

    /**
     * 将Intent 转化为URL地址，通过&符号来连接参数。
     * @param $intent
     * @return string
     */
    static public function intentToURL($intent) {
        $url = "";
        $pageName = $intent->getPagename();   //得到页面名称
        if (empty($pageName)) {
            return $url;
        }

        $rootPage = PageManager::getBasePagePath($pageName);
        if (empty($rootPage)) {
            return $url;
        }

        $url = $rootPage;
        //解析参数
        $pageParam = $intent->getParam();
        if ($pageParam != null && count($pageParam) > 0) {
            $url = $url . "/";
        }
        foreach ($pageParam as $key => $value) {
            if (strpos($url, '?') === false) {
                $url = $url . '?';
                $url = $url . $key . "=" . $value;
            } else {
                $url = $url . '&';
                $url = $url . $key . "=" . $value;
            }
        }
        return $url;
    }

    /**
     * 将Intent 转化为URL地址，通过xml格式来连接参数。
     * @param $intent
     * @return string http://localhost/index?data=<userId>12324324</userId>
     */
    static public function intentToURLV1($intent) {
        $url = "";
        $pageName = $intent->getPagename();   //得到页面名称
        if (empty($pageName)) {
            return $url;
        }

        $rootPage = PageManager::getBasePagePath($pageName);
        if (empty($rootPage)) {
            return $url;
        }

        $url = $rootPage;
        // 在链接后面加上"?"号
        if (strpos($url, '?') === false) {
            $url = $url . '?';
        }

        // 加上承载参数data ---> http://localhost/index?data=xxxx
        $url = $url . "data=";

        //解析参数
        $param = ""; // <userId>12324324</userId>
        $pageParam = $intent->getParam();
        foreach ($pageParam as $key => $value) {
            $param = $param . "<$key>$value</$key>";
        }

        // http://localhost/index?data=<userId>12324324</userId>
        $url = $url . $param;
        return $url;
    }

    /**
     * 将Intent 转化为URL地址，通过pathInfo形式组装参数。
     * @param $intent
     * @return string http://localhost/index?data=<userId>12324324</userId>
     */
    static public function intentToURLV2($intent) {
        $url = "";
        $pageName = $intent->getPagename();   //得到页面名称
        if (empty($pageName)) {
            return $url;
        }

        $rootPage = PageManager::getBasePagePath($pageName);
        if (empty($rootPage)) {
            return $url;
        }

        $url = $rootPage;

        //解析参数
        $param = ""; // userId/12324324/userToken/12324324
        $pageParam = $intent->getParam();
        foreach ($pageParam as $key => $value) {
            if ($value != "" && $value != null) {
                $param = $param . "/$key/$value";
            }
        }

        // http://localhost/index/userId/12324324/userToken/12324324
        $url = $url . $param;
        return $url;
    }

    /**
     * 得到绝对路径
     * @param $relativePath
     * @return string
     */
    static private function getAbsolutePath($relativePath = "") {
        if (defined('APP_ROOT_PATH')) {
            $absolutePath = APP_ROOT_PATH . $relativePath;
        } elseif (defined('APK_ROOT_PATH')) {
            $absolutePath = APK_ROOT_PATH . $relativePath;
        } else {
            $absolutePath = $relativePath;
        }
        return $absolutePath;
    }
}