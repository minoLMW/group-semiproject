$(function() {

    setTimeout(function() {
        anime({
            targets: '.slogan span',
            easing: 'easeOutExpo',
            delay: anime.stagger(40),
            translateX: ['-50%', 0],
            opacity: [0, 1]
        });
    }, 1000);

    $('.code').each(function(i, el) {
        $(el).text($(el).children().text().trim());
    });
});