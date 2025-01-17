/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    ContainerContext,
    GLSPClientContribution,
    GLSPTheiaFrontendModule,
    registerDiagramManager,
    TheiaGLSPConnector
} from '@eclipse-glsp/theia-integration/lib/browser';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { DiagramConfiguration } from 'sprotty-theia/lib';

import { WorkflowNotationLanguage } from '../common/workflow-language';
import { WorkflowTheiaGLSPConnector } from './diagram/theia-glsp-connector';
import { WorkflowDiagramConfiguration } from './diagram/workflow-diagram-configuration';
import { WorkflowDiagramLabelProviderContribution } from './diagram/workflow-diagram-label-provider-contribution';
import { WorkflowDiagramManager } from './diagram/workflow-diagram-manager';
import { WorkflowGLSPClientContribution } from './workflow-glsp-client-contribution';

export class WorkflowTheiaFrontendModule extends GLSPTheiaFrontendModule {

    readonly diagramLanguage = WorkflowNotationLanguage;

    bindTheiaGLSPConnector(context: ContainerContext): void {
        context.bind(TheiaGLSPConnector).toDynamicValue(dynamicContext => {
            const connector = dynamicContext.container.resolve(WorkflowTheiaGLSPConnector);
            connector.doConfigure(this.diagramLanguage);
            return connector;
        });
    }

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(WorkflowDiagramConfiguration);
    }

    bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(WorkflowGLSPClientContribution);
    }

    configure(context: ContainerContext): void {
        context.bind(LabelProviderContribution).to(WorkflowDiagramLabelProviderContribution);
    }

    configureDiagramManager(context: ContainerContext): void {
        registerDiagramManager(context.bind, WorkflowDiagramManager);
    }

}

export default new WorkflowTheiaFrontendModule();
