import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'number-pad',
    templateUrl: './number-pad.component.html',
    styleUrls: ['./number-pad.component.css']
})
export class NumberPadComponent implements OnInit {
    @Output() numberChanged = new EventEmitter<string>();

    private userNumber: string = "";

    constructor() { }

    ngOnInit() { }

    public onType(char: string): void {
        this.userNumber += char;
        this.onNumberChanged();
    }

    public onDelete(): void {
        if (this.userNumber && this.userNumber.length) {
            this.userNumber =
                this.userNumber.length > 1
                    ? this.userNumber.slice(0, -1)
                    : "";
            this.onNumberChanged();
        }
    }

    public onClear(): void {
        this.userNumber = "";
        this.onNumberChanged();
    }

    private onNumberChanged(): void {
        this.numberChanged.emit(this.userNumber);
    }
}