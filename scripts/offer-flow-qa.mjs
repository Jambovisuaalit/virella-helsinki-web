import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

/**
 * Browser smoke tests against a production build of the same PR SHA.
 * If VISUAL_QA_URL is set, tests can target the deployed Preview instead.
 * No real customer submission, payment, or publication occurs.
 */
const origin = process.env.VISUAL_QA_URL ?? "http://127.0.0.1:3000";
const out = "artifacts/visual-qa";
mkdirSync(out, {recursive:true});
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
const results = [];
const offers = [
 {id:"instagram",path:"/instagram",price:"490",mustInclude:["Facebook","Instagram"]},
 {id:"landing-page-seo",path:"/landing-page-seo",price:"990",mustInclude:["495","SEO"]},
 {id:"linkedin",path:"/linkedin",price:null,mustInclude:["Tarjouksen mukaan","LinkedIn"]},
 {id:"verkkosivu-kuntoon",path:"/verkkosivu-kuntoon",price:null,mustInclude:["Tarjouksen mukaan","Conversion Fix"]},
];
try {
 for(const width of [320,390,1440]){
  for(const offer of offers){
   const page=await browser.newPage({viewport:{width,height:width===320?640:900},deviceScaleFactor:1,reducedMotion:"reduce"});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(origin+offer.path,{waitUntil:"networkidle"});
   assert.equal(response?.status(),200,offer.path+" is unavailable");
   const text=await page.locator("main").innerText();
   if(offer.price){
     assert.ok(text.includes(offer.price),offer.path+" has incorrect price");
   }else{
     assert.ok(!text.includes("490 €"),"LinkedIn public service page must not show the obsolete fixed price");
     assert.ok(!text.includes("1 470 €"),"Quote-only page must not promise a fixed commitment total");
     if(offer.id==="verkkosivu-kuntoon"){
       assert.ok(!text.includes("690 €"),"Conversion Fix must not promise an unapproved fixed price");
       assert.ok(!text.includes("72 h"),"Conversion Fix must not promise an unapproved delivery SLA");
       assert.ok(!text.includes("72 tunnin"),"Conversion Fix must not promise an unapproved delivery SLA in text");
     }
   }
   for(const fragment of offer.mustInclude)assert.ok(text.includes(fragment),offer.path+" missing "+fragment);
   const pageInfo=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(pageInfo.scrollWidth<=width+1,offer.path+" horizontal overflow at "+width);
   assert.equal(await page.locator('form[action="/api/checkout"]').count(),0,offer.path+" must not offer direct checkout");
   const ctas=page.getByRole("link",{name:"Aloita yhteistyö",exact:true});
   assert.ok(await ctas.count()>=2,offer.path+" missing consistent primary CTAs");
   const href=await ctas.first().getAttribute("href");
   assert.equal(href,"/aloita?product="+offer.id,"incorrect offer selection");
   await page.screenshot({path:out+"/offer-"+offer.id+"-"+width+".png",fullPage:true,animations:"disabled"});
   await ctas.first().click();
   await page.waitForURL("**/aloita?product="+offer.id);
   assert.equal(await page.locator('input[name="productId"]').inputValue(),offer.id);
   assert.ok(await page.getByText("Aloituspyyntö ei ole tilaus.",{exact:false}).count()>0,"intake must disclose non-binding request");
   assert.equal(await page.locator('form[action="/api/checkout"]').count(),0,"no checkout on intake");
   if(offer.id==="landing-page-seo"){
      const copy=await page.locator("main").innerText();
      assert.ok(copy.includes("495")&&copy.includes("990"),"landing payment milestones missing");
   }
   if(offer.id==="verkkosivu-kuntoon"){
     const copy=await page.locator("main").innerText();
     assert.ok(copy.includes("Korjausten sisältö, hinta ja aikataulu sovitaan erillisessä kirjallisessa tarjouksessa."),"Conversion Fix intake must disclose quotation-only pricing");
     assert.ok(!copy.includes("690 €"),"Conversion Fix intake shows obsolete price");
     assert.equal(await page.locator('form[action="/api/checkout"]').count(),0,"Conversion Fix intake must not allow direct checkout");
   }
   if(offer.id==="linkedin"){
     const copy=await page.locator("main").innerText();
     assert.ok(copy.includes("Hinta, julkaisumäärä ja sopimuskausi sovitaan erillisessä kirjallisessa tarjouksessa."),"LinkedIn intake must disclose quotation-only pricing");
     assert.ok(!copy.includes("490 €"),"LinkedIn intake leaks a historical package price");
     assert.ok(!copy.includes("1 470 €"),"LinkedIn intake leaks a historical minimum total");
     assert.equal(await page.locator('form[action="/api/checkout"]').count(),0,"LinkedIn intake must not allow direct checkout");
   }
   await page.screenshot({path:out+"/intake-"+offer.id+"-"+width+".png",fullPage:true,animations:"disabled"});
   assert.deepEqual(errors,[],"browser error at "+offer.path+" "+width);
   results.push({width,productId:offer.id,priceVisible:offer.price??"quote-only",cta:href,form:true,overflow:false,errors});
   await page.close();
  }
 }
 for(const offer of offers){
  const context=await browser.newContext({ignoreHTTPSErrors:false});
  const response=await context.request.post(origin+"/api/checkout",{
    headers:{"content-type":"application/x-www-form-urlencoded"},
    data:"productId="+encodeURIComponent(offer.id),
    maxRedirects:0,
  });
  assert.equal(response.status(),303,"POST checkout must fail closed: "+offer.id);
  const redirect=new URL(response.headers()["location"],origin);
  assert.equal(redirect.pathname,"/aloita");
  assert.equal(redirect.searchParams.get("product"),offer.id);
  await context.close();
  results.push({productId:offer.id,serverDirectCheckout:"blocked_303"});
 }
 // A forged GET cannot claim an inquiry was stored or fire a successful receipt view.
 const forged=await browser.newPage({viewport:{width:390,height:844}});
 await forged.goto(origin+"/aloita?product=instagram&submitted=1&receipt=not-a-real-receipt",{waitUntil:"networkidle"});
 assert.equal(await forged.getByRole("heading",{name:"Kiitos. Pyyntö on vastaanotettu."}).count(),0,"forged receipt must not display success");
 assert.equal(await forged.locator('form[action="/api/contact"]').count(),1,"form must remain visible without a valid receipt");
 await forged.close();
 results.push({forgedReceipt:"blocked"});

 // A genuine receipt is scoped to the exact submitted product and request type.
 const scopedContext=await browser.newContext({viewport:{width:390,height:844}});
 await scopedContext.addCookies([{
  name:"virella_contact_receipt",
  value:JSON.stringify({id:"qa-session",productId:"instagram",audit:false}),
  url:origin,
  httpOnly:true,
  sameSite:"Lax",
 }]);
 const scopedPage=await scopedContext.newPage();
 await scopedPage.goto(origin+"/aloita?product=landing-page-seo&submitted=1&receipt=qa-session",{waitUntil:"networkidle"});
 assert.equal(await scopedPage.getByRole("heading",{name:"Kiitos. Pyyntö on vastaanotettu."}).count(),0,"receipt must not prove a different service");
 await scopedPage.goto(origin+"/aloita?kartoitus=1&submitted=1&receipt=qa-session",{waitUntil:"networkidle"});
 assert.equal(await scopedPage.getByRole("heading",{name:"Kiitos. Pyyntö on vastaanotettu."}).count(),0,"receipt must not prove a visibility audit");
 await scopedPage.goto(origin+"/aloita?product=instagram&submitted=1&receipt=qa-session",{waitUntil:"networkidle"});
 assert.equal(await scopedPage.getByRole("heading",{name:"Kiitos. Pyyntö on vastaanotettu."}).count(),1,"matching receipt must show success");
 await scopedContext.close();
 results.push({contextBinding:"passed"});

 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(origin+"/sosiaalinen-media",{waitUntil:"networkidle"});
 const socialCopy=await page.locator("main").innerText();
 assert.ok(!socialCopy.includes("Molemmissa paketeissa vähimmäisjakso"),"Legacy LinkedIn commitment claim returned in FAQ");
 assert.ok(!socialCopy.includes("Kummankin hinta"),"Legacy LinkedIn fixed price claim returned in FAQ");
 assert.ok(socialCopy.includes("LinkedInin hinta, julkaisumäärä ja sopimuskausi määritellään"),"LinkedIn written quote statement missing from FAQ");
 const social=page.locator('a[href="/aloita?product=instagram"]');
 assert.ok(await social.count()>0,"social package must lead to intake");
 for(let i=0;i<await social.count();i++)assert.match((await social.nth(i).textContent())||"",/Aloita yhteistyö/,"social CTA inconsistent");
 await page.close();
 writeFileSync(out+"/offer-flow-summary.json",JSON.stringify(results,null,2));
 console.log("OFFER FLOW QA PASS",JSON.stringify(results));
}finally{await browser.close();}
