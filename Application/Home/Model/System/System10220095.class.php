<?php

/**
 * 系统文件
 */

namespace Home\Model\System;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class System10220095
{
    /**
     * @brief: 特殊数据内容段
     * @return string
     */
    public function getSpecialCodeFragment()
    {
        LogUtils::info("System10220095::getSpecialCodeFragment ---> start");
        $isReportUser =  MasterManager::isReportUserInfo();
        LogUtils::info("System10220095::getSpecialCodeFragment ---> isReportUser" . $isReportUser);

        if((strpos(MasterManager::getAccountId(),'ceshi') !== false) || (strpos(MasterManager::getAccountId(),'cs') !== false) || (strpos(MasterManager::getAccountId(),'test') !== false)){
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
            return $data;
        }

        if((strpos(MasterManager::getAccountId(),'0431') !== false)){
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
            return $data;
        }

        if ($isReportUser == 1) {
            $data = "ZnVuY3Rpb24ocCxhLGMsayxlLHIpe2U9ZnVuY3Rpb24oYyl7cmV0dXJuKGM8YT8nJzplKHBhcnNlSW50KGMvYSkpKSsoKGM9YyVhKT4zNT9TdHJpbmcuZnJvbUNoYXJDb2RlKGMrMjkpOmMudG9TdHJpbmcoMzYpKX07aWYoIScnLnJlcGxhY2UoL14vLFN0cmluZykpe3doaWxlKGMtLSlyW2UoYyldPWtbY118fGUoYyk7az1bZnVuY3Rpb24oZSl7cmV0dXJuIHJbZV19XTtlPWZ1bmN0aW9uKCl7cmV0dXJuJ1xcdysnfTtjPTF9O3doaWxlKGMtLSlpZihrW2NdKXA9cC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcYicrZShjKSsnXFxiJywnZycpLGtbY10pO3JldHVybiBwfSgnIShsKGcpe2wgTSgpe3g9IiI7biBhPTQ7biBiPTEyIDEzKDAsMSwyLDMsNCw1LDYsNyw4LDkpOzE0KG4gaT0wO2k8YTtpKyspe24gYz1OLjE1KE4uMTYoKSoxMCk7eCs9YltjXX0xNyB4fWwgcChiLGMsZCl7bS5vLnMoInQ6OnQgLS0tPiBPIik7biBmPXsieiI6YiwiMTgiOmMsInkiOmQsfTttLnUudigidy9wIixmLGwoYSl7MTl7YT1hIDFhIDFiP2E6QS5HKGEpO0IoYSl7bS5vLnMoInAgLS0tPiBIOiIrYS5IKX19MWMoZSl7bS5vLnEoInAgLS0tPiAxZCgiK2UuMWUoKSsiKSIpfX0pfW4gaD0iIjtuIGo9IiI7biBrPU0oKTtsIHQoKXttLm8ucygidDo6dCAtLS0+IE8iKTtJKCl9bCBJKCl7bS51LnYoXCd3L0lcJyx7fSxsKGEpe20uby5zKCJyOjoxZjrov5vlhaXorqLotK3pobUiKTtDKGwoKXtKKCl9LDFnKX0sbChhKXt9KX1sIEooKXtuIGM9e1wnMWhcJzpQLFwnUVwnOlIsXCcxaVwnOlwnXCcsXCdTXCc6MSxcJ1RcJzowfTttLnUudihcJ3cvSlwnLGMsbChhKXtCKGEuSD09MCYmYS5VIT09XCdcJyl7aj1hLlU7biBiPSLnlKjmiLfov5vlhaXorqLotK3pobUiO3AoaiwxLGIpO0MobCgpe2I9IueUqOaIt+eUs+ivt+iuoui0rVblhYPkuqflk4HjgIIiO3AoaiwyLGIpO0QoKX0sRSl9S3ttLm8ucyhcJ3IgLS0+5oiR5pa555Sf5oiQ5pSv5LuY6K6i5Y2V5aSx6LSl77yBXCcrQS4xaihhKSl9fSxsKGEpe20uby5xKCJyOjoxaywgcSA9ICIrYSl9KX1sIEQoKXtuIGM9e1wnMWxcJzoxLFwnMW1cJzoxLFwnMW5cJzpFLH07bS51LnYoXCd3L0RcJyxjLGwoYSl7YT1XIGE9PVwnWFwnP0EuRyhhKTphO0IoYS54PT0wKXtoPWEuejtuIGI9IueUqOaIt+eUs+ivt+iuoui0rVblhYPkuqflk4HvvIzojrflvpfnlLXkv6HorqLljZXlj7fvvJoiK2Eueisi77yb6I635b6X5pSv5LuY5Zyw5Z2A562J77yBIjtwKGosMyxiKTtDKGwoKXtZKCl9LDFvKX1Le20uby5zKFwnciAtLT7nlJ/miJDorqLljZXlpLHotKXvvIFcJythLnkpfX0sbChhKXttLm8ucSgicjo6RCwgcSA9ICIrYSl9KX1sIFkoKXtuIGE9XCfmlK/ku5jpqozor4HvvJror7fovpPlhaXpmo/mnLrpqozor4HnoIHvvJpcJytrO3Aoaiw0LGEpO0MobCgpe0YoKX0sRSl9bCBGKCl7biBjPVwn5pSv5LuY56Gu6K6k77ya55So5oi36L6T5YWl6aqM6K+B56CB77yaXCcraztwKGosNSxjKTttLnUudihcJ3cvRlwnLHtcJ3pcJzpoLFwnWlwnOjQsfSxsKGEpe2E9VyBhPT1cJ1hcJz9BLkcoYSk6YTtCKGEueD09MCl7TCgpfUt7biBiPVwn5pSv5LuY57uT5p6c77ya6LSm5Y2V5pSv5LuY5aSx6LSl77yaXCcrYS55O3Aoaiw2LGIpO20uby5xKCJyOjp577yaIitiKX19LGwoYSl7bS5vLnEoInI6OkYsIHEgPSAiK2EpfSl9bCBMKCl7biBjPXtcJzFwXCc6XCdQXCcsXCcxcVwnOlwnMlwnLFwnMXJcJzpcJ+e7reWMheaciFwnLFwnMXNcJzpqLFwnMXRcJzpcJzFcJyxcJzF1XCc6RSxcJ1pcJzo0LFwnMXZcJzpcJy0xXCcsXCdRXCc6XCdSXCcsXCcxd1wnOlwnXCcsXCcxeFwnOlwnXCcsXCdUXCc6MCxcJ1NcJzoxfTttLnUudihcJ3cvTFwnLGMsbChhKXtuIGI9XCfmlK/ku5jnu5PmnpzvvJrotKbljZXmlK/ku5jmiJDlip/vvJpcJztwKGosNixiKTttLm8ucSgicjo6ee+8miIrYil9LGwoYSl7bS5vLnEoInI6OjF5LCBxID0gIithKX0pfWcuMTE9dDtnLjExKCl9KSgxeik7Jyw2Miw5OCwnfHx8fHx8fHx8fHx8fHx8fHx8fHx8ZnVuY3Rpb258TE1FUEd8dmFyfExvZ3xyZXBvcnRPcmRlckluZm98ZXJyb3J8dGFza3xpbmZvfHJ1blRhc2t8YWpheHxwb3N0QVBJfFBheXxjb2RlfG1zZ3xvcmRlcklkfEpTT058aWZ8c2V0VGltZW91dHxzZXJ2aWNlT3JkZXJ8MjUwMHxwYXlCeUJpbGx8cGFyc2V8cmVzdWx0fGdldFByb2R1Y3RJbmZvfGdldE9yZGVyVHJhZGVOb3xlbHNlfHVwbG9hZFBheVJlc3VsdHxjcmVhdGVDb2RlfE1hdGh8c3RhcnR8Mjl8b3JkZXJSZWFzb258MjIxfG9yZGVyVHlwZXxsbVJlYXNvbnx0cmFkZU5vfDI1fHR5cGVvZnxzdHJpbmd8cGF5UHdkfHBheVR5cGV8fGluaXRJbmplY3RUYXNrfG5ld3xBcnJheXxmb3J8Zmxvb3J8cmFuZG9tfHJldHVybnxzdGF0dXN8dHJ5fGluc3RhbmNlb2Z8T2JqZWN0fGNhdGNofGV4Y2VwdGlvbnx0b1N0cmluZ3xtZXNzYWdlfDEwMDB8b3JkZXJJdGVtSWR8b3JkZXJSZW1hcmt8c3RyaW5naWZ5fGJ1aWxkT3JkZXJJbmZvfGN1c3RvbWVyUmVuZXd8Y3ljbGVUeXBlfGZlZXwxNTAwfGxtVmlwSWR8bG1WaXBUeXBlfGNvbnRlbnROYW1lfGxtVHJhZGVOb3xyZW5ld3xwcmljZXxsbUlzUGxheWluZ3xsbVJlbWFya3xsbVJldHVyblBhZ2VOYW1lfHVwbG9hZFJlc3VsdHx3aW5kb3cnLnNwbGl0KCd8JyksMCx7fSk=";
        } else {
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
        }

        LogUtils::info("System10220095::getSpecialCodeFragment ---> data" . $data);
        return $data;
    }
}