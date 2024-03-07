import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  @Input() control!: FormControl;
  @Input() icon!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label!: string;
  @Input() autocomplete: string = 'false';

  constructor() { }

  ngOnInit() {}

}
