<?php


namespace Home\Model\Display;


interface IDisplayPage
{
    // 默认的配置页面值
    const DEFAULT_PAGE_CONF = "default";

    // 获取渲染页面的配置信息
    public function getDisplayPageConf();

    // 获取默认渲染页面配置信息
    public function getDefaultPageConf();
}