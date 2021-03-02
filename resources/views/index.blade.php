<div class="{{$viewClass['form-group']}}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}}">
        <div class="sku_warp sku_{{$class}}">
            <input type="hidden" class="Js_sku_input" name="{{$name}}" value="{{old($column, $value)}}">
            <input type="hidden" class="Js_sku_data_input" name="{{$name}}_data" value="{{old($column, $value)}}">
            <div class="sku_attr_select">
                <label class="radio-inline">
                    <input type="radio" name="{{$name}}_single" value="1" class="minimal suk_single" checked/>&nbsp;单规格
                </label>
                <label class="radio-inline">
                    <input type="radio" name="{{$name}}_single" value="0" class="minimal suk_single"/>&nbsp;多规格
                </label>
            </div>
            <div class="sku_attr_key_val" style="display: none">
                <select class="form-control st_select" name="" style="width: 200px" property="选择规格模板">
                    <option value=""></option>
                </select>
                <span class="btn btn-success  Js_load_attr">加载模板</span>
                <span class="btn btn-success  Js_add_attr_name">添加规格项</span>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th style="width: 100px">规格名</th>
                        <th>规格值</th>
                        <th style="width: 100px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>

            <!-- 操作SKU -->
            <div class="sku_edit_warp">
                <table class="table table-bordered" style="width: auto">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

    </div>
</div>
