<?php

namespace Home\Model\Entry;

class ApplicationFactory{

    /**
     * 根据不同的地区编码返回不同的应用实例
     * @return Application 应用实例，主要承载应用的初始化功能
     */
    public static function getApplicationInstance(){
        $instance = null;

        if(IS_RUN_ON_ANDROID == 1) { // 运行android平台，入口的链接参数所传键值都是一致，都统一处理
            $action = new InitActionAPK();
            $instance = new Application($action);
            return $instance;
        }

        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM:
                $action = new InitAction000051();
                $instance = new Application($action);
                // 设置监听器
                $initListener = new InitListenerChinaUnicom();
                $instance->setOnInfoIoInitListener($initListener);
                break;
            case CARRIER_ID_YBHEALTH:
            case CARRIER_ID_CHINAUNICOM_MOFANG:
            case CARRIER_ID_CHINAUNICOM_MEETLIFE:
            case CARRIER_ID_LDLEGEND:
                $action = new InitAction000051();
                $instance = new Application($action);
                break;
            case CARRIER_ID_GUANGXIGD:
                $action = new InitAction450094();
                $instance = new Application($action);
                break;
            case CARRIER_ID_QINGHAIDX:
            case CARRIER_ID_QINGHAIDX_GAME:
                $action = new InitAction630092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_GUIZHOUDX:
            case CARRIER_ID_GUIZHOUGD_XMT:
                $action = new InitAction520092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_GUIZHOUGD:
                $action = new InitAction520094();
                $instance = new Application($action);
                break;
            case CARRIER_ID_XINJIANGDX:
            case CARRIER_ID_XINJIANGDX_TTJS:
            case CARRIER_ID_XINJIANGDX_HOTLINE:
                $action = new InitAction650092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_SICHUANGD:
                $action = new InitAction510094();
                $instance = new Application($action);
                break;
            case CARRIER_ID_JIANGSUDX:

                $action = new InitAction320092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_CHONGQINGDX:
            case CARRIER_ID_CHONGQINGGD:
                $action = new InitAction500092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_GUANGXIDX:
                $action = new InitAction450092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_NINGXIADX:
            case CARRIER_ID_NINGXIADX_MOFANG:
                $action = new InitAction640092();
                $instance = new Application($action);
                // 设置监听器
                $initListener = new InitListener640092();
                $instance->setOnInfoIoInitListener($initListener);
                break;
            case CARRIER_ID_SHANXIDX:
                $action = new InitAction610092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_HUBEIDX:
                $action = new InitAction420092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_GANSUDX:
                $action = new InitAction620092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_FUJIANDX:
                $action = new InitAction350092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_JIANGXIDX:
                $action = new InitAction360092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_HAINANDX:
                $action = new InitAction460092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_HENANDX:
                $action = new InitAction410092();
                $instance = new Application($action);
                // 设置监听器
                $initListener = new InitListener410092();
                $instance->setOnInfoIoInitListener($initListener);
                break;
            case CARRIER_ID_SHANDONGDX:
                $action = new InitAction370092();
                $instance = new Application($action);
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $epgInfo = $_GET['epg_info']; // 检测连接参数中是否包含'epg_info'字段
                if($epgInfo) { // 包含epg_info字段，类似山东电信的解析方式
                    $action = new InitAction370092();
                } else { // 不包含epg_info字段，按正常对接参数进行参数接收
                    $action = new InitAction371092();
                }
                $instance = new Application($action);
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:   // 广东广电（网关版本440004）
                $action = new InitAction440004();
                $instance = new Application($action);
                // 设置监听器，指定链接跳转局方大厅
                $initListener = new InitListenerGDGD();
                $instance->setOnInfoIoInitListener($initListener);
                break;
            case CARRIER_ID_GUANGDONGGD:
                $instance = new Application(null);
                // 设置监听器，指定链接跳转局方大厅
                $initListener = new InitListenerGDGD();
                $instance->setOnInfoIoInitListener($initListener);
                break;
            default:
                $instance = new Application(null);
                break;
        }

        return $instance;
    }

}