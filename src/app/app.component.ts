import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import {MatIcon} from '@angular/material/icon';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [RouterOutlet, HeaderComponent,MatIcon ]
})
export class AppComponent {
  title = 'projeto-di2win';
}
