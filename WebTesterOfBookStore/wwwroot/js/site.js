$(document).ready(function () {

    $('.dropdown-toggle').on('click', function (e) {
        e.stopPropagation();
        $(this).next('.dropdown-menu').toggle();
    });

    $('.dropdown-item').on('click', function () {
        let selected = $(this).text();
        $('.dropdown-toggle').text(selected);
        $('.dropdown-menu').hide();
    });

    $(document).on('click', function () {
        $('.dropdown-menu').hide();
    });

    $('.refresh-btn').on('click', function () {
        const randomSeed = Math.floor(Math.random() * 100000);
        $('#seed').val(randomSeed);
    });

    $('#likesRange').on('input', function () {
        $('#rating').text(parseFloat($(this).val()).toFixed(1));
    });

    $('#reviews').on('input', function () {
        let value = parseFloat($(this).val());
        if (isNaN(value) || value < 0) value = 0;
        if (value > 10) value = 10;
        $(this).val(value.toFixed(1));
    });
});