<?php

namespace Home\Model\Entry;

class InitListener640092 implements OnApplicationInitListener {

    public function onApplicationInit() {
        // 宁夏电信清除进入区医院模块标识
        MasterManager::setEnterHospitalModule(0);
    }
}