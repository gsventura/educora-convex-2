import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGTM } from "@/context/GTMContext";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const submitForm = useMutation(api.forms.submitForm);
  const { trackEvent } = useGTM();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Rastrear início do envio do formulário
    trackEvent(
      'form_submission_attempt',
      'Formulário',
      'Tentativa',
      'Formulário de Contato'
    );

    try {
      await submitForm({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      // Rastrear envio do formulário com sucesso
      trackEvent(
        'form_submission_success',
        'Formulário',
        'Sucesso',
        'Formulário de Contato'
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Rastrear erro de envio do formulário
      trackEvent(
        'form_submission_error',
        'Formulário',
        'Erro',
        'Formulário de Contato'
      );
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rastrear quando o formulário é focado para análise de engajamento
  const handleFieldFocus = (fieldName: string) => {
    trackEvent(
      'form_field_focus',
      'Formulário',
      'Foco',
      `Campo ${fieldName}`
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFieldFocus('nome')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFieldFocus('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onFocus={() => handleFieldFocus('mensagem')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isSubmitting}
          onClick={() => {
            if (!isSubmitting) {
              trackEvent(
                'form_button_click',
                'Formulário',
                'Clique',
                'Botão de Envio'
              );
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      {submitStatus === 'success' && (
        <div className="text-green-600 text-center mt-4">
          Thank you! Your message has been submitted successfully.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="text-red-600 text-center mt-4">
          Sorry, there was an error submitting your message. Please try again.
        </div>
      )}
    </div>
  );
} 