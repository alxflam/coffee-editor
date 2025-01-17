/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
import { Args } from '@eclipse-glsp/protocol';
import { GLSPDiagramLanguage, TheiaDiagramServer } from '@eclipse-glsp/theia-integration';
import { BaseTheiaGLSPConnector } from '@eclipse-glsp/theia-integration/lib/browser/diagram/base-theia-glsp-connector';
import { injectable } from 'inversify';

import { WorkflowNotationLanguage } from '../../common/workflow-language';

@injectable()
export class WorkflowTheiaGLSPConnector extends BaseTheiaGLSPConnector {

    private _diagramType: string = WorkflowNotationLanguage.diagramType;
    private _contributionId: string = WorkflowNotationLanguage.contributionId;

    doConfigure(diagramLanguage: GLSPDiagramLanguage): void {
        this._contributionId = diagramLanguage.contributionId;
        this._diagramType = diagramLanguage.diagramType;
        this.initialize();
    }

    get diagramType(): string {
        if (!this._diagramType) {
            throw new Error('No diagramType has been set for this VwTheiaGLSPConnector');
        }
        return this._diagramType;
    }

    get contributionId(): string {
        if (!this._contributionId) {
            throw new Error('No contributionId has been set for this VwTheiaGLSPConnector');
        }
        return this._contributionId;
    }

    protected initialize(): void {
        if (this._diagramType && this._contributionId) {
            super.initialize();
        }
    }

    disconnect(diagramServer: TheiaDiagramServer): void {
        // this.servers.delete(diagramServer.clientId);
        this.glspClient.then(client =>
            client.disposeClientSession({
                clientSessionId: diagramServer.clientId,
                args: this.disposeClientSessionArgs(diagramServer)
            })
        );
        diagramServer.disconnect();
    }

    disposeClientSessionArgs(diagramServer: TheiaDiagramServer): Args | undefined {
        return {
            ['sourceUri']: diagramServer.sourceUri
        };
    }

}

