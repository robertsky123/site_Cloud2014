
/*admin_addCate*/
function GetClassifyInfo(id) {
	$.ajax({
		url: '/Home/GetClassifyInfo',
		type: 'post',
		data: "classifyId=" + id,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#ed_cate_name").val(v.name);
				$("#ed_description").val(v.des);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}
function UpdateCate() {
	var d = {};
	d.name = $("#ed_cate_name").val();
	d.des = $("#ed_description").val();
	d.classifyId = $("#hid_cataId").val();
	$.ajax({
		url: '/Home/UpdateClassify',
		type: 'post',
		data: d,
		dataType: 'json',
		beforeSend: function () {
			Zqm.poptip_output("正在更新", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("添加成功", "success");
				$("#ed_add_cates").dialog("close");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output("更新失败", "fail");
			}
		}
	});
}
function DisabledCate(id, enable) {
	$.ajax({
		url: '/Home/DisabledClassify',
		type: 'post',
		data: "classifyId=" + id + "&enable=" + enable,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				if (enable) {
					$(".init_cate[iddata='" + id + "']").html("【停用】");
					$(".init_cate[iddata='" + id + "']").addClass("suspend_cate");
					$(".init_cate[iddata='" + id + "']").removeClass("init_cate");
					Zqm.poptip_output("分类启用成功", "success");
				}
				else {
					$(".suspend_cate[iddata='" + id + "']").html("【启用】");
					$(".suspend_cate[iddata='" + id + "']").addClass("init_cate");
					$(".suspend_cate[iddata='" + id + "']").removeClass("suspend_cate");
					Zqm.poptip_output("分类禁用成功", "success");
				}

			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				if (enable)
					Zqm.poptip_output('分类启用失败', "fail");
				else
					Zqm.poptip_output("分类禁用失败", "fail");
			}
		}
	});
}

/*admin_mwlist*/
function selectClassify(currentPage) {
	$.ajax({
		url: '/Home/GetWareList',
		data: 'classifyId=' + $("#sel_select").val() + "&currentPage=" + currentPage,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#tbl_warelist").setTemplateElement("txt_template");
				$("#tbl_warelist").processTemplate(v);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#tbl_warelist").html('');
			}

		}
	});
}
function viewVersion(id) {
	$.ajax({
		url: '/Home/GetWareVersionList',
		data: 'wareId=' + id,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#tbl_version").setTemplateElement("txt_version");
				$("#tbl_version").processTemplate(v);
				$("#mid_vesions").dialog("open");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#tbl_version").html('');
			}
		}
	});
}
function DisableWare(id) {
	$.ajax({
		url: '/Home/DisableWare',
		data: 'wareId=' + id,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("已经成功停用", "success");
				$(".suspend_mdware[iddata='" + id + "']").html("【发布】");
				$(".suspend_mdware[iddata='" + id + "']").parent().siblings().eq(3).html("已停用");
				$(".suspend_mdware[iddata='" + id + "']").addClass("publish_mdware");
				$(".suspend_mdware[iddata='" + id + "']").removeClass("suspend_mdware");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output("停用失败", "fail");
			}
		}
	});
}
function ReleaseWare(id) {
	$.ajax({
		url: '/Home/ReleaseWare',
		data: 'wareId=' + id,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("已经成功发布", "success");
				$(".publish_mdware[iddata='" + id + "']").html("【停用】");
				$(".publish_mdware[iddata='" + id + "']").parent().siblings().eq(3).html("已发布");
				$(".publish_mdware[iddata='" + id + "']").addClass("suspend_mdware");
				$(".publish_mdware[iddata='" + id + "']").removeClass("publish_mdware");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output("发布失败", "fail");
			}
		}
	});
}
/*login*/
function login() {
	$.ajax({
		url: '/Home/Login',
		data: 'user=' + $("#username").val() + '&pwd=' + $("#pwd").val(),
		dataType: 'json',
		type: 'post',
		success: function (val) {
			if (val.Code == 0) {
				window.location.href = val.url;
			} else {
				alert(val.msg);
			}
		}
	});
}

/*mod_lists*/
function GetWidgetConfig(widgetId) {
	var result = null;
	$.ajax({
		url: '/Home/GetWidgetConfig',
		type: 'post',
		dataType: 'json',
		data: 'widgetId=' + widgetId,
		async: false,
		success: function (v) {
			if (v.Code == 0) {
				result = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
	return result;
}

function GetWareList_dropdown(id) {//第二个
	var select_json = null;
	$.ajax({
		url: '/Home/GetWareList',
		type: 'post',
		data: "classifyId=" + id + "&siteId=0",
		dataType: 'json',
		async: false,
		success: function (v) {
			if (v.Code == 0) {
				select_json = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
	return select_json;
}

function GetWidget(wid) {//获取挂件的名称和简介
	$.ajax({
		url: '/Home/GetWidgetInfo',
		type: 'post',
		data: 'widgetId=' + wid,
		dataType: 'json',
		async: false,
		success: function (v) {
			if (v.Code == 0) {
				$("#ed_midwarename").val(v.name);
				$("#ed_mware_intro").val(v.des);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}

function UpdateWidget(wid, name, des) {//编辑挂件
	var d = {};
	d.wid = wid;
	d.name = name;
	d.des = des;
	$.ajax({
		url: '/Home/UpdateWidgetInfo',
		type: 'post',
		data: d,
		dataType: 'json',
		beforeSend: function () {
			Zqm.poptip_output("正在保存", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("保存成功", "success");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output("保存失败", "fail");
			}
		}
	});
}

function RegistWidget(cid, wid, code, name, des, type) {//添加挂件
	var d = {};
	d.classifyId = cid; //分类id
	d.wareId = wid; //应用id
	d.code = code;
	d.name = name;
	d.des = des;
	d.type = type;
	$.ajax({
		url: '/Home/RegistWidget',
		type: 'post',
		data: d,
		dataType: 'json',
		beforeSend: function () {
			$("#pop_add_model").dialog("close");
			Zqm.poptip_output("正在添加挂件", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("添加成功", "success");
				GetWidgetList(1);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output(v.msg, "fail");
			}
		}
	});

}
function GetClassifyList(wareid) {//挂件分类列表
	var select_json = null;
	$.ajax({
		url: '/Home/GetWidgetClassifyList',
		type: 'post',
		data: "wareId=" + wareid,
		dataType: 'json',
		async: false,
		success: function (v) {
			if (v.Code == 0) {
				select_json = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {

			}
		}
	});
	return select_json;
}

function GetWidgetList(page) {//挂件列表
	var p = page + 1;
	var val = "";
	$.ajax({
		url: '/Home/GetWidgetList',
		type: 'post',
		data: 'currentpage=' + p + "&t=" + $("#hid_widgettype").val(),
		dataType: 'json',
		async: false,
		success: function (v) {
			val = v;
			if (v.Code == 0) {
				$(".data_box").setTemplateElement("txt_template");
				$(".data_box").processTemplate(v);
				Zqm.edit_info();
				Zqm.edit_paramete();
				Zqm.pulish_model();
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$(".data_box").html('');
			}
		}
	});
	return val;
}

function SaveItem() {
	var style = $("#model_style").val();
	var name = '';
	var showname = '';
	var datatype = '';
	var required = '';
	var child = '';
	$("#para_options .para_wrap").each(function () {
		if (name == '')
			name += $(this).find("[name='txtName']").val();
		else
			name += ',' + $(this).find("[name='txtName']").val();
		if (showname == '')
			showname += $(this).find("[name='txtTitle']").val();
		else
			showname += ',' + $(this).find("[name='txtTitle']").val();
		if (datatype == '')
			datatype += $(this).find("[name='hid_datatype']").val();
		else
			datatype += ',' + $(this).find("[name='hid_datatype']").val();
		if (required == '')
			required += $(this).find(".ifrequired").prop("checked");
		else
			required += ',' + $(this).find(".ifrequired").prop("checked");
		var ls = '';
		if ($(this).find(".opt_wrap").size() > 0) {//不是文本
			$(this).find(".opt_wrap .opt_line").each(function () {
				var key = $(this).find("[name='txtName']").val();
				var value = $(this).find("[name='txtValue']").val();
				if (ls == '')
					ls += key + ":" + value;
				else
					ls += '|' + key + ":" + value;
			});
		}
		child += ls + ',';
	});
	var d = {};
	d.style = style;
	d.name = name;
	d.showname = showname;
	d.datatype = datatype;
	d.required = required;
	var datasource = $("#cbx_expand_record").is(":checked") ? $("#cbx_expand_record").val() : 0;
	var ex = $("#cbx_expand").is(":checked") ? $("#cbx_expand").val() : 0;
	d.expand = parseInt(datasource) + parseInt(ex);
	d.widgetId = $("#hid_editwidgetId").val();
	d.child = child.substring(0, child.length - 1);
	$.ajax({
		url: '/Home/AddWidgetConfig',
		type: 'post',
		data: d,
		dataType: 'json',
		beforeSend: function () {
			Zqm.poptip_output("正在保存配置参数", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("保存成功", "success");
				$("#pop_model_paras").dialog("close");
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				Zqm.poptip_output("保存失败", "failed");
				$("#pop_model_paras").dialog("close");
			}
		}
	});
}
/*user_mwlist*/
function GetWareList(pageIndex) {
	var d = {};
	d.currentPage = pageIndex + 1;
	d.classifyId = $("#sel_select").val();
	$.ajax({
		url: '/Home/GetWareList',
		data: d,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#tbl_warelist").setTemplateElement("txt_template");
				$("#tbl_warelist").processTemplate(v);
				Zqm.import_testdata();
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#tbl_warelist").html('');
			}
			Zqm.model_cate();
			Zqm.update_mdware();
		}
	});
}

function DeleteDll(dllid) {
	var state;
	$.ajax({
		url: '/Home/DelteDll',
		type: 'post',
		data: "dllid=" + dllid,
		async: false,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				state = 1;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				state = 0;
			}

		}
	});
	return state;
}

function GetLibList(pageindex) {
	$.ajax({
		url: '/Home/GetDllList',
		type: 'post',
		data: 'page=' + pageindex,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#tbl_dlllist").setTemplateElement("txt_template");
				$("#tbl_dlllist").processTemplate(v);
				Zqm.delete_dydll();
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#tbl_dlllist").html('');
			}

		}
	});
}

function DeleteClassify(id) {
	$.ajax({
		url: '/Home/DeleteClassify',
		data: "classifyId=" + id,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				alert('删除成功');
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else
				alert('删除失败');
		}
	});
}

function UpdateClassify(id, name, des) {
	$.ajax({
		url: '/Home/UpdateClassify',
		data: "classifyId=" + id + "&name=" + name + "&des=" + des,
		type: 'post',
		dataType: 'json',
		beforeSend: function () {
			Zqm.poptip_output("正在更新", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("更新成功", "success");
				GetWidgetClassifyList();
				$(".mg_cate_bx").animate({ 'marginLeft': 0 }, 500);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else
				Zqm.poptip_output("更新失败", "fail");
		}
	});
}

function AddClassify() {
	var d = {};
	d.wareId = $("#hid_wareid_c").val();
	d.name = $("#cate_name").val();
	d.des = $("#cate_des").val();
	$.ajax({
		url: '/Home/AddWidgetClassify',
		data: d,
		type: 'post',
		dataType: 'json',
		beforeSend: function () {
			//$("#mod_cate_pop").dialog("close");
			Zqm.poptip_output("正在添加分类", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("添加成功", "success");
				$(".ex_tabs li :last").click();
				GetWidgetClassifyList();
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else
				Zqm.poptip_output("添加失败", "fail");
		}
	});
}

function viewVersion(id) {
	$.ajax({
		url: '/Home/GetWareVersionList',
		data: 'wareId=' + id,
		type: 'post',
		async: false,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#tbl_version").setTemplateElement("txt_version");
				$("#tbl_version").processTemplate(v);
				Zqm.edit_versql();
				$("#mid_vesions").find(".data_box").show(0);
				$("#mid_vesions").dialog("open");
				$(".editver_sql_form").hide(0);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#tbl_version").html('');
			}
		}
	});
}

function UpdateWare(id) {
	$("#hid_wareupdate").val(id);
	$("#Uchangepsd").dialog("open");
}

function GetWidgetClassifyList() {
	$.ajax({
		url: '/Home/GetWidgetClassifyList',
		data: 'wareId=' + $("#hid_wareid_c").val(),
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#pop_manage_cate .data_box").setTemplateElement("temp_widgetclassifylist");
				$("#pop_manage_cate .data_box").processTemplate(v);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				$("#pop_manage_cate .data_box").html('');
			}
			Zqm.chage_mname();
		}
	});
}

///新加版本客户端相关
///版本列表
function ListAssembleVersion() {
	var result;
	$.ajax({
		url: '/Home/ListAssembleVersion',
		type: 'post',
		dataType: 'json',
		async: false,
		success: function (v) {
			if (v.Code == 0) {
				result = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
	return result;
}
//客户端列表
//function ListClientInfo() {
//	var result;
//	$.ajax({
//		url: '/Home/ListClientInfo',
//		type: 'post',
//		dataType: 'json',
//		async: false,
//		success: function (v) {
//			if (v.Code == 0) {
//				result = v.list;
//			} else if (v.Code == -402) {
//				RedictToUserLogin(v.msg);
//			}
//		}
//	});
//	return result;

//}
//添加客户端(已完成)
function AddClientInfo() {
	$.ajax({
		url: '/Home/AddClientInfo',
		data: 'code=' + $("#warecli_pack").val() + "&content=" + $("#warecli_intro").val(),
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#pop_add_wareclient").dialog("close");
				Zqm.poptip_output("客户端添加成功", "success", true);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}

//添加测试数据
function AddTestDataSql(wareid, content) {
	$.ajax({
		url: '/Home/AddTestDataSql',
		data: 'wareid=' + wareid + "&content=" + encodeURIComponent(content),
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {

			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}
///删除测试数据
function DeleteTestDataSql(wareid) {
	$.ajax({
		url: '/Home/DeleteTestDataSql',
		data: 'wareid=' + wareid,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {

			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}

//获取测试数据
function ListTestDataSql(wareid) {
	var result;
	$.ajax({
		url: '/Home/ListTestDataSql',
		data: 'wareid=' + wareid,
		type: 'post',
		async: false,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				result = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
	return result;
}


//添加数据库升级sql
function AddUpdateDataSql(versionId, type, content) {
	$.ajax({
		url: '/Home/AddUpdateDataSql',
		data: 'versionId=' + versionId + "&type=" + type + "&content=" + encodeURIComponent(content),
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {

			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}
///删除测试数据
function DeleteUpdateDataSql(versionId, type) {
	$.ajax({
		url: '/Home/DeleteUpdateDataSql',
		data: 'versionId=' + versionId + "&type=" + type,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {

			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
}

///更新所有应用及挂件
function ReleaseUpdateVersion(versionId, type) {
	$.ajax({
		url: '/Home/ReleaseUpdateVersion',
		type: 'post',
		dataType: 'json',
		beforeSend: function () {
			$(".js-iframe-loading").show();
			Zqm.poptip_output("正在更新所有应用", "loading");
		},
		success: function (v) {
			if (v.Code == 0) {
				Zqm.poptip_output("更新应用成功", "success", false);
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			} else {
				//Zqm.poptip_output("更新应用失败,原因：" + v.msg, "fail", false);
				Zqm.poptip_output("更新应用失败", "fail", false);
				$('.js-update-failinfo').html(v.msg);
				$("#update-fail-popup").dialog("open");
			}
			$(".js-iframe-loading").hide();
		},
		error:function(){
			Zqm.poptip_output("请求失败,请稍后再试", "fail", false);
			$(".js-iframe-loading").hide();
		}
	});
}

//获取升级数据库sql
function ListUpdateDataSql(versionId, type) {
	var result;
	$.ajax({
		url: '/Home/ListUpdateDataSql',
		data: 'versionId=' + versionId + '&type=' + type,
		type: 'post',
		async: false,
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				result = v.list;
			} else if (v.Code == -402) {
				RedictToUserLogin(v.msg);
			}
		}
	});
	return result;
}

function GetClassifyLists(pageIndex) {
	var d = {};
	d.currentPage = pageIndex + 1;
	$.ajax({
		url: '/Home/GetClassifyList',
		data: d,
		type: 'post',
		dataType: 'json',
		success: function (v) {
			if (v.Code == 0) {
				$("#classifyList").setTemplateElement("txt_template");
				$("#classifyList").processTemplate(v);
			} else {
				$("#classifyList").html('');
			}
		}
	});
}