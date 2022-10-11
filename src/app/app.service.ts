import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    showLoader: Subject<boolean> = new Subject()
    
    constructor() {}

    startLoading() {
        this.showLoader.next(true)
    }

    stopLoading() {
        this.showLoader.next(false)
    }
}