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

    public function render()
    {

        $this->script = <<< EOF
window.DemoSku = new JadeKunSKU('{$this->getElementClassSelector()}')
EOF;
        return parent::render();
    }

}
