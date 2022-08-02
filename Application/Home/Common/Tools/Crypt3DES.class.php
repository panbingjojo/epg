<?php

/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/1
 * Time: 17:20
 */

namespace Home\Common\Tools;

class Crypt3DES
{
    /**
     * 3DES 解密
     * @param $message
     * @param $key
     * @return string
     */
    static public function decode($message, $key)
    {
        // 如果key为空，则直接返回
        if ($key == null || $key == '') {
            return $message;
        }

        $key_array = explode(':', $key);
        $key1 = $key_array[0];
        $key2 = $key_array[1];
        $asc_arr = array();
        //判断字符位置的奇偶对acsll码加减$key2
        for ($i = 0; $i < strlen($message); $i++) {
            //echo $message[$i];
            if (($i + 1) % 2 == 1) {
                $asc_arr[$i] = chr(ord($message[$i]) + $key2);
            } else {
                $asc_arr[$i] = chr(ord($message[$i]) - $key2);
            }
        }
        $message_tem = "";
        foreach ($asc_arr as $k => $v) {
            $message_tem .= $v;
        }
        //根据key1拆分字符串
        $m2_len = strlen($message_tem) - $key1;
        $m2 = mb_substr($message_tem, 0, $m2_len);
        $m1 = mb_substr($message_tem, $m2_len, $key1);
        //首尾互换
        $s = 0;
        $e = strlen($m2) - 1;
        $us = array();
        for ($i = 0; $i < $m2_len; $i++) {
            $us[$i] = mb_substr($m2, $i, 1);
        }
        while ($s < $e) {
            $temp = $us[$e];
            $us[$e] = $us[$s];
            $us[$s] = $temp;
            $s++;
            $e--;
        }
        $m2 = '';
        for ($a = 0; $a < count($us); $a++) {
            $m2 .= $us[$a];
        }
        $deMessage = $m1 . $m2;
        return $deMessage;
    }

    /**
     * 江苏3DES加密
     * @param $input
     * @param $key
     * @return string
     */
    public static function encode($input, $key)
    {
        $size = mcrypt_get_block_size(MCRYPT_3DES, MCRYPT_MODE_ECB);
        $input = Crypt3DES::pkcs5pad($input, $size);
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_ECB, '');
        $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td, $key, $iv);
        $data = mcrypt_generic($td, $input);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        $data = base64_encode($data);
        return $data;
    }

    /**
     * DESede/CBC/PKCS5Padding; IV向量为01234567
     * @param $input
     * @param $key
     * @param $iv
     * @return string
     */
    public static function encodeCBC($input, $key, $iv)
    {
        $size = mcrypt_get_block_size(MCRYPT_3DES, MCRYPT_MODE_CBC);
        $input = Crypt3DES::pkcs5pad($input, $size);
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        mcrypt_generic_init($td, $key, $iv);
        $data = mcrypt_generic($td, $input);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        $data = base64_encode($data);
        return $data;
    }

    /**
     * DESede/CBC/PKCS5Padding; IV向量为01234567
     * @param $input
     * @param $key
     * @param string $iv
     * @return bool|string
     */
    public static function decodeCBC($input, $key, $iv = "01234567")
    {
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        mcrypt_generic_init($td, $key, $iv);
        $ret = trim(mdecrypt_generic($td, base64_decode($input)));
        $ret = self::unpkcs5pad($ret);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $ret;
    }

    /**
     * @brief 安徽3DES加密
     * @param $input
     * @param $key
     * @param string $iv 加密向量
     * @return string
     */
    public static function encode340092($input, $key, $iv = "01234567")
    {
        $size = mcrypt_get_block_size(MCRYPT_3DES, MCRYPT_MODE_CBC);
        $input = Crypt3DES::pkcs5pad($input, $size);
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        mcrypt_generic_init($td, $key, $iv);
        $data = mcrypt_generic($td, $input);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        $data = base64_encode($data);
        return $data;
    }

    /**
     * @brief 安徽3DES解密
     * @param $input
     * @param $key
     * @param string $iv
     * @return bool|string
     */
    public static function decode340092($input, $key, $iv = "01234567")
    {
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        mcrypt_generic_init($td, $key, $iv);
        $ret = trim(mdecrypt_generic($td, base64_decode($input)));
        $ret = self::unpkcs5pad($ret);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $ret;
    }

    /**
     * 解密
     * @param $sStr
     * @param $sKey
     * @return bool|string
     */
    public static function decrypt($sStr, $sKey)
    {
        $decrypted = mcrypt_decrypt(
            MCRYPT_RIJNDAEL_192,
            $sKey,
            base64_decode($sStr),
            MCRYPT_MODE_ECB
        );

        $dec_s = strlen($decrypted);
        $padding = ord($decrypted[$dec_s - 1]);
        $decrypted = substr($decrypted, 0, -$padding);
        return $decrypted;
    }

    private static function pkcs5pad($text, $blocksize)
    {
        $pad = $blocksize - (strlen($text) % $blocksize);
        return $text . str_repeat(chr($pad), $pad);
    }

    private static function unpkcs5pad($text)
    {
        $pad = ord($text{strlen($text) - 1});
        if ($pad > strlen($text)) {
            return false;
        }
        return substr($text, 0, -1 * $pad);
    }

    /**
     * @brief 湖南电信加密算法
     * @param $input
     * @param $key
     * @param string $iv
     * @return bool|string
     */
    public static function encode430002($input, $key)
    {
        // 判断key和userId是否为空
        if (empty($input)) {
            return null;
        }

        if (empty($key)) {
            return null;
        }

        // 解密的密钥型如key1:key2，以 : 分割
        if (strpos($key, ':') === false) {
            return null;
        }

        $keys = explode(":",$key);
        $key1 = (int)$keys[0];
        $key2 = (int)$keys[1];

        $u1 = substr($input,0,$key1);
        $u2 = substr($input,$key1,strlen($input));

        $start = 0;
        $end = strlen($u2) - 1;
        $nu2 = str_split($u2);

        while ($start < $end) {
            $temp = $nu2[$end];
            $nu2[$end] = $nu2[$start];
            $nu2[$start] = $temp;
            $start++;
            $end--;
        }

        $u2 = "";
        for ($i = 0; $i < count($nu2); $i++){
            $u2 = $u2 . $nu2[$i];
        }

        $input = $u2 . $u1;
        $use = str_split($input);
        for ($i = 0; $i < strlen($input); $i++) {
            if (($i + 1) % 2 == 1)
                $use[$i] = chr(ord($use[$i])-$key2);
            else
                $use[$i] = chr(ord($use[$i])+$key2);
        }
        $input = "";
        for ($i = 0; $i < count($use); $i++){
            $input = $input .$use[$i];
        }

        return $input;
    }

    /**
     * @brief 湖南电信获得key
     * @param $input
     * @param $key
     * @param string $iv
     * @return bool|string
     */
    public static function getKey($input) {
        $key = mt_rand(0,strlen($input) - 1);
        return $key.":2";
    }
}