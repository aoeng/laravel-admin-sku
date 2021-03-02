<?php

namespace Aoeng\Laravel\Admin\Sku;

use Encore\Admin\Extension;

class Sku extends Extension
{
    public $name = 'sku';

    public $views = __DIR__.'/../resources/views';

    public $assets = __DIR__.'/../resources/assets';

    public function __construct()
    {
        self::routes(__DIR__ . '/../routes/admin.php');
    }

    public static function import()
    {
        parent::import();

        self::createMenu('规格模板管理', 'sku\specification-templates', 'fa-file');
    }
}
