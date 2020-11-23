<?php

namespace AwemaPL\FilterWrapper;

use AwemaPL\BaseJS\AwemaProvider;

class FilterWrapperServiceProvider extends AwemaProvider
{

    public function getPackageName(): string
    {
        return 'filter-wrapper';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}
