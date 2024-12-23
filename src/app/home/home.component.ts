import {Component, computed, effect, inject, Injector, OnInit, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

type Counter = {
  value: number
};

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit {

  courseService = inject(CoursesService);

  #courses = signal<Course[]>([])

  begginerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(c => c.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(c => c.category === 'ADVANCED');
  });

  constructor(){
    effect(() => {
      console.log(`Iniciante: `, this.begginerCourses());
      console.log(`Avançado`, this.advancedCourses());
    });
  }

  ngOnInit(){
    this.loadCourses().then(() => console.log(this.#courses()));

  }

  async loadCourses(){

    try{
      const dataCourses =  await this.courseService.loadAllCourses();
      this.#courses.set(dataCourses.sort(sortCoursesBySeqNo));
    } catch(err){
      alert('Erro carregando cursos');
      console.error(err);
    }

  }

}
