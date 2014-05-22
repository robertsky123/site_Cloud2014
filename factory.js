function copySuccess() {
	//复制图片地址成功后，flash回调函数
	event_do.poptip_output("文件地址复制成功！", "success");
}
(function ($) {//位置固定插件
	var methods = {
		init: function (options) {
			var settings = $.extend({
				'top_gap': 0
			}, options);
			return this.each(function () {
				var _top = $(window).scrollTop();
				if (settings.top_gap) { $(this).hide().stop().animate({ 'top': _top + settings.top_gap - 4 }, 200).show(); }
				else { $(this).stop().animate({ 'top': _top }, 300); }
			});
		}
	};
	$.fn.xjf_posFixed = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('方法 ' + method + ' 不存在');
		}
	};
})(jQuery);

$(document).ready(function () {
	if ($("#manu_act_tools").size()) {
		$("body").delegate("a", "click", function (event) {
			if ($(this).attr("target") != "_blank") {
				event.preventDefault();
			}
		});
	}

	/*弹窗和底部操作栏固定位置*/
	function setBarPos() {
		var win_height = $(window).height();
		var bar_height = $('.bottom_bar').outerHeight();
		$('.bottom_bar').css("top", win_height - bar_height - 4);
	}
	setBarPos();
	$(window).resize(function () {
		setBarPos();
	});
	$(window).scroll(function () {
		var win_height = window.innerHeight || $(window).height();
		var bar_height = $('.bottom_bar').outerHeight();
		var gap = win_height - bar_height;
		/*$('.ui-dialog:visible').not($("#add_page")).xjf_posFixed(); //弹出框位置固定*/
		$('.bottom_bar').xjf_posFixed({ top_gap: gap }); //底部操作栏位置固定
	});

	$(".ak").click(function (e) { e.preventDefault(); $(".tk").fadeIn(1000); })

	//$('.flexslider').flexslider({ animation: "fade", slideshowSpeed: 3000,
	//	animationDuration: 500, pauseOnAction: false, directionNav: false
	//});


	window['event_do'] = {};
	(function (e) {
		if ($("#manu_act_tools").size() >= 1) {
			e.site_domain = Tools.GetSiteDomain(Tools.GetSiteId(window.location));
			e.site_ID=Tools.GetSiteId(window.location);//站点id
			e.custom_html = false; //是否为自定义html的挂件标识
			e.intialed = false; //是否初始化完成富文本框标识
			/*手机版 --判断*/
			e.ifisMobile = parseInt($("#i_hid_hideparam_m").val());
			if (e.ifisMobile == 10) {
				$(".factory_palform").attr("href", "/Content/css/mobileindex.css?v="+window.VERSION);
				/*手机预览弹框*/
				$("#factroymobile-review").dialog({ autoOpen: false, position: 'top', dialogClass: "style-mobile-review", modal: true, width: 381, height: 751, resizable: false,
					close: function (event, ui) {
						$(".js-mobile-review").html("");
					}
				 }); //复用组件库浮框
				$(".close-mobilerw").click(function (event) {
					event.preventDefault();
					$("#factroymobile-review").dialog("close");
					$(".prview").trigger("click");
				});
			}
			/*手机版 --判断end*/
		}
		e.poptip_output = function (info, outstate, refresh) {//操作结果提示框
			var poptip_bx = $("#processTip").find('.pro_wrap');
			if (outstate == "success") {
				poptip_bx.find(".text").text(info);
				if (refresh == true) {
					poptip_bx.attr("class", "pro_wrap pro_success").show(0, function () {
						window.location.reload();
					});
				}
				else {
					poptip_bx.attr("class", "pro_wrap pro_success").show().delay(2000).fadeOut();
				}
			}
			else if (outstate == "fail") {
				poptip_bx.find(".text").text(info);
				poptip_bx.attr("class", "pro_wrap pro_warning").show().delay(2000).fadeOut();
			}
			else if (outstate == "loading") {
				poptip_bx.find(".text").text(info);
				poptip_bx.attr("class", "pro_wrap pro_loading").show();
			}
		};
		$("#manu_tools").remove(); /*删除原始制作工具*/
		/*加载全局样式表*/
		if ($("#manu_act_tools").size() >= 1) {
			var glnow_style = Tools.GetGlobalStyle(Tools.GetSiteId(window.location));
			var repl_domain = new RegExp("/Content/image/", "g");
			glnow_style = glnow_style.replace(repl_domain, e.site_domain + "/Content/image/");
			var str = '<style type="text/css" class="global_style_sheet">' + glnow_style + '</style>';
			$('body').prepend(str);
		}

		e.state = "mading"; /*默认制作模式*/
		/*判断是签出还是签入模式*/
		e.make_page_model = function () {
			var tmp = window.location.search.split('=');
			if (tmp.length == 5) {
				var pagecode = Tools.GetObjPageName(window.location);
				var site_id = Tools.GetSiteId(window.location);
				var checkout = Tools.IsCheckOutPage(site_id, pagecode);
				if (!checkout) {
					$(".factory").attr('href', '');
					$('.act_bar').hide();
					e.readermodel = 1;
					$('.for_create').css("visibility", "visible");
				}
				else {
					$('.for_create').css("visibility", "visible");
					$('#manu_act_tools').css("visibility", "visible");
				}
			}
		};
		e.make_page_model();
		/*模块拖拽放入*/
		e.model_draggble = function () {
			$(".model").each(function () {
				var data_bind = $(this).data("drag");
				if (!data_bind) {
					if($(this).parents(".for_create").size()==0&&$(this).parent(".subframe_cell").size()==0){//非场景和非子框架弹框中
						$(this).draggable({
							addClasses: false,
							revert: "invalid",
							helper: "clone",
							cursor: "move",
							start: function (event, ui) {
								ui.helper.addClass('drag_heper');
								ui.helper.attr("id", $(this).attr("id"));
								e.drag_target = $(this); //图片库的操作
								e.drag_parent = e.drag_target.parents("p.image");
								if (e.drag_parent.size()) {
									e.origin_img = e.drag_target.find("img").attr("data-orig");
								}
								e.drag_flsh_parent = e.drag_target.parents("div.image"); //flash库的操作
							},
							zIndex: 120
						});
						$(this).data("drag", "dragged");
					}
				}
			});
		};
		/*子框架拖拽放入*/
		e.subframe_draggble=function(){
			$("#factory-addframe").find(".framemodel").each(function () {
				var data_bind = $(this).data("drag");
				if (!data_bind) {
					$(this).draggable({
						addClasses: false,
						revert: "invalid",
						helper: "clone",
						cursor: "move",
						start: function (event, ui) {
							ui.helper.addClass('drag_heper').css({width:200,height:50});
							e.drag_target=$(this);
							e.drag_parent =$(this).parent(".subframe_cell");
						},
						zIndex: 120
					});
					$(this).data("drag", "dragged");
				}
			});
		};
		//e.model_draggble(); /*初始化模块拖拽*/
		e.droppable = function () {
			$(".for_create .droppable").each(function () {
				var data_dragto = $(this).data("drop");
				if (!data_dragto) {
					$(this).sortable({
						 appendTo: document.body,
						connectWith: '.droppable',
						cursor: 'pointer',
						items:".model,.framemodel",
						 helper: "clone",
						sort: function( event, ui ) {
							$(".model_bar").hide();//隐藏组件配置栏
							$(".sgbar_wrap").hide();//隐藏布局栏操作
						}
					}).droppable({
						greedy: true,
						tolerance: 'pointer',
						accept: ".model:not(.for_create .model)",
						hoverClass: "ui-action",
						addClasses: false,
						drop: function (event, ui) {
							$(".ui-action").removeClass("ui-action");//结局父级框架hoverClass不删除的问题
							var cloneOne=ui.draggable.clone(false,false);//克隆一份放入场景中
							cloneOne.appendTo(this);
							if(e.drag_parent.hasClass("subframe_cell")){//拖放子框架
								cloneOne.removeClass("model");
								//e.subframe_draggble();
								e.droppable();
								e.w_resize();//编辑布局单元功能
								e.actsForSubFrame();
							}
							else{//拖放组件
								if (e.drag_parent.size()) {//从图片库拖出图片
									cloneOne.find("img").attr("src", e.origin_img);
									//e.model_draggble();
								}
								else if (e.drag_flsh_parent.size()) { //从Flash库拖出flash
									//e.model_draggble();
								}
								else if (e.drag_target.hasClass("AdverCouplet") || e.drag_target.hasClass("TalkApp")) {//轮播挂件，在线咨询
									$(".for_create").append(e.drag_target);
								}
								e.model_edit();
								$(".models_wrapper .steps").find(".model").remove();
								//关闭全局组件弹框，清除生成组件
								$("#shared_models").dialog('close');
								$("#shared_models").find(".model").remove();
								
								$("#copwiget_lib_pop .comds_wrap").find(".model").remove();
								$("#model_story").dialog('close');
								$("#copwiget_lib_pop").dialog('close');
								$(".steps").animate({
									marginLeft: 0
								}, { duration: 500, easing: "easeOutQuad" });
								$("#shared_models").find('.comds_wrap').animate({
									marginLeft: 0
								}, { duration: 500, easing: "easeOutQuad" });
							}
						}
					});
					
					//添加布局单元框架线
					if($(this).find(".factoryframe").size()==0){
						$(this).append('<div class="factoryframe js-pubremove"><div class="factoryframe_t"></div><div class="factoryframe_r"></div><div class="factoryframe_b"></div><div class="factoryframe_l"></div></div>');
					}
					
					$(this).data("drop", "droppable");
				}
			});
		}
		e.droppable(); /*初始可放入容器*/

		/*底部操作栏*/
		e.preview_show_action=function (event) {//点击预览
			event.preventDefault();
			$(".factory").attr('href', '');
			$(window).scrollTop(0);
			$(".ui-dialog-content").dialog('close');
			e.state = "previewing"; /*预览模式模式*/
			$(".shulter_layer").show();
			$(".bottom_bar").addClass("patial_disable");
			if ($(".for_create").hasClass("set_width")) {
				$(".for_create").removeClass("set_width");
			}
			if ($("body").hasClass("framemodel_set")) {
				$("body").removeClass("framemodel_set");
			}
			$(".for_create .droppable").sortable("disable");
			//$(this).text("继续制作");
			e.editing_structure = false;
			$(".edit_col_width").text("编辑框架");
			$(".js-faceditcol-acts").hide();
			if (e.ifisMobile == 10) {
				$("#factroymobile-review").dialog("open");
				$(".js-mobile-review").html($(".for_create").html());
			}
		};
		e.preview_hide_action= function (event) {//再次点击预览
			event.preventDefault();
			$(".factory").attr('href', '/Content/css/factory.css?v='+window.VERSION);
			e.state = "mading";
			$(".shulter_layer").hide();
			$(".bottom_bar").removeClass("patial_disable");
			e.editing_structure = false;
			$(".for_create .droppable").sortable("enable");
			//$(this).text("预览");
		};
		$(".prview").toggle(e.preview_show_action,e.preview_hide_action);
		/*显示隐藏宽度编辑按钮*/
		$(".edit_col_width").click(
            function (event) {
            	event.preventDefault();
            	if ($(".for_create").hasClass("set_width")) {
					$("body").removeClass("framemodel_set");
            		$(".for_create").removeClass("set_width");
            		$(".zoom_mover").css("visibility", "visible");
					$(".js-faceditcol-acts").hide();//隐藏子操作栏
					$(".factory-addframe").dialog("close");
            		$(this).text("编辑框架");
            		e.editing_structure = false;
            	}
            	else {
            		e.editing_structure = true;		
            		$("body").addClass("framemodel_set");
            		$(".for_create").addClass("set_width");
            		$(".zoom_mover").css("visibility", "hidden");
					$(".js-faceditcol-acts").show();//显示子操作栏
            		$(this).text("取消编辑");
            	}
            }
        );

		$("#model_story").dialog({
			autoOpen: false, position: 'top', width: 600,
			close: function (event, ui) { if ($(".models_wrapper .steps").css("marginLeft") == "-1140px" && $(".models_wrapper .steps").find(".model").size() == 1) { $(".re_choose").trigger("click"); } }
		});

		e.add_mod_action=function (event) {//模块列表展示
			event.preventDefault();
			var items = [];
			var model_dataSource = Tools.GetClassifyList();
			var model_lsits = model_dataSource.Data;
			if (model_lsits.length == 0) {
				var site_id = Tools.GetSiteId(window.location);
				var chos_model_url;
				if (e.ifisMobile == 10) {
					chos_model_url = "/Mobile/Chooseapp?siteId=" + site_id + "&taskId=" + window.location.search.split('&')[1].split('=')[1];
				}
				else{
					chos_model_url = "/Home/Chooseapp?siteId=" + site_id + "&taskId=" + window.location.search.split('&')[1].split('=')[1];
				}
				var chos_model_link = '<p class="cho_tip1"><span class="grey_ctip">没有选择挂件，请到“应用系统选择”页面</span><a target="_blank" href="' + chos_model_url + '" class="chose_model_tip" >选择需要的的挂件</a></p>';
				$('.step_1').find(".cate_bx").html(chos_model_link);
			}
			else {
				$.each(model_lsits, function (key, val) {
					var cohd_title = val['Name'];
					var mod_list = val['WidgetList'];
					var a_list = [];
					$.each(mod_list, function (mkey, mval) {
						a_list.push('<a href="#" data-thumber="/content/widgetIcon/'+mval["WidgetImage"]+'" class="choose_link" title="' + mval["Code"] + '">' + mval["Name"] + '</a>');
					});
					var models_list = '<div class="cho_bd">' + a_list.join('') + '</div>';
					var list_cell = '<li class="cholink_list"><div class="cho_hd"><h2 class="chcate_title">' + cohd_title + '</h2><span href="" class="toggle_chcate up_arrow"></span></div>' + models_list + '</li>';
					items.push(list_cell);
				});
				var widget_navi = [];
				widget_navi.push('<a href="#" data-thumber="/content/images/thumb_image1.jpg" class="choose_link" title="htmlwidget1">html挂件1</a>'); //自定义
				var common_widget = '<li class="cholink_list"><div class="cho_hd"><h2 class="chcate_title">自定义Html</h2><span href="" class="toggle_chcate up_arrow"></span></div><div class="cho_bd">' + widget_navi.join('') + '</div></li>';

				items.push(common_widget); common_widget = null; widget_navi = null;

				var lists_all = '<ul class="cholink_lists">' + items.join('') + '</ul>';
				$('.step_1').find(".cate_bx").html(lists_all);
				lists_all = null;
				e.create_model();
				e.cate_bx_toggle();
			}
			$(".steps").css({ marginLeft: 0 });
			$("#model_story").dialog({ title: "组件库" }); //返回组件选择界面
			$("#model_story").dialog('open');
			$(".ui-dialog-content").not($("#model_story")).dialog('close');
		};
		$(".add_mod").click(e.add_mod_action);

		e.cate_bx_toggle = function () {//模块列表的展开收起
			$(".cate_bx").find(".cho_hd").click(function () {
				var next_sib = $(this).next();
				var toggle_cate = $(this).find(".toggle_chcate");
				if (next_sib.is(":visible")) {
					next_sib.hide();
					toggle_cate.removeClass("up_arrow");
				}
				else {
					next_sib.show();
					toggle_cate.addClass("up_arrow");
				}
			});
		};

		e.model_edit = function () {//模块编辑栏
			$(".model").each(function () {
				var model_edate = $(this).data("edate");
				if (!model_edate) {
					$(this).data("edate", "bar_bind");
					var target = $(this);
					var edit_bar = $(".model_bar");
					$(this).bind("mouseover.show_bar", function (event) {
						$(".bar_hover").removeClass("bar_hover");
						target.addClass("bar_hover");
						var mod_width = target.width();
						var offset = target.offset();
						if (target.hasClass("AdverCouplet")) {//如果是对联挂件
							offset = target.find(".coupletLbox").offset();
						}
						var offset_x = offset.left, offset_y = offset.top;
						var window_with = $(window).width();
						if (e.state == "mading") {
							if (target.hasClass("custom_html_model")) {//自定义挂件
								edit_bar.find(".search_btn,.c_para,.factcopy_model").hide();
								edit_bar.find(".edit_cushtml").show();
								if (offset_x + 120 > window_with) {
									offset_x = offset_x + mod_width - 120;
								}
								edit_bar.css({ "width": 120, "left": offset_x, "top": offset_y }).show();
							}
							else if (target.hasClass("static_file")) {
								edit_bar.find(".c_para").show();
								edit_bar.find(".search_btn").hide();
								edit_bar.find(".edit_cushtml,.factcopy_model").hide();
								if (offset_x + 120 > window_with) {
									offset_x = offset_x + mod_width - 120;
								}
								edit_bar.css({ "width": 120, "left": offset_x, "top": offset_y }).show();
							}
							else if (!(target.hasClass("custom_html_model") || target.hasClass("static_file")) && target.data("global") == 1) {
								edit_bar.find(".search_btn,.c_para").show();
								edit_bar.find(".edit_cushtml,.factcopy_model").hide();
								if (offset_x + 180 > window_with) {
									offset_x = offset_x + mod_width - 180;
								}
								if (target.hasClass("LanguageSelect") || target.hasClass("BasicSharing")) {//多语言选择组件
									offset_y = offset_y - 20;
								}
								if (target.hasClass("ProductDetail")) {//放大镜
									offset_x = offset_x + mod_width - 180;
								}
								if ($(this).hasClass("Weibo_sina") || $(this).hasClass("Weibo_tencet model")) {
									$(this).addClass("for_unable_dragelement");
								}
								edit_bar.css({ "width": 180, "left": offset_x, "top": offset_y }).show();
							}
							else {
								edit_bar.find(".search_btn,.c_para,.factcopy_model").show();
								edit_bar.find(".edit_cushtml").hide();
								if (offset_x + 240 > window_with) {
									offset_x = offset_x + mod_width - 240;
								}
								if (target.hasClass("LanguageSelect") || target.hasClass("BasicSharing")) {//多语言选择组件
									offset_y = offset_y - 20;
								}
								if (target.hasClass("ProductDetail")) {//放大镜
									offset_x = offset_x + mod_width - 240;
								}
								if ($(this).hasClass("Weibo_sina") || $(this).hasClass("Weibo_tencet model")) {
									$(this).addClass("for_unable_dragelement");
								}
								edit_bar.css({ "width": 240, "left": offset_x, "top": offset_y }).show();
							}
						}

					});
					$(this).bind("mouseleave.show_bar", function (event) {
						edit_bar.hide();
						$(this).removeClass("for_unable_dragelement");
					});
				}
			});
		};
		e.model_edit();
		$("#edit_img_style").dialog({ autoOpen: false, position: 'top', width: 370 }); //图片库样式框
		$("#edit_img_para").dialog({ autoOpen: false, position: 'top', width: 370 }); //图片库参数框
		$("#images_library").dialog({ autoOpen: false, position: ['left', 'top'], width: 620 }); //图片库浮框
		$("#shared_models").dialog({ autoOpen: false, position: 'top', width: 500 }); //共用组件库浮框
		$("#edit_custom_html").dialog({ autoOpen: false, position: 'top', width: 600 });
		e.deletgbmd = function () { //删除共用组件
			$("#shared_models").find('.shmd_delete').each(function () {
				var bindclick = $(this).data('bindclick');
				if (!bindclick) {
					$(this).click(function (event) {
						event.preventDefault();
						var alias = $(this).attr('data-alias'); //挂件别名
						var siteId = Tools.GetSiteId(window.location);
						var ifdelete = Tools.DeleteGlobalWidgetList(siteId, alias);
						if (ifdelete != -2) { //已经删除成功
							$(this).parent('.smd_cell').hide().remove();
						}
					});
					$(this).data('bindclick', 'bindclick');
				}
			});
		};
		e.renameglb = function () { //重命名全局变量
			$("#shared_models").find('.shmd_rename').each(function () {
				var bindclick = $(this).data('bindclick');
				if (!bindclick) {
					$(this).click(function (event) {
						event.preventDefault();
						var par_cell = $(this).parent('.smd_cell');
						if (!par_cell.hasClass("smd_cell_rename")) {
							par_cell.addClass("smd_cell_rename");
							var chosdmd_txt = par_cell.find('.chosdmd').text();
							par_cell.find('.rename_input').val(chosdmd_txt).trigger("focus");
						}
					});
					$(this).data('bindclick', 'bindclick');
				}
			});

			$("#shared_models").find('.rename_input').each(function () {//重命名输入框的操作
				var bindblur = $(this).data('bindblur');
				if (!bindblur) {
					$(this).blur(function (event) {
						event.preventDefault();
						var par_cell = $(this).parent('.smd_cell');
						if (par_cell.hasClass("smd_cell_rename")) {
							var rename_txt = $(this).val();
							var chosdmd = par_cell.find('.chosdmd');
							var alias = chosdmd.attr('data-alias');
							var siteId = Tools.GetSiteId(window.location);
							Tools.RenameGlobalWidgetList(siteId, alias, rename_txt);
							chosdmd.text(rename_txt);
							par_cell.removeClass("smd_cell_rename");
						}
					});
					$(this).data('bindblur', 'bindblur');
				}
			});
		};
		/*e.ajax_refreshers = $('[data-global=1]').size() + $('[data-wiget-type]:not([data-global=1])').size(); //需要重新ajax加载的挂件的数目
		e.ajax_counter = 0; //预加载计数器
		if (e.ajax_refreshers > 0) {
		$('body').prepend('<div class="loading_bgoverlay" style="position: fixed; top: 0pt; width: 100%; bottom: 0pt; background:url(/Content/images/big_preloader.gif) center 100px no-repeat #000; z-index: 1000;filter:alpha(opacity=50);opacity: 0.5;"></div>'); //页面初始时加上加载遮罩
		}
		e.replace_glbmd = function () { //页面加载完成是替换全局挂件，是全局挂件保持最新结构
		var siteId = Tools.GetSiteId(window.location);
		$('[data-global=1]').each(function () {
		var alias = $(this).attr('id'); //挂件别名
		var wigetcode = $(this).attr('title'); //挂件原名
		var warecod = $(this).attr('data-warecode'); //应用名称
		var globljson = Tools.GetGlobalWidgetHtml(siteId, warecod, wigetcode, alias);
		var orihtml = globljson.html;
		var style = '<style type="text/css" class="style_sheet">' + globljson.style + '</style>';
		$(".para_temp").html(orihtml); //临时存储新的结构
		var new_model = $(".para_temp").find(".model");
		new_model.attr('id', alias);
		new_model.attr('title', wigetcode);
		new_model.attr('data-warecode', warecod);
		new_model.attr('data-global', 1);
		new_model.prepend(style);
		$(this).replaceWith(new_model);
		++e.ajax_counter;
		if (e.ajax_refreshers > 0) {
		if (e.ajax_counter == e.ajax_refreshers) {
		$('.loading_bgoverlay').remove();
		}
		}
		});
		e.model_edit();
		e.model_draggble();
		};
		e.replace_glbmd();*/

		e.replace_animodel = function () { //页面加载完成是替换带动画效果的挂件
			var siteId = Tools.GetSiteId(window.location);
			if($('[data-wiget-type]').size()==0){//如果没有动画挂件直接跳出
				return;
			}
			$('[data-wiget-type]').each(function () {
				var c_m_name = $(this).attr("title"); //挂件原名
				var model_name = $(this).attr("id"); //挂件别名
				var ware_code = $(this).attr("data-warecode"); //应用系统名称
				var ifglobe = parseInt($($(this)).attr("data-global")); //全局标识的值
				var new_model = Tools.GetPageHtml(ware_code, c_m_name, Tools.GetSiteId(window.location), model_name); //_setobj.data 改成aliascode
				$(".para_temp").html(new_model); //临时存储新的结构
				var new_model = $(".para_temp").find(".model");
				new_model.find(".style_sheet").remove();
				var style_copy = $(this).find(".style_sheet").clone();
				style_copy.prependTo(new_model);
				new_model.attr("id", model_name);
				var para_ch = $(this).attr("date-parach");
				new_model.attr("date-paraCh", para_ch);
				new_model.attr("data-warecode", ware_code);
				new_model.attr("data-global", ifglobe);
				$(this).replaceWith(new_model);
				$(".para_bx").html("");
				++e.ajax_counter;
				if (e.ajax_refreshers > 0) {
					if (e.ajax_counter == e.ajax_refreshers) {
						$('.loading_bgoverlay').remove();
					}
				}
			});
			aniInitObj.aniWigetInit();
			e.model_edit();
			e.model_draggble();
		};
		if ($("#manu_act_tools").size()) {
			e.replace_animodel();
		}
		e.chosegbmd = function () { //选择全局挂件
			$("#shared_models").find('.chosdmd').each(function () {
				var bindclick = $(this).data('bindclick');
				if (!bindclick) {
					$(this).click(function (event) {
						event.preventDefault();
						var alias = $(this).attr('data-alias'); //挂件别名
						var wigetcode = $(this).attr('data-wigetcode'); //挂件原名
						var warecod = $(this).attr('data-warecode'); //应用名称
						var wigetType = $(this).attr('data-wigettype'); //挂件类型
						var siteId = Tools.GetSiteId(window.location);
						if ($('#' + alias).size()) {
							e.poptip_output("当前页面已存在此全局挂件", "fail");
							return;
						}
						$(this).addClass("loading_goble_mdhtml");
						var globljson = Tools.GetGlobalWidgetHtml(siteId, warecod, wigetcode, alias);
						$(this).removeClass("loading_goble_mdhtml");
						$("#shared_models").find('.comds_wrap').animate({
							marginLeft: -470
						}, { duration: 500, easing: "easeOutQuad" });
						$("#shared_models")[0].scrollTop = 0;
						var orihtml = globljson.html;
						if (wigetType == 3 || wigetType == 2 || wigetType == -12) {
							var nowmod_style = globljson.style;
							var rep_domain = new RegExp("/Content/image/", "g");
							nowmod_style = nowmod_style.replace(rep_domain, e.site_domain + "/Content/image/");
							var style = '<style type="text/css" class="style_sheet">' + nowmod_style + '</style>';
							$(".para_temp").html(orihtml); //临时存储新的结构
							var new_model = $(".para_temp").find(".model");
							new_model.attr('id', alias);
							new_model.attr('title', wigetcode);
							new_model.attr('data-warecode', warecod);
							new_model.attr('data-global', 1);
							new_model.prepend(style);
							$("#shared_models").find('.sharemd_html').html($(".para_temp").html());
							$(".para_temp").html("");
							aniInitObj.aniWigetInit(); //初始化挂件脚本动画
						}
						else if (wigetType == 1 || wigetType == -11) {//自定义html
							var now_html_str = globljson.style;
							var rep_domain = new RegExp("/Content/image/", "g");
							now_html_str = now_html_str.replace(rep_domain, e.site_domain + "/Content/image/");
							var str = '<div class="model custom_html_model bar_hover" data-global="1"  id="' + alias + '">' + now_html_str + '</div>';
							$("#shared_models").find('.sharemd_html').html(str);
						}
						e.model_edit();
						e.model_draggble();
						$('#shared_models').find('.back_choose').click(function (event) {//重新选择全局挂件
							event.preventDefault();
							$("#shared_models").find('.comds_wrap').animate({
								marginLeft: 0
							}, { duration: 500, easing: "easeOutQuad" });
							$("#shared_models").find('.sharemd_html').html(''); //清空sharemd_html
						});
					});
					$(this).data('bindclick', 'bindclick');
				}
			});
		};

		e.add_sharmd_action=function (event) {//共用组件库浮框
			event.preventDefault();
			if (!$("#shared_models").is(":visible")) {
				var siteId = Tools.GetSiteId(window.location);
				var shamd_array = Tools.GetGlobalWidgetList(siteId)
				var html_array = [];
				if (shamd_array.length) {
					$("#shared_models .back_choose").show();
					var arlength = shamd_array.length;
					for (var i = 0; i < arlength; i++) {
						var obj = shamd_array[i];
						var list_cell = '<div class="smd_cell clearfix"><a href="#" class="fl chosdmd" data-alias="' + obj.AliasCode + '" data-warecode="' + obj.WareCode + '" data-wigettype="' + obj.Type + '" data-wigetcode="' + obj.WidgetCode + '">' + obj.ShowName + '</a><input type="text" name="rename_input" class="rename_input fl" /><a href="#" class="fr shmd_rename">重命名</a><a href="#" class="fr shmd_delete" data-alias="' + obj.AliasCode + '">删除</a></div>'
						html_array.push(list_cell);
					}
					var shlists = html_array.join('');
					$('#shared_models').find('.sharedmd_lists').html(shlists);
					e.deletgbmd();
					e.renameglb();
					e.chosegbmd();
					$("#shared_models").find(".smd_cell").hover(function () {
						$(this).addClass('smd_cell_hover');
					},
                function () {
                	$(this).removeClass('smd_cell_hover');
                }
              );
					$("#shared_models").dialog('open');
					$(".ui-dialog-content").not($("#shared_models")).dialog('close');
				}
				else {
					$("#shared_models .back_choose").hide();
					$("#shared_models").dialog('open');
					$(".ui-dialog-content").not($("#shared_models")).dialog('close');
					$('#shared_models').find('.sharedmd_lists').html('<p class="smd_tip" style="color:#888;">暂时没有共用挂件</p>');
				}

			}
		};
		$(".add_shared_md").click(e.add_sharmd_action);

		e.totalcount = 0; //总共资源数目
		e.count_perpage = 10; //每页多少条
		e.pagegation_state_new = true;
		e.getImgLists = function (siteId, pageIndex) { //获取图片资源文件列表
			if (!e.Search_state) {
				var type = $(".add_img_lb").data("type");
				var objfile = Tools.SearchFile(siteId, 0, type, "", pageIndex);
				var image_lists = objfile.list;
				e.totalcount = objfile.total;
			}
			else {
				var type = e.source_type;
				var catolog = e.source_catalog; //分类
				var keyname = e.source_keyname; //关键字
				var objfile = Tools.SearchFile(siteId, catolog, type, keyname, pageIndex);
				var image_lists = objfile.list;
				e.totalcount = objfile.total;
			}
			if (image_lists) {
				var items = [];
				$.each(image_lists, function (index, val) {
					items.push(
                 '<li><p class="image"><a class="delete_img lig_blu" data-fid="' + val["FileId"] + '" href="">删除</a><a id="" class="model static_file" href="javascript:void(0)"><img alt="' + val["Title"] + '" data-orig="' + val["FileUrl"] + '" data-source="' + val["SourceUrl"] + '" alt="" src="' + val["ThumbUrl"] + '"></a></p><div class="image-detail"><div class="clip_src_btn fl"><span data-orig="' + val["FileUrl"] + '" id="' + 'rep_imgfl_btn_' + val["FileId"] + '" class="rep_flash_btn"></span></div><span class="imglib_text">' + val["Name"] + '</span></div></li>'
                );
				});
				var imglists = $('<ul/>', {
					'id': 'list_content',
					'class': 'image-list clearfix',
					html: items.join('')
				});

				var obj = [];
				obj[0] = imglists;
				obj[1] = 1;
				return obj;
			}
			else {
				var site_id = Tools.GetSiteId(window.location);
				var chos_source_url = "/Home/Pagefile?siteId=" + site_id;
				var chos_source_link = '<p class="cho_tip1"><span class="grey_ctip">当前条件下没有可选图片，请到“资源文件管理”页面</span><a target="_blank" href="' + chos_source_url + '" class="chose_model_tip" >上传所需要的图片</a></p>';
				var obj = [];
				obj[0] = chos_source_link;
				obj[1] = 0;
				return obj;
			}
		};
		e.getImagesbx = function (pageIndex) {
			if (pageIndex == undefined) {
				pageIndex = 0;
			}
			var siteId = Tools.GetSiteId(window.location);
			var imglists = e.getImgLists(siteId, pageIndex + 1);
			if (imglists[1]) {
				$("#images_library .library_wrap").html(imglists[0]);
				e.model_draggble();
				if (e.pagegation_state_new) {
					e.paganation_filelis();
					e.pagegation_state_new = false;
				}
			}
			else {
				$("#images_library .library_wrap").html(imglists[0]);
				$(".factorydata_page_nav").html("");
			}
			$("#images_library").find('.rep_flash_btn').each(function () {
				var copyCon = $(this).attr("data-orig");
				var flashvars = {
					content: encodeURIComponent(copyCon),
					uri: '/content/images/clip_imgsrc.png'
				};
				var rep_id = $(this).attr("id");
				var params = {
					wmode: "transparent",
					allowScriptAccess: "always"
				};
				swfobject.embedSWF("/content/swf/clipboard.swf", rep_id, "14", "15", "9.0.0", null, flashvars, params);

			});
			return false;
		};

		e.paganation_filelis = function () {//分页
			if (e.source_type == $(".add_img_lb").data("type")) {
				$(".factorydata_page_nav").pagination(e.totalcount, {
					prev_text: '上一页',
					next_text: '下一页',
					num_display_entries: 5,
					current_page: 0,
					items_per_page: e.count_perpage,
					num_edge_entries: 2,
					show_if_single_page: true,
					load_first_page: false,
					callback: e.getImagesbx
				});
			}
			else if (e.source_type == $(".add_flash_lb").data("type")) {
				$(".factorydata_page_nav").pagination(e.totalcount, {
					prev_text: '上一页',
					next_text: '下一页',
					num_display_entries: 5,
					current_page: 0,
					items_per_page: e.count_perpage,
					num_edge_entries: 2,
					show_if_single_page: true,
					load_first_page: false,
					callback: e.getFlashbx
				});
			}
		};

		e.getImagecatselect = function (element) {//列出文件夹下拉菜单
			var site_id = Tools.GetSiteId(window.location);
			var opt_obj = [];
			opt_obj = Tools.ListCatalog(site_id, e.source_type);
			opt_obj.unshift({ "ClassifyId": 0, "Name": "全部" });
			element.html("");
			element.setTemplateElement("select_opt_tmp");
			element.processTemplate(opt_obj);
		};
		if ($("#manu_act_tools").size()) {
			$(".js-catalog_search").click(function (event) {
				event.preventDefault();
				e.Search_state = true;
				e.pagegation_state_new = true;
				var parentbx = $(this).parents(".search_bx");
				e.source_catalog = parentbx.find(".source_cata_select").val();
				e.source_type = $(this).data("type");
				e.source_keyname = parentbx.find(".user_keyname").val();
				if ($(this).data("style") == 1) {
					e.getImagesbx();
				}
				else if ($(this).data("style") == 2) {
					e.getFlashbx();
				}
			});
		}

		e.add_imglib_action=function (event) {//站点图片库展示
			event.preventDefault();
			e.Search_state = false;
			e.source_type = $(this).data("type");
			e.pagegation_state_new = true;
			e.getImagesbx();
			e.getImagecatselect($("#images_library").find(".source_cata_select"));
			$("#images_library").dialog('open');
			/*$(".ui-dialog-content").not($("#images_library")).dialog('close');*/
		};
		$(".add_img_lb").click(e.add_imglib_action);

		/*flash库操作*/
		$("#flashes_library").dialog({ autoOpen: false, position: ['left', 'top'], width: 620 }); //flash库弹框
		e.getflashLists = function (siteId, pageIndex) { //获取flash文件列表
			if (!e.Search_state) {
				var type = $(".add_flash_lb").data("type");
				var objfile = Tools.SearchFile(siteId, 0, type, "", pageIndex);
				var flash_lists = objfile.list;
				e.totalcount = objfile.total;
			}
			else {
				var type = e.source_type;
				var catolog = e.source_catalog; //分类
				var keyname = e.source_keyname; //关键字
				var objfile = Tools.SearchFile(siteId, catolog, type, keyname, pageIndex);
				var flash_lists = objfile.list;
				e.totalcount = objfile.total;
			}
			if (flash_lists) {
				var items = [];
				$.each(flash_lists, function (index, val) {
					items.push(
                 '<li><div class="image"><div id="" class="model for_flash_drager static_file"><embed plugspace="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" wmode="transparent" quality="autohigh" align="TL" src="' + val["FileUrl"] + '" /></div></div><div class="image-detail"><div class="clip_src_btn fl"><span data-orig="' + val["FileUrl"] + '" id="' + 'rep_flashfl_btn_' + val["FileId"] + '" class="rep_flash_btn"></span></div><span class="imglib_text">' + val["Name"] + '</span></div></li>'
                );
				});
				var flashlists = $('<ul/>', {
					'id': 'list_content',
					'class': 'image-list clearfix',
					html: items.join('')
				});
				var obj = [];
				obj[0] = flashlists;
				obj[1] = 1;
				return obj;
			}
			else {
				var site_id = Tools.GetSiteId(window.location);
				var chos_source_url = "/Home/Pagefile?siteId=" + site_id;
				var chos_source_link = '<p class="cho_tip1"><span class="grey_ctip">当前条件下没有可选flash，请到“资源文件管理”页面</span><a target="_blank" href="' + chos_source_url + '" class="chose_model_tip" >上传所需要的flash</a></p>';
				var obj = [];
				obj[0] = chos_source_link;
				obj[1] = 0;
				return obj;
			}
		};
		e.getFlashbx = function (pageIndex) {
			if (pageIndex == undefined) {
				pageIndex = 0;
			}
			var siteId = Tools.GetSiteId(window.location);
			var flashlists = e.getflashLists(siteId, pageIndex + 1);
			if (flashlists[1]) {
				$("#flashes_library .library_wrap").html(flashlists[0]);
				e.model_draggble();
				if (e.pagegation_state_new) {
					e.paganation_filelis();
					e.pagegation_state_new = false;
				}
			}
			else {
				$("#flashes_library .library_wrap").html(flashlists[0]);
				$(".factorydata_page_nav").html("");
			}
			$("#flashes_library").find('.rep_flash_btn').each(function () {
				var copyCon = $(this).attr("data-orig");
				var flashvars = {
					content: encodeURIComponent(copyCon),
					uri: '/content/images/clip_imgsrc.png'
				};
				var rep_id = $(this).attr("id");
				var params = {
					wmode: "transparent",
					allowScriptAccess: "always"
				};
				swfobject.embedSWF("/content/swf/clipboard.swf", rep_id, "14", "15", "9.0.0", null, flashvars, params);

			});
			return false;
		};

		e.add_flashlb_action=function (event) {//站点flash库展示
			event.preventDefault();
			e.Search_state = false;
			e.source_type = $(this).data("type");
			e.pagegation_state_new = true;
			e.getFlashbx();
			e.getImagecatselect($("#flashes_library").find(".source_cata_select"));
			$("#flashes_library").dialog('open');
			/*$(".ui-dialog-content").not($("#images_library")).dialog('close');*/

		};
		$(".add_flash_lb").click(e.add_flashlb_action);

		/*编辑全局样式相关操作*/
		$("#global_stysheet_editor").dialog({ autoOpen: false, position: ['left', 'top'], width: 500 }); //初始添加布局栏编辑框
		
		e.editor_gloabl_sheet=function (event) {//编辑全局样式函数
			event.preventDefault();
			if (!e.codem_globe_style) {
				var box = $("#globle_style_inputbox")[0];
				e.codem_globe_style = CodeMirror(box, {
					value: "",
					mode: "css",
					lineNumbers: true
				});
				var cssCompletion = new CodeCompletion(e.codem_globe_style, new CssCompletion());
				e.codem_globe_style.setOption("onKeyEvent", function (cm, e) {
					return cssCompletion.handleKeyEvent(cm, e);
				});
				/*初始化文本搜索功能*/
				$(".js-gbprev").click(function(){//上一个
					e.codem_globe_style.findPrev($(".js-gbstxt").val(), {'ignoreCase':false,'regexp':false});
				});
				$(".js-gbnext").click(function(){//下一个
					e.codem_globe_style.findNext($(".js-gbstxt").val(), {'ignoreCase':false,'regexp':false});
				});
				$(".js-gbrplall").click(function(){//全部
					e.codem_globe_style.replaceAll($(".js-gbstxt").val(),$(".js-gbrptxt").val(),{'ignoreCase':false,'regexp':false});
				});
			}
			$("#global_stysheet_editor").dialog('open');
			/*$(".ui-dialog-content").not($("#global_stysheet_editor")).dialog('close');*/
			var glnow_style = Tools.GetGlobalStyle(Tools.GetSiteId(window.location));
			var repl_domain = new RegExp("/Content/image/", "g");
			var now_gbstyle = glnow_style.replace(repl_domain, e.site_domain + "/Content/image/");
			e.codem_globe_style.setValue($.format(now_gbstyle, { method: 'css' }));//格式化html和css
			//$("#glb_sheet_content").val(now_gbstyle);
		};

		$(".edit_global_sheet").click(e.editor_gloabl_sheet);

		$("#global_stysheet_editor .save_btn").click(function (event) {//保存全局样式表
			event.preventDefault();
			//var gbstyle = $("#glb_sheet_content").val();
			var gbstyle = e.codem_globe_style.getValue();
			$('.global_style_sheet').replaceWith('<style type="text/css" class="global_style_sheet">' + gbstyle + '</style>');
			var site_id = Tools.GetSiteId(window.location);
			var rep_domain = new RegExp(e.site_domain + "/Content/image/", "g");
			gbstyle = gbstyle.replace(rep_domain, "/Content/image/"); //替换背景图片地址
			Tools.SetGlobalStyle(site_id, gbstyle);
		});
		$("#global_stysheet_editor .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#global_stysheet_editor").dialog('close');
		});

		/*添加子框架相关操作*/
		//弹框
		$("#factory-addframe").dialog({ autoOpen: false, position: 'middle',resizable:false, width: 900 ,create: function( event, ui ) {e.subframe_draggble();}}); //初始添加子框架弹框
		$(".js-faceditcol-addsubframe").click(function(event){//工具栏添加子框架按钮
			event.preventDefault();
			$("#factory-addframe").dialog("open");
		});
		//添加新的子框架
		e.newSubFrameArray=[];
		$(".js-addnewframe").click(function(event){
			event.preventDefault();
			var colnum = $(".js-addfselect").val();//获取添加栏数
			var hasAdded=false;//是否已经添加
			$.each(e.newSubFrameArray, function(index,val) {
				if(val==colnum){
					hasAdded=true;
				}
			});
			if(hasAdded){
				e.poptip_output("框架已添加，请使用", "fail");
				return;
			}
			
			var new_col = ""; //新增子框架结构
				var col_str = "";
				for (var i = 0; i < colnum; i++) {
					col_str += '<div data-fwidth="' + Math.floor(1 / colnum * 10000) / 100 + '%" style="width:' + Math.floor(1 / colnum * 10000) / 100 + '%" class="droppable sgcol_' + colnum + ' fl" data-oriclass="droppable sgcol_' + colnum + ' fl" data-nowclass="">'+
					'<div class="factoryframe js-pubremove"><div class="factoryframe_t"></div><div class="factoryframe_r"></div><div class="factoryframe_b"></div><div class="factoryframe_l"></div></div></div>';
				}
			new_col = '<div class="subframe_cell"><p class="subframe_colnumb">'+colnum+'栏</p><div data-nowidth="" data-nowclass="" data-oriclass="framemodel" class="framemodel model clearfix"><div class="framemodel_head clearfix js-pubremove">'+
									'<a title="编辑子框架" href="" class="subframe_editor fl js-edit-subframe"></a><a title="删除子框架" href="" class="subframe_remove fl js-subframe-remove"></a></div>'+col_str +'</div></div>';
			$(".js-subframe_lists").append(new_col);
			e.newSubFrameArray.push(colnum);
			e.subframe_draggble();
		});

		//子框架编辑和删除功能
		e.nowEditingSubframe=null;//当前编辑的子框架
		e.actsForSubFrame=function(){
			//编辑按钮
			$(".for_create .js-edit-subframe").each(function () {
				var data_bind= $(this).data("binded");
				if(!data_bind){
					$(this).data("binded","binded");
					$(this).click(function(event){
						event.preventDefault();
						e.nowEditingSubframe=$(this).parent().parent();
						var nowwidth=e.nowEditingSubframe.attr("data-nowidth");
						if(nowwidth ===""){
							$(".js-subfwidth").val("");
						}
						else{
							$(".js-subfwidth").val(nowwidth);
						}
						$(".js-subfclass").val(e.nowEditingSubframe.attr("id"));
						$("#factory-editsubframe").dialog("open");
					});
				}
			});

			//删除按钮
			$(".for_create .js-subframe-remove").each(function () {
				var data_bind= $(this).data("binded");
				if(!data_bind){
					$(this).data("binded","binded");
					$(this).click(function(event){
						event.preventDefault();
						var nowSubFrame =$(this).parent().parent();
						if (nowSubFrame.find('.model').size()) {
							e.poptip_output("框架中有挂件，请先删除挂件", "fail");
						}
						else{
							nowSubFrame.remove();
						}
					});	
				}
			});

		};
		e.actsForSubFrame();//初始化子框架编辑删除功能
		$("#factory-editsubframe").dialog({ autoOpen: false, position: 'top', width: 350 }); //初始droppable的参数编辑框
		$("#factory-editsubframe .save_btn").click(function (event) {
			event.preventDefault();
			var re_value = $(".js-subfwidth").val();
			var re_id = $(".js-subfclass").val();
			if ($.trim(re_value) != "") {
				e.nowEditingSubframe.animate({ "width": re_value }, 1000);
				e.nowEditingSubframe.attr("data-nowidth",re_value);
			}
			else {
				e.nowEditingSubframe.css("width", "");
				e.nowEditingSubframe.attr("data-nowidth","");
			}
			e.nowEditingSubframe.attr("id", re_id);
			e.poptip_output("设置成功！", "success");
		});

		$("#factory-editsubframe .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#factory-editsubframe").dialog('close');
		});

		/*添加子框架相关操作 --end*/

		/*框架修改相关操作*/
		e.sg_hover = function () { //单行框架鼠标移上去显示操作栏
			$(".colsg_inner").each(function () {
				var bindhover = $(this).data("bindhover");
				if (!bindhover) {
					$(this).hover(function () {
						if (e.editing_structure) {
							var now_in = $(this).find('.sgbar_wrap').size();
							//$(this).addClass("colsg_inner_hover");
							if (!now_in) {
								$(this).prepend($('.sgbar_wrap'));
								$('.sgbar_wrap').show();
							}
							else {
								$('.sgbar_wrap').show();
							}
							$('.sgbar_wrap').css({ left: 0, top: 0 });
						}
					},
					function () {
						if (e.editing_structure) {
							//$(this).removeClass("colsg_inner_hover");
							$('.sgbar_wrap').hide();
						}
					}
					);
					$(this).data("bindhover", "bindhover");
				}
			});
		};
		e.sg_hover();
		$("#add_newrow").dialog({ autoOpen: false, position: 'top', width: 350 }); //初始添加布局栏编辑框
		$("#add_newrow .save_btn").click(function (event) {
			event.preventDefault();
			var colnum = $("#add_newrow").find('.sg_colselect').val();
			var new_col = ""; //新增栏的结构
			if (colnum == 1) {
				new_col = '<div data-sgpg="sgpg">' +
								'<div class="colsg_inner" data-oriclass="colsg_inner" data-nowclass="">' +
									'<div class="droppable clearfix">' +
									'</div>' +
								'</div>' +
							'</div>';
			}
			else {
				var col_str = "";
				for (var i = 0; i < colnum; i++) {
					col_str += '<div data-fwidth="' + Math.floor(1 / colnum * 10000) / 100 + '%" style="width:' + Math.floor(1 / colnum * 10000) / 100 + '%" class="droppable sgcol_' + colnum + ' fl" data-oriclass="droppable sgcol_' + colnum + ' fl" data-nowclass=""></div>';
				}
				new_col = '<div data-sgpg="sgpg">' +
								'<div class="colsg_inner" data-oriclass="colsg_inner" data-nowclass="">' + col_str +
								'</div>' +
							'</div>';
			}
			e.adding_column_target.after(new_col);
			e.w_resize();
			e.sg_hover();
			e.droppable();	
			$("#add_newrow").dialog('close');
		});
		$("#add_newrow .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#add_newrow").dialog('close');
		});

		$("#edit_col_class").dialog({ autoOpen: false, position: 'top', width: 550 }); //初始添加布局栏编辑框
		$("#edit_col_class .save_btn").click(function (event) {
			event.preventDefault();
			e.otcol_target.attr("class", $("#otcol_class").val());
			e.innercol_target.attr("class", $("#incol_class").val() + " colsg_inner");
			e.innercol_target.attr("data-nowclass", $("#incol_class").val());
			var styletext = $.trim($("#incol_width").val());
			if (styletext != "") {
				e.innercol_target.animate({ "width": styletext });
				e.innercol_target.attr("data-fwidth",styletext);
			}
			else {
				e.innercol_target.css("width", "");
				e.innercol_target.attr("data-fwidth","");
			}
			$("#edit_col_class").dialog('close');
		});
		$("#edit_col_class .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#edit_col_class").dialog('close');
		});

		e.sgbar_act = function () {//框架操作栏的相关按钮操作
			$(".sgbar_wrap").find(".sg_add").click(function (event) { //添加框架
				event.preventDefault();
				e.adding_column_target = $(this).parents('[data-sgpg]');
				$(".ui-dialog-content").not($("#add_newrow")).dialog('close');
				$("#add_newrow").dialog("open");
			});

			$(".sgbar_wrap").find(".sg_edit").click(function (event) { //编辑布局栏按钮
				event.preventDefault();
				e.otcol_target = $(this).parents('[data-sgpg]');
				e.innercol_target = $(this).parents('.colsg_inner');
				var in_class = e.innercol_target.attr("data-nowclass");
				var ot_class = e.otcol_target.attr("class");
				var out_width = e.otcol_target.width();
				var in_width = e.innercol_target.width();
				if(e.innercol_target.attr("data-fwidth") === undefined){
					if (out_width == in_width) {
						in_width = "100%";
					}
					if(e.innercol_target.attr("style")===undefined){
						in_width="";
					}
				}
				else{
					in_width=e.innercol_target.attr("data-fwidth");
				}
				$("#incol_width").val(in_width);
				$("#incol_class").val(in_class);
				$("#otcol_class").val(ot_class);
				$(".ui-dialog-content").not($("#edit_col_class")).dialog('close');
				$("#edit_col_class").dialog("open");
			});

			$(".sgbar_wrap").find(".sg_down").click(function (event) { //下移框架
				var now_bx = $(this).parents('[data-sgpg]');
				if (now_bx.next().size()) {
					now_bx.next().after(now_bx);
					$('.colsg_inner').removeClass('colsg_inner_hover');
				}
			});

			$(".sgbar_wrap").find(".sg_up").click(function (event) { //上移框架
				var now_bx = $(this).parents('[data-sgpg]');
				if (now_bx.prev().size()) {
					now_bx.prev().before(now_bx);
					$('.colsg_inner').removeClass('colsg_inner_hover');
				}
			});

			$(".sgbar_wrap").find(".sg_delete").click(function (event) { //删除布局栏
				var now_bx = $(this).parents('[data-sgpg]');
				if ($('[data-sgpg]').size() == 1) {
					e.poptip_output("此框架为唯一框架，无法删除", "fail");
				}
				else {
					if (now_bx.find('.model').size()) {
						e.poptip_output("框架中有挂件，请先删除挂件！", "fail");
					}
					else {
						if (now_bx.next().size()) {
							now_bx.next().find(".colsg_inner").prepend($('.sgbar_wrap'));
						}
						else {
							now_bx.prev().find(".colsg_inner").prepend($('.sgbar_wrap'));
							$('.sgbar_wrap').hide();
						}
						now_bx.remove();
					}
				}
			});
		};
		e.sgbar_act();
		/*编辑布局宽度*/
		e.w_resize = function () {//初始化droppable中设置按钮事件
			var colum_edit = $(".colum_edit_wrapper").html();
			$(".droppable").each(function () {
				var have_edit = $(this).find('.colum_edit').size();
				if (!have_edit) {
					$(this).prepend(colum_edit);
				}
			});
			$(".colum_edit").each(function () {
				var bindclick = $(this).data("bindclick");
				if (!bindclick) {
					$(this).click(function (event) {
						var targetdroper=$(this).parent(".droppable");
						$(".droppable").removeClass("cur_colum");
						var cur_colum = targetdroper.addClass("cur_colum");
						event.preventDefault();
						$("#edit_colum").dialog('close');
						$("#edit_colum").dialog('open');
						$(".ui-dialog-content").not($("#edit_colum")).dialog('close');
						var ori_width = targetdroper.width();
						if(targetdroper.attr("data-fwidth") === undefined){
							if(targetdroper.attr("style")===undefined){
								ori_width="";
							}
						}
						else{
							ori_width=targetdroper.attr("data-fwidth");
						}
						$("#edit_colum .width_num").val(ori_width);
						var ori_id = targetdroper.attr("id");
						$("#edit_colum .scolum_class").val(ori_id);
					});
					$(this).data("bindclick", "bindclick");
				}
			})
		};
		$("#dialog").dialog({
			autoOpen: false, position: 'top', width: 900,
			resizeStart: function (event, ui) {
				e.style_popheight = $("#dialog").height(); //拖拽前样式弹框的高度
			},
			resizeStop: function (event, ui) {//初始样式编辑框
				var gap = $("#dialog").height() - e.style_popheight;
				var code_scrollheight = parseInt($(".CodeMirror-scroll").height());
				var code_scrollnowheight = code_scrollheight + gap;
				$(".CodeMirror-scroll").css("height", code_scrollnowheight);
				e.style_popheight = $("#dialog").height();
				e.codem_css1.refresh();
				e.codem_html1.refresh();
			}
		});
		$("#edit_colum").dialog({ autoOpen: false, position: 'top', width: 350 }); //初始droppable的参数编辑框
		$("#edit_colum .save_btn").click(function (event) {
			event.preventDefault();
			var re_value = $("#edit_colum .width_num").val();
			var re_id = $("#edit_colum .scolum_class").val();
			if ($.trim(re_value) != "") {
				$(".cur_colum").animate({ "width": re_value }, 1000);
				$(".cur_colum").attr("data-fwidth",re_value);
			}
			else {
				$(".cur_colum").css("width", "");
				$(".cur_colum").attr("data-fwidth",re_value);
			}
			$(".cur_colum").attr("id", re_id);
			e.poptip_output("设置成功！", "success");
		});

		$("#edit_colum .cancel_btn").click(function (event) {
			event.preventDefault();
			$(".current_ed").removeClass("current_ed");
			$("#edit_colum").dialog('close');
		});
		e.w_resize();
		/*生成模块*/
		e.paraformvalid = function (valid_obj, validate_target) {//配置参数验证
			validate_target.validate(valid_obj);
		};
		e.tabswitch_paras_refresh = function () {//Tab切换配置数据更新
			var tabs_id = e.tabswitch_container.find("[name=tabsid]");
			var tabs_name = e.tabswitch_container.find("[name=tabsname]");
			var tabs_source = e.tabswitch_container.find(".tabswitch_paracainput");
			var tabs_id_value = "";
			var tabs_names_value = "";
			var tab_length = tabs_source.size();
			tabs_source.each(function (index) {
				var id_val = $(this).data("id");
				var tab_name = $(this).val();
				if (index + 1 < tab_length) {
					tabs_id_value += id_val + ',';
					tabs_names_value += tab_name + ',';
				}
				else {
					tabs_id_value += id_val;
					tabs_names_value += tab_name;
				}
			});
			tabs_id.val(tabs_id_value);
			tabs_name.val(tabs_names_value);
		};
		e.sort_tabswitch = function () {//Tab切换排序上移，下移事件的绑定
			$(".tabswitch_paralists").find(".tabswitch_paradown").each(function () {
				var bindclcik = $(this).data("bindclcik");
				if (!bindclcik) {
					$(this).click(function () {
						var target = $(this).parents(".tabswitch_paracell");
						target.next().after(target);
					});
					$(this).data("bindclcik", "bindclcik");
				}
			});
			$(".tabswitch_paralists").find(".tabswitch_paraup").each(function () {
				var bindclcik = $(this).data("bindclcik");
				if (!bindclcik) {
					$(this).click(function () {
						var target = $(this).parents(".tabswitch_paracell");
						target.prev().before(target);
					});
					$(this).data("bindclcik", "bindclcik");
				}
			});
		};
		e.selctDataSource = function (target_bx) {//选择挂件数据源，扩展方法,target_bx配置项所在的弹框
			$(".select_navi").each(function () {
				var bindtree = $(this).data("bindtree");
				if (!bindtree) {
					$(this).treeview({//初始化树形结构
						collapsed: true
					});
					$(this).data("bindtree", "bindtree");
				}
			})
			$('.selectl_bx').each(function () {
				var sel_chos = $(this).find(".select_chos");
				var sel_navi = $(this).find(".select_navi");
				var sel_val = $(this).next("#cate_id");
				sel_chos.each(function () {
					if (!$(this).data("clickbinded")) {
						$(this).click(function (event) {
							event.stopPropagation();
							if (!sel_navi.is(":visible")) {
								sel_navi.show();
							}
							else {
								sel_navi.hide();
							}
							$(".catedp_navi").hide();
						});
					}
					$(this).data("clickbinded", "clickbinded");
				});
				if ($(this).parents('.single_line').find(".js-tabs-sourse").size()) {//tabs切换，checkbox选择方式
					$(this).find('a').each(function () {
						var data_id = $(this).data("value");
						var data_text = $(this).text();
						$(this).before('<input type="checkbox" data-id="' + data_id + '" data-text="' + data_text + '" name="for-tabs-id" class="js-tabsour-select" />');
						$(this).prev().change(function () {
							var datas_id = $(this).data("id");
							var datas_text = $(this).data("text");
							if ($(this).is(":checked")) {
								var li_html = ' <li class="tabswitch_paracell clearfix" data-id="' + datas_id + '">' +
	'<div class="fl tabswitch_paratext"><span class="tabswitch_paracatename">' + datas_text + '</span>--标题：</div><div class="suit"><input class="tabswitch_paracainput" value="' + datas_text + '" data-id="' + datas_id + '" type="text" name="" id="">' +
	'<span class="tabswitch_paradown"></span><span class="tabswitch_paraup"></span></div></li>';
								target_bx.find('.tabswitch_paralists').append(li_html);
								e.sort_tabswitch();
							}
							else {
								target_bx.find('.tabswitch_paralists').find("li[data-id=" + datas_id + "]").remove();
							}
						});
					});
				}
				else {
					$(this).find('a').each(function () {
						var clickbind = $(this).data("clickbind");
						if (!clickbind) {
							$(this).click(function (event) {
								event.preventDefault();
								$(".select_navi").hide();
								var text = $(this).text();
								var value = $(this).attr('data-value');
								sel_chos.find('span').text(text);
								sel_val.val(value);
							});
							$(this).data("clickbind", "clickbind");
						}
					});
				}
			});
			$(".select_navi").hover(function () {
				$('body').unbind('click.hide_navi');
			}
			, function () {
				$('body').bind('click.hide_navi', function () {
					$(".select_navi").hide();
				});
			});
			$('body').bind("click.hide_navi", function () {
				$(".select_navi").hide();
			});
		};

		jQuery.validator.addMethod("Ifhaveid", function (value, element) {   /*验证是否使用这个ID*/
			e.widgetalis = e.c_m_name + $("#styleId").val();
			var ifused = Tools.IsAliasCodeUsed(Tools.GetSiteId(window.location), e.widgetalis);
			return !ifused;

		}, "    <font color='red'>编号只能为英文字符</font>");
		jQuery.validator.addMethod("Idcheck", function (value, element) {   /*验证ID命名规则*/
			var repex = /^[0-9a-zA-Z\_]{3,16}$/i;
			var checked_out = repex.test(value);
			return checked_out;

		}, "    <font color='red'>编号只能为英文字符</font>");

		e.checkHtmlContent=function(htmlStr){//检验自定义html是否为空或者没有高度
			var dom=$('<div class="js-checkHtmlContent" style="display:none;">'+htmlStr+'</div>').appendTo("body");
			if($.trim(dom.text())|| dom.find("img").size()){
				dom.remove();
				return true;
			}
			else{
				dom.remove();
				e.poptip_output("html内容不能为空或者没有高度","fail");
				return false;
			}
		}
		jQuery.validator.addMethod("contentChecked", function (value, element) {   /*验证ID命名规则*/	
			return e.checkHtmlContent(e.cutom_html_content.html());

		},"    <font color='red'></font>");
		e.paraInputHtm = function (para_target, idChangable) { //模块配置输入项
			var global_set_html = null; //设置为全局模块的html
			$('.step_2 .create').show(); //显示第二步生成按钮
			if (para_target == 'htmlwidget1') {//自定义html挂件返回的配置结构
				e.validatapara = {}; //验证配置参数
				e.validatapara.submitHandler = function () {//验证通过执行模块html生成
					//Tools.AddAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
					e.createhtmlaction();
				};
				e.validatapara.rules = {};
				e.validatapara.messages = {};
				e.validatapara.focusInvalid = false;
				e.validatapara.onkeyup = false;
				e.validatapara.onfocusout = false;
				e.validatapara.rules.gl_name = {};
				e.validatapara.messages.gl_name = {};
				e.validatapara.rules.gl_name.required = true;
				e.validatapara.messages.gl_name.required = "请填写自定义html名称";
				e.validatapara.rules.custom_html_content = {};
				e.validatapara.messages.custom_html_content = {};
				e.validatapara.rules.custom_html_content.contentChecked = true;
				e.validatapara.messages.custom_html_content.contentChecked = "";
				var vali_submit = "";
				var parashtml = "";
				var gl_chk = "";
				if (idChangable) {
					e.validatapara.rules.styleId = {};
					e.validatapara.messages.styleId = {};
					e.validatapara.rules.styleId.required = true;
					e.validatapara.rules.styleId.Idcheck = true;
					e.validatapara.rules.styleId.Ifhaveid = true;
					e.validatapara.messages.styleId.required = "请填写模块ID";
					e.validatapara.messages.styleId.Idcheck = "请输入3-16位数字,字母,下划线";
					e.validatapara.messages.styleId.Ifhaveid = "ID已被使用";
					e.custom_html = true; //选择挂件时自定义html标识
					vali_submit = '<input type="submit" id="paravalid_btn" value="" style="display:none;" />';
					gl_chk = '<div class="single_line clearfix">' +
                        	'<label>&nbsp;</label>' +
                        	'<div class="suit" class="check_gbx">' +
                        		'<label class="setfor_glabel" for="setfor_globle">' +
                        			'<input type="checkbox"  class="setfor_globle" name="setfor_globle" id="setfor_globle">设为全局模块</label>' +
                        		'</div>' +
                        '</div>';
				}
				else {
					e.ed_custom_html = true; //编辑挂件时，自定义html标识
					parashtml = '<input type="submit" id="edi_odpara_btn" value="" style="display:none;" />';
				}
				var parashtml = '<form action=""><div class="single_line clearfix"><label>模块ID<sup>*</sup>:</label><div class="suit">  <input type="text" class="data_in text" name="styleId" id="styleId" /></div></div>' +
'<div class="single_line clearfix"><label>自定义html名称<sup>*</sup>:</label><div class="suit">  <input type="text" class="gl_name text" name="gl_name" id="gl_name" /></div></div>' + gl_chk +
'<div id="custom_html_area"><textarea style="width: 550px;height: 300px;display:none;" id="custom_html" name="custom_html"></textarea><p><input style="border: 0;clip: rect(0 0 0 0); height: 1px;margin: -1px;overflow: hidden;padding: 0;position: absolute;width: 1px;" type="text" id="custom_html_content" name="custom_html_content" /></p></div>' + vali_submit + '</form>';

				if (idChangable) {//新生成挂件配置参数验证通过执行的函数
					e.validatapara.submitHandler = function () {//验证通过执行模块html生成
						//Tools.AddAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						e.createhtmlaction();
					};
				}
				else {//编辑挂件配置参数验证通过执行的函数
					e.validatapara.submitHandler = function () {//验证通过执行模块html生成
						//Tools.AddAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						e.sava_odmod_action();
					};
				}
				return parashtml;
			}
			else {
				var isnavimodel = false; //是否为导航模块的标识符
				var naviSelctHtml = null; //返回的导航选择select
				if (idChangable) {
					e.custom_html = false;
				}
				else {
					e.ed_custom_html = false;
				}
				var model_data = Tools.GetWidgetConfig(para_target);
				if (model_data.WareCode.toLowerCase() == "navi") {//导航挂件
					isnavimodel = true;
					if (model_data.WidgetCode.toLowerCase() == "mainnavi") {//主导航挂件
						naviSelctHtml = Tools.GetNaviList(true, Tools.GetSiteId(window.location));
					} else {//左侧导航
						naviSelctHtml = Tools.GetNaviList(false, Tools.GetSiteId(window.location));
					}
				}

				e.modDefultstyle = model_data.Style; //所选挂件默认的样式表
				e.ware_code = model_data.WareCode; //用于获取模板html
				e.widget_code = model_data.WidgetCode; //用于获取模板html
				//.model_data.ExpandData
				//获取数据源
				//Tools.GetWareDataHtmlList(siteid,warecode,widgetcode)
				e.expanddataHtml = null;
				e.IsExpand = model_data.ExpandClassify; //是否带有扩展分类
				e.IsDataexp = model_data.ExpandData; //是否带有扩展数据源
				if (e.IsExpand) {//带有扩展数据源
					var expandStr = Tools.GetCategoryHtml(e.ware_code, Tools.GetSiteId(window.location));
					$(".para_temp").html(expandStr).find(".select_navi").prepend('<li><a data-value="0" href="">（所有分类）</a></li>').end().find(".select_chos span").text("（所有分类）");
					e.expanddataHtml = '<div class="single_line clearfix"><label>请选择分类<sup></sup>:</label><div class="suit">' + $(".para_temp").html() +
'<input type="text" style=" width:0; height:0; border:0; font-size:0; line-height:0;" value="0" class="data_in" name="cate_id" id="cate_id" /></div></div>';
					if (model_data.WidgetCode == "NewsTab") {// tab切换挂件
						$(".para_temp").find(".select_chos span").text("请选择");
						e.expanddataHtml = '<div class="single_line clearfix"><label class="js-tabs-sourse">Tab数据源<sup></sup>:</label><div class="suit">' + $(".para_temp").html() +
	'<input type="text" style=" width:0; height:0; border:0; font-size:0; line-height:0;" value="0" class="data_in" name="cate_id" id="cate_id" /><span style="display:none;" class="js-tabswitch-erro tabswitch-erro">请至少选择一个数据源</span></div></div>';
						var tabswichParahtml = '<div class="single_line clearfix"><label>Tab的标题和排序:</label>' + '<div class="suit"><ul class="tabswitch_paralists"></ul></div></div>'
						e.expanddataHtml = tabswichParahtml + e.expanddataHtml;
					}
				}
				if (e.IsDataexp) {
					var expanddataStr = Tools.GetWareDataHtmlList(Tools.GetSiteId(window.location), e.ware_code, e.widget_code);
					if (!e.expanddataHtml) {
						e.expanddataHtml = '<div class="single_line clearfix"><label>选择数据源<sup>*</sup>:</label>' + '<div class="suit"><p class="data_in select_para" id="dataid"><select name="dataid" >' + expanddataStr + '</select></p></div></div>'
					}
					else {
						e.expanddataHtml += '<div class="single_line clearfix"><label>选择数据源<sup>*</sup>:</label>' + '<div class="suit"><p class="data_in select_para" id="dataid"><select name="dataid" >' + expanddataStr + '</select></p></div></div>'

					}
				}
				else if (!(e.IsExpand || e.IsDataexp)) { //不带有扩展数据源
					e.expanddataHtml = null;
				}

				e.data_obj = model_data.ConfigItem;

				e.validatapara = {}; //验证配置参数

				if (idChangable) {//新生成挂件配置参数验证通过执行的函数
					e.validatapara.submitHandler = function () {//验证通过执行模块html生成
						//Tools.AddAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						e.createhtmlaction();
					};
				}
				else {//编辑挂件配置参数验证通过执行的函数
					e.validatapara.submitHandler = function () {//验证通过执行模块html生成
						//Tools.AddAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						e.sava_odmod_action();
					};
				}
				e.validatapara.rules = {};
				e.validatapara.messages = {};
				e.validatapara.focusInvalid = false;
				e.validatapara.onkeyup = false;
				e.validatapara.onfocusout = false;
				var items = [];
				if (idChangable) {
					global_set_html = '<div class="single_line clearfix">\
                        	<label>&nbsp;</label>\
                        	<div class="suit" class="check_gbx">\
                        		<label class="setfor_glabel" for="setfor_globle">\
                        			<input type="checkbox"  class="setfor_globle" name="setfor_globle" id="setfor_globle">设为全局模块</label>\
                        		</div>\
                        </div>\
                        <div class="single_line clearfix gl_name_bx">\
	                    <label for="gl_name">全局模块名称<sup>*</sup>：</label>\
	                    <div class="suit">  <input type="text" id="gl_name" name="gl_name" class="gl_name text"></div></div>';
					e.validatapara.rules.styleId = {};
					e.validatapara.messages.styleId = {};
					e.validatapara.rules.styleId.required = true;
					e.validatapara.rules.styleId.Idcheck = true;
					e.validatapara.rules.styleId.Ifhaveid = true;
					e.validatapara.messages.styleId.required = "请填写模块ID";
					e.validatapara.messages.styleId.Idcheck = "请输入3-16位数字,字母,下划线";
					e.validatapara.messages.styleId.Ifhaveid = "ID已被使用";
					items = ['<div class="single_line clearfix"><label>模块ID<sup>*</sup>:</label><div class="suit">  <input type="text" id="styleId" name="styleId" class="data_in text"></div></div>'];
				}
				$.each(e.data_obj, function (key, val) {//生成参数配置表格
					var ifrequired = val["Required"];
					if (val["DataType"] == 0) { //文本类型
						if (isnavimodel && val["Name"] == "navid")//如果为导航挂件
						{
							items.push('<div class="single_line clearfix"><label>' + val["ShowName"] + '<sup>*</sup>:</label>' + '<div class="suit"><p class="data_in select_para" id="' + val["Name"] + '"><select name="' + val["Name"] + '" >' + naviSelctHtml + '</select></p></div></div>');
						}
						else {
							if (ifrequired) {
								e.validatapara.rules[val["Name"]] = {};
								e.validatapara.messages[val["Name"]] = {};
								e.validatapara.rules[val["Name"]].required = true;
								e.validatapara.messages[val["Name"]].required = '请填写' + val["ShowName"];
								if (val["Name"] == "tabsid" || val["Name"] == "tabsname") {//tab切换参数配置id，name隐藏掉
									items.push('<div class="single_line hide_fromscre clearfix"><label for="' + val["Name"] + '">' + val["ShowName"] + '<sup>*</sup>:</label>' + '<div class="suit">  <input type="text" class="data_in text" name="' + val["Name"] + '" id="' + val["Name"] + '" /></div></div>');
								} else {
									items.push('<div class="single_line clearfix"><label for="' + val["Name"] + '">' + val["ShowName"] + '<sup>*</sup>:</label>' + '<div class="suit">  <input type="text" class="data_in text" name="' + val["Name"] + '" id="' + val["Name"] + '" /></div></div>');
								}
							}
							else {
								items.push('<div class="single_line clearfix"><label for="' + val["Name"] + '">' + val["ShowName"] + ':</label>' + '<div class="suit">  <input type="text" class="data_in text" name="' + val["Name"] + '" id="' + val["Name"] + '" /></div></div>');
							}
						}
					}
					else if (val["DataType"] == 100) { //下拉框类型
						e.validatapara.rules[val["Name"]] = {};
						e.validatapara.messages[val["Name"]] = {};
						e.validatapara.rules[val["Name"]].required = true;
						e.validatapara.messages[val["Name"]].required = '请填写' + val["ShowName"];
						var select_obj = val["ChildrenList"];
						var select_group = "";
						for (var item in select_obj) {
							select_group += '<option value="' + item + '">' + select_obj[item] + '</option>';
						}
						select_group = '<select name="' + val["Name"] + '" >' + select_group + '</select>';
						if (ifrequired) {
							items.push('<div class="single_line clearfix"><label>' + val["ShowName"] + '<sup>*</sup>:</label>' + '<div class="suit"><p class="data_in select_para" id="' + val["Name"] + '">' + select_group + '</p></div></div>');
						}
						else {
							items.push('<div class="single_line clearfix"><label>' + val["ShowName"] + ':</label>' + '<div class="suit"><p class="data_in select_para" id="' + val["Name"] + '">' + select_group + '</p></div></div>');
						}
					}
					else if (val["DataType"] == 200) {//单选按钮类型
						var radio_obj = val["ChildrenList"];
						var radio_group = "";
						var obj_length = radio_obj.length;
						var i_l = obj_length;
						for (var item in radio_obj) {
							if (i_l == obj_length) {
								radio_group += '<input type="radio" checked="checked" value="' + item + '" name="' + key + '">' + radio_obj[item];
								i_l--;
							}
							else {
								radio_group += '<input type="radio" value="' + item + '" name="' + key + '">' + radio_obj[item];
							}
						}
						if (ifrequired) {
							items.push('<div class="single_line clearfix"><label>' + val["ShowName"] + '<sup>*</sup>:</label>' + '<div class="suit"><p class="data_in radio" id="' + val["Name"] + '">' + radio_group + '</p></div></div>');
						}
						else {
							items.push('<div class="single_line clearfix"><label>' + val["ShowName"] + ':</label>' + '<div class="suit"><p class="data_in radio" id="' + val["Name"] + '">' + radio_group + '</p></div></div>');
						}
					}
				});
				e.validatapara.rules.gl_name = {};
				e.validatapara.messages.gl_name = {};
				e.validatapara.rules.gl_name.required = true;
				e.validatapara.messages.gl_name.required = "请填写模块名称";
				if (e.expanddataHtml) {//验证有数据源选择的下拉框
					//					e.validatapara.rules.cate_id = {};
					//					e.validatapara.messages.cate_id = {};
					//					e.validatapara.rules.cate_id.required = true;
					//					e.validatapara.messages.cate_id.required = "请选择应用分类";
					items.push(e.expanddataHtml);
				}
				if (global_set_html) {//如果是拉选挂件阶段
					items.push(global_set_html);
				}

				var parashtml = items.join('');
				if (idChangable) {
					parashtml = '<form action="">' + parashtml + '<input type="submit" id="paravalid_btn" value="" style="display:none;" /></form>';
				}
				else {
					parashtml = '<form action="">' + parashtml + '<input type="submit" id="edi_odpara_btn" value="" style="display:none;" /></form>';
				}
				return parashtml;
			}
		};
		e.sava_para = function (target, c_m_name, model_name, ware_code, ifglobal, globlestyle) { //保存输入参数，c_m_name挂件原名，model_name挂件别名
			var set_obj = {};
			e.para_ch = ""; //存储参数的名称和值，键值对
			target.find(".data_in").each(function () {
				var name = $(this).attr("id");
				var value = "";
				if ($(this).hasClass("radio")) {//单选按钮的配置参数
					value = $(this).find(':checked').val();
				}
				else if ($(this).hasClass("select_para")) {//下拉菜单的配置参数
					value = $(this).find('select').find('option:selected').val();
				}
				else { value = $(this).val(); }
				set_obj[name] = value;
				e.para_ch += '"' + name + '":' + '"' + value + '",';
			});
			var _setobj = {};
			_setobj.style = globlestyle;
			var gl_name = target.find('#gl_name');
			if (gl_name.size() && gl_name.is(":visible")) {
				var glname = gl_name.val();
			}
			if (e.custom_html) {
				_setobj.ishtml = 1;
			}
			else {
				_setobj.ishtml = 0;
			}
			_setobj.showname = glname; //全局模块的名称
			_setobj.isGlobal = ifglobal;
			_setobj.warecode = ware_code;
			_setobj.modelname = c_m_name; //c_m_name挂件原名
			_setobj.givename = model_name; //model_name挂件别名
			_setobj.data = set_obj; //存储以model_name挂件别名为索引的值
			var tmps = window.location.search.split('=');
			var pagecode = Tools.GetObjPageName(window.location); //页面名称
			_setobj.code = pagecode;
			_setobj.siteId = Tools.GetSiteId(window.location);
			Tools.SetWebConfig(_setobj);
			return _setobj;
		};
		e.create_model = function () {
			var thumbrTime;//缩略图延缓显示
			$(".choose_link").each(function () {
				var bind_click = $(this).data("clickbind");
				if (!bind_click) {
					$(this).data("clickbind", "clickbind");
					$(this).click(function (event) {
						event.preventDefault();
						$(".js-widegetlib").hide();//隐藏缩略图
						var para_from = $(this).attr("title");
						var paraInputHtm = e.paraInputHtm(para_from, true); //拼出配置结构
						$("#custom_html_area").hide();
						$('.date_i_lists').show();
						var inputStru = $('<div/>', {
							'class': 'date_input',
							html: paraInputHtm
						});
						$('.date_i_lists').html(inputStru);
						if (e.custom_html) {//如果是自定义html挂件
							(function (K) {
								e.cutom_html_content = K.create('#custom_html', {
									cssPath: '/Scripts/kindeditor/plugins/code/prettify.css',
									uploadJson: '/Home/UpLoadKindEditImage?siteId=' + Tools.GetSiteId(window.location),
									allowFileManager: false,
									afterCreate: function () {
										e.intialed = true;
										var self = this;
										K.ctrl(document, 13, function () {
											self.sync();
											K('form[name=product_submit]')[0].submit();
										});
										K.ctrl(self.edit.doc, 13, function () {
											self.sync();
											K('form[name=product_submit]')[0].submit();
										});
									}
								});
							})(KindEditor);
						}
						e.selctDataSource($("#model_story")); //执行选取数据源分类
						e.setgloble = 0; //默认挂件为非全局的
						$("#setfor_globle").each(function () {//显示隐藏全局模块名称配置
							var changed = $(this).data("changebind");
							var gl_name_bx = $('.gl_name_bx'); //全局模块名称配置
							if (!changed) {
								$(this).change(function () {
									if ($(this).is(":checked")) {
										gl_name_bx.show();
										e.setgloble = 1; //设为全局挂件
									}
									else {
										gl_name_bx.hide();
										e.setgloble = 0;
									}
								});
								$(this).data("changebind", "changebind");
							}
						});
						e.paraformvalid(e.validatapara, $(".step_2 form"));
						e.c_m_name = $(this).attr("title"); //挂件文件名
						$(".steps").animate({
							marginLeft: -570
						}, { duration: 500, easing: "easeOutQuad" }
					);
						$("#model_story").dialog({ title: "组件库--" + $(this).text() }); //进入配置参数界面告诉用户是哪个挂件
						$("#model_story")[0].scrollTop = 0;
					});
					/*鼠标浮动上去显示缩略图*/
					$(this).hover(function(){
						var pathsrc=$(this).data("thumber");
						$(".js-widegetlib-img").attr("src",pathsrc).css("top",$("#model_story").scrollTop());
						clearTimeout(thumbrTime);
						thumbrTime= setTimeout(function() {
							$(".js-widegetlib").show();
						}, 500);	
					},function(){
						clearTimeout(thumbrTime);
						thumbrTime= setTimeout(function() {
							$(".js-widegetlib").hide();
						}, 200);
					});
				}
			});


			$(".re_choose").each(function () {
				var bind_click = $(this).data("clickbind");
				if (!bind_click) {
					$(this).data("clickbind", "clickbind");
					$(this).click(function (event) {
						event.preventDefault();
						$(".step_3").removeClass("model_adding");
						$(".steps").animate({
							marginLeft: 0
						}, { duration: 500, easing: "easeOutQuad" }
					);
						e.custom_html = false;
						$('.date_i_lists').html('');
						//Tools.DeleteAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						if ($(this).parents(".step_3").length)
							Tools.RemoveWidget(Tools.GetSiteId(window.location), e.widgetalis);
						$(".step_3").find(".inner").html('');
						$("#model_story").dialog({ title: "组件库" }); //返回组件选择界面
					});
				}
			});

			$(".re_editpara").each(function () {//重新配置参数
				var bind_click = $(this).data("clickbind");
				if (!bind_click) {
					$(this).data("clickbind", "clickbind");
					$(this).click(function (event) {
						event.preventDefault();
						$(".step_3").removeClass("model_adding");
						$(".steps").animate({
							marginLeft: -570
						}, { duration: 500, easing: "easeOutQuad" }
					);
						//Tools.DeleteAliasCode(Tools.GetSiteId(window.location), e.widgetalis);
						if ($(this).parents(".step_3").length)
							Tools.RemoveWidget(Tools.GetSiteId(window.location), e.widgetalis);
						$(".step_3").find(".inner").html('');
					});
				}
			});

			e.createhtmlaction = function () {//生成模块html的函数
				if (e.custom_html) {//生成自定义挂件
					var target = $(".date_input");
					e.model_name = e.c_m_name + $(".date_input input#styleId").val(); //挂件唯一性的标识
					$('.step_3 .inner').html('<div id=' + e.model_name + ' data-global="' + e.setgloble + '" title=' + e.c_m_name + ' class="model custom_html_model">' + e.cutom_html_content.html() + '</div>');
					var custom_html_str = e.cutom_html_content.html();
					var rep_domain = new RegExp(e.site_domain + "/Content/image/", "g");
					var re_custhtml = custom_html_str.replace(rep_domain, "/Content/image/"); //替换掉图片src中的域名
					re_custhtml = re_custhtml.replace(/@/g, "&#64;"); //替换@为转义字符
					/*自定义html的结构存放在globle_style中*/
					e.sava_para(target, e.c_m_name, e.model_name, e.ware_code, e.setgloble, re_custhtml);
					$(".steps").animate({
						marginLeft: -1140
					}, { duration: 500, easing: "easeOutQuad" }
			    			);
					$("#model_story")[0].scrollTop = 0;
					e.model_draggble();
					//e.cutom_html_content.html("");
					//e.custom_html = false;
				}
				else {
					var target = $(".date_input");
					e.model_name = e.c_m_name + $(".date_input input#styleId").val(); //挂件唯一性的标识
					e.globlestyle = e.modDefultstyle.replace(eval("/." + e.c_m_name + "/g"), "#" + e.model_name + "." + e.c_m_name);
					var _setobj = e.sava_para(target, e.c_m_name, e.model_name, e.ware_code, e.setgloble, e.globlestyle); //存储配置参数,e.setgloble全局标识符，e.globlestyle全局挂件样式
					$(".steps").animate({
						marginLeft: -1140
					}, { duration: 500, easing: "easeOutQuad" }
			    		);

					e.in_html = Tools.GetPageHtml(e.ware_code, e.widget_code, Tools.GetSiteId(window.location), e.model_name); //_setobj.data 改成aliascode

					$('<div/>', {
						'class': 'in_wrap',
						html: e.in_html
					}).prependTo('.step_3 .inner');

					e.model_draggble();
					e.para_ch = e.para_ch.replace(/\,$/, "");
					var created_mod = $(".step_3").find(".model"); //已经生成的挂件html
					if (e.setgloble == 0) {
						created_mod.attr("date-paraCh", "{" + e.para_ch + "}"); //将挂件的配置参数保存
					}
					created_mod.attr("id", e.model_name); //给挂件加上设置的id
					created_mod.attr("data-warecode", e.ware_code); //给挂件加上设置的id
					created_mod.attr("data-global", e.setgloble); //添加全局标识
					var changestyId = e.modDefultstyle.replace(eval("/." + e.c_m_name + "/g"), "#" + e.model_name + "." + e.c_m_name); //默认样式加上模板ID
					var modefautStyle = '<style class="style_sheet" type="text/css">' + changestyId + '</style>'; //挂件中放入默认样式
					created_mod.prepend(modefautStyle);
					aniInitObj.aniWigetInit(); //初始化挂件脚本动画
				}
				$(".step_3").addClass("model_adding");
				//$('.date_i_lists').html('');
			};
			$("a.create").each(function () {//点击生成挂件
				var bind_click = $(this).data("b_click");
				if (!bind_click) {
					var bind_click = $(this).data("b_click", "binded");
					$(this).click(function (event) {
						event.preventDefault();
						if ($("#model_story .tabswitch_paralists").size()) {//含有tab切换配置参数
							e.tabswitch_container = $("#model_story");
							e.tabswitch_paras_refresh();
							var tabs_values = $("#model_story").find("[name=tabsid]").val();
							if (tabs_values == "") {
								$("#model_story").find(".js-tabswitch-erro").show();
							}
							else {
								$("#model_story").find(".js-tabswitch-erro").hide();
							}
						}
						$("#paravalid_btn").click();
					});
				}
			});
		};

		/*配置模块*/
		$(".model_bar").hover(function () { $(this).show(); });
		$(".model_bar").mouseleave(function () { $(this).hide(); });
		$(".model_bar").find(".edit_cushtml").click(function (event) { //点击编辑自定义html按钮
			event.preventDefault();
			var bind_kind = $("#edit_custom_area").data("bind_kind");
			var target = $(".bar_hover");
			var mod_id = target.attr("id"); //当前模块的ID
			$("#edit_custom_html").dialog("option", { title: '编辑自定义html（id="' + mod_id + '")' });
			$("#edit_custom_html").dialog("open");
			if (!bind_kind) {
				(function (K) {
					e.edit_cutom_content = K.create('#edit_custom_area', {
						cssPath: '/Scripts/kindeditor/plugins/code/prettify.css',
						uploadJson: '/Home/UpLoadKindEditImage?siteId=' + Tools.GetSiteId(window.location),
						allowFileManager: false,
						afterCreate: function () {
							var self = this;
							K.ctrl(document, 13, function () {
								self.sync();
								K('form[name=product_submit]')[0].submit();
							});
							K.ctrl(self.edit.doc, 13, function () {
								self.sync();
								K('form[name=product_submit]')[0].submit();
							});
						}
					});
				})(KindEditor);
				$("#edit_custom_area").data("bind_kind", "bind_kind");
			}
			$(".model").removeClass("editing_mod");
			target.addClass("editing_mod");
			e.edhtml_alias = target.attr("id");
			var siteId = Tools.GetSiteId(window.location);
			e.edht_global_set = target.attr("data-global");
			var now_html = Tools.GetGlobalWidgetHtml(siteId, "", "", e.edhtml_alias);
			var rep_domain = new RegExp("/Content/image/", "g");
			var now_html_str = now_html.style.replace(rep_domain, e.site_domain + "/Content/image/"); //替换图片src中的域名
			e.edit_cutom_content.html(now_html_str);
		});
		/*自定义html*/
		$("#edit_custom_html .save_btn").click(function (event) {
			event.preventDefault();
			if(!e.checkHtmlContent(e.edit_cutom_content.html())){
				return;
			}
			var custom_html = e.edit_cutom_content.html();
			$(".editing_mod").html(custom_html);
			var tmp = window.location.search.split('=');
			if (tmp.length == 5) {
				var page_id = parseInt(tmp[3]);
			}
			var _setobj = {};
			var rep_domain = new RegExp(e.site_domain + "/Content/image/", "g");
			var re_custhtml = custom_html.replace(rep_domain, "/Content/image/"); //替换掉图片src中的域名
			re_custhtml = re_custhtml.replace(/@/g, "&#64;"); //替换@字符为转义字符
			_setobj.style = re_custhtml;
			_setobj.ishtml = 1;
			_setobj.isGlobal = e.edht_global_set;
			_setobj.givename = e.edhtml_alias;
			_setobj.siteId = Tools.GetSiteId(window.location);
			_setobj.code = Tools.GetObjPageName(window.location);
			Tools.SetWebConfig(_setobj);
		});
		/*关闭自定义html编辑框*/
		$("#edit_custom_html .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#edit_custom_html").dialog("close");
		});

		$(".model_bar").find(".edit_act").click(function (event) {//点击样式按钮
			event.preventDefault();
			$(".model").removeClass("editing_mod");
			target = $(".bar_hover");
			target.addClass("editing_mod");
			if (target.hasClass("static_file")) {//编辑图片样式
				var img_style = target.find('img').attr('style');
				if (img_style != undefined) { $('#edit_img_style').find('textarea').val(img_style); }
				else { $('#edit_img_style').find('textarea').val(''); }
				$("#edit_img_style").dialog('open');
				$(".ui-dialog-content").not($("#edit_img_style")).dialog('close');
			}
			else {
				e.comd_alias = target.attr("id");
				e.comd_wigetcode = target.attr("title");
				e.comd_warecode = target.attr("data-warecode");
				e.comd_global = target.attr("data-global");
				e.comd_ishtml = 0;
				var style_text;
				if(e.comd_global == 1){
					var globljson = Tools.GetGlobalWidgetHtml(e.site_ID, null, null, e.comd_alias);
						rep_domain = new RegExp("/Content/image/", "g");
					style_text = globljson.style;
					style_text = style_text.replace(rep_domain, e.site_domain + "/Content/image/");
				}
				else{
					var rep_domain = new RegExp("http:\/\/\\d+\\.\\w+\\.shiwangyun\\.com", "g");
					style_text= target.find(".style_sheet").html();
					style_text = style_text.replace(rep_domain, e.site_domain);
				}
				var css_complete_bx1 = $("#factory_css_complete")[0]; //css高亮
				var html_construct_val1 = $(".para_temp").html(target.clone());
				$(".para_temp").find(".style_sheet").remove();
				var html_construct_bx1 = $("#factory_html_complete")[0]; //挂件html结构高亮
				if (!e.codem_css1) {
					e.codem_css1 = CodeMirror(css_complete_bx1, {
						value: "",
						mode: "css",
						lineNumbers: true
					});
					var cssCompletion = new CodeCompletion(e.codem_css1, new CssCompletion());
					e.codem_css1.setOption("onKeyEvent", function (cm, e) {
						return cssCompletion.handleKeyEvent(cm, e);
					});
					/*初始化css搜索功能*/
					$(".js-cssprev").click(function(){//上一个
						e.codem_css1.findPrev($(".js-csstxt").val(), {'ignoreCase':false,'regexp':false});
					});
					$(".js-cssnext").click(function(){//下一个
						e.codem_css1.findNext($(".js-csstxt").val(), {'ignoreCase':false,'regexp':false});
					});
					$(".js-cssrplall").click(function(){//全部
						e.codem_css1.replaceAll($(".js-csstxt").val(),$(".js-cssrptxt").val(),{'ignoreCase':false,'regexp':false});
					});
				}
				if (!e.codem_html1) {
					e.codem_html1 = CodeMirror(html_construct_bx1, {
						value: "",
						mode: "pophtmlmixed",
						lineNumbers: true,
						readOnly: true
					});
					/*初始html文本搜索功能*/
					$(".js-htmlprev").click(function(){//上一个
						e.codem_html1.findPrev($(".js-htmltxt").val(), {'ignoreCase':false,'regexp':false});
					});
					$(".js-htmlnext").click(function(){//下一个
						e.codem_html1.findNext($(".js-htmltxt").val(), {'ignoreCase':false,'regexp':false});
					});
				}

				$("#dialog").dialog('open');
				if (e.style_popheight != undefined) {//设置样式弹框的高度
					$("#dialog").css({ height: e.style_popheight });
				}
				$(".ui-dialog-content").not($("#dialog")).dialog('close');
				e.codem_css1.setValue($.format(style_text, { method: 'css' }));//格式化html和css
				e.codem_html1.setValue($.format($(".para_temp").html(), { method: 'xml', step: "  " }));//格式化html和css
			}
		});
		$(".model_bar").find(".add_1").click(function (event) {//点击删除按钮
			event.preventDefault();
			target = $(".bar_hover");
			if (confirm("确定删除模块？")) {
				target.remove();
				var id = target.attr("id");
				if (id) {
					Tools.RemoveWidget(Tools.GetSiteId(window.location), id);
				}
				e.creatpg_click = false;
				$(".create_page").trigger("click");
			}
		});
		$("#para_editor").dialog({ autoOpen: false, position: 'top', height: 300, width: 600 });
		$(".model_bar").find(".c_para").click(function (event) {//点击参数按钮
			event.preventDefault();
			$(".model").removeClass("para_editing");
			target = $(".bar_hover");
			target.addClass("para_editing");
			if (target.hasClass("static_file") && !target.hasClass("for_flash_drager")) {//编辑图片参数
				var imgLink = target.attr("href");
				var imgtitle = target.attr("title");
				var imgalt = target.find('img').attr("alt");
				var img_id = target.attr("id");
				if (imgLink != undefined) { $('#edit_img_para').find("#img_href").val(imgLink); }
				else { $('#edit_img_para').find("#img_href").val(''); }
				if (imgtitle != undefined) { $('#edit_img_para').find("#img_title").val(imgtitle); }
				else { $('#edit_img_para').find("#img_title").val(''); }
				if (imgalt != undefined) { $('#edit_img_para').find("#img_alt").val(imgalt); }
				else { $('#edit_img_para').find("#img_alt").val(''); }
				$('#edit_img_para').find("#img_id").val(img_id);
				$("#edit_img_para").dialog('open');
				$(".ui-dialog-content").not($("#edit_img_para")).dialog('close');
			}
			else if (target.hasClass("static_file") && target.hasClass("for_flash_drager")) {
				var flashid = target.attr("id");
				$("#edit_flash_para").find("#flashes_id").val(flashid);
				$("#edit_flash_para").dialog('open');
				$(".ui-dialog-content").not($("#edit_flash_para")).dialog('close');
			}
			else {//编辑模块参数
				var para_from = target.attr("title");
				var globenum = parseInt(target.attr('data-global'));
				//				if (globenum == 1 && target.attr("date-paraCh") == undefined) {//如果是共用组件，从数据库取键值对
				var alias = target.attr("id");
				var siteId = Tools.GetSiteId(window.location);
				var para_obj = Tools.GetWidgetConfigItem(siteId, alias);
				//				}
				//				else {
				//					e.para_obj_str = target.attr("date-paraCh");
				//					var para_obj = jQuery.parseJSON(e.para_obj_str);
				//				}
				var paraInputHtm = e.paraInputHtm(para_from, false);
				$('.para_bx').html('');
				$('<div/>', {
					'class': 'input_bx',
					html: paraInputHtm
				}).prependTo('.para_bx');
				e.selctDataSource($("#para_editor")); //执行选取数据源分类
				$('.para_bx').find(".data_in").each(function () {
					var id = $(this).attr("id");
					if ($(this).hasClass("radio")) {//单选框
						$(this).find(':radio').removeAttr("checked");
						$(this).find('input:radio[value="' + para_obj[id] + '"]').attr("checked", "checked");
					}
					else if ($(this).hasClass("select_para")) {
						$(this).find('select option[value="' + para_obj[id] + '"]').attr("selected", "selected");
					}
					else {
						$(this).val(para_obj[id]);
						if (id == "cate_id" && !$('.para_bx').find(".tabswitch_paralists").size())//选择分类数据源的选择项反填会编辑状态
						{
							var target_bx = $(this).prev(".selectl_bx");
							if (!para_obj[id]) {
								para_obj[id] = 0;
							}
							var nowVal = target_bx.find('[data-value=' + para_obj[id] + ']').text();
							target_bx.find(".select_chos span").text(nowVal);
						}
						else if ($('.para_bx').find(".tabswitch_paralists").size() && id == "tabsname") {
							var tabs_idArray = $('.para_bx').find("[name=tabsid]").val().split(",");
							var tabs_nameArray = $('.para_bx').find("[name=tabsname]").val().split(",");
							var tabidLength = tabs_idArray.length;
							for (var i = 0; i < tabidLength; i++) {
								var tabCellId = tabs_idArray[i];
								var tabTarget = $('.para_bx').find('.js-tabsour-select[data-id=' + tabCellId + ']');
								tabTarget.attr("checked", "checked");
								var liHtml = ' <li class="tabswitch_paracell clearfix" data-id="' + tabTarget.data("id") + '">' +
	'<div class="fl tabswitch_paratext"><span class="tabswitch_paracatename">' + tabTarget.data("text") + '</span>--标题：</div><div class="suit"><input class="tabswitch_paracainput" value="' + tabs_nameArray[i] + '" data-id="' + tabTarget.data("id") + '" type="text" name="" id="">' +
	'<span class="tabswitch_paradown"></span><span class="tabswitch_paraup"></span></div></li>';
								$('.para_bx').find('.tabswitch_paralists').append(liHtml);
							}
							e.sort_tabswitch();
						}
					}
				});
				e.paraformvalid(e.validatapara, $(".editor_pmain form"));
				$(".ui-dialog-content").not($("#para_editor")).dialog('close');
				$("#para_editor").dialog('open');
			}
		});
		$(".editor_pmain").find(".save_para").click(function (event) { //保存修改的参数
			event.preventDefault();
			if ($("#para_editor .tabswitch_paralists").size()) {//含有tab切换配置参数
				e.tabswitch_container = $("#para_editor");
				e.tabswitch_paras_refresh();
				var tabs_values = $("#para_editor").find("[name=tabsid]").val();
				if (tabs_values == "") {
					$("#para_editor").find(".js-tabswitch-erro").show();
				}
				else {
					$("#para_editor").find(".js-tabswitch-erro").hide();
				}
			}
			$("#edi_odpara_btn").trigger('click'); //模拟点击验证submit
		});
		e.sava_odmod_action = function () {//修改挂件参数验证通过执行的函数
			var target = $(".para_bx");
			var c_m_name = $(".para_editing").attr("title"); //挂件原名
			var model_name = $(".para_editing").attr("id"); //挂件别名
			var ware_code = $(".para_editing").attr("data-warecode"); //应用系统名称
			var ifglobe = parseInt($(".para_editing").attr("data-global")); //全局标识的值
			var globestyle = $(".para_editing").find('.style_sheet').html(); //全局挂件的样式
			var _setobj = e.sava_para(target, c_m_name, model_name, ware_code, ifglobe, globestyle);
			$("#para_editor").dialog('close');
			$(".para_bx").html("");
			var new_model = Tools.GetPageHtml(ware_code, c_m_name, Tools.GetSiteId(window.location), model_name); //_setobj.data 改成aliascode
			$(".para_temp").html(new_model); //临时存储新的结构
			var new_model = $(".para_temp").find(".model");
			new_model.find(".style_sheet").remove();
			var style_copy = $(".para_editing").find(".style_sheet").clone();
			style_copy.prependTo(new_model);
			new_model.attr("id", model_name);
			e.para_ch = e.para_ch.replace(/\,$/, "");
			if (ifglobe == 0) {
				new_model.attr("date-paraCh", "{" + e.para_ch + "}");
			}
			new_model.attr("data-warecode", ware_code);
			new_model.attr("data-global", ifglobe);
			$(".para_editing").replaceWith(new_model);
			e.model_edit();
			e.model_draggble();
			aniInitObj.aniWigetInit(); //初始化挂件脚本动画
		};


		$(".model_bar").hover(function () { $(this).show(); }, function () { $(this).hide(); }
        );

		/*保存flash参数配置框*/
		$("#edit_flash_para").dialog({ autoOpen: false, position: 'top', width: 370 }); //图片库参数框
		$("#edit_flash_para .save_btn").click(function (event) {//保存flash外层div的id
			event.preventDefault();
			var re_value = $("#edit_flash_para").find("#flashes_id").val();
			$(".para_editing").attr("id", re_value);
		});
		$("#edit_flash_para .cancel_btn").click(function (event) {//关闭flash编辑弹框
			event.preventDefault();
			$("#edit_flash_para").dialog("close");
		});
		/*保存图片样式*/
		$("#edit_img_style .save_btn").click(function (event) {
			event.preventDefault();
			var re_value = $("#edit_img_style textarea").val();
			$(".editing_mod").find("img").attr("style", re_value);
		});
		/*关闭图片样式编辑框*/
		$("#edit_img_style .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#edit_img_style").dialog("close");
		});
		/*保存图片参数*/
		$("#edit_img_para .save_btn").click(function (event) {
			event.preventDefault();
			$('#edit_img_para').find(".cell").each(function () {
				var input_taget = $(this).find("input");
				var attr_name = input_taget.attr("data-attr");
				var attr_value = input_taget.val();
				if (attr_name == "alt") {
					$(".para_editing").find("img").attr(attr_name, attr_value);
				}
				else if (attr_name == "id") {
					$(".para_editing").attr("id", attr_value);
				}
				else {
					$(".para_editing").attr(attr_name, attr_value);
				}
			});
			$("#edit_img_para").dialog("close");
		});
		/*关闭图片参数编辑框*/
		$("#edit_img_para .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#edit_img_para").dialog("close");
		});
		/*保存模块样式*/
		$("#dialog .save_btn").click(function (event) {
			event.preventDefault();
			var re_value = e.codem_css1.getValue();
			$(".editing_mod").find(".style_sheet").replaceWith('<style type="text/css" class="style_sheet">' + re_value + '</style>');
			var if_global = $(".editing_mod").attr("data-global");
			if (if_global == 1) {//保存全局样式
				var tmp = window.location.search.split('=');
				if (tmp.length == 5) {
					var page_id = parseInt(tmp[3]);
				}
				var rep_domain = new RegExp(e.site_domain + "/Content/image/", "g");
				re_value = re_value.replace(rep_domain, "/Content/image/"); //替换背景图片
				var _setobj = {};
				_setobj.style = re_value;
				_setobj.ishtml = 0;
				_setobj.isGlobal = e.comd_global;
				_setobj.givename = e.comd_alias;
				_setobj.siteId = Tools.GetSiteId(window.location);
				_setobj.code = Tools.GetObjPageName(window.location);
				_setobj.modelname = e.comd_wigetcode;
				_setobj.warecode = e.comd_warecode;
				Tools.SetWebConfig(_setobj);
			}
			e.poptip_output("保存成功", "success");
		});
		/*关闭样式编辑器*/
		$("#dialog .cancel_btn").click(function (event) {
			event.preventDefault();
			$("#dialog").dialog('close');
		});

		$(".quick_edit_page").click(function (event) {//退出编辑按钮
			event.preventDefault();
			window.location = '/Home/Pagemanage?siteId=' + Tools.GetSiteId(window.location);
		});

		if ($("#manu_act_tools").size()) { //复制组件相关操作
			$("#copy_widget_pop").dialog({ autoOpen: false, position: 'top', width: 400 }); //复制组件弹框
			$(".model_bar").find(".factcopy_model").click(function (event) { //点击复制组件
				event.preventDefault();
				$("#copy_widget_pop").find(".copy_widgetinfo_name").val("");
				target = $(".bar_hover");
				e.copywiget_alias = target.attr("id");
				e.copywiget_style = target.find(".style_sheet").html();
				e.copywiget_warecode = target.data("warecode");
				e.copywiget_widgetcode = target.attr("title");
				$("#copy_widget_pop").dialog("open");
			});
			$(".copy_widget_form").validate({//验证复制组件输入
				'rules': {
					'copy_widgetinfo_name': {
						'required': true
					}
				},
				'messages': {
					'copy_widgetinfo_name': {
						'required': "请填写名称"
					}
				},
				'submitHandler': function (form) {
					var site_id = Tools.GetSiteId(window.location);
					var name = $("#copy_widget_pop").find(".copy_widgetinfo_name").val();
					var state = Tools.SaveWidgetTemplate(site_id, e.copywiget_alias, name, e.copywiget_style, e.copywiget_warecode, e.copywiget_widgetcode);
					if (state) {
						e.poptip_output("组件复制成功！", "success");
						$("#copy_widget_pop").dialog("close");
					}
					else {
						e.poptip_output("组件复制失败！", "fail");
					}
				}
			});
			$("#copy_widget_pop").find(".save_btn").click(function (event) { //点击确定按钮
				event.preventDefault();
				$(this).next().trigger("click");
			});
			$("#copy_widget_pop").find(".cancel_btn").click(function (event) { //点击取消按钮
				event.preventDefault();
				$("#copy_widget_pop").dialog("close");
			});

			/*复用组件框操作*/
			jQuery.validator.addMethod("Ifhavealiasid", function (value, element) {   /*验证是否使用这个ID*/
				var widgetalis = e.faccoy_wiget_code + $("#copy_widgetinfo_id").val();
				e.faccoy_newwiget_code = widgetalis;
				var ifused = Tools.IsAliasCodeUsed(Tools.GetSiteId(window.location), widgetalis);
				return !ifused;

			}, "    <font color='red'>编号只能为英文字符</font>");
			$(".fact_modcopy_form").validate({//验证复用组件form
				'rules': {
					'copy_widgetinfo_id': {
						'required': true,
						'Ifhavealiasid': true
					}
				},
				'messages': {
					'copy_widgetinfo_id': {
						'required': "请填写模块ID",
						'Ifhavealiasid': "ID已被使用"
					}
				},
				'focusInvalid': false,
				'onkeyup': false,
				'onfocusout': false,
				'submitHandler': function (form) {
					var pagecode = Tools.GetObjPageName(window.location);
					var site_id = Tools.GetSiteId(window.location);
					var html_str = Tools.SetWebConfigByTemplate(site_id, e.faccoy_newwiget_code, e.faccoy_alias, pagecode);
					$("#copwiget_lib_pop").find('.comds_wrap').animate({
						marginLeft: -940
					}, { duration: 500, easing: "easeOutQuad" });
					$(".fact_copymod_html").html(html_str);
					var ori_alias = e.faccoy_alias.slice(0, -17);
					var now_style = e.faccoy_alias_style.replace(eval("/#" + ori_alias + "/g"), "#" + e.faccoy_newwiget_code);
					var now_newwidget = $(".fact_copymod_html").find(".model");
					//					var para_obj = Tools.GetWidgetConfigItem(Tools.GetSiteId(window.location), ori_alias);
					//					var para_obj_str = eval("" + obj + "");
					//					now_newwidget.attr("date-paraCh", para_obj_str);
					now_newwidget.attr("id", e.faccoy_newwiget_code);
					now_newwidget.attr("data-warecode", e.faccoy_ware_code); //给挂件加上设置的warecod属性
					now_newwidget.attr("data-global", 0); //添加全局标识
					var style = '<style class="style_sheet" type="text/css">' + now_style + '</style>'; //挂件中样式
					now_newwidget.prepend(style);
					e.model_draggble();
					aniInitObj.aniWigetInit(); //初始化挂件脚本动画
				}
			});
			$(".js_createcpy_bgn").click(function (event) { //点击生成复制挂件
				event.preventDefault();
				$(this).next().trigger("click");
			});

			$("#copwiget_lib_pop").dialog({ autoOpen: false, position: 'top', width: 500, height: 360 }); //复用组件库浮框
			$("#copwiget_lib_pop").dialog({
				autoOpen: false, position: 'top', width: 500,
				close: function (event, ui) { if ($("#copwiget_lib_pop .comds_wrap").css("marginLeft") == "-940px" && $("#copwiget_lib_pop .comds_wrap").find(".model").size() == 1) { $(".js-delet-copwiget").trigger("click"); } }
			});
			$("#copwiget_lib_pop").find('.back_choose').click(function (event) { //重新选择
				event.preventDefault();
				$("#copwiget_lib_pop").find('.comds_wrap').animate({
					marginLeft: 0
				}, { duration: 500, easing: "easeOutQuad" });
				if ($(this).hasClass("js-delet-copwiget")) {
					$("#copwiget_lib_pop .comds_wrap").find(".model").remove();
					Tools.RemoveWidget(Tools.GetSiteId(window.location), e.faccoy_newwiget_code);
				}
			});
			e.deletcopymd = function () {//删除复用挂件
				$("#copwiget_lib_pop").find('.shmd_delete').each(function () {
					var bindclick = $(this).data('bindclick');
					if (!bindclick) {
						$(this).click(function (event) {
							event.preventDefault();
							var alias = $(this).attr('data-alias'); //挂件别名
							var siteId = Tools.GetSiteId(window.location);
							var ifdelete = Tools.DeleteWidgetTemplate(siteId, alias);
							if (ifdelete) { //已经删除成功
								$(this).parent('.smd_cell').hide().remove();
								e.poptip_output("删除成功", "success");
							}
							if ($("#copwiget_lib_pop").find(".smd_cell").size() == 0) {
								$('#copwiget_lib_pop').find('.sharedmd_lists').html('<p class="smd_tip" style="color:#888;">暂时没有复用挂件</p>');
							}
						});
						$(this).data('bindclick', 'bindclick');
					}
				});
			};

			e.chosecopymd = function () { //选择复用挂件
				$("#copwiget_lib_pop").find('.chosdmd').each(function () {
					var bindclick = $(this).data('bindclick');
					if (!bindclick) {
						$(this).data('bindclick', 'bindclick');
						$(this).click(function () {
							$("#copwiget_lib_pop").find('.comds_wrap').animate({
								marginLeft: -470
							}, { duration: 500, easing: "easeOutQuad" });

							e.faccoy_alias_style = $(this).next().next('textarea').val(); //样式
							e.faccoy_alias = $(this).data("alias"); //编号
							e.faccoy_wiget_code = $(this).data("widgetcode"); //挂件名
							e.faccoy_ware_code = $(this).data("warecode"); //应用名称
						});
					}
				});
			};

			e.add_copylibmod_action=function (event) {//复用组件库浮框
				event.preventDefault();
				if (!$("#copwiget_lib_pop").is(":visible")) {
					var siteId = Tools.GetSiteId(window.location);
					var shamd_array = Tools.ListWidgetTemplate(siteId);
					var html_array = [];
					if (shamd_array.length) {
						$("#copwiget_lib_pop .back_choose").show();
						var arlength = shamd_array.length;
						for (var i = 0; i < arlength; i++) {
							var obj = shamd_array[i];
							var list_cell = '<div class="smd_cell clearfix"><a href="#" data-warecode="' + obj.WareCode + '" data-widgetcode="' + obj.WidgetCode + '" class="fl chosdmd" data-alias="' + obj.AliasCode + '"  >' + obj.Name + '</a><a href="#" class="fr shmd_delete" data-alias="' + obj.AliasCode + '">删除</a><textarea style="display:none;">'+obj.Style+'</textarea></div>'
							html_array.push(list_cell);
						}
						var shlists = html_array.join('');
						$('#copwiget_lib_pop').find('.sharedmd_lists').html(shlists);
						e.deletcopymd();
						e.chosecopymd();
						$("#copwiget_lib_pop").find(".smd_cell").hover(function () {
							$(this).addClass('smd_cell_hover');
						},
                function () {
                	$(this).removeClass('smd_cell_hover');
                }
              );
						$("#copwiget_lib_pop").find('.comds_wrap').css({ marginLeft: 0 });
						$("#copwiget_lib_pop").dialog('open');
						$(".ui-dialog-content").not($("#copwiget_lib_pop")).dialog('close');
					}
					else {
						$(".ui-dialog-content").not($("#copwiget_lib_pop")).dialog('close');
						$('#copwiget_lib_pop').find('.sharedmd_lists').html('<p class="smd_tip" style="color:#888;">暂时没有复用挂件</p>');
						$("#copwiget_lib_pop").find('.comds_step2').hide();
						$("#copwiget_lib_pop .back_choose").hide();
						$("#copwiget_lib_pop").dialog('open');
						$("#copwiget_lib_pop").find('.comds_step2').show();
					}

				}
			};
			$(".add_copylib_libs").click(e.add_copylibmod_action);



		}


		e.create_page = function () {/*格式化html结构*/
			var temp = $(".for_create").html();
			//var c_page = {};
			$("#temporary_bx").html(temp);
			$("#temporary_bx").find(".static_file img").each(function () {//对拖拽生成的图片的结构处理
				var ori = $(this).attr("src");
				var beigin_index = ori.indexOf('/Content/');
				var pub_path = ori.substring(beigin_index, ori.length);
				$(this).attr("src", pub_path);
				$(this).removeAttr("data-source").removeAttr("data-orig");
			});
			$("#temporary_bx").find(".colum_edit").remove().end().find(".save_head").remove().end().find(".save_footer").remove().end().find(".sgbar_wrap").remove().end().find(".js-pubremove").remove().end().find(".droppable,.colsg_inner,.framemodel").removeAttr("data-nowidth").removeAttr("data-nowclass").removeAttr("data-fwidth").removeAttr("data-oriclass");
			$("#temporary_bx").find(".ui-sortable").removeClass("ui-sortable").end().find(".for_flash_drager").removeClass("for_flash_drager").end().find(".bar_hover").removeClass("bar_hover").end().find(".para_editing").removeClass("para_editing");
			$("#temporary_bx").find('.model:not(.static_file)').each(function () {
				var data_model = $(this).attr("data-model");
				// '@{Html.RenderAction("News_list", "UserControl", new { pageName = "index", modelName = "model_navi" });}';
				var givenname = $(this).attr("id"); //挂件别名
				var modelname = $(this).attr("title"); //挂件原名
				var warecode = $(this).attr("data-warecode");
				if ($(this).hasClass("custom_html_model")) {
					modelname = "HtmlWidget";
					warecode = "UserWidget";
				}
				//c_page[givenname] = givenname;
				//Tools.GetControlEntity(modelname, givenname, warecode);

				$(this).replaceWith(Tools.GetControlEntity(modelname, givenname, warecode));
			});

			//return c_page;
		}

		e.creatpg_click = true; //是否为真正点击 保存页面按钮

		e.save_page_action=function (event) {/*点击生成页面*/

			event.preventDefault();
			var obj = e.create_page();
			//			if (obj) {
			//				var tmps = window.location.search.split('=');
			//				var page_Id = tmps[3];
			//				Tools.SetWebConfig(Tools.GetSiteId(window.location), obj, page_Id);
			//			}
			var html = $("#temporary_bx").html(); //取出来的html结构
			var replace_domain = new RegExp(e.site_domain, "g");
			html = html.replace(replace_domain, "");
			var css_style = "";
			$('.style_sheet').each(function () {
				if (!$(this).parents('[data-global=1]').size()) {
					var style = $(this).html();
					var rep_domain = new RegExp(e.site_domain, "g");
					style = style.replace(rep_domain, "");
					style = style.replace(new RegExp(/http:\/\/\w+.site.jssdw.com/gi), ""); //只是为了同步迁移的数据，后期可以删除
					css_style += style;
				}
			}); //样式表文件
			/*替换图片路径*/
			//var now_s_id = Tools.GetSiteId(window.location);
			//Tools.CssFileUpdata(css_style, Tools.GetObjPageName(window.location), Tools.GetSiteId(window.location));

			//只取body
			$(".para_temp").html($(".for_create").html());
			$(".para_temp").find('[data-wiget-type]').each(function () {//删除带动画效果的挂件的html
				var style = $(this).find('.style_sheet').clone();
				$(this).html(style);
			});
			$(".para_temp").find(".model").removeClass("para_editing").removeClass("editing_mod").removeClass("bar_hover");
			$(".para_temp").find(".sgbar_wrap").remove().end().find(".colum_edit").remove();
			var for_create_now = $(".para_temp").html();
			var html_orig = '<div class="for_create">' + for_create_now + '</div>';
			html_orig = html_orig.replace(/@/g, "&#64;"); //替换@为转义字符
			var pagecode = Tools.GetObjPageName(window.location);
			var json = Tools.SaveFile(pagecode, Tools.GetSiteId(window.location), html, html_orig, css_style); //生成页面
			if (json.Code == 0) {
				if (e.creatpg_click) {
					e.poptip_output("页面保存成功！", "success");
				}
				e.creatpg_click = true;
			}
			$(".para_temp").html(""); //清空para_temp
			$("#temporary_bx").html(""); //清空temporary_bx
		};
		$(".create_page").click(e.save_page_action);


		if ($("#manu_act_tools").size()) {
			if (!e.readermodel) {
				window.onbeforeunload = function () { return "请确保您已经保存了当前页面，再关闭窗口。"; };
			}
		}
	})(event_do);


});