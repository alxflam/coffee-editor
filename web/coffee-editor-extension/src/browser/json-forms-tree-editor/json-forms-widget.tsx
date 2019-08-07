import { Actions, jsonformsReducer, JsonFormsState } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonFormsDispatch, JsonFormsReduxContext } from "@jsonforms/react";
import { Emitter, Event, ILogger } from "@theia/core";
import { BaseWidget, Message } from "@theia/core/lib/browser";
import { inject, injectable } from "inversify";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";

import { CoffeeModel } from "../json-forms-tree/coffee-model";
import { JsonFormsTree } from "../json-forms-tree/json-forms-tree";
import { brewingView, coffeeSchema, controlUnitView, machineView } from "../models/coffee-schemas";

@injectable()
export class JSONFormsWidget extends BaseWidget {
  private selectedNode: JsonFormsTree.Node;
  private store: any;

  protected changeEmitter = new Emitter<Readonly<any>>();

  constructor(@inject(ILogger) private readonly logger: ILogger) {
    super();

    this.store = this.initStore();
    this.store.dispatch(Actions.init({}, { type: 'string' }));
    this.toDispose.push(this.changeEmitter);
    this.store.subscribe(() => {
      this.changeEmitter.fire(this.store.getState().jsonforms.core.data);
    })
    this.renderEmptyForms();
  }
  get onChange(): Event<Readonly<any>> {
    return this.changeEmitter.event;
  }

  private initStore() {
    const initState: JsonFormsState = {
      jsonforms: {
        cells: materialCells,
        renderers: materialRenderers
      }
    };
    return createStore(
      combineReducers({ jsonforms: jsonformsReducer() }),
      initState
    );
  }

  setSelection(selectedNode: JsonFormsTree.Node) {
    this.selectedNode = selectedNode;

    this.store.dispatch(
      Actions.init(
        this.selectedNode.jsonforms.data,
        {
          definitions: coffeeSchema.definitions,
          ...this.getSchemaForNode(this.selectedNode)
        },
        this.getUiSchemaForNode(this.selectedNode),
        {
          refParserOptions: {
            dereference: { circular: "ignore" }
          }
        }
      )
    );
    this.renderForms();
  }
  protected getSchemaForNode(node: JsonFormsTree.Node) {
    let schema = this.getSchemaForType(node.jsonforms.type);
    if (schema) {
      return schema;
    }
    // there is no type, try to guess
    if (node.jsonforms.data.nodes) {
      return coffeeSchema.definitions.workflow;
    }
    return undefined;
  }
  protected getUiSchemaForNode(node: JsonFormsTree.Node) {
    let schema = this.getUiSchemaForType(node.jsonforms.type);
    if (schema) {
      return schema;
    }
    // there is no type, try to guess
    if (node.jsonforms.data.nodes) {
      return {
        type: "Label",
        text: "Workflow"
      };
    }
    return undefined;
  }
  protected getUiSchemaForType(type: string) {
    if (!type) {
      return undefined;
    }
    switch (type) {
      case CoffeeModel.Type.Machine:
        return machineView;
      case CoffeeModel.Type.ControlUnit:
        return controlUnitView;
      case CoffeeModel.Type.BrewingUnit:
        return brewingView;
      default:
        this.logger.warn("Can't find registered ui schema for type " + type);
        return undefined;
    }
  }

  protected getSchemaForType(type: string) {
    if (!type) {
      return undefined;
    }
    const schema = Object.entries(coffeeSchema.definitions)
      .map(entry => entry[1])
      .find(
        definition =>
          definition.properties && definition.properties.eClass.const === type
      );
    if (!schema) {
      this.logger.warn("Can't find definition schema for type " + type);
    }
    return schema;
  }

  protected renderForms(): void {
    if (this.selectedNode) {
      ReactDOM.render(
        <React.Fragment>
          <Provider store={this.store}>
            <JsonFormsReduxContext>
              <JsonFormsDispatch />
            </JsonFormsReduxContext>
          </Provider>
        </React.Fragment>,
        this.node
      );
    } else {
      this.renderEmptyForms();
    }
  }
  protected renderEmptyForms(): void {
    ReactDOM.render(
      <React.Fragment>Please select an element</React.Fragment>,
      this.node
    );
  }
  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    this.renderForms();
  }
}