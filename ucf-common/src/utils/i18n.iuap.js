// 原有iuap的处理，仅仅处理现有相关逻辑
/**
 * 前端的国际化操作：
 * 1、国际化展示采用用户自己选择的语种进行展示；
 * 2、默认的语种为简体中文；
 * 3、网站支持国际化多语，需要对翻译的内容进行资源化；
 * 4、
 */

/*
 * 设置语言类型： 默认为中文
 */
var defaultLocales = "zh_CN";

/*
 * 后台获取的语种描述信息
 */
// var langs = [];

/**
 *  页面执行主入口
 */
// $(function() {

	/*
	 * 设置默认的语言环境
	 */
	// setDefaultLocales();

	/* 
	 * 加载I18n资源 
	 */
	// loadI18nProperties();
	
// });


/**
 * 加载i18n资源
 * 回调函数中不需要写入任何的处理逻辑，页面赋值单独处理
 * TODO 把当前目录下的资源文件都加载
 * @return
 */
function loadI18nProperties(subpath) {

	/*
	 * i18n资源加载
	 */
	$.i18n.properties({
        name :'iuap',
        language : getCurrentLocales(),
        path : getCurrAbsPath(subpath),
        mode : 'map', // 用Map的方式使用资源文件中的值
        //checkAvailableLanguages: true,
        //async: true,
        cache:true,
        callback : function() {
            // do nothing
        }
    });
	
	/* 需要引入 i18n 文件 */
	if ($.i18n == undefined) {
		console.log("请引入i18n js 文件")
		return false;
	};

};


/**
 * 获取当前页面所在的资源路径，主要通过js来进行逻辑判断
 *
 * @param subpath 可以不进行判断，直接指定资源路径
 *
 * @returns {string}
 */
function getCurrAbsPath(subpath) {
    // var href= window.location.href;
    // 获取当前网址，如：
    var href=window.location.href;

    // 获取主机地址之后的目录如：/Tmall/index.jsp
    var pathName=window.location.pathname;
    // var pos=curWwwPath.indexOf(pathName);

    // 获取主机地址，如：//localhost:8080
    // var localhostPath=curWwwPath.substring(0,pos);
    var localhostPath=window.location.origin||window.location.protocol+'//'+window.location.host;

    // 获取带"/"的项目名，如：/Tmall
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);

    var path = localhostPath + projectName + "/locales";

    if (subpath !== null && typeof subpath !== 'undefined') {
        return path + subpath;
    }

    if(href.indexOf(localhostPath + projectName) >= 0){
        href = href.substr((localhostPath + projectName).length);
    }
    // href = pathName.substring(pathName.substr(1).indexOf('/')+1);

	if(href.indexOf('#')>0){
		try {
            var id = href.split('#')[1];
			if(id.indexOf('/') !=-1){
            	id=id.split('/')[1];
            	if(id.indexOf('?') !=-1){
                    id=id.split('?')[0];
				}
            }
            if(typeof (id) == 'undefined' ||id ==''){
            	path = path + getSubPath(href);
			}else {
                // path = window.allPath[id];
                path = path + getSubPath(window.allPath[id]);
			}

		}catch(e) {
            var stack = e.stack || e.sourceURL || e.stacktrace;

            var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/;
            var absPath = rExtractUri.exec(stack);
            path = absPath[0] || '';

		}

		return path;
	}else{// 标准的路径，取后两位//

		// console.log("其他路由开发中");
        return path + getSubPath(href);

	}
};

/**
 * 获取locales下的子路径
 *
 * @param href
 * @returns {*}
 */
function getSubPath(href){

    if(href.split('/').length <=2 ) return "";

    var direct = href.substr(0,href.lastIndexOf('/'));

    var subpath1 = direct.substr(direct.lastIndexOf('/'));

    if(href.split('/').length <=2 ) return subpath1;

    direct = direct.substr(0,direct.lastIndexOf('/'));
    var subpath2 = direct.substr(direct.lastIndexOf('/'));

    return subpath2 + subpath1;
}

/**
 * 给页面进行赋值
 * 该部分由于页面异步加载的问题，需要使用回调函数aftercreate
 * 1、 html页面： 先对其中的i18n标记的label进行赋值，再对grid的title进行赋值
 * 2、 js文件：直接通过i18n.prop进行赋值
 */
function assignmentPage() {
	
	// 对其中的i18n标记的label进行赋值
	var labelElement = $(".i18n");

	labelElement.each(function() {
		// 根据i18n元素的 name 获取内容写入
		$(this).html($.i18n.prop($(this).attr('name')));
	});

	// 该部分需要对表格部分的title进行重新的封装。
	// 建议进行替换的方式，通过type=text & u-mate.type = grid找到options在找到title进行替换
	var gridElement = $("div[attribute='options']");

	gridElement.each(function() {
		var options = $(this).html();

	});

	// 获取所有含有title、placeholder属性的元素，进行单独的处理：即直接采用key值替换
    var insertInputEle = $("*[placeholder]");

    insertInputEle.each(function() {
        // var key = $(this).attr('placeholder');
        if($(this).attr('placeholderkey')){
            // $(this).html($.i18n.prop($(this).attr('placeholderkey')));
            $(this).attr('placeholder', $.i18n.prop($(this).attr('placeholderkey')));
        }else{
            $(this).attr('placeholderkey',$(this).attr('placeholder'));
            // $(this).html($.i18n.prop($(this).html()));
            $(this).attr('placeholder', $.i18n.prop($(this).attr('placeholder')));
        }

    });

    // 20181203配合调整页面上刷新慢时显示key的情况（需要将html中的key值放到placeholderkey属性中）
    var insertInputEle = $("*[placeholderkey]");

    insertInputEle.each(function() {
        // var key = $(this).attr('placeholder');
        if($(this).attr('placeholderkey')){
            // $(this).html($.i18n.prop($(this).attr('placeholderkey')));
            $(this).attr('placeholder', $.i18n.prop($(this).attr('placeholderkey')));
        }else{
            $(this).attr('placeholderkey',$(this).attr('placeholder'));
            // $(this).html($.i18n.prop($(this).html()));
            $(this).attr('placeholder', $.i18n.prop($(this).attr('placeholder')));
        }

    });


	var insertTitleEle = $("*[title]");

    insertTitleEle.each(function() {

		if($(this)[0].tagName ==="LINK" || $(this)[0].tagName ==="INPUT"){
        	return true;
		}
		// var key = $(this).attr('title');
		// $(this).attr('title', $.i18n.prop($(this).attr('title')));
		if($(this).attr('titlekey')){
			// $(this).html($.i18n.prop($(this).attr('placeholderkey')));
			$(this).attr('title', $.i18n.prop($(this).attr('titlekey')));
		}else{
			$(this).attr('titlekey',$(this).attr('title'));
			// $(this).html($.i18n.prop($(this).html()));
			$(this).attr('title', $.i18n.prop($(this).attr('title')));
		}
	});


   var titleElement = $("title");
   titleElement.each(function() {
	   if($(this).attr('key')){
		   $(this).html($.i18n.prop($(this).attr('key')));
	   }else{
		   $(this).attr('key',$(this).html());
		   $(this).html($.i18n.prop($(this).html()));
	   }
   });

};

/**
 * 设置cookie操作
 *
 * @param name
 * @param value
 * @param options
 */
function setCookie(name, value, options) {
	
	options = options || {};
	if (value === null) {
		value = '';
		options.expires = -1;
	}
	var expires = '';
	if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
		var date;
		if (typeof options.expires == 'number') {
			date = new Date();
			date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
		} else {
			date = options.expires;
		}
		expires = '; expires=' + date.toUTCString();
	}
	var path = options.path ? '; path=' + options.path : '';
	var domain = options.domain ? '; domain=' + options.domain : '';
	var s = [ cookie, expires, path, domain, secure ].join('');
	var secure = options.secure ? '; secure' : '';
	var c = [ name, '=', encodeURIComponent(value) ].join('');
	var cookie = [ c, expires, path, domain, secure ].join('')
	document.cookie = cookie;

};

/**
 * 获取cookie操作
 */
function getCookie(name) {
	
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = cookie.substring(name.length + 1);
				break;
			}
		}
	}

	return cookieValue;
	
};

/**
 * 获取浏览器语言类型
 * 
 * @return {string} 浏览器国家语言
 */
function getNavLocales () {

    var navLanguage = (navigator.languages && navigator.languages.length > 0) ? navigator.languages[0]
        : (navigator.language || navigator.userLanguage /* IE */ || 'en');

    navLanguage = navLanguage.toLowerCase();
    navLanguage = navLanguage.replace(/-/,"_");
    if (navLanguage.length > 3) {
        navLanguage = navLanguage.substring(0, 3) + navLanguage.substring(3).toUpperCase();
    }

	return navLanguage;
};

/**
 * 获取当前的语种
 */
function  getCurrentLocales(){

    var t = getCookie('u_locale');

    if (t == null || typeof t == 'undefined' || t == "" || t == "\"\"") {
        t = defaultLocales;
    }
    return t;

};

/**
 * 设置默认的语言环境
 * 1、 先从本地cookie中获取，
 * 2、 再从本地语言环境中获取
 * 3、 如果用于有自己的设置的话，从session中获取
 */
function  setDefaultLocales(settings){

	// 如果1、2、3都不存在，则取默认值
    var navLocales = defaultLocales;
    var serial = 1;

	// 1、 先取用户设置的语种
    var t = getCookie("u_locale");

    // 2、如果存在，则使用该语种
    if (t !== null && typeof t !== 'undefined' && t !== "" && t !== "\"\"") {
        navLocales = t;

	} else {
        // 3、如果不存在，则获取浏览器语言
        t = getNavLocales();
        if (t !== null && typeof t !== 'undefined' && t !== "" && t !== "\"\"") {
            navLocales = t;
        }
    }

	// 4、 如果系统设置的语种存在，需要判断浏览器语种的匹配
	if (settings !== null && typeof settings !== 'undefined' && settings.length > 0) {

		var equal = false;
		for (var i=0,j=settings.length;i<j;i++) {
			if(settings[i] != null && settings[i].value != null && settings[i].value.replace(/-/,"_") == navLocales){
				equal = true;
				serial = settings[i].serial;
				break;
			}
		}

		// 获取浏览器语言后需要与系统语种描述信息匹配，不然无法获取实际的资源信息
		// 5、如果不能匹配，则采用前2位匹配
		if(!equal){

			if (navLocales.length >= 3) {
				navLocales = navLocales.substring(0, 2);
			}

			for (var i=0,j=settings.length;i<j;i++) {

				if(settings[i] != null && settings[i].value != null && (settings[i].value).indexOf(navLocales) >= 0){
					navLocales = settings[i].value;
					serial = settings[i].serial;
					equal = true;
					break;
				}
			}
		}

        // 6、如果采用前两位仍不能匹配，则采用序号为1 的语种 -- delete by yy 20181211
        // update by yy 20181211 添加默认语种字段，此处采用默认语种展示，不采用序号为1的语种了 (//添加容错机制：只有默认语种没有设置时采用序号为1的语种)
        if(!equal){

            for (var i=0,j=settings.length;i<j;i++) {
                if(settings[i] != null && settings[i].i18nDefault != null && settings[i].i18nDefault == "1"){
                    if(settings[i].value != null && settings[i].serial != null) {
                        navLocales = settings[i].value.replace(/-/, "_");
                        serial = settings[i].serial;
                        equal = true;
                        break;
                    }
                }
            }
        }
        // update by yy 20181211 添加默认语种字段，此处采用默认语种展示，不采用序号为1的语种了 (//添加容错机制：只有默认语种没有设置时采用序号为1的语种)
        if(!equal){

            for (var i=0,j=settings.length;i<j;i++) {
            	if(settings[i] != null && settings[i].serial != null && settings[i].serial == serial){
            		if(settings[i].value != null)
                        navLocales = settings[i].value.replace(/-/,"_");
            		break;
            	}
            }
        }

	} else {
		// 4、如果系统设置的语种不存在，则取默认语种--即中文简体
		// 该情况基本不会发生，特殊情况是后台获取超时报错
		// TODO 需要做超时处理
        return false;
	}

	if(navLocales != null && typeof navLocales != 'undefined'){

		navLocales = navLocales.replace(/-/,"_");

		defaultLocales = navLocales;

		// 存到cookie中
		setCookie("u_locale", navLocales, {path:'/'});

		setCookie("locale_serial", serial, {path:'/'});

	} else {
		console.log("not navigator");
		return false;
	}

};


/**
 * 获取serial对应的name属性
 */
function getPropSerial(){

	var serial = getCookie('locale_serial');

	if(serial == "1"){

		return "";
	}else {
		return serial||"";
	}
}

/**
 *  页面执行主入口
 */
function initI18n(subpath) {

    /*
     * 加载页面资源
     */
    loadI18nProperties(subpath);
    /*
	 * 给页面赋值
	 */
	assignmentPage();

};

/**
 *  登录页面的逻辑判断
 *
 *  @param settings 后台查询的语种描述信息
 *
 */
function loginInitI18n(settings) {

    setDefaultLocales(settings);
    /*
     * 加载页面资源
     */
    // loadI18nProperties();
    /*
	 * 给页面赋值
	 */
    // assignmentPage();

};

export {loginInitI18n}