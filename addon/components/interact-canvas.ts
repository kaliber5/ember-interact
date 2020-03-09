import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-canvas';
import { layout, tagName } from "@ember-decorators/component";

@tagName("")
@layout(template)
export default class InteractCanvas extends Component {
}
