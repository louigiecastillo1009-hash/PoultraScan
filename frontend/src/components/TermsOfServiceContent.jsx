export default function TermsOfServiceContent() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#6F7160]">Last Updated: July 9, 2026</p>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">1. Acceptance of Terms</h3>
        <p>
          By creating an account or using PoultraScan AI ("the Service," "we," "us," or "our"), you
          agree to be bound by these Terms of Service. If you do not agree to these terms, please do
          not use the Service.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">2. Description of Service</h3>
        <p className="mb-2">PoultraScan AI is a poultry health diagnostic and farm management application. The Service allows users to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Create and manage one or more poultry farms</li>
          <li>Capture or upload images of chickens for AI-assisted analysis</li>
          <li>Receive AI-generated estimates regarding chicken count, disease indicators, weight, oil yield, and market readiness</li>
          <li>Maintain scan history, farm journals, and related records tied to their account</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">3. Eligibility and Accounts</h3>
        <p>
          You must provide accurate and complete information when registering for an account,
          including a valid email address. You are responsible for maintaining the confidentiality
          of your login credentials and for all activity that occurs under your account. You must
          notify us promptly if you suspect unauthorized access to your account.
        </p>
        <p className="mt-2">
          You may register using an email and password, or through Google Sign-In. If you register
          via Google, certain profile information (such as your name and profile picture) may be
          used to populate your account.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">4. AI-Generated Results Are Estimates, Not Veterinary Diagnoses</h3>
        <p className="font-semibold text-[#101107] mb-2">This is the most important section of these Terms.</p>
        <p className="mb-2">
          PoultraScan AI uses artificial intelligence to analyze images of poultry and generate
          estimates related to disease indicators, weight, oil yield, and market readiness. These
          results are automated estimates only and:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1 mb-2">
          <li>Are <strong>not</strong> a substitute for examination, diagnosis, or treatment by a licensed veterinarian or qualified poultry health professional</li>
          <li>May be inaccurate, incomplete, or wrong, particularly in cases involving atypical lighting, image quality, flock density, or breed variation</li>
          <li>Should not be the sole basis for decisions involving flock culling, medical treatment, quarantine, or market sale, especially for sick, high-value, or large-scale commercial flocks</li>
        </ul>
        <p>
          If a scan indicates signs of illness or abnormality, you should confirm findings with a
          licensed veterinarian before taking action. You assume full responsibility for decisions
          made based on Service output, and we are not liable for losses (financial, agricultural,
          or otherwise) resulting from reliance on AI-generated results.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">5. User Content</h3>
        <p>
          "User Content" includes images, farm data, journal entries, and any other information you
          upload or input into the Service. You retain ownership of your User Content. By uploading
          User Content, you grant us a limited license to store, process, and analyze it solely for
          the purpose of providing and improving the Service.
        </p>
        <p className="mt-2">
          You are responsible for ensuring you have the right to upload any images or data you
          submit. Do not upload content that is unlawful, infringes on third-party rights, or
          contains sensitive personal information unrelated to poultry management.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">6. Acceptable Use</h3>
        <p className="mb-2">You agree not to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Use the Service for any unlawful purpose or in violation of applicable agricultural, food safety, or animal welfare regulations</li>
          <li>Attempt to reverse-engineer, disrupt, or gain unauthorized access to the Service's underlying systems, models, or infrastructure</li>
          <li>Upload malicious files or attempt to interfere with other users' accounts or data</li>
          <li>Misrepresent AI-generated results as certified veterinary or regulatory findings</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">7. Data Storage and Farm/Account Scoping</h3>
        <p>
          Scan results, images, and cached data are associated with your specific user account and
          the farm you select at the time of scanning. Deleting a farm or account may result in
          permanent loss of associated scan history, images, and journal entries. We recommend
          exporting or backing up important records before deleting a farm.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">8. Service Availability</h3>
        <p>
          The Service, including AI analysis features, depends on third-party infrastructure and may
          occasionally be unavailable, degraded, or rate-limited. We do not guarantee uninterrupted
          access and are not liable for losses resulting from downtime, processing delays, or
          third-party service outages.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">9. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, PoultraScan AI and its developers shall not be
          liable for any indirect, incidental, special, or consequential damages — including loss of
          livestock, revenue, or business opportunity — arising from your use of, or inability to
          use, the Service, including reliance on AI-generated diagnostic results.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">10. Changes to the Service and Terms</h3>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes
          are posted constitutes acceptance of the revised Terms. We may also modify, suspend, or
          discontinue features of the Service at our discretion.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">11. Termination</h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms, engage in
          abusive behavior, or misuse the Service in a way that harms other users or the platform.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">12. Contact</h3>
        <p>
          If you have questions about these Terms, please reach out through the Contact Support
          option within the app.
        </p>
      </section>
    </div>
  );
}