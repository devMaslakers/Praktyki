import { Directive, ViewContainerRef, Component, ViewChild, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LessonItem } from '../lessons/lesson-item';
import { LessonService } from '../lessons/lesson.service';
import { LessonContainerComponent } from '../lessons/lessonsContainer.component';
import { NgxChessBoardView } from 'ngx-chess-board';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/shared/storage.service/storage.service';
import { alertController } from '@ionic/core';
import { TabsPage } from 'src/app/shared/tabs/tabs.page';


@Directive({
  selector: '[chessboard]'
})
@Component({
  selector: 'app-tab3',
  templateUrl: 'chess-lessons.page.html',
  styleUrls: ['chess-lessons.page.scss']
})
export class Tab3Page implements OnInit{

  data:any = {
    chessLessonsDone: 0
  }

  @Input() screenWidth: string;

  @ViewChild('container') container: ElementRef;
  @ViewChild('goBackButton', {read: ElementRef}) goBackButton: ElementRef;
  @ViewChild('title', {read: ElementRef}) title: ElementRef;
  @ViewChild('board', {static: false}) board!: NgxChessBoardView;


  lessonsData: any[] = [];
  actualLessonData: any;
  iconName: any[] = ['school','lock-closed','lock-closed','lock-closed','lock-closed','lock-closed','lock-closed','lock-closed','lock-closed','lock-closed'];

  constructor(
    private tabs: TabsPage,
    private renderer: Renderer2,
    public viewContainerRef: ViewContainerRef,
    private lessonService: LessonService,
    private platform: Platform,
    private storageService: StorageService) {
      platform.ready().then( () => {
        this.screenWidth = "" + platform.width;
      })

      this.getData();
    }


  @ViewChild(LessonContainerComponent) lesson:LessonContainerComponent;

  async getData() {
    const data = await this.storageService.getData();
    this.data.chessLessonsDone = data[1].chessLessonsDone;
    this.actualLessonData = data[2];


    this.updateIconsOfButtons();
  }
  async updateIconsOfButtons() {
    const lock = 'lock-closed';
    const school = 'school';


    for(let index = 0; index < this.iconName.length; index++){
      if(index <= this.data.chessLessonsDone){
        this.iconName[index] = school;
      }
      else {
        this.iconName[index] = lock;
      }
    }

  }


  async updateLessonData() {
    await this.storageService.updateData(this.data, 1);
    await this.storageService.updateData(this.actualLessonData, 2);
  }

  async startLesson(index)
  {   
    if(index <= this.data.chessLessonsDone) {
      

      this.actualLessonData.actualLesson = index;
      this.actualLessonData.isActualLessonDone = false;

      await this.updateLessonData();

      this.lesson.loadComponent(index);
      this.turnLessonsOff();
    } 
    else {
      this.lessonIsNotAvailable();
    }
  }
  lessons: LessonItem[] = [];

  ngOnInit() {
    this.getData()
    this.renderer.listen(this.tabs.tab3.nativeElement, "click", ()=>{this.getData()})
    this.lessons = this.lessonService.getLessons();
  }

  async goBack() {
    await this.updateClientData();
    await this.turnLessonsOn();
    await this.updateIconsOfButtons();
  }

  turnLessonsOff() {

    this.container.nativeElement.style.display = "none";
    this.goBackButton.nativeElement.style.display = "block";
    this.title.nativeElement.style.display = "none";
  }

  turnLessonsOn() {

    this.container.nativeElement.style.display = "block";
    this.goBackButton.nativeElement.style.display = "none";
    this.title.nativeElement.style.display = "block";

    this.lesson.unloadComponent();
  }

  async lessonIsNotAvailable() {
    const alert = await alertController.create({
      header: 'Nie masz dostępu !!!',
      message: 'rozwiąż poprzednią lekcję'
    })

    await alert.present();
  }

  async updateClientData() {
    await this.getData();

    const lesson = this.actualLessonData.actualLesson;
    const isLessonDone = this.actualLessonData.isActualLessonDone;

    if(isLessonDone) {
      if(lesson == this.data.chessLessonsDone) 
      {
        this.data.chessLessonsDone += 1;
      } 
    }
    
    this.updateLessonData();
  }

}
