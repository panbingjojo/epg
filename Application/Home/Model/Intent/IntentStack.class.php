<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/5/9
 * Time: 上午10:36
 */

namespace Home\Model\Intent;

use Home\Model\Entry\MasterManager;

class IntentStack {
    /**
     * 路由页面入栈，如果入栈元素已经在栈中存在，将该元素后面所有元素出栈。
     * @param string $key 页面的名称，页面名称是统一的
     * @param object $value 参数值
     * @throws \Think\Exception
     */
    public static function push($key, $value) {
        $stack = self::getStack();
        if (array_key_exists($key, $stack)) {
            self::_popKey($key, $stack);
            $stack = self::getStack();
        }
        $stack[$key] = $value;
        self::setStack($stack);
    }

    /**
     * 元素出栈
     * @param $key
     * @return mixed|null
     * @throws \Think\Exception
     */
    public static function pop($key) {
        $stack = self::getStack();
        $value = null;
        if ($key == null) {
            $value = array_pop($stack);
            self::setStack($stack);
        } else {
            $value = self::_popKey($key, $stack);  //弹出栈后已经重新保存栈
        }
        return $value;
    }

    /**
     * 获取栈顶元素 -- 数组的第一个元素
     * @return mixed|null 栈顶元素
     */
    public static function getTopValue() {
        $topValue = null;
        $stack = self::getStack();
        if (count($stack) > 0) {
            $pageNames = array_keys($stack);
            $pageNamesLength = count($pageNames);
            $lastPageName = $pageNames[$pageNamesLength - 1];
            $topValue = $stack[$lastPageName];
        }
        return $topValue;
    }

    /**
     * 清空栈
     */
    public static function clear() {
        self::setStack(null);
    }

    /**
     * 返回堆栈的总数
     * @return int
     */
    public static function count() {
        $stack = self::getStack();
        return $stack != null && is_array($stack) ? count($stack) : 0;
    }


    /**
     * 将$key后的所有元素出栈
     * @param $key
     * @param $stack
     * @return mixed|null
     * @throws \Think\Exception
     */
    private static function _popKey($key, $stack) {
        $value = null;
        if ($stack == null || !array_key_exists($key, $stack))
            return $value;
        while (count($stack) > 0) {
            $arrayKeys = array_keys($stack);
            $key1 = array_pop($arrayKeys);
            if ($key1 == $key) {
                $value = array_pop($stack);
                break;
            }
            array_pop($stack);
        }
        self::setStack($stack);
        return $value;
    }

    /**
     * 获取session中保存的栈
     * @return array|mixed
     */
    private static function getStack() {
        $stack = MasterManager::getRouterStack();
        $stack = $stack != null ? $stack : [];
        return $stack;
    }

    /**
     * 将栈保存到session中
     * @param $stack
     * @throws \Think\Exception
     */
    private static function setStack($stack) {
        if (empty($stack)) {
            $stack = null;
        }
        MasterManager::setRouterStack($stack);
    }
}