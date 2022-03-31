import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Component, OnInit, Renderer2, } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TabsPage } from 'src/app/shared/tabs/tabs.page';
import { StorageService } from '../../shared/storage.service/storage.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './chess-ranking.page.html',
  styleUrls: ['./chess-ranking.page.scss'],
})
export class Tab4Page implements OnInit {

  statsEater = {
    clickedRight: 1337,
    clickedWrong: 69,
    highScore: 420,
    completed: 666
  };
  ranking : any;

  constructor(
    private http: HttpClient,
    public alertController: AlertController, private storageService: StorageService, private tabs: TabsPage, private renderer: Renderer2) { 
  }
  async updateData()
  {
    const data = await this.storageService.getData()
    this.statsEater = data[0].eater;
  }
  ngOnInit() {

    this.updateData()
    this.renderer.listen(this.tabs.tab4.nativeElement, "click", ()=>{this.updateData()})
  }

  async handleButtonClick() {
    const alert = await this.alertController.create({
      header: 'Czy na pewno?',
      message: 'Czy chcesz się wylogować?',
      buttons: ['Nie', 'Nie'],
    });

    await alert.present();
  }
  async showRankings()
  {
    this.http.get('http://localhost:3000/getrankings').pipe(
      map(r => r)
    ).subscribe(resp => {
        this.ranking = resp
        if(document.querySelector("#blankScoreboard")) document.querySelector("#blankScoreboard").setAttribute("id", "scoreboard")
      }
    );
  }
  closeScoreboard()
  {
    document.querySelector("#scoreboard").setAttribute("id", "blankScoreboard")
  }
}
