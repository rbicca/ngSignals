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
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

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
  dialog = inject(MatDialog);

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

  onCourseUpadted(updatedCourse: Course){

    const courses = this.#courses();

    const newCourses = courses.map(c =>
      c.id === updatedCourse.id ? updatedCourse : c
    );

    this.#courses.set(newCourses);
  }

  async onCouseDeleted(courseId: string){

    try{
      await this.courseService.deleteCourse(courseId);

      const courses = this.#courses();
      const newCourses = courses.filter(c => c.id !== courseId);
      this.#courses.set(newCourses);
    }
    catch(err){
      console.error(err);
      alert('Erro ao exlcuir o curso');
    }

  }

  async onAddCourse(){

    const newCourse = await openEditCourseDialog(
      this.dialog,
      {
        mode: "create",
        title: "Criar novo curso"
      });

      const newCourses = [
        ...this.#courses(),
        newCourse
      ];
      this.#courses.set(newCourses);
  }

}


