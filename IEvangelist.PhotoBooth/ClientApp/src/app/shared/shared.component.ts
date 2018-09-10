import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image.service';
import { ShareButtons } from '@ngx-share/core';
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
        public share:ShareButtons,
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
                this.meta.addTags([
                        { name: 'title', content: 'Cream City Code -- 2018' },
                        { name: 'description', content: 'Pictures from the Cream City Code 2018 #DeveloperCommunity Photo Booth App.' },
                        { name: 'twitter:card', content: 'summary_large_image' },
                        { name: 'twitter:creator', content: 'David Pine & Ben Felda' },
                        { name: 'twitter:image', content: this.url },
                        { name: 'twitter:site', content: '@creamcitycode' },                    
                        { name: 'twitter:title', content: 'Cream City Code -- 2018' },
                        { name: 'twitter:url', content: location.href },                    
                        { property: 'og:description', content: 'Pictures from the Cream City Code 2018 #DeveloperCommunity Photo Booth App.' },
                        { property: 'og:image', content: this.url },
                        { property: 'og:image:type', content: 'image/gif' },
                        { property: 'og:image:width', content: '640' },
                        { property: 'og:image:height', content: '480' },
                        { property: 'og:url', content: location.href },
                        { property: 'og:title', content: 'Cream City Code -- 2018' },
                        { property: 'og:type', content:'place'}
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
