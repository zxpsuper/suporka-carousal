import Router from './htmlRouter-dev'
window.router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/monday',
            name: 'monday',
        },
        {
            path: '/tuesday',
            name: 'tuesday',
        },
        {
            path: '/wednesday',
            name: 'wednesday',
        },
        {
            path: '/thursday',
            name: 'thursday',
        },
        {
            path: '/friday',
            name: 'friday',
        },
    ],
});
