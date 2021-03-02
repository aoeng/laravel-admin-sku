<?php

namespace Aoeng\Laravel\Admin\Sku\Controllers;

use Aoeng\Laravel\Admin\Sku\Models\SpecificationTemplate;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class SpecificationTemplateController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = '规格模板管理';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new SpecificationTemplate());

        $grid->column('id', __('Id'));
        $grid->column('name', __('Name'));
        $grid->column('keys', __('Keys'))->display(function ($keys) {
            return implode(',', $keys);
        });
        $grid->column('content', __('Content'))->display(function ($content) {
            return implode('<br/>', array_map(fn($values) => implode(',', $values), $content));
        });
        $grid->column('sort', __('Sort'))->editable();
        $grid->column('is_display', __('Is display'))->switch();
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));

        $grid->actions(function (Grid\Displayers\Actions $actions) {
            $actions->disableView();
        });

        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(SpecificationTemplate::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('content', __('Content'));
        $show->field('sort', __('Sort'));
        $show->field('is_display', __('Is display'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new SpecificationTemplate());

        $form->text('name', __('Name'));
        $form->keyValues('content', __('Content'));
        $form->number('sort', __('Sort'))->default(0);
        $form->switch('is_display', __('Is display'))->default(1);

        return $form;
    }
}
