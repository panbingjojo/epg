<?php

namespace Home\Model\Entry;

interface ITelecomInfoParser{
    /**
     * 从xml中获取数据
     * @param object $xmlObj 链接中解析得到得xml对象
     * @return mixed
     */
    public function parseXMLObj($xmlObj);

    /**
     * 处理第一步获取到得数据
     * @param array $epgInfoMap 已经解析得到的数组
     * @return mixed
     */
    public function parseEPGInfoMap($epgInfoMap);
}