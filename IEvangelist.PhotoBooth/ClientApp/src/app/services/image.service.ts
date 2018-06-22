import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ImageOptions } from '../models/image-options';
import { Generated } from '../models/generated';
import { ShareUrl } from '../models/share-url';

@Injectable()
export class ImageService {
    private readonly httpOptions;

    constructor(private http: HttpClient, @Inject('BASE_API_URL') private apiUrl: string) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
    }

    public getOptions(): Promise<ImageOptions> {
        return this.http
                   .get<ImageOptions>(`${this.apiUrl}api/image/options`)
                   .toPromise();
    }

    public get(id: string): Promise<ShareUrl> {
        return this.http
                   .get<ShareUrl>(`${this.apiUrl}api/image/${id}`)
                   .toPromise();
    }

    public generateAnimiation(phoneNumber: string, images: string[]) {
        let phone =
            phoneNumber && phoneNumber.length > 11
                ? phoneNumber.substring(0, 11)
                : phoneNumber;

        if (phone && phone.length == 10) {
            phone = `1${phone}`;
        }

        return this.http
                   .post<Generated>(
                       `${this.apiUrl}api/image/generate`,
                       JSON.stringify({ phone, images }),
                       this.httpOptions)
                   .toPromise();
    }
}