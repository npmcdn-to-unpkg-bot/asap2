import {Component, OnInit} from 'angular2/core';
import {JSONP_PROVIDERS} from 'angular2/http';
import {Observable} from "rxjs/observable"
import {Subject} from "rxjs/subject"

import {WikipediaService} from "./wikipedia.service";


@Component({
    selector: 'my-wiki',
    template: `
        <h1>Wikipedia Demo</h1>
            <p><i>Fetches after each keystroke</i></p>
            <input #term (keyup)="search(term.value)"/>
            <ul>
                <li *ngFor="#item of items | async">{{item}}</li>
            </ul>
    `,
    providers: [JSONP_PROVIDERS, WikipediaService]
})
export class WikiComponent {

    constructor(private _wikipediaService: WikipediaService) {
    }

    private _searchTermStream = new Subject<string>();

    search(term: string) {
        this._searchTermStream.next(term);
    }

    items: Observable<string[]> = this._searchTermStream
        .debounceTime(300)
        .distinctUntilChanged()
        .switchMap((term: string) => this._wikipediaService.search(term));



}

