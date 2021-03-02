<?php

namespace Aoeng\Laravel\Admin\Sku\Models;


use Encore\Admin\Traits\DefaultDatetimeFormat;
use Illuminate\Database\Eloquent\Model;

/**
 * @group 规格模板 SpecificationTemplate
 * Class SpecificationTemplate
 * @package App\Models
 */
class SpecificationTemplate extends Model
{
    use DefaultDatetimeFormat;
    protected $appends = ['keys'];

    public function getKeysAttribute()
    {
        return array_keys(json_decode( $this->attributes['content'], true) ?: []);
    }

    public function getContentAttribute($value)
    {
        return json_decode($value, true) ?: [];
    }

    public function setContentAttribute($value)
    {
        if (is_array($value)) {
            $value = json_encode($value);
        }
        $this->attributes['content'] = $value;
    }
}
