export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-medium tracking-tight text-white mb-4">Terms of Service</h1>
        
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">1. Acceptance of Terms</h2>
          <p className="text-zinc-400 leading-relaxed">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">2. Description of Service</h2>
          <p className="text-zinc-400 leading-relaxed">
            We provide an AI-powered productivity tool that helps generate prompts, design documents, and agent skills. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">3. User Conduct</h2>
          <p className="text-zinc-400 leading-relaxed">
            You agree to not use the service to generate content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another&apos;s privacy, or otherwise objectionable.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">4. Intellectual Property</h2>
          <p className="text-zinc-400 leading-relaxed">
            You retain all rights to the input prompts you provide. The generated outputs are provided to you for your own commercial or personal use, subject to the terms of the underlying AI models (e.g., Google Gemini, OpenAI, Anthropic).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium text-white">5. Limitation of Liability</h2>
          <p className="text-zinc-400 leading-relaxed">
            In no event shall we be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service.
          </p>
        </section>
      </div>
    </div>
  );
}
