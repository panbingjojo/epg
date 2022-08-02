<?php

namespace Provider\Model\Constants;

class Type
{
    // -----------------------------------------------------------//
    // data_type: 可自定义, 范围: 0~100
    //
    // [须知]：
    //      1.切记已有上线运营地区，不要随意变更已定义的data_type！
    //      2.切记有使用通用/cws/api/cloud/push.php、pull.php接口时，
    // 不要与现有的data_type冲突！！！
    // -----------------------------------------------------------//
    const DT_INQUIRY_ARCHIVE_DATA_MAP = 1;         //问诊模块 - 归档问诊记录："第三方成员id与问诊详情json串"映射
    const DT_MEASURE_TYPE_MEASUREID_MAP = 2;       //检测模块 - 归档："检测type与检测id"映射表1。
    const DT_MEASURE_ARCHIVE_DATA_MAP = 3;         //检测模块 - 归档："第三方成员id与检测id"映射表2，用于存储整个检测详情json串。

    // 检测数据类型
    const MEASURE_TYPES = array(
        1, //血糖
        2, //胆固醇
        3, //甘油三脂
        4, //尿酸
    );
}