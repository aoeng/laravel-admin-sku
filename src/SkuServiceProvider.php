<?php

namespace Aoeng\Laravel\Admin\Sku;

use Encore\Admin\Admin;
use Encore\Admin\Form;
use Illuminate\Support\ServiceProvider;

class SkuServiceProvider extends ServiceProvider
{
    public function boot(Sku $extension)
    {
        if ($views = $extension->views()) {
            $this->loadViewsFrom($views, 'laravel-admin-sku');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes([
                $assets => public_path('vendor/aoeng/laravel-admin-sku')
            ], 'laravel-admin-sku'
            );
        }

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        Admin::booting(function () {
            Form::extend('sku', SkuField::class);
        });
    }
}
