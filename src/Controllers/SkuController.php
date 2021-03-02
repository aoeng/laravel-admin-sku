<?php

namespace Aoeng\Laravel\Admin\Sku\Controllers;

use Aoeng\Laravel\Admin\Sku\Models\SpecificationTemplate;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SkuController extends Controller
{
    public function specifications(Request $request)
    {
        return SpecificationTemplate::query()->where('is_display', 1)->orderByDesc('sort')->paginate(null, ['id', 'name', 'content']);
    }
}
