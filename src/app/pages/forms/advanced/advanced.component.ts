import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbTimeStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { COUNTRIES, STATES } from './data';

@Component({
  selector: 'app-form-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  // select2 config
  countries: Select2Data = [];

  // date picker config
  model1!: NgbDateStruct;
  model2!: NgbDateStruct;
  hidden: boolean = true;

  // timepicker config
  time1!: NgbTimeStruct;
  time2!: NgbTimeStruct;
  time3!: NgbTimeStruct;
  time4!: NgbTimeStruct;
  show: boolean = true;
  meridian: boolean = true;
  spinners = true;

  // typeahead config
  statesList: string[] = [];
  typeaheadModel: any;
  formatter = (result: string) => result.toUpperCase();

  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;

  constructor (private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Forms', path: '/' }, { label: 'Form Advanced', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches country list
   */
  _fetchData(): void {
    this.countries = COUNTRIES;
    this.statesList = STATES;
  }


  /**
   * toggles meridian
   */
  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  /**
   * toggles spinner visibility
   */
  toggleSpinners() {
    this.spinners = !this.spinners;
  }


  /**
 * search function of typeahead 1
 */
  search1: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.statesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  /**
   * search function of typeahead 2
   */
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.statesList
        : this.statesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
}
