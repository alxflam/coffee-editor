/*
 * generated by Xtext 2.17.1
 */
package com.eclipsesource.workflow.dsl.validation;

import java.util.ArrayList;
import java.util.List;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.xtext.validation.AbstractDeclarativeValidator;

public abstract class AbstractWorkflowValidator extends AbstractDeclarativeValidator {
	
	@Override
	protected List<EPackage> getEPackages() {
		List<EPackage> result = new ArrayList<EPackage>();
		result.add(com.eclipsesource.workflow.dsl.workflow.WorkflowPackage.eINSTANCE);
		return result;
	}
}