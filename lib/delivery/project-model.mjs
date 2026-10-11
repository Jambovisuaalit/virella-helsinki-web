/**
 * Internal deterministic delivery state model (v0.1).
 * No I/O: this module does NOT issue invoices, send email or publish anything.
 * Every gate requires external evidence captured by an authorized operator.
 */
export function createClientProject({ clientId, projectId, productId }) {
  if (!clientId || !projectId || !["instagram", "landing-page-seo"].includes(productId)) throw new Error("invalid_project_identity");
  return {
    clientId, projectId, productId, stage: "draft_offer",
    offer: null, acceptance: null, depositPayment: null,
    intake: null, production: null, qa: null, clientApproval: null,
    finalPayment: null, publication: null, delivery: null,
    internal: { hours: 0, costNotes: [], profitEstimate: null },
    history: [],
  };
}
function requireEvidence(condition, code) { if (!condition) throw new Error(code); }
function moved(p, stage, event, payload) {
  return { ...p, stage, history: [...p.history, { event, stage, evidence: payload?.evidenceId || null }] };
}
export function applyDeliveryEvent(project, event, payload = {}) {
  const p = structuredClone(project);
  const only = (...allowed) => requireEvidence(allowed.includes(p.stage), "invalid_transition");
  switch (event) {
    case "send_offer":
      only("draft_offer");
      requireEvidence(payload.offerId && payload.version && payload.fileHash && payload.vatVerified === true, "offer_evidence_or_vat_missing");
      p.offer = { id: payload.offerId, version: payload.version, fileHash: payload.fileHash };
      return moved(p, "offer_sent", event, payload);
    case "accept_offer":
      only("offer_sent");
      requireEvidence(payload.acceptedVersion === p.offer.version && payload.acceptedBy && payload.authorityVerified === true && payload.evidenceId, "written_offer_approval_missing");
      p.acceptance = { version: payload.acceptedVersion, by: payload.acceptedBy, evidenceId: payload.evidenceId };
      return moved(p, "offer_accepted", event, payload);
    case "record_deposit":
      only("offer_accepted");
      requireEvidence(payload.invoiceId && payload.paymentEvidenceId, "verified_deposit_missing");
      p.depositPayment = { invoiceId: payload.invoiceId, evidenceId: payload.paymentEvidenceId };
      return moved(p, "deposit_paid", event, payload);
    case "onboard":
      only("deposit_paid");
      requireEvidence(payload.questionnaireVersion && payload.rulesetVersion && payload.rulesetHash && payload.approver, "onboarding_evidence_missing");
      requireEvidence(Array.isArray(payload.facts) && payload.facts.every(x => x.verified === true && x.source), "facts_missing");
      requireEvidence(Array.isArray(payload.materials) && payload.materials.length > 0 && payload.materials.every(x => x.licensed === true && x.evidenceId), "material_rights_missing");
      p.intake = { questionnaireVersion: payload.questionnaireVersion, rulesetVersion: payload.rulesetVersion, rulesetHash: payload.rulesetHash, facts: payload.facts, materials: payload.materials, approver: payload.approver };
      return moved(p, "production_ready", event, payload);
    case "submit_draft":
      only("production_ready", "changes_required");
      requireEvidence(payload.version && payload.artifacts && payload.artifacts.length > 0, "draft_missing");
      p.production = { version: payload.version, artifacts: payload.artifacts };
      p.qa = null; p.clientApproval = null; p.finalPayment = null; p.publication = null;
      return moved(p, "qa_pending", event, payload);
    case "pass_qa":
      only("qa_pending");
      requireEvidence(payload.version === p.production.version && payload.evidenceId, "qa_evidence_missing");
      p.qa = { version: payload.version, evidenceId: payload.evidenceId };
      return moved(p, "client_review", event, payload);
    case "reject_draft":
      only("client_review");
      requireEvidence(payload.reason && payload.evidenceId, "rejection_evidence_missing");
      p.clientApproval = null;
      return moved(p, "changes_required", event, payload);
    case "approve_draft":
      only("client_review");
      requireEvidence(payload.version === p.qa.version && payload.approvedBy === p.intake.approver && payload.evidenceId, "customer_version_approval_missing");
      p.clientApproval = { version: payload.version, approvedBy: payload.approvedBy, evidenceId: payload.evidenceId };
      return moved(p, p.productId === "landing-page-seo" ? "final_payment_pending" : "publication_ready", event, payload);
    case "record_final_payment":
      only("final_payment_pending");
      requireEvidence(payload.invoiceId && payload.paymentEvidenceId, "verified_final_payment_missing");
      p.finalPayment = { invoiceId: payload.invoiceId, evidenceId: payload.paymentEvidenceId };
      return moved(p, "publication_ready", event, payload);
    case "change_approved_version":
      only("final_payment_pending", "publication_ready");
      requireEvidence(payload.newVersion && payload.newVersion !== p.production.version && payload.reason, "change_evidence_missing");
      p.qa = null; p.clientApproval = null; p.finalPayment = null; p.publication = null;
      return moved(p, "changes_required", event, payload);
    case "publish":
      only("publication_ready");
      requireEvidence(p.clientApproval && p.clientApproval.version === p.production.version, "approval_invalid");
      requireEvidence(p.intake.materials.every(x => x.licensed === true && x.evidenceId), "material_rights_missing");
      requireEvidence(p.productId !== "landing-page-seo" || p.finalPayment?.evidenceId, "final_payment_missing");
      requireEvidence(Array.isArray(payload.urls) && payload.urls.length === (p.productId === "instagram" ? 24 : 1) && payload.urls.every(u => /^https:\/\//.test(u)), "publication_proof_missing");
      requireEvidence(payload.version === p.production.version && payload.evidenceId, "publication_version_mismatch");
      p.publication = { version: payload.version, urls: payload.urls, evidenceId: payload.evidenceId };
      return moved(p, "published", event, payload);
    case "deliver":
      only("published");
      requireEvidence(payload.deliveryEvidenceId && payload.deliveredAt && (p.productId !== "landing-page-seo" || (payload.sourceCodeEvidenceId && payload.userGuideEvidenceId)), "handover_proof_missing");
      p.delivery = { evidenceId: payload.deliveryEvidenceId, date: payload.deliveredAt };
      return moved(p, "delivered", event, payload);
    default: throw new Error("unknown_event");
  }
}
export function customerView(project) {
  const { internal, history, ...clientSafe } = project;
  return clientSafe;
}
