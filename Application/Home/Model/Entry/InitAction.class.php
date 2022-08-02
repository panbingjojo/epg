<?php

namespace Home\Model\Entry;


interface InitAction {
    /**
     * 获取EPG信息相关参数
     * @return mixed
     */
    public function getEPGInfoMap();

    /**
     * 解析EPG信息相关参数
     * @param array $epgInfoMap 待解析的参数
     * @return mixed
     */
    public function handleEPGInfoMap($epgInfoMap);
}