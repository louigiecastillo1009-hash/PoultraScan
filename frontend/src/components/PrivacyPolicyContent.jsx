
export default function PrivacyPolicyContent() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#6F7160]">Last Updated: July 9, 2026</p>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">1. Introduction</h3>
        <p>
          This Privacy Policy explains how PoultraScan AI ("the Service," "we," "us," or "our")
          collects, uses, stores, and protects your information when you use our poultry health
          diagnostic application. By using the Service, you agree to the practices described in this
          policy.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">2. Information We Collect</h3>
        <p className="mb-2">
          <strong>Account Information.</strong> When you register, we collect your full name,
          username, email address, and password (stored as a securely hashed value, never in plain
          text). If you sign in with Google, we collect the name, email address, and profile picture
          associated with your Google account.
        </p>
        <p className="mb-2">
          <strong>Farm and Scan Data.</strong> We collect information you provide about your farms,
          including farm names and optional farm images. We also collect the images you capture or
          upload during a scan, along with the AI-generated results derived from them — including
          chicken counts, detected bounding boxes, disease classifications, severity levels,
          estimated weight, estimated oil yield, and market-readiness status.
        </p>
        <p className="mb-2">
          <strong>Journal and Activity Data.</strong> If you use the farm journal feature, we store
          the entries you create. We also log certain account activity, such as login and logout
          events, for security and notification purposes.
        </p>
        <p>
          <strong>Technical Information.</strong> We may collect limited technical data necessary to
          operate the Service, such as session identifiers stored in an HTTP-only authentication
          cookie. This cookie is used solely to keep you logged in and is not accessible to other
          websites or scripts.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">3. How We Use Your Information</h3>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Create and maintain your account</li>
          <li>Associate your farms, scans, and journal entries with your account so only you can access them</li>
          <li>Run AI analysis on submitted images to generate health, weight, and yield estimates</li>
          <li>Send account-related notifications, such as login confirmations</li>
          <li>Maintain and improve the accuracy and reliability of the Service</li>
          <li>Detect, investigate, and prevent misuse, fraud, or unauthorized access</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">4. How Your Images Are Processed</h3>
        <p>
          Images submitted for scanning are processed through our detection and prediction pipeline,
          which may include analysis by third-party AI services for disease classification. Images
          are cropped and analyzed on a per-chicken basis. We do not sell your images or scan data to
          third parties, and we do not use your farm images to train models for other users' benefit
          without your consent.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">5. Data Storage and Retention</h3>
        <p className="mb-2">
          Your account information, farm data, scan history, and journal entries are stored in our
          database and remain associated with your account until you delete them or close your
          account. Scan results and cached previews may also be temporarily stored on your own device
          (locally, in your browser) to improve loading performance, scoped specifically to your
          account and the farm selected at the time of the scan.
        </p>
        <p>
          If you delete a farm, associated scans, images, and journal entries tied to that farm may
          be permanently removed and cannot be recovered. We recommend backing up any records you
          wish to keep before deleting a farm.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">6. Data Sharing</h3>
        <p className="mb-2">
          We do not sell your personal information or farm data. We may share limited information
          with third-party service providers strictly to operate the Service, such as:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1 mb-2">
          <li>AI processing providers, to generate disease classification and health insights from submitted images</li>
          <li>Google, if you choose to register or sign in using Google authentication</li>
        </ul>
        <p>
          We do not share your data with advertisers, data brokers, or unrelated third parties.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">7. Data Security</h3>
        <p>
          We take reasonable technical measures to protect your information, including password
          hashing, HTTP-only authentication cookies, and access controls that scope your data to your
          account. However, no method of electronic storage or transmission is completely secure, and
          we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">8. Your Choices and Rights</h3>
        <p className="mb-2">
          You may update your account information, delete farms, scans, or journal entries, or
          request account deletion at any time through the app or by contacting support. If you
          registered via Google, you may also revoke the Service's access through your Google account
          settings.
        </p>
        <p>
          You may use the password reset feature at any time if you lose access to your account.
          Reset codes are time-limited and single-use for your security.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">9. Children's Privacy</h3>
        <p>
          The Service is not intended for use by children, and we do not knowingly collect personal
          information from children. If we become aware that a child has provided us with personal
          information, we will take steps to delete it.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">10. Third-Party Sign-In</h3>
        <p>
          If you use "Sign in with Google," Google's own privacy policy governs the information
          Google collects during that process. We only receive and store the specific profile fields
          necessary to create or match your account (name, email, and profile picture).
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">11. Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          for legal and operational reasons. Continued use of the Service after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#101107] mb-1">12. Contact Us</h3>
        <p>
          If you have questions or concerns about this Privacy Policy or how your data is handled,
          please reach out through the Contact Support option within the app.
        </p>
      </section>
    </div>
  );
}
