(function () {
    // 上传地址
    const UploadHost = '/admin/upload_file';

    function SKU(name, options, sku) {
        this.warp = $('.sku_' + name);
        this.attrs = {};// 规格项
        this.attrsData = JSON.parse(sku); //SKU数据
        this.options = JSON.parse(options)
        this.template = null;
        this.isSingle = 1;
        this.option_values = []; // 统一库存
        this.init();
    }

    SKU.prototype.init = function () {
        let _this = this;
        // 选择sku的类型（单规格/多规格）
        _this.warp.find('.suk_single').change(function () {
            _this.isSingle = $(this)[0].value
            if (_this.isSingle === '1') {
                _this.warp.find('.sku_attr_key_val').hide();
                _this.warp.find('.Js_sku_input').val('');
                _this.warp.find('.Js_sku_data_input').val('');
            } else {
                if (_this.template === null) {
                    var target = _this.warp.find(".st_select");
                    $(target).select2({
                        placeholder: {id: '', text: '选择规格模板'},
                        allowClear: true,
                        ajax: {
                            url: "/admin/sku/specifications",
                            dataType: 'json',
                            type: 'GET',
                            delay: 500,
                            data: function (params) {
                                return {
                                    p: params.term,        //params.term 搜索参数值
                                    page: params.page
                                };
                            },
                            processResults: function (data, page) {
                                var arr = [];
                                data.data.map(x => arr.push({id: x.id, text: x.name, dataContent: x.content}));  //整理绑定格式 ， 放到arr里

                                return {
                                    results: arr,
                                    more: page < data.last_page
                                };
                            },
                            cache: true
                        },
                        escapeMarkup: function (markup) {
                            return markup;
                        },
                        // let our custom formatter work
                        // minimumInputLength: 2, //至少输入多少个字符后才会去调用ajax
                        // maximumInputLength: 20, //最多能输入多少个字符后才会去调用ajax
                        // minimumResultsForSearch: 1,
                        // width: "260px",
                        templateResult: function (data) {
                            if (data.loading) return data.text;
                            return "<div>" + data.text + "</div>";
                        },
                        templateSelection: function (data) {
                            return data.text;
                        }

                    });
                }
                _this.warp.find('.Js_sku_input').val(JSON.stringify(_this.attrs));
                _this.warp.find('.sku_attr_key_val').show();
            }
            _this.SKUForm(_this.attrsData)
        });

        _this.warp.on('click', '.Js_load_attr', function () {
            _this.attrs = _this.warp.find('.st_select').select2('data')[0].dataContent
            _this.warp.find('.Js_sku_input').val(JSON.stringify(_this.attrs));
            _this.initForm();
        });

        // 绑定属性值添加事件
        _this.warp.find('.sku_attr_key_val').on('click', '.Js_add_attr_val', function () {
            let html = '<div class="sku_attr_val_item">' +
                '<div class="sku_attr_val_input">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>';
            $(this).before(html);
        });

        // 绑定属性值移除事件
        _this.warp.find('.sku_attr_key_val').on('click', '.Js_remove_attr_val', function () {
            $(this).parent('.sku_attr_val_item').remove();
            _this.getSkuAttr();
        });

        // 绑定添加属性名事件
        _this.warp.find('.Js_add_attr_name').click(function () {
            let html = '<tr>' +
                '<td><input type="text" class="form-control"></td>' +
                '<td>' +
                '<div class="sku_attr_val_warp">' +
                '<div class="sku_attr_val_item">' +
                '<div class="sku_attr_val_input">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>' +
                '<div class="sku_attr_val_item Js_add_attr_val" style="padding-left:10px">' +
                '<span class="btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<span class="btn btn-warning Js_remove_attr_name">移除</span>' +
                '</td>' +
                '</tr>';
            _this.warp.find('.sku_attr_key_val tbody').append(html)
        });

        // 绑定移除属性名事件
        _this.warp.find('.sku_attr_key_val').on('click', '.Js_remove_attr_name', function () {
            $(this).parents('tr').remove();
            _this.getSkuAttr()
        });

        // 绑定input变化事件
        _this.warp.find('.sku_attr_key_val tbody').on('change', 'input', _this.getSkuAttr.bind(_this));
        _this.warp.find('.sku_edit_warp tbody').on('keyup', 'input', _this.processSku.bind(_this));

        // 统一价格
        _this.warp.find('.sku_edit_warp thead').on('keyup', 'input.Js_common', function () {
            _this.option_values[$(this).data('field')] = $(this).val();
            _this.warp.find('.sku_edit_warp tbody td[data-field="' + $(this).data('field') + '"] input').val($(this).val());
            _this.processSku()
        });

        //初始化数据
        _this.attrs = JSON.parse(_this.warp.find('.Js_sku_input').val())

        _this.initForm();
        if (Object.keys(_this.attrs).length === 0) {
            _this.warp.find('.suk_single[value=1]').attr("checked", true).change();
        } else {
            _this.warp.find('.suk_single[value=0]').attr("checked", true).change();
        }
    };

    SKU.prototype.initForm = function () {
        let _this = this
        let attr_names = _this.attrs;
        let tbody = _this.warp.find('.sku_attr_key_val tbody');
        let attr_keys = Object.keys(attr_names);
        let attr_keys_len = attr_keys.length;
        attr_keys.forEach(function (attr_key, index) {
            // 接着处理下一行
            if (index < attr_keys_len) {
                _this.warp.find('.Js_add_attr_name').trigger('click');
            }
            // 规格名
            let tr = tbody.find('tr').eq(index);
            tr.find('td:eq(0) input').val(attr_key);

            // 规格值
            let attr_val_td = tr.find('td:eq(1)');
            let attr_vals = attr_names[attr_key];
            let attr_vals_len = attr_vals.length;
            attr_vals.forEach(function (attr_val, index_2) {
                attr_val_td.find('input').eq(index_2).val(attr_val);
                if (index_2 < attr_vals_len - 1) {
                    attr_val_td.find('.Js_add_attr_val').trigger('click');
                }
            });

        });

        _this.SKUForm(_this.attrsData);
    };

    // 获取SKU属性
    SKU.prototype.getSkuAttr = function () {
        let attr = {}; // 所有属性
        let _this = this;
        let trs = _this.warp.find('.sku_attr_key_val tbody tr');
        trs.each(function () {
            let tr = $(this);
            let attr_name = tr.find('td:eq(0) input').val(); // 属性名
            let attr_val = []; // 属性值
            if (attr_name) {
                // 获取对应的属性值
                tr.find('td:eq(1) input').each(function () {
                    let ipt_val = $(this).val();
                    if (ipt_val) {
                        attr_val.push(ipt_val)
                    }
                });
            }
            if (attr_val.length) {
                attr[attr_name] = attr_val;
            }
        });

        if (JSON.stringify(_this.attrs) !== JSON.stringify(attr)) {
            _this.attrs = attr;
            _this.warp.find('.Js_sku_input').val(JSON.stringify(_this.attrs));
            _this.SKUForm(_this.attrsData)
        }
    };

    // 生成具体的SKU配置表单
    SKU.prototype.SKUForm = function (default_sku) {
        let _this = this;
        let attr_names = Object.keys(_this.attrs);
        // 渲染表头
        let thead_html = '<tr>';
        if (_this.isSingle !== '1') {
            attr_names.forEach(function (attr_name) {
                thead_html += '<th>' + attr_name + '</th>'
            });
        }
        $.each(_this.options, function (key, name) {
            thead_html += `<th style="width: 100px">${name} <input data-field="${key}" value="${_this.option_values[key] | 0}" type="text" style="width: 50px" class="Js_common"></th>`;
        })

        thead_html += '</tr>';
        _this.warp.find('.sku_edit_warp thead').html(thead_html);
        let tbody_html = '';
        if (_this.isSingle === '1') {
            tbody_html += '<tr>';
            $.each(_this.options, function (key, name) {
                tbody_html += `<td style="width: 100px">${name} <input value="${_this.option_values[key] | 0}" type="text" style="width: 50px" class="Js_common"></td>`;
            })
            tbody_html += '</tr>'
        } else {
            let cartesianProductOf = (function () {
                return Array.prototype.reduce.call(arguments, function (a, b) {
                    var ret = [];
                    a.forEach(function (a) {
                        b.forEach(function (b) {
                            ret.push(a.concat([b]));
                        });
                    });
                    return ret;
                }, [[]]);
            })(...Object.values(_this.attrs));

            // 根据计算的笛卡尔积渲染tbody

            cartesianProductOf.forEach(function (sku_item) {
                tbody_html += '<tr>';
                sku_item.forEach(function (attr_val, index) {
                    let attr_name = attr_names[index];
                    tbody_html += '<td data-field="' + attr_name + '">' + attr_val + '</td>';
                });

                $.each(_this.options, function (key, name) {
                    tbody_html += `<td data-field="${key}"><input value="${_this.option_values[key] | 0}" type="text" class="form-control"></td>`;
                })

                tbody_html += '</tr>'
            });
        }
        // 求笛卡尔积

        _this.warp.find('.sku_edit_warp tbody').html(tbody_html);

        if (default_sku) {
            // 填充数据
            $.each(default_sku, function (index, item_sku) {
                let tr = _this.warp.find('.sku_edit_warp tbody tr').eq(index);
                Object.keys(item_sku).forEach(function (field) {
                    let input = tr.find('td[data-field="' + field + '"] input');
                    if (input.length) {
                        input.val(item_sku[field]);
                    }
                })
            });
        }

        _this.processSku()
    };

    // 处理最终SKU数据，并写入input
    SKU.prototype.processSku = function () {
        let _this = this;
        let sku = [];
        _this.warp.find('.sku_edit_warp tbody tr').each(function () {
            let tr = $(this);
            let item_option = {};
            let item_sku = {};
            tr.find('td[data-field]').each(function () {
                let td = $(this);
                let field = td.attr('data-field');
                let input = td.find('input');


                if (input.length) {
                    item_option[field] = input.val();
                } else {
                    item_sku[field] = td.text();
                }
            });
            item_option['specification'] = item_sku
            sku.push(item_option);
        });
        _this.warp.find('.Js_sku_data_input').val(JSON.stringify(sku));
    };

    window.LaravelAdminSKU = SKU;
})();
