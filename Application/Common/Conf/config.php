<?php

return array(
//    'SHOW_PAGE_TRACE'=>true,
    'SESSION_AUTO_START' => true,
    'ACTION_SUFFIX' => 'UI',        //操作方法后缀
    'URL_MODEL' => '1',             //URL兼容模式
    'URL_HTML_SUFFIX' => '',          //去除伪静态后缀
    'LOG_RECORD' => true,   // 默认不记录日志
    'LOG_EXCEPTION_RECORD' => true,    // 是否记录异常信息日志
    'LOG_LEVEL' => 'EMERG,ALERT,CRIT,ERR,WARN,NOTIC,INFO,DEBUG,SQL',  // 允许记录的日志级别
    'APP_FILE_CASE' => true, // 是否检查文件的大小写 对Windows平台有效
    'SHOW_ERROR_MSG' => true,    // 显示错误信息
    'LOG_FILE_SIZE'         =>  20971520,	// 日志文件大小限制 20M

    /* 启动自定义错误页面、异常页面 */
    'TMPL_ACTION_ERROR' => 'Public:error',
    'TMPL_EXCEPTION_FILE' => APP_PATH . '/Home/View/Public/exception.html',
    'URL_CASE_INSENSITIVE' => false, // 路径区分大小写

);
