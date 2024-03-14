import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() backButton!: string;
  @Input() isModal: boolean = false;
  @Input() showMenu: boolean = false;

  private utilsServices = inject(UtilsService)

  constructor() { }

  ngOnInit() {}

  closeModal() {
    this.utilsServices.dismissModal();
  }

}
