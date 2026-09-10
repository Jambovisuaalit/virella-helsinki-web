import type { QuestionnaireDefinition } from "@/config/questionnaires";
import { products } from "@/config/products";

const fieldClassName =
  "mt-2 min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

type QuestionnaireFormProps = {
  questionnaire: QuestionnaireDefinition;
  orderId?: string;
};

export function QuestionnaireForm({ questionnaire, orderId }: QuestionnaireFormProps) {
  const product = products[questionnaire.productKey];
  const hasOrder = Boolean(orderId);

  return (
    <div>
      <div className="mb-8 rounded-xl border border-border bg-cloud p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Kyselyn kytkentä</p>
        <p className="mt-2 font-bold">{product.name}</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          {hasOrder
            ? `Tilaustunniste: ${orderId}`
            : "Esikatselutila. Tilaustunniste liitetään kyselyyn maksuvaiheen jälkeen."}
        </p>
      </div>

      <form className="space-y-6" aria-label={questionnaire.title}>
        <input type="hidden" name="questionnaireId" value={questionnaire.id} />
        <input type="hidden" name="productId" value={questionnaire.productId} />
        {orderId ? <input type="hidden" name="orderId" value={orderId} /> : null}

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

        <div className="rounded-xl border border-border bg-background p-4 text-sm leading-6 text-muted">
          Kyselyn lähetys aktivoidaan, kun maksuvaihe ja tilausten tallennus toteutetaan. Tässä vaiheessa lomake varmistaa oikean tuotteen ja tilaustunnisteen kulun käyttöliittymässä.
        </div>

        <button type="button" disabled className="min-h-12 w-full cursor-not-allowed rounded-xl bg-mist px-5 py-3 text-sm font-bold text-muted sm:w-auto">
          Lähetys aktivoidaan maksuvaiheen yhteydessä
        </button>
      </form>
    </div>
  );
}
