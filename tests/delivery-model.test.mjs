import test from "node:test";
import assert from "node:assert/strict";
import { createClientProject, applyDeliveryEvent, customerView, buildClientRuleset } from "../lib/delivery/project-model.mjs";
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

test("AI ruleset blocks missing facts and unlicensed material", () => {
  const r=buildClientRuleset({clientId:"T1",projectId:"P1",productId:"landing-page-seo",audience:"LVI",primaryService:"Putkityöt",cta:"Soita",tone:"Asiallinen",approver:"Customer CEO",facts:[{claim:"sertifikaatti",source:null,verified:false}],materials:[{id:"photo-1",licensed:false}]});
  assert.equal(r.status,"blocked");
  assert.ok(r.missing.some(x=>x.startsWith("fact:")));
  assert.ok(r.missing.some(x=>x.startsWith("asset:")));
  assert.equal(r.rulesetHash.length,64);
});
test("AI ruleset creates a reproducible ready version from verified inputs", () => {
  const input={clientId:"T2",projectId:"P2",productId:"instagram",audience:"Uusimaa",primaryService:"Sähköasennus",cta:"Pyydä tarjous",tone:"Suora",approver:"Customer CEO",facts:[{claim:"Helsinki",source:"customer-confirmed",verified:true}],materials:[{id:"photo-1",licensed:true,evidenceId:"permission:1"}]};
  const first=buildClientRuleset(input),second=buildClientRuleset(input);
  assert.equal(first.status,"ready");
  assert.equal(first.rulesetHash,second.rulesetHash);
  assert.deepEqual(first.approvedChannels,["instagram","facebook"]);
});

test("A project cannot onboard or produce an AI brief with zero verified facts", () => {
 let p = begin("instagram");
 const payload = {questionnaireVersion:"v1",rulesetVersion:"v1",rulesetHash:"hash",approver:"Customer CEO",facts:[],materials:[{id:"img1",licensed:true,evidenceId:"permission:img1"}]};
 assert.throws(()=>applyDeliveryEvent(p,"onboard",payload),/facts_missing/);
 const brief = buildClientRuleset({clientId:"T",projectId:"P",productId:"instagram",audience:"LVI",primaryService:"Putkityöt",cta:"Ota yhteyttä",approver:"CEO",tone:"Asiallinen",facts:[],materials:payload.materials});
 assert.equal(brief.status,"blocked");
 assert.ok(brief.missing.includes("facts:VAHVISTETUT_FAKTAT_PUUTTUVAT"));
});
test("Onboarding records facts and rights as an immutable snapshot", () => {
 const input = {questionnaireVersion:"v1",rulesetVersion:"v1",rulesetHash:"hash",approver:"Customer CEO",facts:[{claim:"original",source:"customer",verified:true}],materials:[{id:"img1",licensed:true,evidenceId:"permission:img1"}]};
 const p = applyDeliveryEvent(begin("instagram"),"onboard",input);
 input.facts[0].claim="TAMPERED";input.materials[0].licensed=false;input.materials[0].evidenceId=null;
 assert.equal(p.intake.facts[0].claim,"original");
 assert.equal(p.intake.materials[0].licensed,true);
 assert.equal(p.intake.materials[0].evidenceId,"permission:img1");
 const briefInput={clientId:"T",projectId:"P",productId:"instagram",audience:"B2B",primaryService:"Asennus",cta:"Soita",approver:"CEO",tone:"Suora",facts:[{claim:"original",source:"client",verified:true}],materials:[{id:"p",licensed:true,evidenceId:"p:1"}]};
 const brief=buildClientRuleset(briefInput);
 briefInput.facts[0].claim="TAMPERED";
 assert.equal(brief.facts[0].claim,"original");
});
test("Settled final installment remains settled after landing preview revision", () => {
 let p=reviewed(begin("landing-page-seo"));
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v1",approvedBy:"Customer CEO",evidenceId:"email:approval1"});
 p=applyDeliveryEvent(p,"record_final_payment",{invoiceId:"INV-2",paymentEvidenceId:"bank:paid"});
 const paid=p.finalPayment;
 p=applyDeliveryEvent(p,"change_approved_version",{newVersion:"draft-v2",reason:"corrected approved copy"});
 assert.deepEqual(p.finalPayment,paid);
 p=applyDeliveryEvent(p,"submit_draft",{version:"draft-v2",artifacts:["preview-v2"]});
 assert.deepEqual(p.finalPayment,paid);
 p=applyDeliveryEvent(p,"pass_qa",{version:"draft-v2",evidenceId:"qa:2"});
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v2",approvedBy:"Customer CEO",evidenceId:"email:approval2"});
 assert.equal(p.stage,"publication_ready");
 assert.equal(p.finalPayment.evidenceId,"bank:paid");
 p=applyDeliveryEvent(p,"publish",{version:"draft-v2",evidenceId:"prod:2",urls:["https://example.test/final"]});
 assert.equal(p.stage,"published");
});
test("Publication evidence must be 24 different valid HTTPS URLs", () => {
 let p=reviewed(begin("instagram"));
 p=applyDeliveryEvent(p,"approve_draft",{version:"draft-v1",approvedBy:"Customer CEO",evidenceId:"email:ok"});
 const good=Array.from({length:24},(_,i)=>"https://example.test/p/"+i);
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"proof",urls:Array(24).fill(good[0])}),/publication_proof_missing/);
 const withHttp=[...good];withHttp[0]="http://example.test/bad";
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"proof",urls:withHttp}),/publication_proof_missing/);
 const withMalformed=[...good];withMalformed[0]="https:// ";
 assert.throws(()=>applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"proof",urls:withMalformed}),/publication_proof_missing/);
 const original=[...good];
 const result=applyDeliveryEvent(p,"publish",{version:"draft-v1",evidenceId:"proof",urls:good});
 good[0]="https://tampered.invalid";
 assert.equal(result.publication.urls[0],original[0]);
});
