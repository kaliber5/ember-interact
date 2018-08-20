import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-canvas';
import { classNames, layout } from "@ember-decorators/component";

@layout(template)
@classNames('interact-canvas')
export default class InteractCanvas extends Component {
};
