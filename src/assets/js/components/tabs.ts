import { getDOMElementHandler } from "../helpers/_base";

const selector = 'tabs';

type TabsParamsType = {
  target: HTMLElement;
  selector: string;
  onComplete?: () => void;
};

class Tabs {
  isActive: boolean;

  activeClass: string;

  domSelector: string;

  domTabItemSelector: string;

  domTabPanelSelector: string;

  domElement?: Element;

  domTargetElement?: Element;

  domTargetParentElement?: Element;

  domParentElement?: Element;

  constructor() {
    this.isActive = false;
    this.activeClass = 'active';
    this.domSelector = '';
    this.domTabItemSelector = '.tabs_nav_item';
    this.domTabPanelSelector = '.tabs_panel';
    this.domElement = getDOMElementHandler('body'); // Get body by default then initialize with accordion element later
    this.domTargetElement = getDOMElementHandler('body'); // Get body by default then initialize with accordion element later
    this.domTargetParentElement = getDOMElementHandler('body'); // Get body by default then initialize with accordion parent element later
    this.domParentElement = getDOMElementHandler('body'); // Get body by default then initialize with accordion parent element later
  }

  setUpParams(params: TabsParamsType): void {
    this.domSelector = params.selector;
    this.domElement = getDOMElementHandler(this.domSelector);
    this.domParentElement = this.domElement?.parentElement!;
    this.domTargetElement = params.target;
    this.domTargetParentElement = this.domTargetElement.parentElement!;
  }

  closeOthers(): void {
    this.domParentElement
      ?.querySelectorAll(this.domTabPanelSelector)
      .forEach((elem) => {
        elem.classList.remove(this.activeClass);
      });

    this.domTargetParentElement
      ?.querySelectorAll(this.domTabItemSelector)
      .forEach((elem) => {
        elem.classList.remove(this.activeClass);
      });
  }

  open(params: TabsParamsType, init = true): void {
    init ? this.setUpParams(params) : '';

    // Close other
    this.closeOthers();

    // Add active class
    this.domElement?.classList.add(this.activeClass);
    this.domTargetElement?.classList.add(this.activeClass);
  }

  close(params: TabsParamsType, init = true): void {
    this.domElement?.classList.remove(this.activeClass);
    this.domTargetElement?.classList.remove(this.activeClass);
  }

  toggle(params: TabsParamsType): void {
    this.setUpParams(params);

    this.domElement?.classList.contains(this.activeClass)
      ? this.close(params, false)
      : this.open(params, false);
  }
}


window.addEventListener('click', (evt: Event) => {
  const target = <HTMLElement>evt.target;
  const toggleTarget = target.dataset.toggle;

  const tabs = new Tabs();

  if (toggleTarget && toggleTarget === selector) {
    const targetedTab = target.dataset.target;

    const domTargetedTab = getDOMElementHandler(targetedTab);

    if (targetedTab && domTargetedTab) {
      tabs.toggle({
        selector: targetedTab,
        target,
      })
    }
  }
})