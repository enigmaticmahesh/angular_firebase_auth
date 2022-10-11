import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AppService } from "src/app/app.service";

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

    handleLoader: boolean = false
    handleSub: Subject<boolean> = new Subject()

    constructor(private appService: AppService) {
        
    }

    ngOnInit(): void {
        this.appService.showLoader
        .pipe(takeUntil(this.handleSub))
        .subscribe(val => this.handleLoader = val)
    }
    
    ngOnDestroy(): void {
        this.handleSub.next(true)
    }
}