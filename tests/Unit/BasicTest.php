<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class BasicTest extends TestCase
{
    public function test_money_values_can_be_formatted_to_two_decimals(): void
    {
        self::assertSame('19.90', number_format(19.9, 2, '.', ''));
    }
}
