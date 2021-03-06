import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Asset } from './_models/asset';
import { DataMockService } from './_services/datamock.service';
import { map } from 'rxjs/operators';
import { DateFilter, Filter, FilterOn, NumberFilter, StringFilter } from './_models/filter';
import {  FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {  
  title = 'exercise-senior-front-end';
  displayAssets: Asset [] = [];
  sortByColumn: string = '';
  sortingOrderAsc: boolean = false;
  private timeObservable = interval(1000);
  private dataMockSubscription: Subscription;
  
  appliedFilters: FilterOn[] = []; 
  showFilter: boolean = false;

  stringFilters = StringFilter.filters;
  numberFilters = NumberFilter.filters;
  dateFilters = DateFilter.filters;

  idFilterFormGroup :FormGroup;
  assetFilterFormGroup: FormGroup;
  priceFilterFormGroup: FormGroup;
  updatedDateFilterFormGroup: FormGroup;
  assetTypeFilterFormGroup: FormGroup;

  constructor(private dataMockService: DataMockService,
    private formBuilder: FormBuilder){  
  }

  ngOnInit(): void {    
    this.filterFormInit();
    this.dataMockSubscription = this.mockObservable.subscribe();
    this.displayAssets = this.dataMockService.assets.slice();
  }

  ngOnDestroy(): void {    
    this.dataMockSubscription.unsubscribe();
  }  

  mockObservable = Observable.create(observer => {
    this.timeObservable.subscribe(() => {
      from(this.dataMockService.assets).pipe(map(val => {
        const random = Math.random();
        val.price = random >= 0.5 ? val.price + random : val.price - random;
        val.lastUpdate = Date.now();      
        if(this.sortByColumn === 'price'){
          this.sortBy('price');
        }if(this.sortByColumn === 'lastUpdate'){
          this.sortBy('lastUpdate');
        }
        return val;
      }))      
      .subscribe(val => observer.next(val));
    });
  });


  filterFormInit(){
    this.idFilterFormGroup = this.formBuilder.group({
      columnName:["id"],
      operation: [this.numberFilters[0].name],
      key: [null, [Validators.required]]
    });
    this.assetFilterFormGroup =  this.formBuilder.group({
      columnName:["assetName"],
      operation: [this.stringFilters[0].name],
      key: [null, [Validators.required]]
    });
    this.priceFilterFormGroup =  this.formBuilder.group({
      columnName:["price"],
      operation: [this.numberFilters[0].name],
      key: [null, [Validators.required]]
    });
    this.updatedDateFilterFormGroup = this.formBuilder.group({
      columnName:["lastUpdate"],
      operation: [this.dateFilters[0].name],
      key: [null, [Validators.required]]
    });
    this.assetTypeFilterFormGroup = this.formBuilder.group({
      columnName:["type"],
      operation: [this.stringFilters[0].name],
      key: [null, [Validators.required]]
    });
  }

  public clearFilter(){
    this.displayAssets = this.dataMockService.assets.slice();
    this.appliedFilters.splice(0, this.appliedFilters.length);
    //to retain the original sorting order after clearing the filter
    this.sortingOrderAsc = !this.sortingOrderAsc;
    this.sortBy(this.sortByColumn);
    this.filterFormInit();
  }

  public filterById(){
    const key = this.idFilterFormGroup.get('key').value;
    const operation = this.idFilterFormGroup.get('operation').value;
    const columnName = this.idFilterFormGroup.get('columnName').value;
    if(key != null ){
      this.filter("number", operation, columnName, key ); 
    }    
  }

  public filterByAssetName(){
    const key = this.assetFilterFormGroup.get('key').value;
    const operation = this.assetFilterFormGroup.get('operation').value;
    const columnName = this.assetFilterFormGroup.get('columnName').value;
    if(key != null){
      this.filter("string", operation, columnName, key ); 
    }    
  }

  public filterByPrice(){
    const key = this.priceFilterFormGroup.get('key').value;
    const operation = this.priceFilterFormGroup.get('operation').value;
    const columnName = this.priceFilterFormGroup.get('columnName').value;
    if(key != null){
      this.filter("number", operation, columnName, key ); 
    }       
  }

  public filterByDate(){
    const key = this.updatedDateFilterFormGroup.get('key').value;
    const operation = this.updatedDateFilterFormGroup.get('operation').value;
    const columnName = this.updatedDateFilterFormGroup.get('columnName').value;
    if(key != null){
      this.filter("date", operation, columnName, key ); 
    }    
  }

  public filterByAssetType(){
    const key = this.assetTypeFilterFormGroup.get('key').value;
    const operation = this.assetTypeFilterFormGroup.get('operation').value;
    const columnName = this.assetTypeFilterFormGroup.get('columnName').value;
    console.log("key:"+key+" operation:"+operation+" columnName:"+columnName);
    if(key != null){
      this.filter("string", operation, columnName, key ); 
    }    
  }


  public filter(dataType:string, operation: string, column:string, key:any){
    const type = dataType.toLowerCase();
    switch(type){      
      case "number":
          const numberFilter = this.numberFilters.find(a => a.name === operation);
          console.log(numberFilter);
          this.appliedFilters.push({columnName : column,key : key,filter: numberFilter});
          break;
      case "date":
          const dateFilter = this.dateFilters.find(a => a.name === operation);
          this.appliedFilters.push({columnName : column,key : key, filter:dateFilter});
          break;
      default:
          const stringFilter = this.stringFilters.find(a => a.name === operation);
          this.appliedFilters.push({columnName : column,key : key,filter:stringFilter});
          break;
    }
    this.applyFilter();
  }
  
  applyFilter(){
    this.appliedFilters.forEach(item => {
      if(item.key != null){
        this.displayAssets = this.displayAssets.filter( a => item.filter.logic(a[item.columnName], item.key));
      }      
    });
  }

  public sortBy (key:string){    
    if(key !== '' && key != null){
      if(this.sortByColumn === '' || this.sortByColumn !== key){
        this.sortByColumn = key;
        this.sortingOrderAsc = true;              
      }
      else{
        this.sortingOrderAsc = !this.sortingOrderAsc;       
      }    
      this.sortArray(this.displayAssets, key, this.sortingOrderAsc);  
    }    
  }

  public sortArray <T> (array: Array<T>, key:string, sortingByAsc: boolean){         
    array.sort( (obj1, obj2) => {
      return this.CompareObjectValues(obj1, obj2, key, sortingByAsc)
    });
  }

  public removeSort(){
    this.displayAssets = this.dataMockService.assets.slice();
    this.applyFilter();
    this.sortByColumn = '';
  }

  private CompareObjectValues(object1: any, object2:any, key:string, sortingByAsc: boolean): number{
    if(object1.hasOwnProperty(key) && object2.hasOwnProperty(key)){
      const a = object1[key];
      const b = object2[key];
      if(a === null || a === undefined){
        if(b === null || b === undefined){
          return 0;
        }
        return -1;
      } else if(b === null || b === undefined){
          return 0;
      }

      if(sortingByAsc === true){
        return a > b ? 1 : -1;
      }else{
        return a > b ? -1: 1;
      }
    }else{
      return 0;
    }
  }
}
