<?php
/*
  +----------------------------------------------------------------------+
  | IPTV                                                                 |
  +----------------------------------------------------------------------+
  | AES-128 ECB模式加密、解密工具
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2017/11/30 17:56                                                |
  +----------------------------------------------------------------------+
 */

namespace Home\Common\Tools;


class AesTool {
    /**
     * AES-128 ECB模式加密数据
     * @param $str  待加密的字符串
     * @param $encryptKey 秘钥
     * @return string AES加密后的字符串
     */
    public static function encrypt($str, $encryptKey) {
        $localKeyBase64 = base64_decode($encryptKey);
        $str = trim($str);
        $str = self::addPKCS7Padding($str);
        $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB), MCRYPT_RAND);
        $encrypt_str = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $localKeyBase64, $str, MCRYPT_MODE_ECB, $iv);
        return base64_encode($encrypt_str);
    }

    /**
     *  ES-128 ECB模式加密数据
     * @param $str 待解密字符串
     * @param $encryptKey 秘钥
     * @return bool|string 返回解密后的字符串
     */
    public static function decrypt($str, $encryptKey) {

        $str = base64_decode($str);
        $localKeyBase64 = base64_decode($encryptKey);
        $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB), MCRYPT_RAND);
        $encrypt_str = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $localKeyBase64, $str, MCRYPT_MODE_ECB, $iv);
        $encrypt_str = trim($encrypt_str);
        $encrypt_str = self::stripPKSC7Padding($encrypt_str);
        return $encrypt_str;

    }

    /**
     * AES-128 CBC模式加密数据
     * @param $str  待加密的字符串
     * @param $encryptKey 秘钥
     * @param $iv 加密向量
     * @return string AES加密后的字符串 -- 再进行转成HEX
     */
    public static function encryptCBCModel($str, $encryptKey, $iv) {
        $str = trim($str);
        $size = mcrypt_get_block_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $str = self::addPKCS5Padding($str, $size);
        $encrypt_str = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $encryptKey, $str, MCRYPT_MODE_CBC, $iv);
        return strtoupper(bin2hex($encrypt_str));
    }

    /**
     * AES-128 CBC模式解密数据
     * @param $str 待解密字符串
     * @param $encryptKey 秘钥
     * @param $iv 加密向量
     * @return bool|string 返回解密后的字符串
     */
    public static function decryptCBCModel($str, $encryptKey, $iv) {
        $str = hex2bin($str);
        $encrypt_str = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $encryptKey, $str, MCRYPT_MODE_CBC, $iv);
        $encrypt_str = trim($encrypt_str);
        $encrypt_str = self::stripPKSC5Padding($encrypt_str);
        return $encrypt_str;
    }

    private static function addPKCS7Padding($source) {
        $source = trim($source);
        $block = mcrypt_get_block_size('rijndael-128', 'ecb');
        $pad = $block - (strlen($source) % $block);
        if ($pad <= $block) {
            $char = chr($pad);
            $source .= str_repeat($char, $pad);
        }
        return $source;
    }

    private static function stripPKSC7Padding($source) {
        $source = trim($source);
        $char = substr($source, -1);
        $num = ord($char);
        if ($num == 62) return $source;
        $source = substr($source, 0, -$num);
        return $source;
    }

    private static function addPKCS5Padding($source, $size) {
        $pad = $size - (strlen($source) % $size);
        return $source . str_repeat(chr($pad), $pad);
    }

    private static function stripPKSC5Padding($source) {
        $pad = ord($source{strlen($source) - 1});
        if ($pad > strlen($source)) {
            return false;
        }

        return substr($source, 0, -1 * $pad);
    }
}