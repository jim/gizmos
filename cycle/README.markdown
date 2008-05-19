## Cycle - a Javascript implementation of Rails' Text Helper

Built to ease zebra-striping a table. I've avoided any JS library-provided niceties to maximize portability. No support for naming.

Basic usage:

    >>> Cycle.thru('one', 'two', 'three');
    "one"
    >>> Cycle.thru('one', 'two', 'three');
    "two"
    >>> Cycle.thru('one', 'two', 'three');
    "three"
    >>> Cycle.thru('one', 'two', 'three');
    "one"
    >>> Cycle.thru('one', 'two', 'three');
    "two"
    >>> Cycle.reset('one', 'two', 'three');
    >>> Cycle.thru('one', 'two', 'three');
    "one"