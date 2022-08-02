<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/5/11
 * Time: 下午2:08
 */

namespace Home\Model\Intent;


class Intent {
    private $name;
    private $param;

    /**
     * 构成Intent 对象
     * Intent constructor.
     * @param string $pageName
     * @param null $pageParam
     */
    public function __construct($pageName = "", $pageParam = null) {
        $this->name = "";
        $this->param = new \stdClass();
        if ($pageName != null && !empty($pageName)) {
            $this->name = $pageName;
        }
        if ($pageParam != null && $pageParam instanceof \stdClass) {
            $this->param = $pageParam;
        }
    }

    /**
     * 设置页面名称
     * @param $name
     */
    public function setPageName($name) {
        if ($name != null) {
            $this->name = $name;
        }
    }

    /**
     * 返回页面名称
     * @return string
     */
    public function getPageName() {
        return $this->name;
    }

    /**
     * 增加或修改页面参数
     * @param $name
     * @param $value
     */
    public function setParam($name, $value) {
        if (empty($name)) {
            return;
        }
        $this->param->$name = $value;
    }

    /**
     * 得到参数值
     * @param $name 如果$name == null的话，然后参数数组
     * @return string
     */
    public function getParam($name = null) {
        if ($name == null) {
            return $this->param;
        }
        return $this->param[$name];
    }


    public function toStdClass() {
        $intentObj = new \stdClass();
        $intentObj->name = $this->name;
        $intentObj->param = $this->param;
        return $intentObj;
    }
}