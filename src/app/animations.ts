import {
    animate,
    group,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const generalAnimation = trigger('generalAnimation', [
    transition('* <=> *', [

        query(':enter', [
            style({ opacity: 0, transform: 'scale(0.8)' })
        ], { optional: true }),

        group([
            query(':enter', [
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ], { optional: true }),
        ]),
    ]),
]);

export const slideDownAnimation = trigger('slideDownAnimation', [
    transition(':enter', [
        style({
            transform: 'translateY(-100%)',
            opacity: 0,
        }),
        animate(
            '800ms ease-out',
            style({
                transform: 'translateY(0)',
                opacity: 1,
            })
        ),
    ]),
]);
