import { Navbar } from "@/components/navbar";
import { ContactForm } from "@/components/form";

export default function FormPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Fale Conosco</h1>
          <p className="text-gray-600 text-center mb-12">
            Preencha o formulário abaixo e retornaremos o mais rápido possível.
          </p>
          <ContactForm />
        </div>
      </main>
    </div>
  );
} 