package org.eclipse.emfcloud.coffee.modelserver.commands.semantic;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.coffee.Flow;
import org.eclipse.emfcloud.coffee.Node;
import org.eclipse.emfcloud.coffee.modelserver.commands.util.SemanticCommandUtil;

public class SetFlowTargetCommand extends SemanticElementCommand {

	protected String semanticUriFragment;
	protected String newTargetUriFragment;

	public SetFlowTargetCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
			final String newTargetUriFragment) {
		super(domain, modelUri);
		this.semanticUriFragment = semanticUriFragment;
		this.newTargetUriFragment = newTargetUriFragment;
	}

	@Override
	protected void doExecute() {
		Flow flow = SemanticCommandUtil.getElement(semanticModel, semanticUriFragment, Flow.class);
		Node newTarget = SemanticCommandUtil.getElement(semanticModel, newTargetUriFragment, Node.class);
		flow.setTarget(newTarget);
	}

}
