import React from 'react';

export const ColorDemo = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Demonstração do Esquema de Cores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ColorBox name="Primary" colorClass="bg-primary" textClass="text-primary-foreground" />
        <ColorBox name="Secondary" colorClass="bg-secondary" textClass="text-secondary-foreground" />
        <ColorBox name="Tertiary" colorClass="bg-tertiary" textClass="text-foreground" />
        <ColorBox name="Quaternary" colorClass="bg-quaternary" textClass="text-foreground" />
        <ColorBox name="Quinary" colorClass="bg-quinary" textClass="text-foreground" />
        <ColorBox name="Accent" colorClass="bg-accent" textClass="text-accent-foreground" note="Não mais usado em elementos de UI (substituído por Secondary)" />
        <ColorBox name="Muted" colorClass="bg-muted" textClass="text-muted-foreground" />
        <ColorBox name="Destructive" colorClass="bg-destructive" textClass="text-destructive-foreground" />
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Exemplos de Uso</h3>
        <div className="space-y-4">
          <div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
              Botão Primário
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
              Botão Secundário
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-tertiary text-foreground rounded">
              Botão Terciário
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-quaternary text-foreground rounded">
              Botão Quaternário
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-quinary text-white rounded">
              Botão Quinary
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-secondary">
        <h3 className="text-xl font-semibold mb-2">Atualização em componentes de UI</h3>
        <p>Os seguintes componentes foram atualizados para usar a cor <strong>Secondary</strong> em vez de Accent:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Select - para itens em foco</li>
          <li>DropdownMenu - para itens em foco e triggers</li>
          <li>Command - para itens selecionados</li>
          <li>NavigationMenu - para efeitos de hover e focus</li>
          <li>Toggle - para estado ativo e efeitos de hover</li>
          <li>Calendar/DatePicker - para datas selecionadas, datas de hoje e dias no range</li>
          <li>ContextMenu - para triggers e itens</li>
          <li>Button - nas variantes outline e ghost</li>
          <li>Menubar - para triggers e itens</li>
          <li>Dialog - no botão de fechar</li>
        </ul>
      </div>
    </div>
  );
};

const ColorBox = ({ name, colorClass, textClass, note }: { name: string, colorClass: string, textClass: string, note?: string }) => {
  return (
    <div className={`p-4 rounded-md ${colorClass}`}>
      <div className={`font-bold ${textClass}`}>{name}</div>
      <div className={`text-sm ${textClass}`}>{colorClass}</div>
      {note && <div className={`text-xs mt-1 ${textClass} opacity-80`}>{note}</div>}
    </div>
  );
};

export default ColorDemo; 