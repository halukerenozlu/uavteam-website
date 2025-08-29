import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <ContactHero />
      <div className="px-8 pb-16">
        <ContactSection />
      </div>
    </main>
  );
}
