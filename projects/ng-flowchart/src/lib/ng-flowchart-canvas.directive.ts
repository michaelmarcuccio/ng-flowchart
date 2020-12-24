import { Directive, ElementRef, HostListener, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgFlowChart } from './model/flow.model';
import { CONSTANTS } from './model/flowchart.constants';
import { NgFlowchartCanvasService } from './ng-flowchart-canvas.service';


@Directive({
    selector: '[ngFlowchartCanvas]',
    providers: [
        NgFlowchartCanvasService
    ]
})
export class NgFlowchartCanvasDirective implements OnInit {

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        const type = event.dataTransfer.getData('type');

        document.querySelectorAll('.' + CONSTANTS.CANVAS_STEP_CLASS).forEach(
            ele => ele.removeAttribute(CONSTANTS.DROP_HOVER_ATTR)
        );

        if (type == 'FROM_PALETTE') {
            let data = JSON.parse(event.dataTransfer.getData('data')) || null;
            this.canvas.dropPaletteStep(event, data);
        }
        else if (type == 'FROM_CANVAS') {
            this.canvas.dropCanvasStep(event, event.dataTransfer.getData('id'));
        }
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {

        event.preventDefault();
        this.canvas.onDragStep(event);

    }

    @Input('ngFlowchartCallbacks')
    callbacks: NgFlowChart.Callbacks;

    @Input('ngFlowchartOptions')
    options: NgFlowChart.Options;


    flow: HTMLElement[] = [];

    constructor(
        protected canvasEle: ElementRef<HTMLElement>,
        private viewContainer: ViewContainerRef,
        private canvas: NgFlowchartCanvasService) {
        this.canvasEle.nativeElement.classList.add(CONSTANTS.CANVAS_CLASS);
        
        this.createCanvasContent(this.viewContainer);
    }

    ngOnInit() {
        this.canvas.init(this.viewContainer, this.callbacks, this.options);
    }

    private createCanvasContent(viewContainer: ViewContainerRef) {
        let canvas = viewContainer.element.nativeElement as HTMLElement;
        let canvasContent = document.createElement('div');
        canvasContent.classList.add(CONSTANTS.CANVAS_CONTENT_CLASS);
        canvas.appendChild(canvasContent);
    }

}