import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { Disclaimer } from "@/components/content/Disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Fresh Origins food and health disclaimer: our products are foods, not medicines, educational content is not medical advice, allergen and nutrition notes, and our claim discipline.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Food & health"
      title="Disclaimer"
      toc={[
        { id: "not-medical", label: "Educational content is not medical advice" },
        { id: "nutrition", label: "Nutrition information & lab validation" },
        { id: "allergens", label: "Allergens & cross-contamination" },
        { id: "health-goals", label: "Health-goal pages are educational" },
        { id: "outcomes", label: "No guaranteed outcomes" },
        { id: "links", label: "External links" },
      ]}
    >
      <div className="mt-6">
        <Disclaimer title="Important — please read.">
          Nutritional needs and responses vary. Our products are foods, not medicines,
          and are not intended to diagnose, treat, cure, or prevent any disease. Consult
          a qualified healthcare professional for personalised advice.
        </Disclaimer>
      </div>
      <div className="mt-4 rounded-control border border-fo-line border-l-4 border-l-fo-earth-700 bg-fo-cream-50 px-6 py-4 text-[0.88rem] text-fo-muted">
        <strong className="text-fo-earth-700">Draft placeholder.</strong> This Disclaimer
        is a working draft for prototype purposes and will be reviewed and finalised
        before launch. Bracketed items such as [Legal entity name] and [FSSAI licence
        no.] are placeholders.
      </div>

      <p>
        Fresh Origins offers traditional foods and educational content. This disclaimer
        explains the limits of that information and reinforces our discipline around
        health claims. It applies to our website, product pages, health-goal pages, and
        all educational material.
      </p>

      <h2 id="not-medical">1. Educational content is not medical advice</h2>
      <p>
        Articles, recipes, health-goal pages, and any nutrition information on our site
        are for general education only. They are not medical advice, diagnosis, or
        treatment, and are not a substitute for guidance from a qualified healthcare
        professional who knows your situation. Always seek professional advice before
        making changes to your diet — especially if you are pregnant or breastfeeding,
        managing a health condition, taking medication, or caring for children or older
        adults. Never disregard or delay professional medical advice because of
        something you read here.
      </p>

      <h2 id="nutrition">2. Nutrition information &amp; lab validation status</h2>
      <p>
        We aim to present nutrition information clearly and honestly. Where values are
        estimated — for example from standard databases or recipe calculations — we
        treat them as estimates, not final facts, and we will say so. We use specific
        nutrition claims only after appropriate lab validation. Until a value is
        validated, please treat it as indicative. Natural foods can also vary by batch,
        season, and source, so actual values may differ slightly from those shown.
      </p>

      <h2 id="allergens">3. Allergens &amp; cross-contamination</h2>
      <p>
        We declare allergens clearly and prominently on product pages. Some products are
        made or packed in facilities that also handle allergens such as gluten, nuts, or
        other grains, and we state this where it applies. We cannot guarantee a product
        is completely free of traces of an allergen handled in the same facility. If you
        have a food allergy or intolerance, please read the allergen information on each
        product carefully, and consult your healthcare professional if you are unsure.
      </p>

      <h2 id="health-goals">4. Health-goal pages are educational</h2>
      <p>
        Our health-goal pages (such as protein &amp; fibre, gut health, or senior
        nutrition) group foods by general nutritional themes to help you choose. They
        describe what foods may contribute to a balanced diet as part of an overall
        lifestyle. They do not promise a specific result, and they are not a treatment
        plan for any condition. Individual needs differ, and these pages should be read
        alongside professional advice.
      </p>

      <h2 id="outcomes">5. No guaranteed outcomes</h2>
      <p>
        Food is one part of overall health, which also depends on your full diet,
        activity, sleep, genetics, and other factors. We do not guarantee any specific
        health outcome from using our products. In keeping with our claim discipline, we
        do not use language suggesting a food can{" "}
        <strong>cure, treat, reverse, or detox</strong>, and we avoid terms like
        &ldquo;miracle,&rdquo; &ldquo;guilt-free,&rdquo; or implied medical endorsement
        we do not have. Our goal is to support better everyday eating — honestly and
        without overpromising.
      </p>

      <h2 id="links">6. External links</h2>
      <p>
        Our site may link to third-party websites or resources for convenience. We do
        not control and are not responsible for their content, accuracy, or practices,
        and a link does not imply endorsement. Please review the terms and privacy
        policies of any external site you visit.
      </p>

      <p className="mt-8 text-fo-muted">
        Questions about this disclaimer? Reach us through our{" "}
        <a href="/contact">contact page</a>. Operated by [Legal entity name],
        [registered address], India · FSSAI licence: [FSSAI licence no.] (to be
        confirmed before launch).
      </p>
    </LegalPage>
  );
}
