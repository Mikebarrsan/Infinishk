/* Funciones para alternar entre usuarios activos y no activos */
function diplomados_activos() {
    const tab_en_curso = document.querySelector('#nav_en_curso');
    const tab_no_activos = document.querySelector('#nav_no_activos');
    const tab_activos = document.querySelector('#nav_activos');

    tab_en_curso.classList.remove('is-active');
    tab_no_activos.classList.remove('is-active');
    tab_activos.classList.add('is-active');

    const diplomados_no_activos = document.querySelector(
        '#diplomados_no_activos');
    diplomados_no_activos.classList.add('is-hidden');

    const diplomados_en_curso = document.querySelector('#diplomados_en_curso');
    diplomados_en_curso.classList.add('is-hidden');

    const diplomados_activos = document.querySelector('#diplomados_activos');
    diplomados_activos.classList.remove('is-hidden');
}

function diplomados_no_activos() {
    const tab_en_curso = document.querySelector('#nav_en_curso');
    const tab_no_activos = document.querySelector('#nav_no_activos');
    const tab_activos = document.querySelector('#nav_activos');

    tab_en_curso.classList.remove('is-active');
    tab_no_activos.classList.add('is-active');
    tab_activos.classList.remove('is-active');

    const diplomados_no_activos = document.querySelector(
        '#diplomados_no_activos');
    diplomados_no_activos.classList.remove('is-hidden');

    const diplomados_en_curso = document.querySelector('#diplomados_en_curso');
    diplomados_en_curso.classList.add('is-hidden');

    const diplomados_activos = document.querySelector('#diplomados_activos');
    diplomados_activos.classList.add('is-hidden');
}

function diplomados_en_curso() {
    const tab_en_curso = document.querySelector('#nav_en_curso');
    const tab_no_activos = document.querySelector('#nav_no_activos');
    const tab_activos = document.querySelector('#nav_activos');


    tab_en_curso.classList.add('is-active');
    tab_no_activos.classList.remove('is-active');
    tab_activos.classList.remove('is-active');

    const diplomados_en_curso = document.querySelector('#diplomados_en_curso');
    diplomados_en_curso.classList.remove('is-hidden');

    const diplomados_activos = document.querySelector('#diplomados_activos');
    diplomados_activos.classList.add('is-hidden');

    const diplomados_no_activos = document.querySelector(
        '#diplomados_no_activos');
    diplomados_no_activos.classList.add('is-hidden');
}
