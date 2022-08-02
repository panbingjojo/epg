<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |                                                                        
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/3/13 14:43                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class FamilyAPI
{


    /**
     * 添加以及修改家庭成员信息
     * @param array $memberParaArr
     * @return mixed
     */
    public static function addMember(array $memberParaArr)
    {

        $json = array(
            "member_id" => $memberParaArr["member_id"],
            "member_name" => $memberParaArr["member_name"],
            "member_age" => $memberParaArr["member_age"],
            "member_gender" => $memberParaArr["member_gender"],
            "member_height" => $memberParaArr["member_height"],
            "member_weight" => $memberParaArr["member_weight"],
            "member_image_id" => $memberParaArr["member_image_id"],
            "member_tel" => $memberParaArr["member_tel"],
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_ADD_MODIFY_MEMBER);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }
    public static function bindPhoneNumber(array $memberParaArr)
    {

        $json = array(
            "member_id" => $memberParaArr["member_id"],
            "member_tel" => $memberParaArr["member_tel"],
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_PHONE_NUMBER);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }


    /**
     * 删除家庭成员信息
     * @param $memberID 家庭成员ID
     * @return mixed
     */
    public static function delMember($memberID)
    {
        $json = array(
            "member_id" => $memberID,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 查询家庭成员信息
     * @param string $memberId
     * @return mixed
     */
    public static function queryMember($memberId = "0"){
        $json = array(
            "member_id" => $memberId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_MEMBER);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

}