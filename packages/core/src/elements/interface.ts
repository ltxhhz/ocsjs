import { ConfigElement } from './config';
import { ContainerElement } from './container';
import { DropdownElement } from './dropdown';
import { HeaderElement } from './header';
import { MessageElement } from './message';
import { ModelElement } from './model';
import { ScriptPanelElement } from './script.panel';
import { SearchInfosElement } from './search.infos';

export class IElement extends HTMLElement {}

export interface CustomElementTagMap {
	'container-element': ContainerElement;
	'config-element': ConfigElement;
	'model-element': ModelElement;
	'message-element': MessageElement;
	'script-panel-element': ScriptPanelElement;
	'header-element': HeaderElement;
	'search-infos-element': SearchInfosElement;
	'dropdown-element': DropdownElement;
}
