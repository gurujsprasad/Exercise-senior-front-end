export class Filter{
    name: string;
    displayName: string;
    logic: (value: any, searchVal?: any) => boolean;
}

export class FilterOn{
    columnName: string;
    key: any;
    filter:Filter;
}

export class StringFilter{   
    public static filters: Filter[] = [{
            name: 'contains',
            displayName: 'Contains',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return target.includes(searchVal);
            }
        }, {
            name: 'doesNotContain',           
            displayName: 'Does not contains',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return !target.includes(searchVal);
            }
        }, {
            name: 'startsWith',           
            displayName: 'Starts with',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return target.startsWith(searchVal);
            }
        }, {
            name: 'endsWith',           
            displayName: 'Ends with',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return target.endsWith(searchVal);
            }
        }, {
            name: 'equals',           
            displayName: 'Equals',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return target === searchVal;
            }
        }, {
            name: 'notEqual',          
            displayName: 'Not Equal',
            logic: (target: string, searchVal: string) => {
                searchVal = searchVal.toLowerCase();
                target = target.toLowerCase();
                return target !== searchVal;
            }
        }];    
}

export class NumberFilter{
    public static filters: Filter[] =  [{
            name: 'equals',            
            displayName: 'Equals',
            logic: (target: number, searchVal: number) => {
                return target === searchVal;
            }
        }, {
            name: 'notEquals',            
            displayName: 'Not equals',
            logic: (target: number, searchVal: number) => {
                return target !== searchVal;
            }
        }, {
            name: 'greaterThan',            
            displayName: 'Greater than',
            logic: (target: number, searchVal: number) => {
                return target > searchVal;
            }
        }, {
            name: 'lessThan',
            displayName: 'Less than',
            logic: (target: number, searchVal: number) => {
                return target < searchVal;
            }
        }, {
            name: 'greaterThanOrEquals',            
            displayName: 'Greater than or equals',
            logic: (target: number, searchVal: number) => {
                return target >= searchVal;
            }
        }, {
            name: 'lessThanOrEquals',            
            displayName: 'Less than or equals',
            logic: (target: number, searchVal: number) => {
                return target <= searchVal;
            }
        }];
}

export class DateFilter{
    public static filters: Filter[] =  [{
            name: 'equals',            
            displayName: 'Equals',
            logic: (target: Date, searchVal: Date) => {
                if (!target) {
                    return false;
                }

                if(DateFilter.isValidDate(target) == false){
                    return false;
                }
                return (target.getFullYear() === searchVal.getFullYear() &&
                target.getMonth() === searchVal.getMonth() &&
                target.getDay() === searchVal.getDay());
            }
        }, {
            name: 'notequals',            
            displayName: 'Not equals',
            logic: (target: Date, searchVal: Date) => {
                if (!target) {
                    return true;
                }

                if(DateFilter.isValidDate(target) == false){
                    return false;
                }
                return (target.getFullYear() !== searchVal.getFullYear() &&
                target.getMonth() !== searchVal.getMonth() &&
                target.getDay() !== searchVal.getDay());
            }
        }, {
            name: 'before',
            
            displayName: 'is_before',
            logic: (target: Date, searchVal: Date) => {
                if (!target) {
                    return false;
                }

                if(DateFilter.isValidDate(target) == false){
                    return false;
                }

                return target < searchVal;
            }
        }, {
            name: 'after',
            
            displayName: 'is_after',
            logic: (target: Date, searchVal: Date) => {
                if (!target) {
                    return false;
                }

                if(DateFilter.isValidDate(target) == false){
                    return false;
                }

                return target > searchVal;
            }
        }];

    public static isValidDate(date: Date): boolean{
        return (date instanceof Date); 
    }
}
