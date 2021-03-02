<?php

namespace Aoeng\Laravel\Admin\Sku;

use Encore\Admin\Form\Field;

class SkuField extends Field
{
    protected $view = 'laravel-admin-sku::index';

    protected static $js = [
        'vendor/aoeng/laravel-admin-sku/sku.js'
    ];

    protected static $css = [
        'vendor/aoeng/laravel-admin-sku/sku.css'
    ];

    protected $sku = [];

    public function load($sku)
    {
        $this->sku = $sku;
    }

    public function render()
    {
        $options = json_encode($this->options ?: ['price' => '价格', 'inventory' => '库存']);
        $sku = json_encode($this->sku);

        $this->script = <<< EOF
window.DemoSku = new LaravelAdminSKU('{$this->column}','{$options}','$sku');

EOF;
        return parent::render();
    }

}
