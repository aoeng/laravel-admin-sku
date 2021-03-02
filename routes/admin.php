<?php

use Illuminate\Support\Facades\Route;

Route::prefix('sku')->group(function () {
    Route::resource('specification-templates', \Aoeng\Laravel\Admin\Sku\Controllers\SpecificationTemplateController::class);
    Route::get('specifications', '\Aoeng\Laravel\Admin\Sku\Controllers\SkuController@specifications');
});
