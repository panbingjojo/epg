<?php
/**
 * Brief: 此类用于校验是否为联合活动
 */

namespace Home\Model\Activity;


class JointActivityEntryManager
{
    /**
     * @brief: 通过下面的参数来判断是否进入联合活动
     * @param $areaCode
     * @param $lmSubId
     * @param $accountId
     * @return bool
     */
    public static function isJointActivity($areaCode, $lmSubId, $accountId)
    {
        // "新春团圆季 字谜大冒险"中国联通EPG局方联合活动版
        $prefix = substr($lmSubId, 0, 5);
        if ($prefix == "Joint") {
            return true;
        }

        return false;
    }
}