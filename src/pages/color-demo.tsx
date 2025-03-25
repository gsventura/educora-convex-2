import ColorDemo from '../components/color-demo';

export default function ColorDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Demonstração do Novo Esquema de Cores</h1>
      <p className="mb-6">
        Esta página demonstra as cores do tema atualizado conforme solicitado:
      </p>
      <ul className="list-disc pl-6 mb-8">
        <li><strong>Primary:</strong> #3D5A80 (azul escuro)</li>
        <li><strong>Secondary:</strong> #E9E9E9 (cinza claro)</li>
        <li><strong>Tertiary:</strong> #EE6C4D (laranja/coral)</li>
        <li><strong>Quaternary:</strong> #09BC8A (verde)</li>
        <li><strong>Quinary:</strong> #6F1A07 (vermelho escuro/marrom)</li>
      </ul>
      
      <div className="border rounded-lg shadow-sm">
        <ColorDemo />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Modo Escuro / Claro</h2>
        <p>
          Você pode alternar entre o modo claro e escuro para ver como as cores se adaptam a cada tema.
        </p>
      </div>
    </div>
  );
} 