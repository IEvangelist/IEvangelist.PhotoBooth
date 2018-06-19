import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phone'
})
export class PhoneNumberPipe implements PipeTransform {

    transform(tel: string, _?: any): any {
        var value = tel.toString().trim().replace(/^\+/, '');
        if (value.match(/[^0-9]/)) {
            return tel;
        }

        let country, city, number;
        switch (value.length) {
            case 10:
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11:
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12:
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    }
}
