<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017-04-18
 * Time: 11:14
 * breif: 目前这个类用于对数据进行加密，并上报给pay服务器
 */
namespace Home\Common\Tools;

class DES3Tool
{
    private $key = "";
    private $iv = "";

    /**
     * 构造，传递二个已经进行base64_encode的KEY与IV
     *
     * @param string $key
     * @param string $iv
     */
    function __construct($key, $iv)
    {
        if (empty($key) || empty($iv)) {
            echo 'key and iv is not valid';
            exit();
        }
        $this->key = $key;
        $this->iv = $iv;
    }

    /**
     *加密
     * @param <type> $value
     * @return <type>
     */
    public function encrypt($value)
    {
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        $size = mcrypt_get_block_size(MCRYPT_3DES, MCRYPT_MODE_CBC);

        $key = base64_decode($this->key);
        $iv = base64_decode($this->iv);

        $value = $this->pkcs5_pad($value, $size);

        mcrypt_generic_init($td, $key, $iv);
        $ret = base64_encode(mcrypt_generic($td, $value));
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);

        return $ret;
    }

    /**
     *解密
     * @param <type> $value
     * @return <type>
     */
    public function decrypt($value)
    {
        $td = mcrypt_module_open(MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');

        $key = base64_decode($this->key);
        $iv = base64_decode($this->iv);

        mcrypt_generic_init($td, $key, $iv);

        $ret = trim(mdecrypt_generic($td, base64_decode($value)));
        $ret = $this->pkcs5_unpad($ret);

        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);

        return $ret;
    }

    private function PaddingPKCS7($data)
    {
        $block_size = mcrypt_get_block_size('tripledes', 'cbc');
        $padding_char = $block_size - (strlen($data) % $block_size);
        $data .= str_repeat(chr($padding_char), $padding_char);
        return $data;
    }

    private function UnPaddingPKCS7($text)
    {
        $pad = ord($text{strlen($text) - 1});
        if ($pad > strlen($text)) {
            return false;
        }
        if (strspn($text, chr($pad), strlen($text) - $pad) != $pad) {
            return false;
        }
        return substr($text, 0, -1 * $pad);
    }

    private function pkcs5_pad ($text, $blocksize) {
        $pad = $blocksize - (strlen($text) % $blocksize);
        return $text . str_repeat(chr($pad), $pad);
    }

    private function pkcs5_unpad($text){
        $pad = ord($text{strlen($text)-1});
        if ($pad > strlen($text)) {
            return false;
        }
        if (strspn($text, chr($pad), strlen($text) - $pad) != $pad){
            return false;
        }
        return substr($text, 0, -1 * $pad);
    }
}