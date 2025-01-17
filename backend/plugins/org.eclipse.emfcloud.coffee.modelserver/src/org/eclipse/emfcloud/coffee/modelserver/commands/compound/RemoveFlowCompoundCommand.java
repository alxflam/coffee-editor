/*******************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ******************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver.commands.compound;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.coffee.modelserver.commands.notation.RemoveFlowEdgeCommand;
import org.eclipse.emfcloud.coffee.modelserver.commands.semantic.RemoveFlowCommand;

public class RemoveFlowCompoundCommand extends CompoundCommand {

	public RemoveFlowCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
		this.append(new RemoveFlowCommand(domain, modelUri, semanticUriFragment));
		this.append(new RemoveFlowEdgeCommand(domain, modelUri, semanticUriFragment));
	}
}
