import { Directive, Input, ElementRef, OnChanges } from '@angular/core';
  
@Directive({  
  selector: '[dataBalloon]'  
})  
export class DataBalloonDirective implements OnChanges {  
  @Input('dataBalloonProperty') tooltipText: any;  
  @Input('dataBalloonPos') position: any;  

  constructor(private el: ElementRef) {}
  
  ngOnChanges(changes) {  
    if (this.tooltipText) {  
      $(this.el.nativeElement).attr({  
        "data-balloon": this.tooltipText,  
        "data-balloon-pos": this.position
      });  
    }  
  }  
} 
