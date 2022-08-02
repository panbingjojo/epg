<?php
/**
 * Created by longmaster.
 * Date: 2018-10-30
 * Time: 16:40
 * Brief: 此文件（或类）用于规划订购页的显示规则
 */

namespace Home\Model\Order;

use Home\Model\Entry\MasterManager;

class PayRule
{
    /**
     * 是否走普通活动对应的二次订购页
     * return true--是, false--否
     */
    public static function isGoActivityPayPage($activityName) {
        if (defined("ACTIVITY_ORDER_PAGE")) {
            $array = eval(ACTIVITY_ORDER_PAGE);
            if (in_array($activityName, $array)) {
                // 河南、黑龙江都不走活动专门的计费页（走自定义的普通订购页）
                if (MasterManager::getAreaCode() == '204'
                || MasterManager::getAreaCode() == '211') {
                    return false;
                } else {
                    return true;
                }
            }

            return false;
        }
        return false;
    }

    /**
     * 是否走联合活动对应的二次订购页
     * return true--是, false--否
     */
    public static function isGoJointActivityPayPage($activityName) {
        if (defined("JOINT_ACTIVITY_ORDER_PAGE")) {
            $array = eval(JOINT_ACTIVITY_ORDER_PAGE);
            if (in_array($activityName, $array)) {
                return true;
            }

            return false;
        }
        return false;
    }
}