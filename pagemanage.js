var admin_js = {};
$(function () {
	(function (M) {
		//头部tab切换，配置变量
		M.ifrs_index=0;
		M.ifrs_cell_w=0;

		M.re_height = function () {//左侧导航和展示栏高度自适应
			var rest_h = $("#header").outerHeight();
			w_h = $(window).height(); w_w = $(window).width();
			$("#side_bar").css("height", w_h - 40 - rest_h);
			$("#main_content").css("height", w_h - 30 - rest_h);
			$("#s_container .s_ini_left").css("height", w_h - 102);
			//头部页面tab切换
			M.ifrs_cell_w=w_w;
			$(".js-ifrs").css("height", w_h-rest_h);
			$(".js-ifrs-cell").css("width", w_w);
			$(".js-ifrs-inner").css("width", w_w*3+100);
			$(".js-js-ifrs-iframe1,.js-js-ifrs-iframe2").css("height", w_h-rest_h-$('.js-fac-bar').outerHeight());
		};
		M.re_height();

		M.isMobile = parseInt($("#i_hid_hideparam_m").val());

		if ($(".js-mkcondi").size()) {//当前编辑环境是手机版还是电脑版
			if (M.isMobile == 10) {
				$(".js-mkcondi").html('手<br/>机<br/>版');
			}
			$(".js-mkcondi").animate({ left: -22 }, 1500, 'easeOutBounce');
		}


		M.main_navi = function () { //主导航链接地址绑定
			var url_str = window.location.href.replace(/#/g,'');
			M.all_mainavis=$(".main_nav_box").find("a");
			var manage_link = $(".main_nav_box").find("a:eq(0)");
			var resourse_link = $(".main_nav_box").find("a:eq(1)");
			var chmodel_link = $(".main_nav_box").find("a:eq(2)");
			if (url_str.indexOf("Pagefile") > 0) {
				var m_href = url_str.replace(/Pagefile/, "Pagemanage");
				var r_href = url_str.replace(/Pagefile/, "Pagefile");
				var c_href = url_str.replace(/Pagefile/, "Chooseapp");
				if (M.isMobile == 10) {
					var m_href = m_href.replace(/Home/, "Mobile");
					var r_href = r_href.replace(/Home/, "Mobile");
					var c_href = c_href.replace(/Home/, "Mobile");
				}
				manage_link.attr("href", m_href);
				//resourse_link.attr("href", r_href).addClass("current");
				chmodel_link.attr("href", c_href);
			}
			if (url_str.indexOf("Pagemanage") > 0) {
				var m_href = url_str.replace(/Pagemanage/, "Pagemanage");
				var r_href = url_str.replace(/Pagemanage/, "Pagefile");
				var c_href = url_str.replace(/Pagemanage/, "Chooseapp");
				if (M.isMobile == 10) {
					var m_href = m_href.replace(/Home/, "Mobile");
					var r_href = r_href.replace(/Home/, "Mobile");
					var c_href = c_href.replace(/Home/, "Mobile");
				}
				//manage_link.attr("href", m_href).addClass("current");
				resourse_link.attr("href", r_href);
				chmodel_link.attr("href", c_href);
			}
			else if (url_str.indexOf("Chooseapp") > 0) {
				var m_href = url_str.replace(/Chooseapp/, "Pagemanage");
				var r_href = url_str.replace(/Chooseapp/, "Pagefile");
				var c_href = url_str.replace(/Chooseapp/, "Chooseapp");
				if (M.isMobile == 10) {
					var m_href = m_href.replace(/Home/, "Mobile");
					var r_href = r_href.replace(/Home/, "Mobile");
					var c_href = c_href.replace(/Home/, "Mobile");
				}
				manage_link.attr("href", m_href);
				resourse_link.attr("href", r_href);
				//chmodel_link.attr("href", c_href).addClass("current");
			}
			if (M.isMobile == 10 && $(".browser_site_btn").size()) { //手机版--改变浏览网站
				var oribhref = $(".browser_site_btn").attr("href");
				var nowbhref = oribhref.replace(/index/, "mobile/index");
				$(".browser_site_btn").attr("href", nowbhref);
				$(".browser_site_btn").hover(function () {
					$(".js-3dimg").show();
					$(".js-3dimg img").stop().animate({ top: 46, width: 150, height: 150 }, 1000, 'easeOutElastic');
				}, function () {
					$(".js-3dimg img").stop().animate({ top: 200, width: 0, height: 0 }, 500, 'jswing', function () {
						$(".js-3dimg").hide();
					});

				});
			}
			//绑定头部tab切换事件
			manage_link.addClass("current");
			$(".main_nav_box").on("click","a",function(event){
				event.preventDefault();
				var tab_index=$(".main_nav_box a").index($(this)),
						target_src=$(this).attr("href");
						M.ifrs_index=tab_index;
				if(!$(this).data("loaded")){//未初始化ifrmane
					$(this).data("loaded","loaded");
					if(tab_index!=0){
						M.main_navi.ifs_tab(tab_index,target_src);
					}
					else{
						M.main_navi.ifs_tab(tab_index);
					}
				}
				else{//已经初始化ifrmae
					M.main_navi.ifs_tab(tab_index);
				}
			});
		};
		M.main_navi.ifs_tab=function (index,target_src) {
			$(".js-ifrs-inner").animate({"marginLeft":-(index*M.ifrs_cell_w)},300,function(){
				M.all_mainavis.removeClass("current");
				$('.main_nav_box a:eq('+index+')').addClass("current");
				if(target_src){
					var iframe_target=$('.js-js-ifrs-iframe'+index)
					M.iframe_loader.show();
					iframe_target.off("load");
					iframe_target.on("load",function(){
						M.iframe_loader.hide()
					});
					iframe_target.attr("src",target_src);
				}
			});
			
		}
		M.main_navi();

		/*工具栏2,3操作*/
		M.simplebar=(function(){ 
			function init(){
				$(".js-back-ifr1").click(function(event){
					event.preventDefault();
					M.main_navi.ifs_tab(0);
				});
				$('.js-refresh-ifr2').click(function(event){
					event.preventDefault();
					var iframe2 = document.getElementById("js-ifrs-iframe2"),
						iframeDoc = $(iframe2),
						origin_src=iframeDoc.attr("src");
						M.iframe_loader.show();
						iframeDoc.off("load");
						iframeDoc.on("load",function(){
							M.iframe_loader.hide()
						});
					iframeDoc.attr("src","").attr("src",origin_src);
				});
				$('.js-refresh-ifr3').click(function(event){
					event.preventDefault();
					var iframe3 = document.getElementById("js-ifrs-iframe3"),
						iframeDoc = $(iframe3),
						origin_src=iframeDoc.attr("src");
						M.iframe_loader.show();
						iframeDoc.off("load");
						iframeDoc.on("load",function(){
							M.iframe_loader.hide()
						});
					iframeDoc.attr("src","").attr("src",origin_src);
				});
			}
			return {
				init:init
			};
		})();
		M.simplebar.init();
		/*初始化透明加载进度花*/
		M.png24_spinner=(function(){
			var spinner_target,
				spinner;
			function init(){
				var opts = {
				  lines: 9, // The number of lines to draw
				  length: 12, // The length of each line
				  width: 7, // The line thickness
				  radius: 15, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: '#00a4e1', // #rgb or #rrggbb or array of colors
				  speed: 1, // Rounds per second
				  trail: 60, // Afterglow percentage
				  shadow: false, // Whether to render a shadow
				  hwaccel: false, // Whether to use hardware acceleration
				  className: 'spinner', // The CSS class to assign to the spinner
				  zIndex: 2e9, // The z-index (defaults to 2000000000)
				  top: '30%', // Top position relative to parent
				  left: '50%' // Left position relative to parent
				};
				spinner_target = document.getElementById('trans_loader');
				spinner= new Spinner(opts);
			};
			
			function stop(){
				spinner.stop();
			}
			
			function use () {
				spinner.spin(spinner_target);
			}

			return {
				init:init,
				stop:stop,
				use:use
			};
		})();
		if($(".js-iframe-loading").size()){
			M.png24_spinner.init();
		}
		/*iframe加载遮罩层*/
		M.iframe_loader=(function(){
			function show(){
				$(".js-iframe-loading").show();
				M.png24_spinner.use();
			}

			function hide(){
				$(".js-iframe-loading").hide();
				M.png24_spinner.stop();
			}
			return {
				show:show,
				hide:hide
			}
		})();

		M.l_link_act = function () {//左侧导航点击，右侧获得对应的修改信息
			$(".links_wrap").find('.page_altlink').each(function () {
				var act_on = $(this).data("edate");
				if (!act_on) {
					$(this).data("edate", "act_on");
					$(this).click(function (event) {
						event.preventDefault();
						if (!$(this).hasClass("s_c_link")) {
							var nearby = $(this).parents('.links_wrap');
							nearby.find('.page_altlink').removeClass("s_c_link"); //移除其它链接class
							nearby.find('.page_altlink').removeClass("current"); //移除其它链接class
							$(this).addClass("s_c_link");
							$(this).addClass("current");
							var p_name = $(this).text();
							var p_title = $(this).attr("data-title");
							var page_hdkeword = $(this).attr("data-keyword");
							var p_des = $(this).attr("data-des");
							$('.p_tip').text(p_name);
							$("#pa_editor").fadeOut(500, function () {
								$("#pa_editor").find(".page_name").val(p_name);
								$("#pa_editor").find(".page_hdtitle").val(p_title);
								$("#pa_editor").find(".page_hdkeword").val(page_hdkeword);
								$("#pa_editor").find(".page_des").val(p_des);
							});
							$("#pa_editor").fadeIn(500);
							var pg_name = $(this).attr("data-tip");
							var br_link = window.location;
							var page_id = $(this).attr("data-pid");
							var site_id = Tools.GetParamSiteId(br_link); //取site_id
							var address_str;
							if (M.isMobile == 10) {
								address_str = '/Mobile/Index?pageName=';
							}
							else {
								address_str = '/Home/Index?pageName=';
							}
							var link = address_str + pg_name + '&siteId=' + site_id + '&pageId=' + page_id + "&taskId=" + window.location.search.split('&')[1].replace('taskId=', '');
							$('.cre_link').attr("href", link);
						}
						else return;
					});
				}
			});
		};
		M.get_site_lists = function () {//获得并生成左侧站点列表
			if ($("body").hasClass("siteinit")) {
				var site_lists = Tools.GetSiteList();
				var listHtml = '';
				for (var i = 0, lengths = site_lists.length; i < lengths; i++) {
					listHtml += '<li class="item"><a data-id="' + site_lists[i].SiteId + '" href="/Home/Pagemanage?siteId=' + site_lists[i].SiteId + '" class="link">' + site_lists[i].SiteName + '</a><div class="site_actions clearfix"><a href="" class="lig_grey s_dele fr">删除</a><a href="" class="lig_blu s_edit fr">编辑</a></div></li>';
				}
				$('.sites_lists').html(listHtml);
			}
		};
		M.ger_page_lists = function () {//获得站点的页面列表
			if ($("#container").hasClass("pag_lists")) {
				var br_link = window.location;
				var site_id = Tools.GetParamSiteId(br_link);
				var pg_list = Tools.GetPageList(parseInt(site_id));
				if (!pg_list[0]) { $('.create_tip ').show(); }
				else {
					var listpage = '';
					for (var i = 0, lengths = pg_list.length; i < lengths; i++) {
						var btn_class = "";
						var btn_txt = "";
						if (pg_list[i].IsCheckOut) {
							btn_class = "checkpg_btn checkpgin_btn";
							btn_txt = "签入";
						}
						else {
							btn_class = "checkpg_btn";
							btn_txt = "签出";
						}
						listpage += '<div class="pagelt_link"><a href="" data-keyword="' + pg_list[i].Keyword + '" data-des="' + pg_list[i].Description + '" data-title="' + pg_list[i].Title + '" class="page_altlink" title=' + pg_list[i].FileName + ' data-pid=' + pg_list[i].PageId + ' data-tip=' + pg_list[i].FileName + '>' + pg_list[i].Name + '</a><span class="lighty_btn set_modpage" data-filename=' + pg_list[i].FileName + ' data-pid=' + pg_list[i].PageId + '>模板</span><a class="' + btn_class + '" data-filename=' + pg_list[i].FileName + ' data-pid=' + pg_list[i].PageId + ' href="#">' + btn_txt + '</a></div>';
					}

					$('.links_wrap').html(listpage);
					M.l_link_act();
					$('.cre_link').show();
					$(".links_wrap").find("a:eq(0)").trigger('click');
				}
			}
			M.page_check_act();
			M.set_modpage_act();
		};
		M.page_check_act = function () {//页面签入签出操作
			var site_id = Tools.GetParamSiteId(window.location);
			$(".checkpg_btn").each(function () {
				var bindclik = $(this).data("bindclik");
				if (!bindclik) {
					$(this).click(function (event) {
						event.preventDefault();
						var chk_pagecode = $(this).attr("data-filename");
						var $this = $(this);
						if ($this.hasClass("checkpgin_btn")) {
							var sucess = Tools.CheckInPage(site_id, chk_pagecode); //签入操作
							if (sucess) {
								$this.removeClass("checkpgin_btn");
								$this.text("签出");
							}
						}
						else {
							var sucess = Tools.CheckOutPage(site_id, chk_pagecode); //签出操作
							if (sucess) {
								$this.addClass("checkpgin_btn");
								$this.text("签入");
							}
							else {
								alert("此页面已经被其他制作人员签出");
							}
						}
					});
					$(this).data("bindclik", "bindclik");
				}
			});
		};

		$("#add_as_modpag").dialog({ autoOpen: false, position: 'center', width: 380 }); //添加模板页面弹框
		$(".add_mopage_form").validate({//验证
			'rules': {
				'modpag_name': {
					'required': true
				},
				'modpag_sum': {
					'required': true
				}
			},
			'messages': {
				'modpag_name': {
					'required': "请填写模板名称"
				},
				'modpag_sum': {
					'required': "请填写模板简介"
				}
			},
			'submitHandler': function (form) {
				var site_id = Tools.GetParamSiteId(window.location); //取site_id
				var mod_name = $("#add_as_modpag").find(".fmodpag_name").val();
				var mod_sum = $("#add_as_modpag").find(".fmodpag_sum").val();
				Tools.PageSaveAsTemplate(site_id, M.page_name, "zh", mod_name, mod_sum);
				event_do.poptip_output("成功设为模板页", "success");
				//M.now_addmod.addClass("addmodpaged_btn");
				$("#add_as_modpag").dialog("close");
			}
		});
		$("#add_as_modpag").find(".save_btn").click(function (event) {
			event.preventDefault();
			$(this).next().trigger("click");
		});

		$("#add_as_modpag").find(".cancel_btn").click(function (event) {
			event.preventDefault();
			$("#add_as_modpag").dialog("close");
		});
		M.set_modpage_act = function () {//页面设为模板的操作
			var site_id = Tools.GetParamSiteId(window.location);
			$(".links_wrap").find(".set_modpage").each(function () {
				var bindclik = $(this).data("bindclik");
				if (!bindclik) {
					$(this).data("bindclik", "bindclik");
					$(this).click(function () {
						if ($(this).hasClass("addmodpaged_btn")) {
							event_do.poptip_output("已经设为模板页面", "fail");
						}
						else {
							$("#add_as_modpag").dialog("open");
							var text = $(this).prev("a").text();
							$("#add_as_modpag").find(".fmodpag_name").val(text);
							$("#add_as_modpag").find(".fmodpag_sum").val("");
							//M.now_addmod = $(this);
							M.page_name = $(this).data("filename");
						}
					});
				}
			});
		};

		M.import_test_data = function () { //导入测试数据
			if ($(".import_test_data").size()) {
				$("#import_testdata_pop").dialog({ autoOpen: false, position: 'center', width: 350 }); //新建页面弹框
				$(".import_test_data").click(function (event) {
					event.preventDefault();
					$("#import_testdata_pop").dialog("open");
				});
				$("#import_testdata_pop").find(".save_btn").click(function (event) {
					event.preventDefault();
					Tools.InsertTestData(Tools.GetParamSiteId(window.location));
				});
				$("#import_testdata_pop").find(".cancel_btn").click(function (event) {
					event.preventDefault();
					$("#import_testdata_pop").dialog("close");
				});
			}
		};
		M.import_test_data();

		M.delete_page = function () { //删除站点中的指定页面
			$(".del_pg_btn").click(function (event) {
				event.preventDefault();
				$("#delete_page").dialog('open');
				var dele_namme = $(".p_tip").text();
				$(".dele_tip span").text('“' + dele_namme + '”');
				$("#delete_page").find(".cancel_btn").click(function () {//关闭删除提示框
					$("#delete_page").dialog('close');
				});
				$("#delete_page").find(".save_btn").each(function () {//点击“确定”按钮
					var act_on = $(this).data("edate");
					if (!act_on) {
						$(this).data("edate", "act_on");
						$(this).click(function (event) {
							event.preventDefault();
							var editing_pag = $(".links_wrap").find('.current'); //获取当前正在配置页面的左侧链接
							var pagecode = editing_pag.attr("data-tip");
							var br_link = window.location;
							var site_id = Tools.GetParamSiteId(br_link);
							if (Tools.DeletePage(site_id, pagecode)) //从数据库删除页面
							{
								var next_page = $(".links_wrap").find('.current').parent().next().find(".page_altlink ");
								if (!next_page.text()) {
									next_page = $(".links_wrap").find('a:eq(0)');
								}
								editing_pag.parent().fadeOut(500, function () { $(this).remove(); });
								next_page.trigger("click");
							}
							$("#delete_page").dialog('close');
						});
					}
				});
			});

		};
		M.delete_site = function () { //删除指定站点
			$("ul.sites_lists").find(".s_dele").click(function (event) {
				event.preventDefault();
				var curr_link = $(this).parents(".item");
				if (!curr_link.hasClass("current_link")) {
					var nearby = curr_link.siblings();
					nearby.removeClass("current_link");
					curr_link.addClass("current_link");
				}
				$("#delete_site").dialog('open');
				var dele_namme = $(this).parents(".item").find(".link").text();
				$(".dele_tip span").text('“' + dele_namme + '”');
				$("#delete_site").find(".cancel_btn").click(function () {//关闭删除提示框
					$("#delete_site").dialog('close');
				});
			});
			$("#delete_site").find(".save_btn").each(function () {//点击“确定”按钮
				var act_on = $(this).data("edate");
				if (!act_on) {
					$(this).data("edate", "act_on");
					$(this).click(function (event) {
						event.preventDefault();
						var editing_site = $(".s_ini_left").find('.current_link'); //获取当前正在配置的站点
						var siteId = $(".current_link").find('.link').attr("data-id");
						Tools.DeleteSite(siteId);
						editing_site.fadeOut(500, function () { $(this).remove(); });
						$("#delete_site").dialog('close');
					});
				}
			});
		};
		M.edit_sites = function () { //编辑站点信息
			$("ul.sites_lists").find(".s_edit").click(function (event) {
				event.preventDefault();
				var curr_link = $(this).parents(".item");
				if (!curr_link.hasClass("current_link")) {
					var nearby = curr_link.siblings();
					nearby.removeClass("current_link");
					curr_link.addClass("current_link");
				}
				var sites_name = $(this).parents(".item").find(".link").text(); //站点名称
				$("#site_editing").find(".sites_name").val(sites_name);
				$("#site_editing").dialog('open');
				$("#site_editing").find(".cancel_btn").click(function () {//关闭删除提示框
					$("#site_editing").dialog('close');
				});
				$("#site_editing").find(".save_btn").click(function () { //保存编辑内容
					var site_c_name = $("#site_editing").find(".sites_name").val();
					var siteId = $(".current_link").find('.link').attr("data-id");
					Tools.UpdateSite(siteId, site_c_name);
					$(".current_link").find(".link").text(site_c_name);
					$("#site_editing").dialog('close');
				});
			});
		};

		M.delete_i_file = function () { //资源文件管理--删除图片文件
			$("#img_lists_wrap").find(".image").hover(function () {
				$(this).find(".delete_img").show();
				$(this).find(".edtimg_alt ").show();
			},
                                                    function () {
                                                    	$(this).find(".delete_img").hide();
                                                    	$(this).find(".edtimg_alt ").hide();
                                                    });
			$("#img_lists_wrap").find(".delete_img").each(function () {
				var act_on = $(this).data("edate");
				if (!act_on) {
					$(this).data("edate", "act_on");
					$(this).click(function (event) { //点击删除按钮
						event.preventDefault();
						var br_link = window.location;
						var site_id = Tools.GetParamSiteId(br_link);
						var file_id = $(this).attr("data-fid");
						if (confirm("确定删除文件？")) {
							Tools.DeleteFile(site_id, file_id);
							$(this).parents("li").remove();
						}
					})
				}
			});
		};

		M.getImgLists = function (siteId, pageIndex) { //获取图片资源文件列表
			if (!M.Search_state) {
				var type = $("#filemg_tabs").find(".show_imgs").data("type");
				var objfile = Tools.SearchFile(siteId, 0, type, "", pageIndex);
				var image_lists = objfile.list;
				M.totalcount = objfile.total;
			}
			else {
				var type = M.source_type;
				var catolog = M.sear_cata;
				var keyname = M.sear_keyname;
				var objfile = Tools.SearchFile(siteId, catolog, type, keyname, pageIndex);
				var image_lists = objfile.list;
				M.totalcount = objfile.total;
			}
			if (image_lists) {
				var items = [];
				$.each(image_lists, function (index, val) {
					items.push(
                 '<li><p class="image"><a class="delete_img lig_blu" data-fid="' + val["FileId"] + '" href="">删除</a><a class="edtimg_alt lig_blu" data-fid="' + val["FileId"] + '" data-alt="' + val["Title"] + '" href="">编辑</a><a class="model static_file" href="javascript:void(0)"><img alt="' + val["Title"] + '" data-orig="' + val["FileUrl"] + '" data-source="' + val["SourceUrl"] + '" alt="" src="' + val["ThumbUrl"] + '"></a></p><div class="image-detail"><div class="clip_src_btn fl"><span data-orig="' + val["FileUrl"] + '" id="' + 'rep_imgfl_btn_' + val["FileId"] + '" class="rep_flash_btn"></span></div><span class="imglib_text">' + val["Name"] + '</span></div></li>'
                );
				});
				var imglists = $('<ul/>', {
					'id': 'list_content',
					'class': 'image-list clearfix',
					html: items.join('')
				});
				return imglists;
			}
			else {
				$("#data_page_nav").html("");
				return null;
			}
		}
		$("#edit_img_alt").dialog({ autoOpen: false, position: 'center', width: 350 }); //图片ALT属性编辑弹框
		M.edit_img_alt = function () {//编辑图片ALT属性
			$("#img_lists_wrap").find(".edtimg_alt").each(function () {
				var act_on = $(this).data("edate");
				if (!act_on) {
					$(this).data("edate", "act_on");
					$(this).click(function (event) { //点击编辑按钮
						event.preventDefault();
						$("#edit_img_alt").dialog("open");
						M.now_img_fileid = $(this).attr("data-fid");
						M.now_img_target = $(this).parents('.image').find('img');
						var alt_val = M.now_img_target.attr("alt");
						$("#edit_img_alt").find('.input_img_alt').val(alt_val);
					});
				}
			});
		};
		$("#edit_img_alt").find('.save_btn').click(function (event) { //保存编辑的图片alt属性
			event.preventDefault();
			var site_id = Tools.GetParamSiteId(window.location);
			var img_alt = $("#edit_img_alt").find('.input_img_alt').val();
			var success = Tools.UpdateFileTitle(site_id, M.now_img_fileid, img_alt);
			if (success) {
				$("#edit_img_alt").dialog("close");
				event_do.poptip_output("图片编辑成功", "success");
			}
			else {
				event_do.poptip_output("服务器繁忙,编辑失败", "fail");
			}
			M.now_img_target.attr("alt", img_alt);
		});
		$("#edit_img_alt").find('.cancel_btn').click(function (event) { //保存编辑的图片alt属性
			event.preventDefault();
			$("#edit_img_alt").dialog("close");
		});

		M.pagegation_state_new = true;
		M.totalcount = 0; //总条数
		M.count_perpage = 10;
		M.Search_state = false; //默认不处于搜索状态
		M.search_name = ""; //对于分页需要记住字段
		M.search_cata = ""; //对于分页需要记住字段
		M.update_type = $("#filemg_tabs").find(".show_imgs").data("type"); //默认上传类型为图片
		M.source_type = $("#filemg_tabs").find(".show_imgs").data("type"); //默认显示类型为图片
		M.source_cata = "-1"; //默认显示全部
		if ($("#file_lists_wrap").size()) {
			M.pageint_selcobj = Tools.ListCatalog(Tools.GetParamSiteId(window.location), M.update_type); //页面加载完下拉列表数据是一样的，都是图片文件夹		
		}
		M.tab_index = 0; //默认点击了图片（第一个tab）
		M.paganation_filelis = function () {//分页
			if (M.update_type == $("#filemg_tabs").find(".show_imgs").data("type")) {
				if (M.totalcount == 0) {
					$("#data_page_nav").hide();
				}
				else {
					$("#data_page_nav").pagination(M.totalcount, {
						prev_text: '上一页',
						next_text: '下一页',
						num_display_entries: 5,
						current_page: 0,
						items_per_page: M.count_perpage,
						num_edge_entries: 2,
						show_if_single_page: true,
						load_first_page: false,
						callback: M.getImgs
					});
					$("#data_page_nav").show();
				}
			}
			else if (M.update_type == $("#filemg_tabs").find(".flash_files").data("type")) {
				if (M.totalcount == 0) {
					$("#data_page_nav").hide();
				}
				else {
					$("#data_page_nav").pagination(M.totalcount, {
						prev_text: '上一页',
						next_text: '下一页',
						num_display_entries: 5,
						current_page: 0,
						items_per_page: M.count_perpage,
						num_edge_entries: 2,
						show_if_single_page: true,
						load_first_page: false,
						callback: M.getflashes
					});
					$("#data_page_nav").show();
				}
			}
		};
		M.getImgs = function (pageIndex) { //获取图片列表
			var br_link = window.location;
			var file_shop_page = $("#img_lists_wrap").size();
			if (file_shop_page) {
				if (pageIndex == undefined) {
					pageIndex = 0;
				}
				var site_id = Tools.GetParamSiteId(br_link);
				var imgslists = M.getImgLists(site_id, pageIndex + 1);
				if (imgslists) {
					$("#img_lists_wrap").html(imgslists);
					$("#img_lists_wrap").find('.rep_flash_btn').each(function () {
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
					M.delete_i_file();
					M.edit_img_alt();
					if (M.pagegation_state_new) {
						M.paganation_filelis();
						M.pagegation_state_new = false;
					}
				}
				else {
					$("#img_lists_wrap").html("");
				}
			}
		};
		M.getImgs();


		M.delete_i_flash = function () { //资源文件管理--删除flash文件
			$("#file_lists_wrap").find(".flash").hover(function () { $(this).find(".delete_flash").css("visibility", "visible"); },
                                                    function () { $(this).find(".delete_flash").css("visibility", "hidden"); });
			$("#file_lists_wrap").find(".delete_flash").each(function () {
				var act_on = $(this).data("edate");
				if (!act_on) {
					$(this).data("edate", "act_on");
					$(this).click(function (event) { //点击删除按钮
						event.preventDefault();
						var br_link = window.location;
						var site_id = Tools.GetParamSiteId(br_link);
						var file_id = $(this).attr("data-fid");
						if (confirm("确定删除文件？")) {
							Tools.DeleteFile(site_id, file_id);
							$(this).parents("li").remove();
						}
					})
				}
			});
		};
		M.getflashLists = function (siteId, pageIndex) { //获取flash文件列表
			if (!M.Search_state) {
				var type = M.source_type;
				var objfile = Tools.SearchFile(siteId, 0, type, "", pageIndex);
				var flash_lists = objfile.list;
				M.totalcount = objfile.total;
			}
			else {
				var type = M.source_type;
				var catolog = M.sear_cata;
				var keyname = M.sear_keyname;
				var objfile = Tools.SearchFile(siteId, catolog, type, keyname, pageIndex);
				var flash_lists = objfile.list;
				M.totalcount = objfile.total;
			}
			if (flash_lists) {
				var items = [];
				$.each(flash_lists, function (index, val) {
					items.push(
                 '<li><p class="flash"><a class="delete_flash lig_blu" data-fid="' + val["FileId"] + '" href="">删除</a><embed height="100" width="100" plugspace="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" wmode="transparent" quality="autohigh" align="TL" src="' + val["FileUrl"] + '"></p><div class="image-detail"><div class="clip_src_btn fl"><span data-orig="' + val["FileUrl"] + '" id="' + 'rep_flashfl_btn_' + val["FileId"] + '" class="rep_flash_btn"></span></div><span class="imglib_text">' + val["Name"] + '</span></div></li>'
                );
				});
				var flashlists = $('<ul/>', {
					'id': 'list_content',
					'class': 'flashes-list clearfix',
					html: items.join('')
				});
				return flashlists;
			}
			else {
				$("#data_page_nav").html("");
				return null;

			}
		}

		M.getflashes = function (pageIndex) { //获取图片列表
			var br_link = window.location;
			var file_shop_page = $("#file_lists_wrap").size();
			if (file_shop_page) {
				if (pageIndex == undefined) {
					pageIndex = 0;
				}
				var site_id = Tools.GetParamSiteId(br_link);
				var imgslists = M.getflashLists(site_id, pageIndex + 1);
				if (imgslists) {
					$("#file_lists_wrap").html(imgslists);
					$("#file_lists_wrap").find('.rep_flash_btn').each(function () {
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
					M.delete_i_flash();
					if (M.pagegation_state_new) {
						M.paganation_filelis();
						M.pagegation_state_new = false;
					}
				}
				else {
					$("#file_lists_wrap").html("");
				}
			}
		};
		/*添加文件夹功能变量*/



		M.chage_updatef_select = function (page_intial) {//列出上传文件夹
			var site_id = Tools.GetParamSiteId(window.location);
			var opt_obj = [];
			if (page_intial) {
				opt_obj = M.pageint_selcobj;
			}
			else {
				opt_obj = Tools.ListCatalog(site_id, M.update_type);
			}
			$("#uploade_source_cata").html("");
			$("#uploade_source_cata").setTemplateElement("select_opt_tmp");
			$("#uploade_source_cata").processTemplate(opt_obj);
		};

		M.chage_searcat_select = function (page_intial) {//列出用于搜索的文件夹
			var site_id = Tools.GetParamSiteId(window.location);
			if (page_intial) {
				opt_obj = M.pageint_selcobj;
			}
			else {
				opt_obj = Tools.ListCatalog(site_id, M.source_type);
			}
			opt_obj.unshift({ "ClassifyId": 0, "Name": "全部" });
			$("#source_cata_select").hide();
			$("#source_cata_select").html("");
			$("#source_cata_select").setTemplateElement("select_opt_tmp");
			$("#source_cata_select").processTemplate(opt_obj);
			$("#source_cata_select").show();
		};

		if ($("#file_lists_wrap").size()) {
			$("#uploade_source_type").find("option:eq(0)").attr("selected", "selected");
			M.chage_updatef_select(true);
			M.chage_searcat_select(true);
			$("#uploade_source_type").change(function () { //上传类型选择切换对应上传的文件夹
				M.update_type = $(this).val();
				M.chage_updatef_select();
			});
			$(".js-catalog_search").click(function (event) { //搜索资源文件
				event.preventDefault();
				M.Search_state = true;
				M.pagegation_state_new = true;
				M.sear_cata = $("#source_cata_select").val();
				M.sear_keyname = $.trim($("#user_tname").val());
				if (M.tab_index == 0) {
					M.getImgs();
				}
				else if (M.tab_index == 1) {
					M.getflashes();
				}
			});
		}
		/*添加目录弹框*/
		$("#add_sourcecata").dialog({ autoOpen: false, position: 'center', width: 380 });

		/*添加文件夹相关操作*/
		$("#add_sourcecata").find(".cancel_btn").click(function (e) {
			e.preventDefault();
			$("#add_sourcecata").dialog('close');
		});
		$(".add_sourcecata_form").validate({//验证添加文件夹
			'rules': {
				'source_doucment_name': {
					'required': true
				}
			},
			'messages': {
				'source_doucment_name': {
					'required': "请填写名称"
				}
			},
			'submitHandler': function (form) {
				//M.change_cata_select();
				var siteId = Tools.GetParamSiteId(window.location);
				var name = $(".source_doucment_name").val();
				Tools.AddCatalog(siteId, M.source_type, name);
				event_do.poptip_output("添加文件夹成功", "success");
				M.chage_updatef_select();
				M.chage_searcat_select();
				$("#add_sourcecata").dialog("close");
			}
		});
		$("#add_sourcecata").find(".save_btn").click(function (e) {//保存添加文件夹
			e.preventDefault();
			//调用ajax添加进去
			$(this).next().trigger("click");

		});
		$('.js-add-sourcata').click(function (e) {
			e.preventDefault();
			$(".ui-dialog-content").dialog('close');
			$(".ui-dialog-content").find('.inputtxt').val();
			$("#add_sourcecata").dialog("open");
		});
		/*编辑文件夹弹框*/
		$("#edit_sourcecata").dialog({ autoOpen: false, position: 'center', width: 450 });

		/*编辑文件夹相关操作*/
		M.rename_cata_name = function () {//重命名文件夹
			$("#catalog_table").find(".js-rename_cata").each(function () {
				var data = $(this).data("clickbind");
				if (!data) {
					$(this).data("clickbind", "clickbind");
					$(this).click(function (event) {
						event.preventDefault();
						var ori_name = $(this).parents("tr").find(".cat_name");
						var input_name = $(this).parents("tr").find(".cat_reinput");
						input_name.val(ori_name.text()).show().focus();
					});

				}
			});

			$("#catalog_table").find(".cat_reinput").each(function () {
				var data = $(this).data("changebind");
				if (!data) {
					$(this).data("changebind", "changebind");
					var input_done = function () {
						var ori_name = $(this).parents("tr").find(".cat_name");
						if ($.trim($(this).val()) == ori_name.text()) {
							$(this).hide();
						}
						else if ($.trim($(this).val()) == "") {
							event_do.poptip_output("文件夹名不能为空！", "fail");
						}
						else {
							ori_name.text($.trim($(this).val()));
							$(this).hide();
							Tools.RenameCatalog(Tools.GetParamSiteId(window.location), $(this).data("id"), $(this).val());
							event_do.poptip_output("文件夹重命名成功", "success");
						}
					};
					$(this).blur(input_done);
					$(this).keydown(function (event) {
						if (event.which == 13) {
							input_done.apply(this);
						}
					}
					);
				}
			});

			$("#catalog_table").find(".js-delete_cata").each(function () {
				var data = $(this).data("changebind");
				if (!data) {
					$(this).data("changebind", "changebind");
					$(this).click(function (event) {
						event.preventDefault();
						var dataid = $(this).attr("data-id");
						if (confirm("文件夹删除同时,删除文件夹中的文件会移入临时文件夹")) {
							Tools.DeleteCatalog(Tools.GetParamSiteId(window.location), $(this).data("id"));
							$(this).parents("tr").remove();
							event_do.poptip_output("文件夹删除成功", "success");
						}
					});
				}
			});
		};
		$('.js-edit-sourcata').click(function (e) {//编辑文件夹
			e.preventDefault();
			$(".ui-dialog-content").dialog('close');
			var list = Tools.ListCatalog(Tools.GetParamSiteId(window.location), M.source_type);
			var opt_obj = Array.prototype.slice.call(list, 1);
			$("#catalog_table").html('');
			$("#catalog_table").setTemplateElement("edit_cata_tmp");
			$("#catalog_table").processTemplate(opt_obj);
			$("#edit_sourcecata").dialog("open");
			M.rename_cata_name();
		});


		/*资源文件管理文件类型切换tab*/
		if ($("#filemg_tabs").size() == 1) {
			$("#filemg_tabs").find("a").each(function (index) {
				$(this).click(function (event) {
					event.preventDefault();
					$("#data_page_nav").html("");
					M.pagegation_state_new = true;
					$("#filemg_tabs").find('a').removeClass("current");
					$(this).addClass("current");
					$("#soursemg_box").find(".soursemg_cell").hide();
					$("#soursemg_box").find(".soursemg_cell:eq(" + index + ")").show();
					M.source_type = $(this).data("type");
					M.Search_state = false;
					$("#source_cata_select").find("option:eq(0)").attr("selected", "selected");
					if (index == 0) {
						M.getImgs();
						M.tab_index = 0;
					}
					else if (index == 1) {
						M.getflashes();
						M.tab_index = 1;
					}
					M.chage_searcat_select();
				});
			});

		}

		$("#pa_editor").find(".page_name").val("");
		M.delete_page();
		M.l_link_act();
		M.ger_page_lists();
		M.get_site_lists();
		M.delete_site();
		M.edit_sites();
		$(window).resize(function () { M.re_height(); M.main_navi.ifs_tab(M.ifrs_index); });

		$("#add_page").dialog({ autoOpen: false, position: 'center', width: 350 }); //新建页面弹框
		$("#delete_page").dialog({ autoOpen: false, position: 'center', width: 350 }); //删除页面弹框
		$("#site_editing").dialog({ autoOpen: false, position: 'center', width: 350 }); //编辑站点弹框
		$("#delete_site").dialog({ autoOpen: false, position: 'center', width: 350 }); //删除站点弹框
		/*模板页列表操作*/
		$("#modpag_lists_pop").dialog({ autoOpen: false, position: 'center', width: 450 }); //模板页列表弹框
		$(".modpge_manage").click(function (event) {
			event.preventDefault();
			var opt_obj = Tools.ListPageTemplate(Tools.GetParamSiteId(window.location), "zh");
			$("#tb_modpag_lists").setTemplateElement("modpag_lists_temple");
			$("#tb_modpag_lists").processTemplate(opt_obj);
			$("#modpag_lists_pop").dialog("open");
			M.modpag_delete();
		});

		M.modpag_delete = function () { //删除模板页
			$("#tb_modpag_lists").find(".del_modpg").click(function (event) {
				event.preventDefault();
				var alias = $(this).data("alias");
				Tools.DeletePageTemplate(Tools.GetParamSiteId(window.location), "zh", alias);
				$(this).parents("tr").remove();
			});
		}

		$(".sub_navi").find(".add_1").click(function () {//点击添加页面
			$("#add_modepg_select").setTemplateElement("add_modepg_select_temple");
			var opt_obj = Tools.ListPageTemplate(Tools.GetParamSiteId(window.location), "zh");
			opt_obj.unshift({ Name: "不选择模板", AliasCode: 0 });
			$("#add_modepg_select").processTemplate(opt_obj);
			$("#add_page").dialog('open');
		});
		$("#add_page").find(".cancel_btn").click(function (e) {
			e.preventDefault();
			$("#add_page").dialog('close');
		});
		$("#add_page").find(".save_btn").click(function (e) {//添加页面
			e.preventDefault();
			var doc_name = $("#add_page").find(".doc_name").val();
			var pag_name = $("#add_page").find(".page_name").val();
			var modpg_code = $("#add_modepg_select").val();
			var reg = /^\w+$/;
			var gd = reg.test(doc_name);
			var con = $(".links_wrap").find('a[date-tip="' + doc_name + '"]').size();
			if (con) { event_do.poptip_output("已经有同名的页面存在！", "fail"); }
			else if (!gd) { event_do.poptip_output("请输入数字、26个英文字母或者下划线组成的名称", "fail"); }
			else if (!pag_name) { event_do.poptip_output("页面名称不能为空", "fail"); }
			else if (doc_name == "index") { event_do.poptip_output("不允许创建名index的页面", "fail"); }
			else {
				///返回页面信息
				if (modpg_code == 0) {
					var page = Tools.CreatePage(pag_name, doc_name, window.location);
				}
				else {
					var page = Tools.CreatePage(pag_name, doc_name, window.location, modpg_code);
				}
				if (page.PageId <= 0 || page == 0) {
					return false;
				}
				event_do.poptip_output("创建页面成功", "success");
				var add_link = '<div class="pagelt_link"><a title="' + page.FileName + ' " class="page_altlink" data-tip="' + page.FileName + '" data-pid=' + page.PageId + ' href="">' + page.Name + '</a><span class="lighty_btn set_modpage" data-filename="' + page.FileName + '" data-pid=' + page.PageId + '>模板</span><a class="checkpg_btn" data-filename="' + page.FileName + '" data-pid=' + page.PageId + '  href="#">签出</a></div>';
				$(".links_wrap").append(add_link);
				M.page_check_act();
				M.set_modpage_act();
				M.l_link_act();
				$(".links_wrap").find(".page_altlink:last").trigger('click');
				$("#add_page").dialog('close');
				$("#add_page").find(".doc_name").val("");
				$("#add_page").find(".page_name").val("");
				$('.cre_link').show();

			}
		});
		$("#pa_editor").find('.save_c').click(function (e) {//保存页面基本信息修改
			e.preventDefault();
			var p_name = $("#pa_editor").find(".page_name").val();
			var p_title = $("#pa_editor").find(".page_hdtitle").val();
			var p_keword = $("#pa_editor").find(".page_hdkeword").val();
			var p_des = $("#pa_editor").find(".page_des").val();
			if (!p_name) { alert("页面名称不能为空"); }
			else {
				$(".s_c_link").text(p_name);
				$(".s_c_link").attr("data-title", p_title);
				$(".s_c_link").attr("data-keyword", p_keword);
				$(".s_c_link").attr("data-des", p_des);
				$('.p_tip').text(p_name);
				var editing_pag = $(".links_wrap").find('.current');
				var pagecode = editing_pag.attr("data-tip");
				var br_link = window.location;
				var site_id = Tools.GetParamSiteId(br_link);
				var status = Tools.UpdatePage(site_id, pagecode, p_name, p_title, p_keword, p_des);
				if (status == 0) {
					event_do.poptip_output("页面信息保存成功！", "success");
				}
			}
		});
		/*发布站点*/
		//        $(".pub_site_btn").click(function (event) {//点击发布站点按钮
		//            event.preventDefault();
		//            var br_link = window.location;
		//            var site_id = Tools.GetParam(br_link);
		//            var public_state = Tools.Release(site_id);
		//            if (!public_state) {
		//                event_do.alerttip("站点发布成功");
		//            }
		//        });
		/*  siteInit         */
		$("#s_container").find(".add_site_btn").click(function (e) {//添加站点
			e.preventDefault();
			var site_name = $("#s_container .site_add_bx").find(".site_name").val();
			var app_name = $("#s_container .site_add_bx").find(".site_doc").val();
			var site = {};
			site.site_name = site_name;
			site.app_name = app_name;

			var siteid = Tools.createsite(site);
			if (siteid > 0) {
				window.location.href = "/home/Testtask";
			}

		});

		$("#s_container").find(".item").hover(function () {
			$(this).find(".site_actions").show();
		}, function () {
			$(this).find(".site_actions").hide();
		});

		/*应用选取icon添加*/
		M.add_app_icon = function () {
			if ($("ul#app_cate").size()) {
				$("ul#app_cate").find(".cate_hd").each(function () {
					var text = $.trim($(this).find(".cate_title").text());
					var target = $(this);
					switch (text) {
						case '产品系统':
							target.addClass("cate_app_product");
							break;
						case '相册系统':
							target.addClass("cate_app_albums");
							break;
						case '留言系统':
							target.addClass("cate_app_messages");
							break;
						case '用户系统':
							target.addClass("cate_app_users");
							break;
						case '新闻系统':
							target.addClass("cate_app_news");
							break;
						case '导航系统':
							target.addClass("cate_app_navis");
							break;
						case '资料下载系统':
							target.addClass("cate_app_filedownload");
							break;
						case '电子地图':
							target.addClass("cate_app_elemap");
							break;
						case '在线咨询':
							target.addClass("cate_app_consult");
							break;
						case '会员管理':
							target.addClass("cate_app_members");
							break;
						case '广告系统':
							target.addClass("cate_app_advertisement");
							break;
						case '邮件系统':
							target.addClass("cate_app_mailsys");
							break;
						case '短信系统':
							target.addClass("cate_app_smsys");
							break;
						case '企业微博':
							target.addClass("cate_app_compweibo");
							break;
						case '分享网站':
							target.addClass("cate_app_siteshare");
							break;
						case '招聘系统':
							target.addClass("cate_app_employsys");
							break;
						case '视频系统':
							target.addClass("cate_app_video");
							break;
						case '在线调查':
							target.addClass("cate_app_voteonline");
							break;
						case '公共应用':
							target.addClass("cate_app_commonmd");
							break;
						default:
							return;
					}
				});
			}
		};
		/*模块选取*/
		M.model_choose = function () {
			$("#pop_chkupdate_ware").dialog({ "autoOpen": false, "position": ["center", 100], "width": 700, "modal": true, "draggable": false }); //检查挂件更新
			M.object_length = function (obj) {
				var i = 0;
				for (var key in obj) {
					i++;
				}
				return i;
			};
			M.update_list = function (obj, num, type) {
				var list_str = "", detail_str = "";
				for (var key in obj) {
					var name = obj[key].Name;
					var detail_array = obj[key].Content;
					for (var i = 0, length = detail_array.length; i < length; i++) {
						detail_str += '<p class="update_d_text">' + detail_array[i] + '</p>';
					}
					list_str += '<li class="update_cell">' +
		'<div class="update_hd clearfix"><a href="javascript:void(0);" class="update_detail fr">【详情】</a><h3 class="update_tip">' + name + '</h3></div>' +
		'<div class="update_detail_bx">' + detail_str + '</div></li>';

				}
				if (type == "ware") {
					var updat_list = '<div class="update_title">' + num + '个应用系统可以更新</div><ul class="update_listes">' + list_str + '</ul>';
				}
				else if (type == "wiget") {
					var updat_list = '<div class="update_title">' + num + '个挂件可以更新</div><ul class="update_listes">' + list_str + '</ul>';
				}
				return updat_list;
			};
			M.watch_update_detail = function () {
				$("#pop_chkupdate_ware").find(".update_detail").click(function (event) {
					event.preventDefault();
					var togger_target = $(this).parent(".update_hd ").next();
					if (togger_target.is(":visible")) {
						togger_target.hide();
						$(this).text("【详情】");
					}
					else {
						$(".update_detail_bx").hide();
						togger_target.show();
						$(this).text("【收起】");
					}
				});
			};
			M.check_chkupdate_ware = function () {
				$("#chek_update_ware").click(function (event) {
					event.preventDefault();
					var msgs = Tools.AutoUpdate(Tools.GetParamSiteId(window.location));
					if (msgs.HavNewVersion) {
						var ware_refresh = msgs.ware;
						var widget_refresh = msgs.widget;
						var ware_re_num = M.object_length(ware_refresh);
						var widget_num = M.object_length(widget_refresh);
						if (ware_re_num || widget_num) {
							if (ware_re_num) {
								var update_str = M.update_list(ware_refresh, ware_re_num, "ware");
								$(".update_ware_box").html(update_str);
							}
							if (widget_num) {
								var update_str = M.update_list(widget_refresh, widget_num, "wiget");
								$(".update_wiget_box").html(update_str);
							}
							$("#pop_chkupdate_ware").find(".no_refreash_tip").hide();
							$(".upadete_ishaveversion").show();
							$("#Update_System_btn").show();
							M.watch_update_detail();
						}
					}
					else {
						$("#pop_chkupdate_ware").find(".no_refreash_tip").text('目前没有新的更新').show();
						$(".upadete_ishaveversion").hide();
						$("#Update_System_btn").hide();
					}
					$("#pop_chkupdate_ware").dialog("open");
				});
				$("#Update_System_btn").click(function (event) {
					event.preventDefault();
					Tools.UpdateSystem(Tools.GetParamSiteId(window.location));
				});
			};
			M.check_chkupdate_ware();

			M.model_info = function () {
				$('.models_lists a.mode_link').each(function () {  //挂件信息lightbox
					var click_bind = $(this).data("change_bind");
					if (!click_bind) {
						$(this).bind('click', function (event) {
							event.preventDefault();
							imageArray = [];
							$(this).parents(".models_lists").find("a.mode_link").lightBox();
							$(this).triggerHandler("click");
						});
						$(this).data("change_bind", "change_bind");
					}
				});
			};

			$("#app_cate").find(".cate_hd .cate_title").click(function (event) {
				event.preventDefault();
				$(this).next(".show_arrow").trigger("click");
			});
			$("#app_cate").find(".show_arrow").each(function () {
				var click_bind = $(this).data("change_bind");
				if (!click_bind) {
					$(this).click(function (event) {
						event.preventDefault();
						var app_lists = $(this).parents(".cate_hd").siblings(".app_blists");
						if (!app_lists.is(":visible")) {
							var app_blists = $(this).parents(".app_cate").find(".app_blists li");
							if (app_blists.size() < 1) {
								var app_blists_id = $(this).parents(".app_cate").find(".app_blists").attr("id").replace(/list_/, "");
								pagejscomm.LoadWare(app_blists_id); //加载应用下挂件列表
								M.model_actor();
								M.model_info();
								app_lists.slideDown();
								M.select_allmode_act();
							}
							else {
								app_lists.slideDown();
							}
							$(this).addClass("ar_up");
						}
						else {
							$(this).removeClass("ar_up");
							app_lists.slideUp();
						}
					});
				}
			});
			M.model_actor = function () {
				var mouseover_tid = []; //模块的操作按钮显示
				var mouseout_tid = [];
				$('.models_lists li').each(function (index) {
					$(this).hover(
			function () {
				var _self = $(this);
				clearTimeout(mouseout_tid[index]);
				mouseover_tid[index] = setTimeout(function () {
					_self.find('.action').animate({ marginTop: 0 }, 0);
				}, 0);
			},
			function () {
				var _self = $(this);
				clearTimeout(mouseover_tid[index]);
				mouseout_tid[index] = setTimeout(function () {
					_self.find('.action').animate({ marginTop: -25 }, 0);
				}, 0);
			}

		);
				});
				M.hrefEvent();
			};

			M.select_allmode_act = function () {
				$(".selectall_wiget_chk").each(function () {
					if ($(this).parents(".app_line").find(".enable_model").size() == $(this).parents(".app_line").find(".disable_model").size()) {
						$(this).attr("checked", "checked");
					}
					var bind_change = $(this).data("bind_change");
					if (!bind_change) {
						$(this).data("bind_change", "bind_change");
						$(this).change(function () {//全选挂件checkbox操作
							if ($(this).is(":checked")) {
								var mod_array = $(this).parents(".app_line").find(".enable_model").not(".disable_model");
								var id_str = ""; //挂件id数组
								var length = mod_array.size();
								mod_array.each(function (index) {
									if (index == length - 1) {
										id_str += $(this).attr("wid");
									}
									else {
										id_str += $(this).attr("wid") + ",";
									}
								});
								pagejscomm.SelectWidget(id_str, mod_array, null, true);
							}
							else {
								var mod_array = $(this).parents(".app_line").find(".disable_model");
								var id_str = ""; //挂件id数组
								var length = mod_array.size();
								mod_array.each(function (index) {
									if (index == length - 1) {
										id_str += $(this).attr("wid");
									}
									else {
										id_str += $(this).attr("wid") + ",";
									}
								});
								pagejscomm.UnBindWidget(id_str, mod_array, null, true);
							}
						});
					}
				});
			};

			M.hrefEvent = function () {//模块的操作按钮事件绑定
				var id = '';
				$('.models_lists li .enable_model').each(function () {
					var bindclick = $(this).data('bindclick');
					if (!bindclick) {
						$(this).click(function (e) {
							id = $(this).attr('wid');
							e.preventDefault();
							if ($(this).hasClass("disable_model"))
								pagejscomm.UnBindWidget(id, $(this), $(this).parent().parent().parent());
							else
								pagejscomm.SelectWidget(id, $(this), $(this).parent().parent().parent());
						});
						$(this).data('bindclick', 'bindclick');
					}
				});
			};

			M.model_actor();
			$(".show_arrow:eq(0), .app_cate:eq(0)").trigger("click"); //自动展开第一个应用
		};
		/*获取站点的在线账号*/
		M.GetAccountHtml = function (siteid, userid) {
			var result;
			$.ajax({
				type: "post",
				url: "/Home/AccountNum",
				dataType: "json",
				async: false,
				data: { siteid: siteid, userid: userid },
				success: function (data) {
					if (data != null) {
						result = data.html;
					}
				}
			});
			return result;
		};
		/*添加站点的在线账号*/
		M.AddAccount = function (siteid, type, num, uname, userid) {
			var result = null;
			$.ajax({
				type: "post",
				url: "/Home/AddAccountNum",
				dataType: "json",
				async: false,
				data: { siteid: siteid, type: type, num: num, uname: uname, userid: userid },
				success: function (data) {
					if (data != null) {
						if (data.code > 0) {
							result = data.html;
						}
					}
				}
			});
			return result;
		}
		/*删除站点的在线账号*/
		M.DeleteAccount = function (siteid, cid) {
			$.ajax({
				type: "post",
				url: "/Home/IMdelete",
				async: false,
				dataType: "json",
				data: { siteid: siteid, cid: cid },
				success: function (data) {
					if (data != null) {
						event_do.poptip_output("删除成功", "success");
					}
				}
			})
		}
		/*更新站点的在线账号*/
		M.UpdateAccount = function (siteid, cid, type, num, uname, userid) {
			var result;
			$.ajax({
				type: "post",
				url: "/Home/UpdateAccountNum",
				async: false,
				dataType: "json",
				data: { siteid: siteid, cid: cid, type: type, num: num, uname: uname, userid: userid },
				success: function (data) {
					if (data != null) {
						if (data.code == 1) {
							result = data.html;
						}
					}
				}
			});
			return result;
		}
		/*获取更新站点的在线账号的信息*/
		M.GetUpdateAccount = function (siteid, cid) {
			var result;
			$.ajax({
				type: "post",
				url: "/Home/GetImUpdate",
				dataType: "json",
				async: false,
				data: { siteid: siteid, cid: cid },
				success: function (val) {
					if (val != null) {
						/*siteid, cid, uname, num, type e*/
						result = val;
					}
				}
			});
			return result;
		}
		/*IM左侧浮动框*/
		$("#leftIMbx").each(function () {
			var siteId = Tools.GetParamSiteId(window.location);
			var userId = $(this).attr("datat-userid");
			M.imuserId = userId;
			var IMlist = M.GetAccountHtml(siteId, userId);
			var _that = $(this);
			_that.find('.ltIMlist').html(IMlist);
			//_that.xjf_posFixed({ top_gap: 160 });

			_that.css("visibility", "visible");
		});
		$("#leftIMbx").xjf_posFixed({ top_gap: 160 });
		$(window).scroll(function () {
			$("#leftIMbx").xjf_posFixed({ top_gap: 160 });
		});

		$("#edit_IM_pop").dialog({ autoOpen: false, position: 'center', width: 450, "resizable": false }); //编辑IM列表弹框
		$('.liIMsetbtn').click(function (event) { //弹出IM列表弹框
			event.preventDefault();
			var siteId = Tools.GetParamSiteId(window.location);
			var IMlist = M.GetAccountHtml(siteId, M.imuserId);
			$("#edit_IM_pop").find('.ltIMlist').html(IMlist);
			M.deleteIm();
			M.editIM();
			$("#edit_IM_pop").dialog("open");
		});
		$("#leftIMbx").find(".fold_arrow").click(function () {//显示IM列表框
			if ($(this).hasClass("unfold_arrow")) {
				$(this).removeClass("unfold_arrow");
				$("#leftIMbx").css("right", -204);
			}
			else {
				$(this).addClass("unfold_arrow");
				$("#leftIMbx").css("right", 0);
			}
		});

		M.deleteIm = function () { //删除IM
			$("#edit_IM_pop").find('.IMDelete').each(function () {
				var bindclick = $(this).data("bindclick");
				if (!bindclick) {
					$(this).data("bindclick", "bindclick");
					$(this).click(function (event) {
						event.preventDefault();
						var data_id = $(this).parents("li").attr("data_id");
						var siteId = Tools.GetParamSiteId(window.location);
						M.DeleteAccount(siteId, data_id);
						$('.lfimlistcell[data_id=' + data_id + ']').fadeOut(1000).remove();
					});
				}
			});
		};

		M.editIM = function () { //编辑IM
			$("#edit_IM_pop").find('.IMEdit').each(function () {
				var bindclick = $(this).data("bindclick");
				if (!bindclick) {
					$(this).data("bindclick", "bindclick");
					$(this).click(function (event) {
						event.preventDefault();
						M.edit_state = "edit";
						var data_id = $(this).parents("li").attr("data_id");
						M.data_id = data_id;
						var siteId = Tools.GetParamSiteId(window.location);
						var im_json = M.GetUpdateAccount(siteId, data_id);
						var uname = im_json.uname; //用户名
						var num = im_json.num; //IM账号
						var type = im_json.type; //账号类型
						$("#edit_IM_pop").find('.IMusername').val(uname);
						$("#edit_IM_pop").find('.IMaccount').val(num);
						$("#sel_im_type").find("option[value=" + type + "]").attr('selected', 'selected');
						$(".edit_IM_inner ").animate({
							marginLeft: -450
						}, { duration: 450, easing: "easeOutQuad" });
					});
				}
			});
		};
		$("#edit_IM_pop").find(".IM_add_btn").click(function (event) { //添加IM
			event.preventDefault();
			M.edit_state = "add";
			$("#edit_IM_pop").find('.IMusername').val("");
			$("#edit_IM_pop").find('.IMaccount').val("");
			$(".edit_IM_inner ").animate({
				marginLeft: -450
			}, { duration: 450, easing: "easeOutQuad" });

		});
		$("#edit_IM_pop").find('.back_bx1').click(function (event) {
			event.preventDefault();
			$(".edit_IM_inner ").animate({
				marginLeft: 0
			}, { duration: 450, easing: "easeOutQuad" });
		});
		$("#edit_IM_pop").find('.im_save_btn').click(function (event) {//添加按钮
			event.preventDefault();
			$(".sumbit_im_input").trigger("click");
		});

		jQuery.validator.addMethod("checkIM", function (value, element) {   /*验证英文字符*/
			var data_type = $("#sel_im_type").val();
			var IMaccount = $("#edit_IM_pop").find('.IMaccount').val();
			if (data_type == 1) {
				var qqre = /^\d+(?=\.{0,1}\d+$|$)/;
				if (qqre.test(IMaccount)) {
					return true;
				}
				else {
					return false;
				}
			}
			else if (data_type == 2) {
				return true;
			}
			else if (data_type == 3) {
				return true;
			}
		}, "    <font color='red'>验证错误</font>");
		$("#edit_IM_pop").find("form").validate({//验证添加IM的form
			'rules': {
				'IMusername': {
					'required': true
				},
				'IMaccount': {
					'required': true,
					'checkIM': true
				}
			},
			'messages': {
				'IMusername': {
					'required': "请填写用户名称"
				},
				'IMaccount': {
					'required': "请填写IM账号",
					'checkIM': "IM账号格式不正确"
				}
			},
			'focusInvalid ': false,
			'onkeyup': false,
			'onfocusout': false,
			'submitHandler': function (form) {
				var IMusername = $("#edit_IM_pop").find('.IMusername').val();
				var IMaccount = $("#edit_IM_pop").find('.IMaccount').val();
				var data_type = $("#sel_im_type").val();
				var siteId = Tools.GetParamSiteId(window.location);
				if (M.edit_state == "add") {
					M.AddAccount(siteId, data_type, IMaccount, IMusername, M.imuserId); //ajax方法
				}
				else {
					M.UpdateAccount(siteId, M.data_id, data_type, IMaccount, IMusername, M.imuserId);
				}
				event_do.poptip_output("保存成功", "success");
				var siteId = Tools.GetParamSiteId(window.location);
				var IMlist = M.GetAccountHtml(siteId, M.imuserId);
				$("#leftIMbx .ltIMlist,#edit_IM_pop .ltIMlist").html(IMlist);
				$(".edit_IM_inner ").animate({
					marginLeft: 0
				}, { duration: 450, easing: "easeOutQuad" });
				M.deleteIm();
				M.editIM();

			}
		});
		/*拷贝站点*/
		if ($("#delete_testdata_pop").size()) {
			$("#clone_site_to").dialog({ autoOpen: false, position: 'center', width: 350 });
			var now_langue = $("#hid_session_currentlanguage").val();

			$(".clone_site_to").click(function (event) {
				event.preventDefault();
				var lan_obj = Tools.ListLanguage(Tools.GetParamSiteId(window.location));
				var lan_obj_length = 0;
				for (var key in lan_obj) {
					lan_obj_length++;
				}
				if (lan_obj_length == 1) {
					event_do.poptip_output("目前只有当前一个语言版本", "fail");
				}
				else {
					var str = "";
					for (var key in lan_obj) {
						if (key != now_langue) {
							str += '<li class="fl"><input type="checkbox" value="' + key + '" class="lan_chk" /><span class="lan_name">' + lan_obj[key] + '</span></li>'
						}
					}
					$(".js-lan_lists").html(str);
					$(".js-lan_lists .lan_chk").change(function () {
						if ($(this).is(":checked")) {
							$(".js-lan_lists .lan_chk").removeAttr("checked");
							$(this).attr("checked", "checked");
						}
					});
					//ajax取出语言版本
					$("#clone_site_to").dialog("open");
				}
			});

			$("#clone_site_to").find(".save_btn").click(function (event) {
				event.preventDefault();
				if ($(".js-lan_lists .lan_chk:checked").size() == 0) {
					event_do.poptip_output("请选择要拷贝到的语言版本", "fail");
				}
				else {
					var site_id = Tools.GetParamSiteId(window.location);
					var current_lan = $("#hid_session_currentlanguage").val();
					var target_lan = $(".js-lan_lists .lan_chk:checked").val();
					Tools.CopySite(site_id, current_lan, target_lan);
					$("#clone_site_to").dialog("close");
				}

			});

			$("#clone_site_to").find(".cancel_btn").click(function (event) {
				event.preventDefault();
				$("#clone_site_to").dialog("close");
			});
		}

		/*头部切换语言版本的下拉框*/
		if ($(".hdselects_word_verson").size()) {
			var lan_obj = Tools.ListLanguage(Tools.GetParamSiteId(window.location));
			var now_lan = $("#hid_session_currentlanguage").val();
			var str = "";
			for (var key in lan_obj) {
				if (key == now_lan) {
					str += '<option value="' + key + '" selected="selected">' + lan_obj[key] + '</option>';
				}
				else {
					str += '<option value="' + key + '" >' + lan_obj[key] + '</option>';
				}
			}
			$(".hdselects_word_verson").html(str);
			$(".hdselects_word_verson").change(function () {
				var change_lan = $(this).val();
				Tools.ChangeLanguage(Tools.GetParamSiteId(window.location), change_lan);
			});
		}
		/*打包下载和FTP上传前确认是否删除测试数据*/

		if ($("#delete_testdata_pop").size()) {
			M.down_method = "";
			$("#js-zip-site").click(function (event) { //打包站点
				event.preventDefault();
				M.down_method = "Zip";
				$("#delete_testdata_pop").dialog("open");
			});

			M.clearFtpcate = function () {//清空网站类型选择
				$(".js-ftp-scate").find("input").removeAttr("checked");
			};
			M.clearFtpcate();
			$("#package-pop").dialog({ autoOpen: false, position: 'center', width: 350 }); //选择打包下载站点类型
			$("#package-pop").find(".save_btn").click(function (event) {//确定选择打包类型
				event.preventDefault();
				if ($(".js-package-cate").find("input:checked").size() == 0) {
					event_do.poptip_output("至少选择一种语言版本", "fail");
				}
				else {
					var lan_array = [];
					$(".js-package-cate").find("input:checked").each(function () {
						var lan_value = $(this).val();
						lan_array.push(lan_value);
					});
					var siteid = Tools.GetParamSiteId(window.location);
					var zip_href = $("#js-zip-site").attr("data-href");
					window.location = zip_href + "&mtp=" + lan_array;
					//Tools.packageDownload(siteid,lan_array);需要添加一个打包的ajax函数
				}
			});
			$("#package-pop").find(".cancel_btn").click(function (event) {
				event.preventDefault();
				$("#package-pop").dialog("close");
			});

			$("#delete_testdata_pop").dialog({ autoOpen: false, position: 'center', width: 350 }); //新建页面弹框
			$("#delete_testdata_pop").find(".save_btn").click(function (event) {//确定删除数据
				event.preventDefault();
				Tools.DeleteTestData(Tools.GetParamSiteId(window.location));
				if (M.down_method == "Ftp") {//ftp上传
					if (!M.now_ftping) {
						M.clearFtpcate();
						$("#ftp_release_pop").find('.ftp_step_wrap').css("marginLeft", 0);
						M.ReleaseSite();
					}
				}
				else if (M.down_method == "Zip") {
					event_do.poptip_output("测试数据已移除，打包数据中", "success");
					var zip_href = $("#js-zip-site").attr("data-href");
					$("#package-pop").dialog("open");
					//window.location = zip_href;
				}
			});

			$("#delete_testdata_pop").find(".cancel_btn").click(function (event) {//不删除数据，继续操作
				event.preventDefault();
				if (M.down_method == "Ftp") {//ftp上传
					$("#delete_testdata_pop").dialog("close");
					if (!M.now_ftping) {
						M.clearFtpcate();
						$("#ftp_release_pop").find('.ftp_step_wrap').css("marginLeft", 0);
						$("#package-pop").dialog("open");
						M.ReleaseSite();
					}
				}
				else if (M.down_method == "Zip") {
					$("#delete_testdata_pop").dialog("close");
					var zip_href = $("#js-zip-site").attr("data-href");
					$("#package-pop").dialog("open");
					//window.location = zip_href;
				}
			});
		}

		$("#ftp_release_pop").dialog({ autoOpen: false, position: 'center', width: 450, "resizable": false }); //编辑IM列表弹框
		//FTP上传按钮
		M.now_ftping = false;
		$(".pub_ftp_btn").click(function (event) {
			event.preventDefault();
			M.down_method = "Ftp";
			$("#delete_testdata_pop").dialog("open");

			//$("#ftp_release_pop").dialog("open");
		});
		M.ReleaseSite = function () {//FTP上传
			if (!$("#ftp_release_pop").is(":visible")) {
				$(".ftp_success").hide();
			}
			$("#ftp_release_pop").dialog("open");
		}
		$(".ftp_rel_link").click(function (event) {
			event.preventDefault();
			$(".sumbit_ftp_input").trigger('click');
		})

		jQuery.validator.addMethod("selectftpcat", function () {
			if ($(".js-ftp-scate .js-ftp-sc:checked").size() == 0) {
				return false;
			}
			else {
				return true;
			}
		}, "请至少选择一种类型");
		$("#ftp_release_pop").find("form").validate({//验证添加IM的form
			'rules': {
				'ftpIp': {
					'required': true
				},
				'ftpAccount': {
					'required': true
				}
				,
				'ftpPsd': {
					'required': true
				},
				'forftpcat': {
					'selectftpcat': true
				}
			},
			'messages': {
				'ftpIp': {
					'required': "请填IP地址"
				},
				'ftpAccount': {
					'required': "请填写FTP帐号"
				},
				'ftpPsd': {
					'required': "请填写FTP密码"
				}
			},
			'submitHandler': function (form) {
				M.Release();
				//				M.Release();
				//				if (M.connect_state == 1) {
				//					$("#ftp_release_pop").find('.ftp_step_wrap').animate({
				//						marginLeft: -450
				//					}, { duration: 500, complete: function () {
				//						M.GetDownLoadLists(M.ftp_obj);
				//						if (M.download_num == 0) {
				//							$(".ftp_download_bx .ftp_barinner").stop().animate({ 'width': 100 + "%" }, 0);
				//							$(".ftp_download_bx .num").stop().animate({ 'left': 100 + "%" }, 0);
				//							$(".ftp_download_bx .num").text(100 + "%");
				//							$('.ftp_success').show(100).delay(1000).queue(function () { M.GetUploadLists(); });
				//						}
				//						else {
				//							M.DownLoad(M.download_Lists[0]);
				//						}
				//					}, easing: "easeOutQuad"
				//					});
				//				}
			}
		});
		M.Release = function () {
			var ip = $("#ftpIp").val();
			var name = $("#ftpAccount").val();
			var pwd = $("#ftpPsd").val();
			var root = $("#ftpdocument").val();
			var siteid = Tools.GetParamSiteId(window.location);
			var lan_array = []; //网站类型数组
			$(".js-ftp-scate").find(".js-ftp-sc:checked").each(function () {
				var lan_value = $(this).val();
				lan_array.push(lan_value);
			});
			Tools.FtpRelease(siteid, ip, name, pwd, root, lan_array);
		};
		//获取下载列表
		M.GetDownLoadLists = function (ftp) {
			$.ajax({
				url: "/Home/GetDownLoadLists",
				type: "post",
				dataType: "json",
				data: ftp,
				async: false,
				success: function (val) {
					if (val.Code == 1) {
						M.download_Lists = val.List;
						M.download_num = M.download_Lists.length;
						var myDate = new Date();
						var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
						var month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
						var date = myDate.getDate();        //获取当前日(1-31)
						var hour = myDate.getHours();       //获取当前小时数(0-23)
						var minute = myDate.getMinutes() + 1;     //获取当前分钟数(0-59)
						var second = myDate.getSeconds() + 1;     //获取当前秒数(0-59)
						M.backup_time = year + "_" + month + "_" + date + "_" + hour + "_" + minute + "_" + second;
					}
					else {
						event_do.poptip_output("下载列表获取失败", "fail");
					}
				}
			})
		}
		//下载文件
		M.DownLoad = function (list) {
			for (var item in M.ftp_obj) {
				list[item] = M.ftp_obj[item];
			}
			if (list.isDirectory) {
				list.isDirectory = 1;
			}
			else {
				list.isDirectory = 0;
			}
			list.backupName = M.backup_time;
			$.ajax({
				url: "/Home/FtpDownLoad",
				type: "post",
				dataType: "json",
				data: list,
				success: function (val) {
					if (val.Code == 1) {
						var now_length = M.download_Lists.length;
						if (now_length > 1) {
							var percent = (M.download_num - now_length + 1) / M.download_num * 100;
							percent = M.unberfloatone(percent);
							M.download_Lists.shift();
							$(".ftp_download_bx .num").stop().css({ 'left': percent + "%" });
							$(".ftp_download_bx .num").text(percent + "%");
							$(".ftp_download_bx .ftp_barinner").stop().css({ 'width': percent + "%" });
							M.DownLoad(M.download_Lists[0]);
						}
						else if (now_length == 1) {
							$(".ftp_download_bx .ftp_barinner").stop().css({ 'width': 100 + "%" });
							$(".ftp_download_bx .num").stop().css({ 'left': 100 + "%" });
							$(".ftp_download_bx .num").text(100 + "%");
							M.Zipdownload();
						}
					}
					else if (val.Code == 0) {
						M.DownLoad(M.download_Lists[0]);
					}
					else {
						event_do.poptip_output("下载失败", "fail");
					}
				}
			})
		}
		//打包备份文件
		M.Zipdownload = function () {
			var obj = {};
			obj.siteid = Tools.GetParamSiteId(window.location);
			obj.backupName = M.backup_time;
			$.ajax({
				url: "/Home/BackUp",
				type: "post",
				dataType: "json",
				data: obj,
				success: function (val) {
					if (val.Code == 1) {
						$('.ftp_success').show(100).delay(1000).queue(function () { M.GetUploadLists(); });
					}
					else {
						event_do.poptip_output("备份打包失败", "fail");
					}
				}
			})
		}
		//获取上传列表
		M.GetUploadLists = function () {
			var obj = {};
			obj = M.ftp_obj;
			$.ajax({
				url: "/Home/GetUploadLists",
				type: "post",
				dataType: "json",
				data: obj,
				success: function (val) {
					if (val.Code == 1) {
						M.Upload_Lists = val.List;
						M.upload_num = M.Upload_Lists.length;
						$("#ftp_release_pop").find('.ftp_step_wrap').animate({
							marginLeft: -900
						}, { duration: 500, easing: "easeOutQuad", complete: function () { M.Upload(M.Upload_Lists[0]); } });
					}
					else {
						event_do.poptip_output("上传列表获取失败", "fail");
					}
				}
			})
		}
		M.unberfloatone = function returnFloat1(value) { //保留一位小数点
			value = Math.round(parseFloat(value) * 10) / 10;
			if (value.toString().indexOf(".") < 0)
				value = value.toString() + ".0";
			return value;
		};
		//上传文件
		M.Upload = function (list) {
			for (var item in M.ftp_obj) {
				list[item] = M.ftp_obj[item];
			}
			if (list.isDirectory) {
				list.isDirectory = 1;
			}
			else {
				list.isDirectory = 0;
			}
			$.ajax({
				url: "/Home/FtpUpload",
				type: "post",
				dataType: "json",
				data: list,
				async: false,
				success: function (val) {
					if (val.Code == 1) {
						var now_length = M.Upload_Lists.length;
						if (now_length > 1) {
							var percent = (M.upload_num - now_length) / M.upload_num * 100;
							percent = M.unberfloatone(percent);
							M.Upload_Lists.shift();
							$(".ftp_upload_bx .ftp_barinner").stop().css({ 'width': percent + "%" });
							$(".ftp_upload_bx .num").stop().css({ 'left': percent + "%" });
							$(".ftp_upload_bx .num").text(percent + "%");
							M.Upload(M.Upload_Lists[0]);
						}
						else if (now_length == 1) {
							$(".ftp_upload_bx .ftp_barinner").stop().css({ 'width': 100 + "%" });
							$(".ftp_upload_bx .num").text(100 + "%");
							$("#ftp_release_pop").find('.ftp_step_wrap').animate({
								marginLeft: -1350
							}, { duration: 500, easing: "easeOutQuad" });
						}
					}
					else if (val.Code == 0) {
						M.Upload(M.Upload_Lists[0]);
					}
					else {
						event_do.poptip_output("上传失败", "fail");
					}
				}
			})
		};

		//导入数据库的功能
		if ($(".js-database-pop").size()) {
			$(".js-database-pop").dialog({ autoOpen: false, position: 'center', width: 350 });
			$(".js-import-databse").click(function (event) {
				event.preventDefault();
				var listStr = "",
					lan_obj = Tools.ListLanguage(Tools.GetParamSiteId(window.location));
				for (var key in lan_obj) {
					listStr += '<li><label class="lan_name">' + lan_obj[key] + '</label><input class="lan_file" type="file" name="' + key + '" id="" /></li>';
				}
				$(".js-datbase-lists").html(listStr);
				$(".js-database-pop").dialog("open");
			});

			$(".js-database-pop").find(".save_btn").click(function (event) {
				event.preventDefault();
				$(".js-database-form").submit();
			});

			$(".js-database-pop").find(".cancel_btn").click(function (event) {
				event.preventDefault();
				$(".js-database-pop").dialog("close");
			});
		}

		//取回上传的功能
		if ($(".js-pubback-pop")) {
			//清除选择图片文件复选框状态
			$(".js-pubcheck").removeAttr("checked");
			//取回网站文件操作
			function getBackStatus(ajaxdata){//计时获取取回的信息
				$.ajax({
					url: '/Assemble/GetUpdateState',
					type: 'post',
					dataType: 'json',
					data: ajaxdata,
					success: function (val) {
						if (val.Code == 0) {
							//val.Step;//当前状态，0-5，0未开始，1，准备工作，包括停止iis，2备份网站，3检查数据是否更新，更新数据库，4同步文件，5表示已完成
							//val.Total;//文件总数
							//val.Complete;//已上传文件数
							//val.Message;//当前输出消息
							if(val.Step==5){
								$(".js-pubback-getbox .loading-bar_inner").stop().css({ 'width': 100 + "%" });
								$(".js-pubback-getbox .loading-bar_num").text(100 + "%");
								$(".js-pubback-getbox .loading-tip").html(val.Message);
								setTimeout(function(){
									$(".js-pubbackbx").hide();
									$(".js-pubback-acts").fadeIn();
									$(".js-pubback-getbox .loading-tip").html("开始取回网站文件");
									$(".js-pubback-getbox .loading-bar_inner").stop().css({ 'width': 0 });
									$(".js-pubback-getbox .loading-bar_num").text(0 + "%");
								},2000);
								return;
							}
							else{
								setTimeout(function(){
									$(".js-pubback-getbox .loading-tip").html(val.Message);
									if(val.Step==4){
										var percent = val.Complete/ val.Total * 100;
										percent = M.unberfloatone(percent);
										$(".js-pubback-getbox .loading-bar_inner").stop().css({ 'width': percent+"%" });
										$(".js-pubback-getbox .loading-bar_num").text(percent + "%");
									}
									getBackStatus(ajaxdata);
								},1000);
							}
						}
					}
				});
			}
			$(".js-pubback-getbtn").click(function (event) {
				event.preventDefault();
				var d = {};
				d.siteId = Tools.GetParamSiteId(window.location);
				if($(".js-pubcheck").is(":checked")){
					d.isupdate = 1;
				}
				else{
					d.isupdate = 0;
				}
				d.type = 1;
				$.ajax({
					url: '/Assemble/CheckSiteInfo',
					type: 'post',
					dataType: 'json',
					data: d,
					success: function (val) {
						if (val.Code == 0) {
							$(".js-pubbackbx").hide();
							$(".js-pubback-getbox").fadeIn(1000,function(){
								$.ajax({
									url: '/Assemble/StartUpdateSite',
									type: 'post',
									dataType: 'json',
									data: d,
									success: function (val) {
										
									}
								});
								getBackStatus(d);
							});
							


						} else if (val.Code == -402) {
							o.RedictToUserLogin(val.msg);
						} else {
							event_do.poptip_output("请绑定服务器账号后再操作", "fail");
						}
					}
				});
			});
			//上传网站文件操作
			function pupUpStatus(ajaxdata){//计时获取上传的信息
				$.ajax({
					url: '/Assemble/GetUpdateState',
					type: 'post',
					dataType: 'json',
					data: ajaxdata,
					success: function (val) {
						if (val.Code == 0) {
							//val.Step;//当前状态，0-5，0未开始，1，准备工作，包括停止iis，2备份网站，3检查数据是否更新，更新数据库，4同步文件，5表示已完成
							//val.Total;//文件总数
							//val.Complete;//已上传文件数
							//val.Message;//当前输出消息
							if(val.Step==5){
								$(".js-pubback-pubbox .loading-bar_inner").stop().css({ 'width': 100 + "%" });
								$(".js-pubback-pubbox .loading-bar_num").text(100 + "%");
								$(".js-pubback-pubbox .loading-tip").html(val.Message);
								setTimeout(function(){
									$(".js-pubbackbx").hide();
									$(".js-pubback-acts").fadeIn();
									$(".js-pubback-pubbox .loading-tip").html("开始上传网站文件");
									$(".js-pubback-pubbox .loading-bar_inner").stop().css({ 'width': 0 });
									$(".js-pubback-pubbox .loading-bar_num").text(0 + "%");
								},2000);
								return;
							}
							else{
								setTimeout(function(){
									$(".js-pubback-pubbox .loading-tip").html(val.Message);
									if(val.Step==4){
										var percent = val.Complete/ val.Total * 100;
										percent = M.unberfloatone(percent);
										$(".js-pubback-pubbox .loading-bar_inner").stop().css({ 'width': percent+"%" });
										$(".js-pubback-pubbox .loading-bar_num").text(percent + "%");
									}
									pupUpStatus(ajaxdata);
								},1000);
							}
						}
					}
				});
			}
			$(".js-pubback-pubbtn").click(function (event) {
				event.preventDefault();
				var d = {};
				d.siteId = Tools.GetParamSiteId(window.location);
				if($(".js-pubcheck").is(":checked")){
					d.isupdate = 1;
				}
				else{
					d.isupdate = 0;
				}
				d.type = 2;
				$.ajax({
					url: '/Assemble/CheckSiteInfo',
					type: 'post',
					dataType: 'json',
					data: d,
					success: function (val) {
						if (val.Code == 0) {//todo 让用户选择是否包括后台上传的文件，并告诉他上传文件多的话，会影响上传速度
							$(".js-pubbackbx").hide();
							$(".js-pubback-pubbox").fadeIn();

							//触发上传
							$.ajax({
								url: '/Assemble/StartUpdateSite',
								type: 'post',
								dataType: 'json',
								data: d,
								success: function (val) {
									pupUpStatus(d);
								}
							});

							
						} else if (val.Code == -402) {
							o.RedictToUserLogin(val.msg);
						} else {
							event_do.poptip_output("请绑定服务器账号后再操作", "fail");
						}
					}
				});
			});

			//设置账号
			$(".js-pubback-setbtn").click(function (event) {
				event.preventDefault();
				$(".js-pubback-box2").show();
				$(".js-pubback-box1").hide();
			});
			$(".js-pubacback-btn").click(function (event) {
				event.preventDefault();
				$(".js-pubback-box1").show();
				$(".js-pubback-box2").hide();
			});
			$(".js-pubback-pop").dialog({ autoOpen: false, position: 'center', width: 450, "resizable": false }); //编辑IM列表弹框
			$(".js-pubback").click(function (event) {
				event.preventDefault();
				$(".js-pubback-pop").dialog("open");
			});
			$(".js-pubaccount-btn").click(function (event) {
				event.preventDefault();
				$(".js-pubaccount-submit").trigger('click');
			})
			$(".js-pubaccount").validate({//验证取回上传账号绑定验证
				'rules': {
					'puback_url': {
						'required': true
					},
					'puback_account': {
						'required': true
					},
					'pubback_psd': {
						'required': true
					}
				},
				'messages': {
					'puback_url': {
						'required': "请填域名地址"
					},
					'puback_account': {
						'required': "请填写帐号"
					},
					'pubback_psd': {
						'required': "请填写密码"
					}
				},
				'submitHandler': function (form) {
					//ajax执行ftp信息保存
					var d = {};
					d.siteId = Tools.GetParamSiteId(window.location);
					d.url = $("#puback_url").val();
					d.sitename = $("#puback_account").val();
					d.pwd = $("#pubback_psd").val();
					var result = false;
					$.ajax({
						url: '/Assemble/UpdateSiteInfo',
						type: 'post',
						dataType: 'json',
						data: d,
						async: false,
						success: function (val) {
							if (val.Code == 0) {
								event_do.poptip_output("账号设置成功", "success");
								$(".js-pubback-box1").show();
								$(".js-pubback-box2").hide();
							} else if (val.Code == -402) {
								o.RedictToUserLogin(val.msg);
							} else {
								event_do.poptip_output("账号密码不匹配", "fail");
							}
						}
					});
				}
			});
		}

	})(admin_js);
});


