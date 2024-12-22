import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";

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
export class HomeComponent {

  counter = signal<Counter>({ value: 100});
  values = signal<number[]>([0]);
  cont = signal(0);
  tenX = computed(()=> {
    return this.cont() * 10;
  });

  increment(){
    // this.counter.set(this.counter() +1);

    //this.counter.update(v => v+1);

    // this.counter.update(v => ({
    //   ...v,
    //   value: v.value + 1
    // }));

    this.cont.update(v => v +1);
  }

  append(){
      this.values.update(v =>
        [
          ...v,
          v[v.length -1] + 1
        ]
      );
  }

}
