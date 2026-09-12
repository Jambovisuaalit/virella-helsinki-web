import type { QuestionnaireDefinition } from "@/config/questionnaires";
import { products } from "@/config/products";

const fieldClassName =
  "mt-2 min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

type QuestionnaireFormProps = {
  questionnaire: QuestionnaireDefinition;
  sessionId?: string;
};

export function QuestionnaireForm({ questionnaire, sessionId }: QuestionnaireFormProps) {
  const product = products[questionnaire.productKey];
  const hasOrder = Boolean(sessionId);

  return (
    <div>
      <div className="mb-8 rounded-xl border border-border bg-cloud p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Tilaus ja aloitus</p>
        <p className="mt-2 font-bold">{product.name}</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          {hasOrder
            ? "Maksu on vahvistettu. Vastaukset liitetään automaattisesti tähän tilaukseen."
            : "Voit tutustua kysymyksiin nyt. Lomakkeen lähetys avautuu maksetun tilauksen jälkeen."}
        </p>
      </div>

      <form action="/api/questionnaire" method="post" className="space-y-6" aria-label={questionnaire.title}>
        <input type="hidden" name="questionnaireId" value={questionnaire.id} />
        <input type="hidden" name="productId" value={questionnaire.productId} />
        {sessionId ? <input type="hidden" name="sessionId" value={sessionId} /> : null}

        {questionnaire.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="text-sm font-bold text-foreground">
              {field.label}
              {field.required ? <span className="ml-1 text-action" aria-hidden="true">*</span> : null}
            </label>
            {field.type === "textarea" ? (
              <textarea id={field.name} name={field.name} required={field.required} placeholder={field.placeholder} rows={5} className={fieldClassName} />
            ) : (
              <input id={field.name} name={field.name} type={field.type} required={field.required} placeholder={field.placeholder} className={fieldClassName} />
            )}
          </div>
        ))}

        <p className="rounded-xl border border-border bg-background p-4 text-sm leading-6 text-muted">
          Älä lähetä salasanoja tai muita kirjautumistietoja lomakkeella. Tarvittavat käyttöoikeudet voidaan sopia erikseen turvallisesti.
        </p>

        <button type="submit" disabled={!hasOrder} className="min-h-12 w-full rounded-xl bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-mist disabled:text-muted disabled:hover:brightness-100 sm:w-auto">
          {hasOrder ? "Lähetä aloituskysely" : "Maksa palvelu ennen lähettämistä"}
        </button>
      </form>
    </div>
  );
}
