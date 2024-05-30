import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent, NgFlowchart } from '@joelwenzel/ng-flowchart';
import { RouteStepComponent } from './route-step/route-step.component';
import { Route } from '../interfaces/route';


@Component({
  selector: 'app-custom-step',
  templateUrl: './custom-step.component.html',
  styleUrls: ['./custom-step.component.css']
})
export class CustomStepComponent extends NgFlowchartStepComponent implements OnInit{
  ROUTES: Route[] = [];
  override ngOnInit(): void {}

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }
  
  override canDeleteStep(): boolean {
    return true;
  }

  override getDropPositionsForStep(
    pendingStep: NgFlowchart.PendingStep
  ): NgFlowchart.DropPosition[] {
    if (pendingStep.template !== RouteStepComponent) {
      return ['ABOVE', 'LEFT', 'RIGHT'];
    } else {
      return ['BELOW'];
    }
  }
  
  

  onAddRoute() {
    // Angular has a unique way to define interface.
    let route: Route = {
      name: 'New Route',
      condition: '',
      sequence: 0,
    };
    let index = this.ROUTES.push(route);
    route.sequence = index;

    this.addChild(
      {
        template: RouteStepComponent,
        type: 'route-step',
        data: route,
      },
      {
        sibling: true,
      }
    );

    this.addChild(
      {
        template: RouteStepComponent,
        type: 'route-step',
        data: route,
      },
      {
        sibling: true,
      }
    );
  }

  delete() {
    //recursively delete
    this.destroy(false);
  }

}
