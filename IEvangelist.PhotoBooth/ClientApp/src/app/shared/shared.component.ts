import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image.service';

@Component({
    selector: 'shared',
    templateUrl: './shared.component.html',
    styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {

    // https://palantir.github.io/tslint/rules/no-inferrable-types/
    // Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean
    public isLoading = true;
    public url: string;
    private id: string;

    constructor(
        private readonly imageService: ImageService,
        private readonly route: ActivatedRoute) {
        this.route.params.subscribe(params => this.id = params['id']);
    }

    async ngOnInit() {
        try {
            const shareUrl = await this.imageService.get(this.id);
            if (shareUrl) {
                this.url = shareUrl.url;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoading = false;
        }
    }
}