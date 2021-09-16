package org.eclipse.emfcloud.coffee.workflow.glsp.server.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.model.WorkflowModelState;
import org.eclipse.emfcloud.modelserver.glsp.notation.Diagram;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.builder.impl.GGraphBuilder;
import org.eclipse.glsp.server.protocol.GLSPServerException;

public abstract class GModelFactory extends AbstractGModelFactory<EObject, GModelElement> {

	protected final NodeFactory nodeFactory;
	protected final FlowFactory flowFactory;

	public GModelFactory(final WorkflowModelState modelState) {
		super(modelState);
		flowFactory = new FlowFactory(modelState);
		nodeFactory = new NodeFactory(modelState);
		getOrCreateRoot();
	}

	@Override
	public GModelElement create(final EObject semanticElement) {
		// no-op as we focus on create(final Diagram notationDiagram)
		return null;
	}

	public abstract GGraph create(final Diagram notationDiagram);

	public GGraph create() {
		return create(modelState.getNotationModel());
	}

	public static GLSPServerException createFailed(final EObject semanticElement) {
		return new GLSPServerException("Error during model initialization!", new Throwable(
				"No matching GModelElement found for the semanticElement of type: " + semanticElement.getClass()));
	}

	protected GGraph getOrCreateRoot() {
		GModelRoot existingRoot = modelState.getRoot();
		if (existingRoot != null && existingRoot instanceof GGraph) {
			GGraph graph = (GGraph) existingRoot;
			graph.getChildren().clear();
			return graph;
		}
		return createRoot(modelState);
	}

	public GGraph createRoot(final WorkflowModelState modelState) {
		GGraph graph = new GGraphBuilder().build();
		modelState.setRoot(graph);
		return graph;
	}
}