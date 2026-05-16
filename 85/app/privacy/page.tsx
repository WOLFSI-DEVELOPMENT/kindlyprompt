export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-medium tracking-tight text-white mb-4">Privacy Policy</h1>
        
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">1. Information We Collect</h2>
          <p className="text-zinc-400 leading-relaxed">
            We collect information you provide directly to us when you create an account, such as your name, email address, and profile picture (including information retrieved via third-party logins like TikTok, Google, etc., using basic profile scopes). We also collect the content of the prompts, designs, and skills you generate using our service.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">2. How We Use Your Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services. Your profile information is used to personalize your experience and manage your account. The prompts and content you generate are processed by our AI models to provide the service you requested. We do not use your personal content to train public AI models without your explicit consent.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">3. Third-Party Services</h2>
          <p className="text-zinc-400 leading-relaxed">
            We use third-party AI providers (such as Google Gemini, OpenAI, or Anthropic) to process your prompts. Your use of our service is also subject to their respective privacy policies regarding data processing. When you log in with third-party providers (like TikTok), we only access the basic information necessary to authenticate you.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">4. Data Security</h2>
          <p className="text-zinc-400 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">5. Contact Us</h2>
          <p className="text-zinc-400 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy, please contact us through our provided support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
