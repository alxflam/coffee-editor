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
import { UriSelection } from '@theia/core';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { injectable } from 'inversify';

import { WorkflowNotationLanguage } from '../../common/workflow-language';
import { DIAGRAM_ICON_CLASS } from './workflow-diagram-manager';

@injectable()
export class WorkflowDiagramLabelProviderContribution implements LabelProviderContribution {
    canHandle(uri: object): number {
        let toCheck: any = uri;
        if (FileStat.is(toCheck)) {
            toCheck = toCheck.resource;
        } else if (UriSelection.is(uri)) {
            toCheck = UriSelection.getUri(uri);
        }
        if (toCheck instanceof URI) {
            if (toCheck.path.ext === WorkflowNotationLanguage.fileExtensions[0]) {
                return 1000;
            }
        }
        return 0;
    }

    getIcon(): string {
        return DIAGRAM_ICON_CLASS;
    }

    // Do not need to specify getName() because the default uri label provider handles this

    getLongName(uri: URI): string {
        return uri.displayName;
    }
}
