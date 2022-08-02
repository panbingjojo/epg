<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  | 通过Intent统计相关数据
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/7/16 15:13                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common;


use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class IntentStatManager
{

    private static $PageNameWithPlayer = "player";//播放器界面标识符

    public static function init($currIntentArr, $nextIntentArr)
    {
        self::statPlayVideo($currIntentArr, $nextIntentArr);
    }

    /**
     * 全屏播放开始与结束播放
     * @param $currIntentArr 当前页面Intent
     * @param $nextIntentArr 下一个页面Intent
     * @throws \Think\Exception
     */
    private static function statPlayVideo($currIntentArr, $nextIntentArr)
    {
        $curPageName = $currIntentArr["name"];
        $nextPageName = $nextIntentArr["name"];

        if ($curPageName == self::$PageNameWithPlayer) {//统计视频结束
            LogUtils::info("IntentStatManager-->statPlayVideo-->startTime=" . date("Y-m-d H:i:s"));
            StatManager::uploadPlayVideoFinish(MasterManager::getUserId(), null);
            LogUtils::info("IntentStatManager-->statPlayVideo-->endTime=" . date("Y-m-d H:i:s"));
        }
        
        if ($nextPageName == self::$PageNameWithPlayer) {  //统计视频开始
            $videoInfoArr = json_decode($nextIntentArr["param"]["videoInfo"], true);

            if (!is_array($videoInfoArr)) {
                return;
            }

            $playInfo = array(
                "beginTime" => date("Y-m-d H:i:s", time()),
                "title" => $videoInfoArr['title'],
                "type" => $videoInfoArr['type'],
                "sourceId" => $videoInfoArr['sourceId'],
                "entryType" => $videoInfoArr['entryType'],
                "entryTypeName" => $videoInfoArr['entryTypeName'],
                "search_condition" => $videoInfoArr['searchCondition'],
                "freeSeconds" => $videoInfoArr['freeSeconds'],
                "userType" => $videoInfoArr['userType'],
                "videoUrl" => $videoInfoArr['videoUrl']
            );
            LogUtils::info("IntentStatManager-->statPlayVideo-->startTime=" . date("Y-m-d H:i:s"));
            StatManager::uploadPlayVideoStart(MasterManager::getUserId(), $playInfo);  //上报结果开始播放
            LogUtils::info("IntentStatManager-->statPlayVideo-->endTime=" . date("Y-m-d H:i:s"));
        }

    }

}