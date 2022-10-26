import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div [ngClass]="{ modal: true, modal__hide: !show, modal__show: show }">
      <div class="modal__body">
        <div class="close__btn">
          <button class="btn btn-danger btn-round btn-icon" (click)="close()">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss'],
})
export class ModalCompoent {
  @Input() public show: boolean = false;
  @Output() public handleModal = new EventEmitter<boolean>();

  constructor() {}

  close() {
    this.handleModal.emit(false);
  }
}
