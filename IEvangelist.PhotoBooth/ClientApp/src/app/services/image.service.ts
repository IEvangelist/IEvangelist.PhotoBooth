import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageOptions } from '../models/image-options';
import { Generated } from '../models/generated';
import { HttpHeaders } from '@angular/common/http';

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

    public generateAnimiation(images: string[]) {
        return this.http
                   .post<Generated>(
                       `${this.apiUrl}api/image/generate`,
                       JSON.stringify({ images }),
                       this.httpOptions)
                   .toPromise();
    }
}