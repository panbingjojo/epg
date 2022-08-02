<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\FamilyAPI;

class FamilyAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * 增加家庭成员
     */
    function addMemberAction()
    {

        $memberID = $_REQUEST['member_id'];
        $memberName = $_REQUEST['member_name'];
        $memberAge = $_REQUEST['member_age'];
        $memberGender = $_REQUEST['member_gender'];
        $memberHeight = $_REQUEST['member_height'];
        $memberWeight = $_REQUEST['member_weight'];
        $memberImageID = $_REQUEST['member_image_id'];
        $memberImageTel = $_REQUEST['member_tel'];

        $memberParaArr = array(
            "member_id" => $memberID,
            "member_name" => $memberName,
            "member_age" => $memberAge,
            "member_gender" => $memberGender,
            "member_height" => $memberHeight,
            "member_weight" => $memberWeight,
            "member_image_id" => $memberImageID,
            "member_tel"=>$memberImageTel,

        );
        $res = FamilyAPI::addMember($memberParaArr);
        $this->ajaxReturn(json_encode($res), 'EVAL');
    }
//    家庭成员绑定手机号上传号码
    function bindPhoneNumberAction()
    {

        $memberID = $_REQUEST['member_id'];
        $memberTel = $_REQUEST['member_tel'];

        $memberParaArr = array(
            "member_id" => $memberID,
            "member_tel"=>$memberTel,
        );
        $res = FamilyAPI::bindPhoneNumber($memberParaArr);
        $this->ajaxReturn(json_encode($res), 'EVAL');
    }

    /**
     * 删除家庭成员
     */
    function delMemberAction()
    {
        $memberID = $_REQUEST["member_id"];
        $res = FamilyAPI::delMember($memberID);
        $this->ajaxReturn(json_encode($res), 'EVAL');
    }

    /**
     * 查询指定家庭成员信息
     */
    function queryMemberAction()
    {
        $memberID = $_REQUEST["member_id"];
        $res = FamilyAPI::queryMember($memberID);
        $this->ajaxReturn(json_encode($res), 'EVAL');
    }
}
