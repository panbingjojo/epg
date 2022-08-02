<?php

namespace Home\Model\Entry;

interface OnApplicationInitListener{
    // 局方大厅参数初始化集成函数监听
    public function onApplicationInit();
}