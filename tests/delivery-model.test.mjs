import test from "node:test";
import assert from "node:assert/strict";
import { createClientProject, applyDeliveryEvent, customerView } from "../lib/delivery/project-model.mjs";
const u = ["https://instagram.com/p/1","https://facebook.com/p/1"];
function begin(productId) {
 let p = createClientProject({ clientId: "TEST-Y-000", projectId: "VH-TEST-"+productId, productId });
 p = applyDeliveryEvent(p,"send_offer",{offerId:"VH-T-001",version:"v1",fileHash:"sha256-test",vatVerified:true});
 p = applyDeliveryEvent(p,"accept_offer",{acceptedVersion:"v1",acceptedBy:"Customer CEO",authorityVerified:true,evidenceId:"email:accept-v1"});
 p = applyDeliveryEvent(p,"record_deposit",{invoiceId:"TEST-INV-1",paymentEvidenceId:"bank:test-1"});
 return p;
}
function onboard(p) {
 return applyDeliveryEvent(p,"onboard",{questionnaireVersion:"v1",rulesetVersion:"v1",rulesetHash:"hash-1",approver:"Customer CEO",facts:[{claim:"test",source:"customer-written",verified:true}],materials:[{id:"img1",licensed:true,evidenceId:"permission:img1"}]});
}
function reviewed(p) {
 p=applyDeliveryEvent(onboard(p),"submit_draft",{version:"draft-v1",artifacts:["asset-v1"]});
 p=applyDeliveryEvent(p,"pass_qa",{version:"draft-v1",evidenceId:"qa:1"});
 return p;
}
test("Näkyvyys: 12 contents, 24 proof URLs, report handover gated",()=>{
 let p=reviewed(begin("instagram"));
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v1",approvedBy:"Customer CEO",evidenceId:"email:draft-v1"});
 assert.equal(p.stage,"publication_ready");
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"meta:proof",urls:u}),/publication_proof_missing/);
 p=applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"meta:proof",urls:Array.from({length:24},(_,i)=>"https://example.test/p/"+i)});
 p=applyDeliveryEvent(p,"deliver",{deliveryEvidenceId:"report:1",deliveredAt:"2026-10-11"});
 assert.equal(p.stage,"delivered");
 assert.equal(p.publication.urls.length,24);
});
test("Landing: 990 split, final payment BEFORE publication and source code handover",()=>{
 let p=reviewed(begin("landing-page-seo"));
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v1",approvedBy:"Customer CEO",evidenceId:"email:preview-v1"});
 assert.equal(p.stage,"final_payment_pending");
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"vercel:1",urls:["https://example.test/"]}),/invalid_transition/);
 p=applyDeliveryEvent(p,"record_final_payment",{invoiceId:"TEST-INV-2",paymentEvidenceId:"bank:test-2"});
 p=applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"vercel:1",urls:["https://example.test/"]});
 assert.throws(()=>applyDeliveryEvent(p,"deliver",{deliveryEvidenceId:"handover",deliveredAt:"2026-10-11"}),/handover_proof_missing/);
 p=applyDeliveryEvent(p,"deliver",{deliveryEvidenceId:"handover",deliveredAt:"2026-10-11",sourceCodeEvidenceId:"github:sha",userGuideEvidenceId:"guide:1"});
 assert.equal(p.stage,"delivered");
});
test("Missing materials/rights block production",()=>{
 let p=begin("instagram");
 assert.throws(()=>applyDeliveryEvent(p,"onboard",{questionnaireVersion:"v1",rulesetVersion:"v1",rulesetHash:"h",approver:"Customer CEO",facts:[],materials:[]}),/material_rights_missing/);
 assert.equal(p.stage,"deposit_paid");
});
test("Late payment blocks project start",()=>{
 let p=createClientProject({clientId:"A",projectId:"T2",productId:"landing-page-seo"});
 p=applyDeliveryEvent(p,"send_offer",{offerId:"a",version:"v1",fileHash:"h",vatVerified:true});
 p=applyDeliveryEvent(p,"accept_offer",{acceptedVersion:"v1",acceptedBy:"CEO",authorityVerified:true,evidenceId:"mail"});
 assert.throws(()=>applyDeliveryEvent(p,"onboard",{}),/invalid_transition/);
 assert.equal(p.stage,"offer_accepted");
});
test("Rejected draft returns to changes and cannot publish",()=>{
 let p=reviewed(begin("instagram"));
 p=applyDeliveryEvent(p,"reject_draft",{reason:"wrong-copy",evidenceId:"mail:rejected"});
 assert.equal(p.stage,"changes_required");
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"meta",urls:[]}),/invalid_transition/);
});
test("Change after approval invalidates approval & QA",()=>{
 let p=reviewed(begin("instagram"));
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v1",approvedBy:"Customer CEO",evidenceId:"email:yes"});
 p=applyDeliveryEvent(p,"change_approved_version",{newVersion:"draft-v2",reason:"customer correction"});
 assert.equal(p.stage,"changes_required"); assert.equal(p.qa,null); assert.equal(p.clientApproval,null);
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"meta",urls:[]}),/invalid_transition/);
});
test("Written offer must have VAT proof and matching acceptance version",()=>{
 let p=createClientProject({clientId:"A",projectId:"T3",productId:"instagram"});
 assert.throws(()=>applyDeliveryEvent(p,"send_offer",{offerId:"a",version:"v1",fileHash:"h",vatVerified:false}),/offer_evidence_or_vat_missing/);
 p=applyDeliveryEvent(p,"send_offer",{offerId:"a",version:"v1",fileHash:"h",vatVerified:true});
 assert.throws(()=>applyDeliveryEvent(p,"accept_offer",{acceptedVersion:"v2",acceptedBy:"CEO",authorityVerified:true,evidenceId:"mail"}),/written_offer_approval_missing/);
});
test("Client view never exposes internal hours or margin",()=>{
 const p=begin("instagram");
 p.internal.hours=8;p.internal.profitEstimate=600;
 assert.equal("internal" in customerView(p),false);
 assert.equal("history" in customerView(p),false);
});
