import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import packageInfo from '../../../package.json';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-title-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css']
})
export class TitleScreenComponent {
  // Acessa a versão diretamente do package.json
  version = packageInfo.version;

  constructor(public langSvc: LanguageService) {}
}