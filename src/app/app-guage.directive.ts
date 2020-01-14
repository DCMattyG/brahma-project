import { Directive, OnChanges, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[dataGuage]'
})
export class DataGuageDirective implements OnChanges {
  @Input('dataGuagePercentage') percentage: any;

  constructor(private el: ElementRef) {}
  
  ngOnChanges(changes) {  
    if (this.percentage) {  
      $(this.el.nativeElement).attr({  
        "data-percentage": this.percentage
      });  
    }  
  }  
}
