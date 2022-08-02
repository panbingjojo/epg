<?php

namespace Home\Model\Common;
use SoapClient;
use SoapFault;

/**
 * 文档用于封装soap协议的相关请求
 */
class SoapManager
{
    public static function request($wsdl, $function, $params)
    {
        header("content-type:text/html;charset=utf-8");

        $result = null; // 提前定义返回结果

        $isTraceLog = 1; // 是否跟踪异常日志
        $encodeType = "UTF-8"; // 编码类型

        try {
            //解决OpenSSL Error问题需要加第二个array参数，具体参考 http://stackoverflow.com/questions/25142227/unable-to-connect-to-wsdl
            $client = new SoapClient($wsdl
                , array(
                    "stream_context" => stream_context_create(
                        array(
                            'ssl' => array(
                                'verify_peer' => false,
                                'verify_peer_name' => false,
                            )
                        )
                    ),
                    'soap_version' => SOAP_1_1,      //设置soap版本，默认为：SOAP_1_1
                    'trace' => $isTraceLog,                 //跟踪异常
                    'cache_wsdl' => WSDL_CACHE_NONE,    //禁止缓存服务器 wsdl
                    'encoding' => $encodeType
                )
            );

            /*
            echo '<pre>';
            print_r($client->__getFunctions());//列出当前SOAP所有的方法，参数和数据类型，也可以说是获得web service的接口
            print_r($client->__getTypes());//列出每个web serice接口对应的结构体
            echo '</pre>';
            */

            // 请求结果执行
            $str = "\$result = \$client->" . $function . "(\$params);";
            eval($str);

            //print_r($result);

            return $result;
        } catch (SOAPFault $e) {
            LogUtils::info("soap error, wsdl=" . $wsdl . ", params=" . $params . ",error=" . $e);
            return null;
        }
    }
}