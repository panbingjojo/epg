<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/6/13
 * Time: 下午3:03
 */

namespace Home\Model\Common;


class TextUtils
{
    /**
     * 判断字符串是否以某个字符串开头
     *
     * @param $str
     * @param $head
     * @return bool
     */
    public static function isBeginHead($str, $head)
    {
        if (substr($str, 0, strlen($head)) === $head) {
            return true;
        }
        return false;
    }
}