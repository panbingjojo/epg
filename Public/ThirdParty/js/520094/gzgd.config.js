var cpcom_config = {
    'epg_host':'http://epg.interface.gzgd/gzgd/STBindex',//epg N1接口下行地址
    'version' :'1.0.0.STD.GZGD.AUTO.OTT01.Release', //贵州发布版本号
    'detail_url':'http://10.2.4.60:8080/iPG/template/js/redirectById.html', //节目部提供父母乐详情页地址
    'nns_partner_id' : 'gzgd_pay_2',//支付
    'zf_url' : 'http://epg.interface.gzgd/nn_cms/data/webapp/common/zf/index.html',//支付只有正式服
    'player_url':'http://epg.interface.gzgd/nn_cms/data/webapp/common/',   //播放器player文件路径
    'pay_resource_url': 'http://epg.interface.gzgd/nn_cms/data/webapp/common/zf_v2/',  //新版支付相关资源加载路径
    'device_id':'01010216082401000234',//正式用设备号
    'lous_pay_white_list':'10100',//白条支付白名单，无该参数时所有sp都可进行白条支付，有则只允许白名单支持白条支付
}
