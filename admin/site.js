window.Zqm = {};
(function (Z) {
     Z.poptip_output=function(info,outstate,refresh){//操作结果提示框
        var poptip_bx=$("#processTip").find('.pro_wrap');
        if(outstate=="success"){
            poptip_bx.find(".text").text(info);
            if(refresh==true){
            poptip_bx.attr("class","pro_wrap pro_success").show(0,function(){          
                                                                            window.location.reload();
                                                                           });
             }
             else{
              poptip_bx.attr("class","pro_wrap pro_success").show().delay(2000).fadeOut();
             }
        }
        else if(outstate=="fail"){
            poptip_bx.find(".text").text(info);
            poptip_bx.attr("class","pro_wrap pro_warning").show().delay(2000).fadeOut();
        }
        else if(outstate=="loading")
        {
            poptip_bx.find(".text").text(info);
            poptip_bx.attr("class","pro_wrap pro_loading").show();
        }
    };
	Z.chage_mname = function () {//编辑分类
		$("#pop_manage_cate").find(".change_cname").each(function () {
			var change = $(this).data("change_bind");
			if (!change) {
				$(this).click(function (event) {
					event.preventDefault();
					$(".mg_cate_bx").animate({ 'marginLeft': -580 }, 500);
					var parents = $(this).parents("tr");
					var ori_mname = parents.find('.ori_mname').text();
					var mc_des = parents.find('.mc_des').text();
					$("#edcate_name").val(ori_mname);
					$("#edcate_des").val(mc_des);
					Z.cate_id = $(this).attr("data_id");
				});
				$(this).data("change_bind", "change_binded");
			}
		});
		$(".cancel_edit").click(function () { $(".mg_cate_bx").animate({ 'marginLeft': 0 }, 500); });
	};
	Z.editro_mcate = function () {//编辑保存挂件分类
		var edcate_name = $('#edcate_name').val();
		var edcate_des = $('#edcate_des').val();
		UpdateClassify(Z.cate_id, edcate_name, edcate_des);
	};

	Z.model_cate = function () {
		$(".model_cate_btn").each(function () {//挂件分类
			var click_bind = $(this).data("click_bind");
			var wareId = $(this).attr("wareid");
			if (!click_bind) {
				$(this).click(function (event) {
					event.preventDefault();
					$("#hid_wareid_c").val(wareId);
					GetWidgetClassifyList();
					$("#mod_cate_pop").dialog("open");
				});
				$(this).data("click_bind", "click_bind");
			}
		});
	};
	Z.select_wiget_cate = function () {//选择挂件分类
		var select2 = $(".selct_bx").find(".select_mcate1");
		var select3 = $(".selct_bx").find(".select_mcate2");
		$(".selct_bx").find(".select_mcate").change(function () {
			var option_val = parseInt($(this).find("option:selected").val());
			var items = [];
			var option_ori = '<option value="0">选择分类</option>';
			if (option_val) {
				var select2_json = GetWareList_dropdown(option_val);
				$.each(select2_json, function (key, val) {
					var list_cell = '<option value="' + val["WareId"] + '">' + val["Name"] + '</option>';
					items.push(list_cell);
				});
				var optionlist = option_ori + items.join('');
				select2.html(optionlist);
			}
			else {
				select2.html(option_ori);
				select3.html(option_ori);
			}
		});
		select2.change(function () {
			var option_val = parseInt($(this).find("option:selected").val());
			var items = [];
			var option_ori = '<option value="0">选择分类</option>';
			if (option_val) {
				var select3_json = GetClassifyList(option_val);
				$.each(select3_json, function (key, val) {
					var list_cell = '<option value="' + val["ClassId"] + '">' + val["Name"] + '</option>';
					items.push(list_cell);
				});
				var optionlist = option_ori + items.join('');
				select3.html(optionlist);
			}
			else {
				select3.html(option_ori);
			}
		});
	};
	Z.delete_dydll = function () {//删除动态库
		$(".delete_dydll").each(function () {
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					if (confirm("确定删除动态库？")) {
						event.preventDefault();
						var dataid = $(this).attr("dataid");
						var state = DeleteDll(dataid);
						if (state) {
							alert("删除成功");
							$(this).parents("tr").remove();
						}
						else {
							alert("删除失败");
						}
					}
				});
			}
		});

	};
	/*挂件注册相关脚本-begin*/
	Z.delet_opt = function () {//删除选项
		$(".delet_opt").each(function () {
			var delet_bind = $(this).data("delet_bind");
			if (!delet_bind) {
				$(this).click(function (event) {
					event.preventDefault();
					var line_size = $(this).parent(".opt_line").siblings().size();
					if (line_size == 1) {
						alert('至少有两个选项');
					}
					else {
						$(this).parent(".opt_line").remove();
					}
				});
				$(this).data("delet_bind", "delet_binded");
			}
		});
	};
	Z.delet_para = function () {//删除配置选项
		$(".delet_para_wrap").each(function () {
			var delet_bind = $(this).data("delet_bind");
			if (!delet_bind) {
				$(this).click(function (event) {
					event.preventDefault();
					$(this).parent(".para_wrap").remove();
				});
				$(this).data("delet_bind", "delet_binded");
			}
		});
	};

	Z.show_delet_para = function () {//显示删除配置选项
		$(".para_wrap").each(function () {
			var hover_bind = $(this).data("hover_bind");
			if (!hover_bind) {
				$(this).hover(function () {
					$(this).find(".delet_para_wrap").show();
				},
				function () {
					$(this).find(".delet_para_wrap").hide();
				}
			);
				$(this).data("hover_bind", "hover_binded");
			}
		});
	};

	Z.show_delet_opt = function () {//显示删除选项
		$(".opt_line").each(function () {
			var hover_bind = $(this).data("hover_bind");
			if (!hover_bind) {
				$(this).hover(function () {
					$(this).find(".delet_opt").show();
				},
				function () {
					$(this).find(".delet_opt").hide();
				}
			);
				$(this).data("hover_bind", "hover_binded");
			}
		});
	};

	Z.add_opt = function () {//添加选项
		$(".add_opt").each(function () {
			var add_opt = $(this).data("add_bind");
			if (!add_opt) {
				$(this).click(function (event) {
					event.preventDefault();
					var opt_wrap = $(this).parent(".right_line").next();
					var wrap_line = '<div class="opt_line">\
												<a href="" class="delet_opt">删除选项</a>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip">选项名称：</label><input type="text" class="ch_title" name="txtName" />\
												</div>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip ">值(value)：</label><input type="text" class="ch_title" name="txtValue"/>\
												</div>\
											</div>';
					opt_wrap.append(wrap_line);
					Z.delet_opt();
					Z.show_delet_opt();
				});
				$(this).data("add_bind", "add_binded");
			}
		});
	};
	Z.chk_bxcg = function () {//checkbox操作
		$(".ifrequired").each(function () {
			var changed = $(this).data("changebind");
			if (!changed) {
				$(this).change(function () {
					if ($(this).val() == 1) {
						$(this).val(0);
					}
					else {
						$(this).val(1);
					}
				});
				$(this).data("changebind", "changebind");
			}
		});
	};
	Z.edit_info = function () {//编辑基本信息
		$(".edit_info").each(function () {
			var changed = $(this).data("changebind");
			var widgetId = $(this).attr("iddata");
			if (!changed) {
				$(this).click(function () {
					$("#hid_baseinfoId").val(widgetId);
					GetWidget(widgetId);
					$("#pop_basic_info").dialog("open");
				});
				$(this).data("changebind", "changebind");
			}
		});
	};
	Z.edit_paramete = function () {//编辑配置参数
		$(".edit_paramete").each(function () {
			var changed = $(this).data("changebind");
			if (!changed) {
				$(this).click(function () {
					var model_style = $("#model_style").val("");
					var para_options = $("#para_options").val("");
					var idData = $(this).attr("idData");
					var para_lsits = [];
					var para_json = GetWidgetConfig(idData);
					if (para_json == null) {
						model_style.val("");
						para_options.html("");
					}
					else {
						var style_para = para_json.Style;
						if(para_json.ExpendClassify)
							$("#cbx_expand").attr("checked","checked");
						else
							$("#cbx_expand").removeAttr("checked");
						if(para_json.ExpendData)
							$("#cbx_expand_record").attr("checked","checked");
						else
							$("#cbx_expand_record").removeAttr("checked");
						var para_list_array = para_json.ConfigItem;
						model_style.val(style_para);
						$.each(para_list_array, function (key, val) {
							if (val["DataType"] == 0) {
								var checked = "";
								var checked_val = 0;
								var name = val["name"];
								var ShowName = val["ShowName"];
								var Required = val["Required"];
								if (Required) {
									checked = 'checked="checked"';
									checked_val = 1;
								}
								var name = val["Name"];
								var para_html = '<div class="para_wrap clearfix">\
							                    	<a href="" class="delet_para_wrap">删除</a>\
							                    	<div class="fl zd_bx">\
							                    		<div class="left_line clearfix">\
							                    			<label  class="fl left_tip">字段名称(文本)：</label><input type="text" value="' + name + '" class="zd_input" name="txtName" />\
							                    		</div>\
							                    	</div>\
							                    	<div class="auo_cell">\
							                    		<div class="clearfix">\
							                    			<div class="right_line fl">\
							                    				<label  class="fl left_tip">显示名：</label><input type="text" value="' + ShowName + '" class="ch_title" name="txtTitle" />\
							                    			</div>\
							                    			<div class="right_line fl">\
							                    				<label class="fl left_tip">是否必填：</label><input type="checkbox" ' + checked + ' value="' + checked_val + '" class="ifrequired"  name="ck" /><input type="hidden" value="0"   name="hid_datatype" />\
							                    			</div>\
							                    		</div>\
							                    	</div>\
							                    </div>';
								para_lsits.push(para_html);
							}
							else if (val["DataType"] == 100) {
								var checked = "";
								var checked_val = 0;
								var name = val["name"];
								var ShowName = val["ShowName"];
								var Required = val["Required"];
								if (Required) {
									checked = 'checked="checked"';
									checked_val = 1;
								}
								var name = val["Name"];
								var opt_line = [];
								var childrenList = val["ChildrenList"];
								$.each(childrenList, function (key, val) {
									var opt = '<div class="opt_line">\
							                 	<a href="" class="delet_opt">删除选项</a>\
							                 	<div class="clearfix opt_cell">\
							                 		<label  class="fl left_tip">选项名称：</label><input type="text" value="' + val + '" class="ch_title" name="txtName" />\
							                 	</div>\
							                 	<div class="clearfix opt_cell">\
							                 		<label  class="fl left_tip ">值(value)：</label><input type="text" value="' + key + '" class="ch_title" name="txtValue" />\
							                 	</div>\
							                 </div>';
									opt_line.push(opt);
								});
								var opt_line_paras = opt_line.join('');
								var para_html = '<div class="para_wrap clearfix">\
							                    	<a href="" class="delet_para_wrap">删除</a>\
							                    	<div class="fl zd_bx">\
							                    		<div class="left_line clearfix">\
							                    			<label  class="fl left_tip">字段名称(下拉)：</label><input type="text" value="' + name + '" data-type="select" class="zd_input" name="txtName" />\
							                    		</div>\
							                    		<div class="left_line clearfix">\
							                    			<label  class="fl left_tip">必填：</label><input type="checkbox" ' + checked + ' value="' + checked_val + '" class="ifrequired" /><input type="hidden" value="100"   name="hid_datatype" />\
							                    		</div>\
							                    	</div>\
							                    	<div class="auo_cell">\
							                    		<div class="clearfix">\
							                    			<div class="right_line clearfix">\
							                    				<label  class="fl left_tip">显示名：</label><input type="text" value="' + ShowName + '" class="ch_title" name="txtTitle" /><a href="" class="add_opt">添加选项</a>\
							                    			</div>\
							                    			<div class="opt_wrap">' + opt_line_paras + '</div>\
							                    		</div>\
							                    	</div>\
							                    </div>';
								para_lsits.push(para_html);
							}
							else if (val["DataType"] == 200) {
								var checked = "";
								var checked_val = 0;
								var name = val["name"];
								var ShowName = val["ShowName"];
								var Required = val["Required"];
								if (Required) {
									checked = 'checked="checked"';
									checked_val = 1;
								}
								var name = val["Name"];
								var opt_line = [];
								var childrenList = val["ChildrenList"];
								$.each(childrenList, function (key, val) {
									var opt = '<div class="opt_line">\
							                 	<a href="" class="delet_opt">删除选项</a>\
							                 	<div class="clearfix opt_cell">\
							                 		<label  class="fl left_tip">选项名称：</label><input type="text" value="' + val + '" class="ch_title" name="txtName" />\
							                 	</div>\
							                 	<div class="clearfix opt_cell">\
							                 		<label  class="fl left_tip ">值(value)：</label><input type="text" value="' + key + '" class="ch_title" name="txtValue" />\
							                 	</div>\
							                 </div>';
									opt_line.push(opt);
								});
								var opt_line_paras = opt_line.join('');
								var para_html = '<div class="para_wrap clearfix">\
							                    	<a href="" class="delet_para_wrap">删除</a>\
							                    	<div class="fl zd_bx">\
							                    		<div class="left_line clearfix">\
							                    			<label  class="fl left_tip">字段名称(下拉)：</label><input type="text" value="' + name + '" data-type="select" class="zd_input" name="txtName" />\
							                    		</div>\
							                    		<div class="left_line clearfix">\
							                    			<label  class="fl left_tip">必填：</label><input type="checkbox" ' + checked + ' value="' + checked_val + '" class="ifrequired" /><input type="hidden" value="200"   name="hid_datatype" />\
							                    		</div>\
							                    	</div>\
							                    	<div class="auo_cell">\
							                    		<div class="clearfix">\
							                    			<div class="right_line clearfix">\
							                    				<label  class="fl left_tip">显示名：</label><input type="text" value="' + ShowName + '" class="ch_title" name="txtTitle" /><a href="" class="add_opt">添加选项</a>\
							                    			</div>\
							                    			<div class="opt_wrap">' + opt_line_paras + '</div>\
							                    		</div>\
							                    	</div>\
							                    </div>';
								para_lsits.push(para_html);
							}
						});
						var para_lists_all = para_lsits.join('');
						para_options.html(para_lists_all);
					}
					Zqm.para_allact();
					Zqm.chk_bxcg();
					$("#hid_editwidgetId").val(idData);
					$("#pop_model_paras").dialog("open");
				});
				$(this).data("changebind", "changebind");
			}
		});
	};
	Z.pulish_model = function () {//编辑发布模板
		$(".pulish_model").each(function () {
			var changed = $(this).data("changebind");
			var widgetid = $(this).attr("idData");
			if (!changed) {
				$(this).click(function () {
					$("#pop_publish_model [name='hid_release_widgetid']").val(widgetid);
					$("#pop_publish_model").dialog("open");
				});
				$(this).data("changebind", "changebind");
			}
		});
	};
	Z.para_allact = function () {//配置参数所有操作
		Z.delet_opt();
		Z.add_opt();
		Z.show_delet_opt();
		Z.show_delet_para();
		Z.delet_para();
	};
	/*挂件注册相关脚本-end*/
	Z.edit_app = function () {
		$(".edit_app_cate").each(function () {
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					var id=$(this).attr("iddata");
					$("#hid_cataId").val(id);
					GetClassifyInfo(id);
					$("#ed_add_cates").dialog("open");
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};

	/*模板站审核通过*/
	Z.modsute_chekok = function () {
		$("#tbl_modsite").find(".check_ok").each(function () {
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					//ajax
					alert($(this).data("id"))
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};
	/*模板站停用*/
	Z.modsute_stop = function () {
		$("#tbl_modsite").find(".check_stop").each(function () {
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					//ajax
					alert($(this).data("id"))
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};
	/*模板站启用*/
	Z.modsute_start = function () {
		$("#tbl_modsite").find(".check_start").each(function () {
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					alert($(this).data("id"))
					//ajax
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};
	/*导入测试数据*/
	Z.import_testdata=function(){
		$(".import_testdata").each(function () {//点击导入数据
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					Z.import_test_id=$(this).data("id");
					var sql_data=ListTestDataSql(Z.import_test_id);
					$("#Sql_data").val(sql_data);
					$("#import_datapop").dialog("open");
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};

	Z.update_mdware=function(){//升级应用
		$(".update_mdware").click(function (event) {
		event.preventDefault();
		var id=$(this).data("id");
		$("#hid_wareupdate").val(id);
		var title_now ="升级"+$(this).parents("tr").find("td:eq(1)").text();
		$("#Uchangepsd").dialog({title:title_now});
		$("#Uchangepsd").dialog("open");
		});
	};

	Z.edit_versql=function(){
		$(".edit_versql").each(function () {//点击编辑升级SQL
			var clickbind = $(this).data("clickbind");
			if (!clickbind) {
				$(this).click(function (event) {
					event.preventDefault();
					Z.edit_verid=$(this).data("verid");
					Z.edit_sqltype=$(this).data("type");
					var sql_data=ListUpdateDataSql(Z.edit_verid,Z.edit_sqltype);
					$("#verSql_data").val(sql_data);
					$(".editver_sql_form").fadeIn(100);
					$("#mid_vesions").find(".data_box").fadeOut(100);
				});
				$(this).data("clickbind", "clickbind");
			}
		});
	};
	Z.obj_length=function(obj){
		var i=0;
		for(var key in obj){
			i++;
		}
		return i;
	};
	Z.ware_client_act=function(){//客户端的相关操作
		if($("#pop_add_wareclient").size()){
		$("#pop_add_wareclient").dialog({ "autoOpen": false, "position": ["center", 100], "width": 600, "modal": true, "draggable": false });
		$(".add_ware_client").click(function(event){//添加客户端
			event.preventDefault();
			$("#pop_add_wareclient").dialog("open");
		});

		$("#pop_wareclient_version").dialog({ "autoOpen": false, "position": ["center", 100], "width": 600, "modal": true, "draggable": false });
		//默认版本值等于版本号
		var versionNumOrigin;
		$(".js-version-num").focus(function(){
			versionNumOrigin=$(this).val();
		}).blur(function(){
			if($.trim($(this).val())!=versionNumOrigin){//如果版本号发生变化则负值给版本值
				$(".js-version-val").val($(this).val());
			}
		});
			
		$(".watch_versionclient").click(function(event){//查看客户端版本
			event.preventDefault();
			//var warecli_list=ListAssembleVersion();
			//if(warecli_list.length){
			//$("#warecli_verlist").setTemplateElement("wareclver_lists_template");
			//$("#warecli_verlist").processTemplate(warecli_list);
			//}
			//else{
			//	$("#warecli_verlist").html("");
			//}
			$(".add_warecl_zip").hide();//隐藏+客户端文件
			$(".js-back_warecl").hide();//隐藏返回
			$(".wcv_listbx").hide(0);
			$(".add_wareclzip_form").show(0);
			$("#pop_wareclient_version").dialog("open");
		});

		$(".add_warecl_zip").click(function(){//添加客户端zip
			$(".wcv_listbx").hide(0);
			$(".add_wareclzip_form").show(0);
		});
		$(".js-back_warecl").click(function(){//返回客户端文件列表
			$(".wcv_listbx").show();
			$(".add_wareclzip_form").hide();
			$(".add_wareclzip_form").find("[name=wareclizip_pack]").val("");
			$(".add_wareclzip_form").find("[name=wareclizip_intro]").val("");
		});

		var warecli_list = ListAssembleVersion();
		if (warecli_list.length) {
			$("#warecl_lists").setTemplateElement("wareclver_lists_template");
			$("#warecl_lists").processTemplate(warecli_list);
		}
		else {
			$("#warecl_lists").html("");
		}
		//if(warecli_list.length){
		//	$("#warecl_lists").setTemplateElement("warecl_lists_template");
		//	$("#warecl_lists").processTemplate(warecli_list);
		//}
		//else{
		//	$("#warecl_lists").html("");
		//}
	}
	};
})(Zqm);
$(function () {
	Zqm.modsute_start();
	Zqm.modsute_stop();
	Zqm.modsute_chekok();
	$("#import_datapop").dialog({ "autoOpen": false, "position": ["center", 100], "width": 600, "modal": true, "draggable": false });//导入测试数据弹框
	Zqm.import_testdata();
	Zqm.ware_client_act();
	/* $("#top_act_bar").click(function(event){
	event.stopPropagation();
	Zqm.act_lists=$(this).next();
	if(Zqm.act_lists.is(":visible")){
	Zqm.act_lists.hide();}
	else{
	Zqm.act_lists.show();
	}
	});
	
	$("body").bind("click.hide_actlist",function(){
	$("#header").find(".act_lists").hide();
	}); */

	//admin_mwlist-停用
	$(".suspend_mdware").live('click',function(e){
		e.preventDefault();
		var id=$(this).attr("iddata");
		DisableWare(id);
	});

	//admin_mwlist-发布
	$(".publish_mdware").live('click',function(e){
		e.preventDefault();
		var id=$(this).attr("iddata");
		ReleaseWare(id);
	});

	//admin_mwlist-查看
	$(".read_version").live('click',function(e){
		e.preventDefault();
		var id=$(this).attr("iddata");
		viewVersion(id);
	});
			

	//admin_addCate-启用分类
	$(".init_cate").live('click',function(e){
		e.preventDefault();
		var id=$(this).attr("iddata");
		DisabledCate(id,1);
	});

	$(".suspend_cate").live('click',function(e){
		e.preventDefault();
		var id=$(this).attr("iddata");
		DisabledCate(id,0);
	});


	$("#add_cates").dialog({ "autoOpen": false, "position": ["center", 100], "width": 500, "modal": true, "draggable": false }); //添加应用分类
	$(".add_Cbtn").click(function (event) {
		event.preventDefault();
		$("#add_cates").dialog("open");
	});
	$("#ed_add_cates").dialog({ "autoOpen": false, "position": ["center", 100], "width": 500, "modal": true, "draggable": false }); //编辑应用分类
	Zqm.edit_app();

	$("#mod_cate_pop").dialog({ "autoOpen": false, "position": ["center", 100], "width": 600, "modal": true, "draggable": false }); //挂件分类
	Zqm.model_cate();
	Zqm.chage_mname(); //重命名分类

	$(".ex_tabs li").find("a").each(function (i) {//可切换tab
		var parent_ex_tabs = $(this).parents(".ex_tabs");
		var target = parent_ex_tabs.siblings(".target:eq(" + i + ")");
		var all_ex = parent_ex_tabs.siblings(".target");
		var all_tabs = $(this).parents(".ex_tabs").find("li a");
		$(this).click(function (event) {
			event.preventDefault();
			all_ex.hide();
			target.show();
			all_tabs.removeClass("current");
			$(this).addClass("current");
		});
	});

	$("#pop_add_dlib").dialog({ "autoOpen": false, "position": ["center", 100], "width": 500, "modal": true, "draggable": false }); //添加动态库
	$(".addDlib_btn").click(function (event) {
		event.preventDefault();
		$("#pop_add_dlib").dialog("open");
	});

	$("#Uchangepsd").dialog({ "autoOpen": false, "position": ["center", 100], "width": 500, "modal": true, "draggable": false }); //升级中间件

	$(".cancel_pop").click(function (event) {
		event.preventDefault();
		$(".ui-dialog-content").dialog("close");
	});

	$("#mid_vesions").dialog({ "autoOpen": false, "position": ["center", 100], "width": 600, "height": 350, "modal": true, "draggable": false }); //查看中间件版本信息
	$(".read_version").click(function (event) {
		event.preventDefault();
		$("#mid_vesions").dialog("open");
	});

	$(".cancel_pop").click(function (event) {
		event.preventDefault();
		$(".ui-dialog-content").dialog("close");
	});

	if ($("input[name=update]").size() > 0) {
		$("input[name=update]")[0].checked = true;
		$("input[name=update]").change(function () {//上传公用库
			if ($(this).val() == 0) {
				$(".add_dfrorm").show();
				$(".add_sfrorm").hide();
			}
			else if ($(this).val() == 1) {
				$(".add_dfrorm").hide();
				$(".add_sfrorm").show();
			}
		});
	}

	/*挂件注册相关脚本-begin*/
	$("#pop_basic_info").dialog({ "autoOpen": false, "position": ["center", 30], "width": 550, "modal": true, "draggable": false }); //编辑基本信息
	Zqm.edit_info();
	$("#pop_model_paras").dialog({ "autoOpen": false, "position": ["center", 30], "width": 780, "height": 450, "modal": true, "draggable": false }); //编辑配置参数
	Zqm.edit_paramete();
	$("#pop_publish_model").dialog({ "autoOpen": false, "position": ["center", 30], "width": 550, "height": 250, "modal": true, "draggable": false }); //发布挂件
	Zqm.pulish_model();
	$("#pop_add_model").dialog({ "autoOpen": false, "position": ["center", 30], "width": 550, "modal": true, "draggable": false }); //添加挂件弹框
	$(".add_model_btn").click(function (event) {
		event.preventDefault();
		var id = $(this).attr("id");
		$("#HdWareId").attr("value", id);
		$("#pop_add_model").dialog("open");
	});

	$("#pop_model_paras ").find(".toggle").each(function () {//添加挂件弹框中的操作--收起展开
		$(this).click(function (event) {
			event.preventDefault();
			var cell_wrap = $(this).parent(".add_tip").next();
			if (cell_wrap.is(":visible")) {
				cell_wrap.slideUp();
				$(this).text("展开");
			}
			else {
				cell_wrap.slideDown();
				$(this).text("收起");
			}
		});
	});

	Zqm.para_allact();

	$("#text_type").click(function (event) {//添加文本格式的可选参数
		event.preventDefault();
		var para_html = '<div class="para_wrap clearfix">\
								<a href="" class="delet_para_wrap">删除</a>\
								<div class="fl zd_bx">\
									<div class="left_line clearfix">\
										<label  class="fl left_tip">字段名称(文本)：</label><input type="text" class="zd_input" name="txtName" />\
									</div>\
								</div>\
								<div class="auo_cell">\
									<div class="clearfix">\
										<div class="right_line fl">\
											<label  class="fl left_tip">显示名：</label><input type="text" class="ch_title" name="txtTitle" />\
										</div>\
										<div class="right_line fl">\
											<label class="fl left_tip">是否必填：</label><input type="checkbox" checked="checked" value="1" class="ifrequired"  name="ck" /><input type="hidden" value="' + $(this).attr("typedata") + '"   name="hid_datatype" />\
										</div>\
									</div>\
								</div>\
							</div>';
		$("#para_options").append(para_html);
		Zqm.para_allact();
		Zqm.chk_bxcg();
	});

	$("#select_type").click(function (event) {//添加下拉框格式的可选参数
		event.preventDefault();
		var para_html = '<div class="para_wrap clearfix">\
								<a href="" class="delet_para_wrap">删除</a>\
								<div class="fl zd_bx">\
									<div class="left_line clearfix">\
										<label  class="fl left_tip">字段名称(下拉)：</label><input type="text" data-type="select" class="zd_input" name="txtName" />\
									</div>\
									<div class="left_line clearfix">\
										<label  class="fl left_tip">必填：</label><input type="checkbox" value="1" checked="checked" class="ifrequired" /><input type="hidden" value="' + $(this).attr("typedata") + '"   name="hid_datatype" />\
									</div>\
								</div>\
								<div class="auo_cell">\
									<div class="clearfix">\
										<div class="right_line clearfix">\
											<label  class="fl left_tip">显示名：</label><input type="text" class="ch_title" name="txtTitle" /><a href="" class="add_opt">添加选项</a>\
										</div>\
										<div class="opt_wrap">\
											<div class="opt_line">\
												<a href="" class="delet_opt">删除选项</a>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip">选项名称：</label><input type="text" class="ch_title" name="txtName" />\
												</div>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip ">值(value)：</label><input type="text" class="ch_title" name="txtValue" />\
												</div>\
											</div>\
											<div class="opt_line">\
												<a href="" class="delet_opt">删除选项</a>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip">选项名称：</label><input type="text" class="ch_title" name="txtName" />\
												</div>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip ">值(value)：</label><input type="text" class="ch_title" name="txtValue" />\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>';
		$("#para_options").append(para_html);
		Zqm.para_allact();
		Zqm.chk_bxcg();
	});

	$("#radio_type").click(function (event) {//添加单选格式的可选参数
		event.preventDefault();
		var para_html = '<div class="para_wrap clearfix">\
								<a href="" class="delet_para_wrap">删除</a>\
								<div class="fl zd_bx">\
									<div class="left_line clearfix">\
										<label  class="fl left_tip">字段名称(单选)：</label><input type="text" data-type="radio" class="zd_input" name="txtName" />\
									</div>\
									<div class="left_line clearfix">\
										<label class="fl left_tip">必填：</label><input type="checkbox" value="1" checked="checked" class="ifrequired" /><input type="hidden" value="' + $(this).attr("typedata") + '"   name="hid_datatype" />\
									</div>\
								</div>\
								<div class="auo_cell">\
									<div class="clearfix">\
										<div class="right_line clearfix">\
											<label  class="fl left_tip">显示名：</label><input type="text" class="ch_title" name="txtTitle" /><a href="" class="add_opt">添加选项</a>\
										</div>\
										<div class="opt_wrap">\
											<div class="opt_line">\
												<a href="" class="delet_opt">删除选项</a>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip">选项名称：</label><input type="text" class="ch_title" name="txtName" />\
												</div>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip ">值(value)：</label><input type="text" class="ch_title" name="txtValue" />\
												</div>\
											</div>\
											<div class="opt_line">\
												<a href="" class="delet_opt">删除选项</a>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip">选项名称：</label><input type="text" class="ch_title" name="txtName" />\
												</div>\
												<div class="clearfix opt_cell">\
													<label  class="fl left_tip ">值(value)：</label><input type="text" class="ch_title" name="txtValue" />\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>';
		$("#para_options").append(para_html);
		Zqm.para_allact();
		Zqm.chk_bxcg();
	});
	/*挂件注册相关脚本-end*/
});

function GetJsonDate(dat) {
	var match = dat.match(/\d+/);
	var date = new Date();
	date.setTime(match[0]);
	var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString();
	return str;
}

function RedictToUserLogin(msg) {
	alert(msg);
	window.location = "/home/login";
}