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
package org.eclipse.emfcloud.coffee.modelserver.commands.semantic;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.coffee.CoffeeFactory;
import org.eclipse.emfcloud.coffee.Flow;
import org.eclipse.emfcloud.coffee.Node;
import org.eclipse.emfcloud.coffee.modelserver.commands.util.SemanticCommandUtil;

public abstract class AbstractAddFlowCommand extends SemanticElementCommand {

	protected final Flow flow;
	protected final Node source;
	protected final Node target;

	public AbstractAddFlowCommand(EditingDomain domain, URI modelUri, EClass eClass, String sourceUriFragment,
			String targetUriFragment) {
		super(domain, modelUri);
		flow = (Flow) CoffeeFactory.eINSTANCE.create(eClass);
		source = SemanticCommandUtil.getElement(semanticModel, sourceUriFragment, Node.class);
		target = SemanticCommandUtil.getElement(semanticModel, targetUriFragment, Node.class);
	}

	@Override
	protected void doExecute() {
		flow.setSource(source);
		flow.setTarget(target);
		semanticModel.getFlows().add(flow);

	}

	public Flow getFlow() {
		return flow;
	}
}
