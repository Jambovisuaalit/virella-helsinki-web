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
];
try {
 for(const width of [320,390,1440]){
  for(const offer of offers){
   const page=await browser.newPage({viewport:{width,height:width===320?640:900},deviceScaleFactor:1,reducedMotion:"reduce"});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(origin+offer.path,{waitUntil:"networkidle"});
   assert.equal(response?.status(),200,offer.path+" is unavailable");
   const text=await page.locator("main").innerText();
   assert.ok(text.includes(offer.price),offer.path+" has incorrect price");
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
   await page.screenshot({path:out+"/intake-"+offer.id+"-"+width+".png",fullPage:true,animations:"disabled"});
   assert.deepEqual(errors,[],"browser error at "+offer.path+" "+width);
   results.push({width,productId:offer.id,priceVisible:offer.price,cta:href,form:true,overflow:false,errors});
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

 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(origin+"/sosiaalinen-media",{waitUntil:"networkidle"});
 const social=page.locator('a[href="/aloita?product=instagram"]');
 assert.ok(await social.count()>0,"social package must lead to intake");
 for(let i=0;i<await social.count();i++)assert.match((await social.nth(i).textContent())||"",/Aloita yhteistyö/,"social CTA inconsistent");
 await page.close();
 writeFileSync(out+"/offer-flow-summary.json",JSON.stringify(results,null,2));
 console.log("OFFER FLOW QA PASS",JSON.stringify(results));
}finally{await browser.close();}
