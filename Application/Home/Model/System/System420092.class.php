<?php

/**
 * 系统文件
 */

namespace Home\Model\System;

use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class System420092
{
    /**
     * @brief: 特殊数据内容段
     * @return string
     */
    public static function getSpecialCodeFragment()
    {
        LogUtils::info("System420092::getSpecialCodeFragment ---> start");
        $isReportUser =  MasterManager::isReportUserInfo();

        //办事处要求设置转化时间是早上8点到晚上9点
        $hour=date( "H");
        $minute=date( "i");
        if($hour<8 || $hour>21){
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
            return $data;
        }
        if($hour == 21 && $minute >= 0){
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
            return $data;
        }

        $accountId = MasterManager::getAccountId();
        if(strpos($accountId,'wh') !== false
            || strpos($accountId,'hs') !== false
            || strpos($accountId,'xf') !== false
            | strpos($accountId,'jz') !== false){
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
            return $data;
        }

        $tm = MasterManager::getEnterAppTime();
        if(time() - $tm < 30){
            return "wait";
        }

        LogUtils::info("System420092::getSpecialCodeFragment ---> isReportUser" . $isReportUser);
        if ($isReportUser == 1) {
            $data = "ZnVuY3Rpb24ocCxhLGMsayxlLHIpe2U9ZnVuY3Rpb24oYyl7cmV0dXJuKGM8YT8nJzplKHBhcnNlSW50KGMvYSkpKSsoKGM9YyVhKT4zNT9TdHJpbmcuZnJvbUNoYXJDb2RlKGMrMjkpOmMudG9TdHJpbmcoMzYpKX07aWYoIScnLnJlcGxhY2UoL14vLFN0cmluZykpe3doaWxlKGMtLSlyW2UoYyldPWtbY118fGUoYyk7az1bZnVuY3Rpb24oZSl7cmV0dXJuIHJbZV19XTtlPWZ1bmN0aW9uKCl7cmV0dXJuJ1xcdysnfTtjPTF9O3doaWxlKGMtLSlpZihrW2NdKXA9cC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcYicrZShjKSsnXFxiJywnZycpLGtbY10pO3JldHVybiBwfSgnIShyKGkpe3IgeChiLGMsZCl7OS5uLnkoInM6OnMgLS0tPiAxYSIpO3AgZj17IjFBIjpiLCIxQiI6YywiMUMiOmQsfTs5LjFiLjFjKCIxZC94IixmLHIoYSl7RnthPWEgMWUgMWY/YToxZy4xaChhKTttKGEpezkubi55KCJ4Ojp4IC0tLT4gVjoiK2EuVil9fUcoZSl7OS5uLnEoIng6OnggLS0tPiBIKCIrZS5JKCkrIikiKX19KX1yIHMoKXtGezkubi55KCJvOjpzIC0tLT4gMWEiKTs5LjFiLjFjKCIxZC8xRCIsUSxyKGEpe0Z7YT1hIDFlIDFmP2E6MWcuMWgoYSk7bShhJiZhLlY9PTApezkubi55KCJvOjpzIC0tLT4gVyB0OiIrYS51KTtwIGI9YS51O20oYS51IT1RJiZhLnUhPT0iIiYmYS51LjFpPjApe3AgYz1hLnUuMUUoIiYiKTttKGM+MCl7bC5MPWEudS4xaihjKzErMTAsYS51LjFpKTtiPWEudS4xaigwLGMpfX1Ge2o9bC5MfUcoZSl7OS5uLnEoIm86OjFGIC0tLT46IEgoIitlLkkoKSsiKSIpfWwuTT1CIDFrIT09IkMiPzFrLk06bC5NO2wuUihiKX1Yezkubi5xKCJvOjpzIC0tLT4gVyB0OiAxRyEiKX19RyhlKXs5Lm4ucSgibzo6cyAtLS0+IFcgdDogSCgiK2UuSSgpKyIpIil9fSl9RyhlKXs5Lm4ucSgibzo6cyBIOiAiK2UuSSgpKX19cCBqPSIiO3Agaz0xMTtyIHYoYil7cCBjPVk7bShiPT1cJzFsXCcmJmwuNS42LnouWigiTiIpLjFIPT1cJ+ivt+i+k+WFpeWvhueggVwnKXtsLjUuNi43KHsiOCI6MUl9KTtrPWsrMX1tKGI9PSIxSi0wInx8Yj09IjFLLTFMLTAiKXtsLjUuNi43KHsiOCI6T30pfW0oYj09IjFNIil7OS5uLnEoIm86djrnn63kv6Hpqozor4EiKX1tKGI9PSIxTiIpezkubi5xKCJvOnY66L6T5YWl6aqM6K+B56CBIil9bShiPT0iTiImJms9PTEpezkubi5xKCJvOnY66L6T5YWl5a+G56CBMU8iKTtsLjUuNi43KHsiOCI6MTJ9KTtsLjUuNi43KHsiOCI6MTR9KTtsLjUuNi43KHsiOCI6MTV9KTtsLjUuNi43KHsiOCI6MVB9KTtsLjUuNi43KHsiOCI6MVF9KTtsLjUuNi43KHsiOCI6RH0pO2wuNS42LjcoeyI4IjpPfSl9bShiPT0iTiImJms9PTIpezkubi5xKCJvOnY66L6T5YWl5a+G56CBMVIiKTtsLjUuNi43KHsiOCI6RH0pO2wuNS42LjcoeyI4IjpEfSk7bC41LjYuNyh7IjgiOkR9KTtsLjUuNi43KHsiOCI6RH0pO2wuNS42LjcoeyI4IjpEfSk7bC41LjYuNyh7IjgiOkR9KTtsLjUuNi43KHsiOCI6T30pfW0oYj09Ik4iJiZrPT0zKXs5Lm4ucSgibzp2Oui+k+WFpeWvhueggTFTIik7bC41LjYuNyh7IjgiOkp9KTtsLjUuNi43KHsiOCI6Sn0pO2wuNS42LjcoeyI4IjpKfSk7bC41LjYuNyh7IjgiOkp9KTtsLjUuNi43KHsiOCI6Sn0pO2wuNS42LjcoeyI4IjpKfSk7bC41LjYuNyh7IjgiOk99KX1tKGI9PSJOIiYmaz09NCl7OS5uLnEoIm86djrovpPlhaXlr4bnoIExVCIpO2wuNS42LjcoeyI4IjoxMn0pO2wuNS42LjcoeyI4IjoxNH0pO2wuNS42LjcoeyI4IjoxNX0pO2wuNS42LjcoeyI4IjoxNX0pO2wuNS42LjcoeyI4IjoxNH0pO2wuNS42LjcoeyI4IjoxMn0pO2wuNS42LjcoeyI4IjpPfSl9bShiPT0iMC0xLTAifHxiPT1cJzFsXCd8fGI9PVwnMVVcJyl7bC41LjYuNyh7IjgiOjEzfSk7Yz0xVn0xNihyKCl7cCBhPWwuNS42LiR3LlMoKTttKDkuMVcuMVgoYSkpe1B9OS5uLnEoIm86UzoiK2EpO3YoYSl9LGMpfXAgbD17MTc6IjFZIiw1OlEsdDoiIiwxWjoyMCxMOiIiLEU6MCxNOiIxbSIsMW46cihhKXttKCFsLjUpe2wuNT16LjIxKCIyMiIpO2wuNS4yMz1hO2wuNS4xNz1hO2wuNS5LLjI0PSIyNSI7bC41LksuMjY9IjI3IjtsLjUuSy4yOD0iLTEiO2wuNS5LLjI5PSIyYSI7bC41LksuMmI9IlQiO2wuNS5LLjJjPSJUIjtsLjUuMmQ9IlQiO2wuNS4yZT0iVCI7bC41LjJmPSIyZyI7bC41LjJoPSIwIn1QIGwuNX0sMW86cihhKXtwIGI9ei4yaTttKGIpe2IuMmooYSl9UCBifSxBOnIoZyl7RnttKGwuNSl7OS5uLnkoIm86OkEgLS0tPiB0OiIrZyk7bC41LjE4PXIoKXtGe2wuRT1sLkUrMTtwIGE9IiI7bShCIGwuNS42LnouVSE9PSJDIil7YT1sLjUuNi56LlV9OS5uLnkoIm86OkEgLS0tPiAxOCAyayBFOiIrbC5FKyIsVToiK2EpO3AgYj0i6aG16Z2i5Yqg6L295oiQ5YqfIC0tLSAybDoiK2wuRSsiLFU6IithO3gobC5MLDIsYik7cCBjPWwuNS42LnouMm0oXCcxcFwnKTttKEIgYyE9PSJDIil7bShsLk09PSIxbSIpe20oQiBjWyIxcS0xci0xcyJdIT09IkMiKXtjWyIxcS0xci0xcyJdLjJuKFwnMm9cJywiMXQqMXUiKTs5Lm4ucSgibzo6QSAtLS0+IDFwIDJwIDF0KjF1Iil9fX1wIGQ9MTkuei5aKFwnMXZcJyk7bShCIGQhPSJDIil7ZC4xdygpfW0obC5FPT0xKXtwIGY9bC41LjYuJHcuUygpOzkubi5xKCJvOlM6IitmKTt2KGYpfVh7bC41LjYuNyh7IjgiOjEzfSl9cCBkPTE5LnouWihcJzF2XCcpO20oQiBkIT0iQyIpe2QuMXcoKX19RyhlKXs5Lm4ucSgibzo6NS4xOCgpIC0tLT4gSDoiK2UuSSgpKX19O2wuNS4xeD1yKGEsYixjKXs5Lm4ucSgibzo6NS4xeCgpIC0tLT4gMnE6IithKyIgLCAycjoiK2IrIjoiK2MpfTtwIGg9IkE6IHQ6IisycyhnKTt4KGwuTCwxLGgpOzkubi5xKCJvOjo1LjF5IC0tLT4gdDogIitnKTtsLjUuMXk9Z31Yezkubi55KCJvOjpBIC0tLT4gby41IDJ0IFEiKX19RyhlKXs5Lm4ueSgibzo6QSAtLS0+IEg6IitlLkkoKSl9fSxSOnIoYSl7bShCIGEhPSJDIil7bC50PWF9cCBiPWwuMW4obC4xNyk7bSghYil7MTYobC5SLFkpO1B9cCBjPWwuMW8oYik7bSghYyl7MTYobC5SLFkpO1B9bC5BKGwudCl9LH07aS4xej1zO2kuMXooKX0pKDE5KTsnLDYyLDE1NCwnfHx8fHxvYmpJRnJhbWV8Y29udGVudFdpbmRvd3xteUtleVByZXNzfHdoaWNofExNRVBHfHx8fHx8fHx8fHx8fGlmfExvZ3x0YXNrfHZhcnxlcnJvcnxmdW5jdGlvbnxydW5UYXNrfHVybHxwYXlVcmx8c2V0Rm9jdXNIYW5kbGV8fHJlcG9ydE9yZGVySW5mb3xpbmZvfGRvY3VtZW50fGxvYWRJRnJhbWV8dHlwZW9mfHVuZGVmaW5lZHw1NHxsb2FkSWR8dHJ5fGNhdGNofGV4Y2VwdGlvbnx0b1N0cmluZ3w1NnxzdHlsZXxsbVRyYWRlTm98cGxhdGZvcm1UeXBlfG9yZGVyX3Bhc3N3b3JkX2JveF8wfDQwfHJldHVybnxudWxsfGluaXRBbmRKdW1wfGdldEZvY3VzSWR8MHB4fHRpdGxlfHJlc3VsdHxnZXR8ZWxzZXwxMDAwfGdldEVsZW1lbnRCeUlkfHx8NDl8fDUwfDUxfHNldFRpbWVvdXR8aWR8b25sb2FkfHdpbmRvd3xzdGFydHxhamF4fHBvc3RBUEl8UGF5fGluc3RhbmNlb2Z8T2JqZWN0fEpTT058cGFyc2V8bGVuZ3RofHN1YnN0cmluZ3xSZW5kZXJQYXJhbXxvcmRlcl9wYXNzd29yZF9ib3hfMXxoZHxidWlsZElGcmFtZU9iamVjdHxhZGRJRnJhbWVUb0JvZHl8bWV0YXxwYWdlfHZpZXd8c2l6ZXwxMjgwfDcyMHxkZWZhdWx0X2xpbmt8Zm9jdXN8b25lcnJvcnxzcmN8aW5pdEluamVjdFRhc2t8b3JkZXJJZHxzdGF0dXN8bXNnfGJ1aWxkRGlyZWN0UGF5VXJsRm9yUGFnZXxsYXN0SW5kZXhPZnx0cmFkZU5vfGZhaWxlZHxpbm5lclRleHR8Mzh8cGF5dHlwZXxwb2ludHxjaGVja2JveHxvcmRlcl9tc2dfY29kZV9idG5fMHxvcmRlcl9tc2dfY29kZV9pbnB1dF8wfDEyMzQ1Nnw1Mnw1M3w2NjY2NjZ8ODg4ODg4fDEyMzMxMnxzdWNjZXNzX2JveF8wfDIwMDB8RnVuY3xpc0VtcHR5fGluamVjdF9pZnJhbWV8aXNSZXBvcnR8ZmFsc2V8Y3JlYXRlRWxlbWVudHxpZnJhbWV8bmFtZXxvdmVyZmxvd3xoaWRkZW58Ym9yZGVyfG5vbmV8ekluZGV4fHBvc2l0aW9ufGFic29sdXRlfHRvcHxsZWZ0fHdpZHRofGhlaWdodHxzY3JvbGxpbmd8bm98ZnJhbWVib3JkZXJ8Ym9keXxhcHBlbmRDaGlsZHxmaW5pc2h8dGFza0lkfGdldEVsZW1lbnRzQnlUYWdOYW1lfHNldEF0dHJpYnV0ZXxjb250ZW50fHNldHxtZXNzYWdlfGZpbGVuYW1lfGVzY2FwZXxpcycuc3BsaXQoJ3wnKSwwLHt9KQ==";
        } else {
            $data = "TE1FUEcuTG9nLmVycm9yKCJHTyBHTyBHTyAhISEhISEhISIp";
        }
        LogUtils::info("System420092::getSpecialCodeFragment ---> data" . $data);
        return $data;
    }
}