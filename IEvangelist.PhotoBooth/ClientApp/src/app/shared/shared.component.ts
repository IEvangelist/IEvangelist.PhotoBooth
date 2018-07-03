import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image.service';

@Component({
    selector: 'shared',
    templateUrl: './shared.component.html',
    styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {

    public isLoading = true;
    public url: string;
    private id: string;

    constructor(
        private readonly imageService: ImageService,
        private readonly route: ActivatedRoute,
        private readonly meta: Meta) {
        this.route.params.subscribe(params => this.id = params['id']);
    }

    async ngOnInit() {
        try {
            const shareUrl = await this.imageService.get(this.id);
            if (shareUrl) {
                this.url = shareUrl.url;

                // TODO: add more meta tags here
                // facebook, instagram, foursquare, linkedin, etc.
                this.meta.addTags([
                    { name: 'twitter:card', content: 'summary_large_image' },
                    { name: 'twitter:site', content: 'www.creamcitycode.com' },
                    { name: 'twitter:creator', content: 'David Pine & Ben Felda' },
                    { property: 'og:url', content: location.href },
                    { property: 'og:title', content: 'Cream City Code -- 2018' },
                    { property: 'og:description', content: 'Pictures from the Cream City Code 2018 #DeveloperCommunity Photo Booth App.' },
                    { property: 'og:image', content: this.url }
                ],
                    true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoading = false;
        }
    }
}